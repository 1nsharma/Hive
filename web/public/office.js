let currentTab = "floor";
let coworkers = [];
let workspaces = [];
let tasks = [];
let logs = [];
let workforce = null;
let schedule = null;
let decisions = [];
let selectedCoworker = null;

async function loadData() {
  try {
    const [cRes, wRes, tRes, lRes, wfRes, scRes, decRes] = await Promise.all([
      fetch('/api/coworkers'),
      fetch('/api/workspaces'),
      fetch('/api/tasks'),
      fetch('/api/logs'),
      fetch('/api/workforce'),
      fetch('/api/schedule'),
      fetch('/api/decisions')
    ]);
    coworkers = await cRes.json();
    workspaces = await wRes.json();
    tasks = await tRes.json();
    logs = await lRes.json();
    workforce = await wfRes.json();
    schedule = await scRes.json();
    decisions = await decRes.json();

    if (schedule && schedule.currentRoutine) {
      const topLabel = document.getElementById("top-routine-label");
      if (topLabel) topLabel.innerText = `${schedule.currentRoutine.time} ${schedule.currentRoutine.event}`;
    }

    render();
  } catch (err) {
    console.error("Failed to load company data:", err);
  }
}

function render() {
  const container = document.getElementById("view-container");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === currentTab);
  });

  if (currentTab === "floor") {
    container.innerHTML = `
      <div class="floor-layout">
        <div class="floor-grid">
          ${coworkers.map(c => `
            <div class="station-card" onclick="openDispatchModal('${c.id}')">
              <div class="station-header">
                <div class="avatar-circle" style="background:${c.avatarColor};">
                  ${c.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <span class="dot ${c.status === 'working' ? 'green' : (c.status === 'active' ? 'blue' : 'gold')}"></span>
              </div>
              <div class="station-title">${c.name}</div>
              <div class="station-sub">${c.role}</div>
              <div class="activity-box">${c.currentActivity}</div>
              <span class="model-pill">${c.provider.toUpperCase()} • ${c.model}</span>
            </div>
          `).join('')}
          <div class="station-card" style="background:rgba(245, 158, 11, 0.05); border-style:dashed; border-color:var(--gold);" onclick="triggerStandup()">
            <div class="station-header">
              <div class="avatar-circle" style="background:var(--gold); color:#000;">CR</div>
              <span class="dot gold"></span>
            </div>
            <div class="station-title">Conference Room</div>
            <div class="station-sub">Hourly Floor Standup</div>
            <div class="activity-box">Click to summon all coworkers for an instant cross-department standup.</div>
            <span class="model-pill" style="color:var(--gold);">MUNDER DIFFLIN HUDDLE</span>
          </div>
        </div>

        <div class="stream-panel">
          <h2>⚡ Live Office Activity Feed</h2>
          <div class="log-stream" id="floor-log-stream">
            ${logs.map(l => `<div>&gt; ${l}</div>`).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (currentTab === "workforce") {
    const analysis = workforce?.analysis || {};
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h2 style="font-size:20px; font-weight:800;">Workforce Management (Full-Time vs Part-Time)</h2>
          <p style="font-size:12px; color:var(--text-muted); margin-top:2px;">Autonomous staffing model: Core full-time staff + on-demand part-time AI contractors.</p>
        </div>
        <button class="btn btn-primary" onclick="promptHireContractor()">+ Hire Part-Time AI Specialist</button>
      </div>

      <!-- Capacity KPI Row -->
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin-bottom:24px;">
        <div class="card" style="border-left:3px solid var(--blue);">
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Total Workforce</div>
          <div style="font-size:24px; font-weight:800; color:#fff; margin-top:4px;">${analysis.totalEmployees || 10}</div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">${analysis.fullTimeCount} Full-Time • ${analysis.partTimeCount} Part-Time</div>
        </div>
        <div class="card" style="border-left:3px solid var(--green);">
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Active on Floor</div>
          <div style="font-size:24px; font-weight:800; color:var(--green); margin-top:4px;">${analysis.activeEmployees || 6}</div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Available for instant missions</div>
        </div>
        <div class="card" style="border-left:3px solid var(--gold);">
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Average Capacity Load</div>
          <div style="font-size:24px; font-weight:800; color:var(--gold); margin-top:4px;">${analysis.averageCapacityLoadPct || 40}%</div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Target threshold: &lt; 80%</div>
        </div>
        <div class="card" style="border-left:3px solid var(--purple);">
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Autonomous HR Action</div>
          <div style="font-size:12px; font-weight:700; color:#fff; margin-top:6px; line-height:1.4;">${analysis.recommendation}</div>
        </div>
      </div>

      <!-- Full-Time Staff -->
      <h3 style="font-size:15px; margin-bottom:12px; color:var(--blue);">🏢 Core Full-Time Team (${workforce?.fullTime?.length || 0})</h3>
      <div class="grid-cards" style="margin-bottom:24px;">
        ${(workforce?.fullTime || []).map(s => `
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <strong style="color:#fff; font-size:14px;">${s.name}</strong>
              <span class="model-pill" style="color:var(--blue); background:rgba(59,130,246,0.1);">FULL-TIME (${s.hoursPerWeek}h/wk)</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">${s.role}</div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:#cbd5e1; margin-bottom:6px;">
              <span>Shift: <strong>${s.shift}</strong></span>
              <span>Load: <strong>${s.capacityLoadPct}%</strong></span>
            </div>
            <div style="width:100%; height:6px; background:#070b13; border-radius:3px; overflow:hidden;">
              <div style="width:${s.capacityLoadPct}%; height:100%; background:var(--blue);"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Part-Time Contractors -->
      <h3 style="font-size:15px; margin-bottom:12px; color:var(--gold);">⚡ On-Demand Part-Time AI Contractors (${workforce?.partTime?.length || 0})</h3>
      <div class="grid-cards">
        ${(workforce?.partTime || []).map(s => `
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <strong style="color:#fff; font-size:14px;">${s.name}</strong>
              <span class="model-pill" style="color:var(--gold); background:rgba(245,158,11,0.1);">PART-TIME (${s.hoursPerWeek}h/wk)</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">${s.role}</div>
            <div style="font-size:11px; color:#cbd5e1; margin-bottom:6px;">
              Auto-Trigger Condition: <em style="color:var(--gold);">${s.triggerCondition}</em>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted);">
              <span>Status: <strong style="color:${s.status === 'active' ? 'var(--green)' : 'var(--text-muted)'};">${s.status.toUpperCase()}</strong></span>
              <span>Shift: <strong>${s.shift}</strong></span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (currentTab === "schedule") {
    const cur = schedule?.currentRoutine || {};
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h2 style="font-size:20px; font-weight:800;">Office Schedule & Shift Engine (Kab Kya Karna)</h2>
          <p style="font-size:12px; color:var(--text-muted); margin-top:2px;">Automated 24-hour business clock: Sets routine agendas, shift rotations, and audits.</p>
        </div>
        <button class="btn btn-warning" onclick="advanceSchedule()">⏰ Advance Routine Clock</button>
      </div>

      <!-- Current Active Routine Highlight -->
      <div class="card" style="border:1px solid var(--gold); background:rgba(245,158,11,0.04); margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span class="model-pill" style="color:var(--gold); background:rgba(245,158,11,0.15);">CURRENT ACTIVE FLOOR ROUTINE</span>
            <h3 style="font-size:18px; font-weight:800; margin-top:6px; color:#fff;">${cur.time} — ${cur.event}</h3>
            <p style="font-size:13px; color:#cbd5e1; margin-top:4px;">Lead: <strong style="color:var(--gold);">${cur.lead}</strong> • Action Directive: "${cur.action}"</p>
          </div>
          <button class="btn btn-primary" onclick="triggerAutonomousCycle()">⚡ Execute Routine Now</button>
        </div>
      </div>

      <!-- 24-Hour Roster Timeline -->
      <h3 style="font-size:15px; margin-bottom:12px;">📅 Daily Floor Schedule (8 Master Routines)</h3>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${(schedule?.allRoutines || []).map((r, idx) => {
          const isActive = r.event === cur.event;
          return `
            <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:12px 18px; border-left:4px solid ${isActive ? 'var(--gold)' : 'var(--border)'}; background:${isActive ? 'rgba(255,255,255,0.06)' : 'var(--bg-card)'};">
              <div style="display:flex; align-items:center; gap:16px;">
                <span style="font-family:'JetBrains Mono', monospace; font-size:13px; font-weight:700; color:${isActive ? 'var(--gold)' : 'var(--blue)'}; width:80px;">${r.time}</span>
                <div>
                  <strong style="color:#fff; font-size:14px;">${r.event}</strong>
                  <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Lead: ${r.lead} • ${r.action}</div>
                </div>
              </div>
              <span class="model-pill">${r.type}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else if (currentTab === "director") {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h2 style="font-size:20px; font-weight:800;">Autonomous Director (Kudh Kya Karna)</h2>
          <p style="font-size:12px; color:var(--text-muted); margin-top:2px;">Self-executing AI decision engine: Auto-triages open backlog, matches skills, and balances workload.</p>
        </div>
        <button class="btn btn-primary" onclick="triggerAutonomousCycle()">⚡ Run Autonomous Decision Cycle</button>
      </div>

      <div class="stream-panel" style="margin-bottom:24px;">
        <h2>🤖 Autonomous Decision History & Actions</h2>
        <div class="log-stream" style="max-height:450px;">
          ${decisions.map(d => `
            <div style="margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
              <div style="color:var(--gold); font-size:10px;">[${new Date(d.timestamp).toLocaleTimeString()}] Routine: ${d.routine} (${d.pendingTasksCount} in-flight tasks)</div>
              ${d.decisions.map(dec => `<div style="color:#38bdf8; margin-top:2px;">&gt; ${dec}</div>`).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentTab === "workspaces") {
    container.innerHTML = `
      <h2 style="font-size:20px; font-weight:800; margin-bottom:16px;">Departmental Workspaces (${workspaces.length} Autonomous Units)</h2>
      <div class="grid-cards">
        ${workspaces.map(w => `
          <div class="card">
            <h3 style="color:#38bdf8; font-size:15px; margin-bottom:4px;">${w.name}</h3>
            <div style="font-size:11px; color:var(--gold); margin-bottom:10px;">Lead: ${w.lead}</div>
            <p style="font-size:12px; color:#cbd5e1; line-height:1.5; margin-bottom:12px;">${w.description}</p>
            <div style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">
              <strong>Connected Tools:</strong> ${w.tools.join(', ')}
            </div>
            <div style="font-size:11px; color:#10b981; font-weight:700;">
              Active In-Flight Tasks: ${w.activeTasks}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  
  } else if (currentTab === "services") {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h2 style="font-size:20px; font-weight:800;">Enterprise Business Units & Microservices (8 Services + Gateway)</h2>
          <p style="font-size:12px; color:var(--text-muted); margin-top:2px;">Production-grade microservices integrated into the unified holding company architecture.</p>
        </div>
      </div>
      <div class="grid-cards">
        <div class="card" style="border-left:3px solid var(--blue);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fff; font-size:15px;">DukaanMitra OS</strong>
            <span class="model-pill" style="color:var(--green);">PORT 3001 • ONLINE</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin:6px 0;">Retail & MSME Bahi-Khata</div>
          <p style="font-size:11px; color:#cbd5e1; line-height:1.4;">Automated ledger, customer credit tracking, and WhatsApp invoice dispatch.</p>
        </div>
        <div class="card" style="border-left:3px solid var(--orange);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fff; font-size:15px;">TruckWala 24x7</strong>
            <span class="model-pill" style="color:var(--green);">PORT 3002 • ONLINE</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin:6px 0;">Highway Emergency SOS & Fleet</div>
          <p style="font-size:11px; color:#cbd5e1; line-height:1.4;">15-minute emergency roadside dispatch and dynamic highway price surge engine.</p>
        </div>
        <div class="card" style="border-left:3px solid var(--gold);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fff; font-size:15px;">SolarHub PM Surya Ghar</strong>
            <span class="model-pill" style="color:var(--green);">PORT 3003 • ONLINE</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin:6px 0;">CleanTech Subsidy Engine</div>
          <p style="font-size:11px; color:#cbd5e1; line-height:1.4;">Direct ₹78,000 national subsidy calculator, EPC matching, and DISCOM audit.</p>
        </div>
        <div class="card" style="border-left:3px solid var(--purple);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fff; font-size:15px;">HireSaathi AI</strong>
            <span class="model-pill" style="color:var(--green);">PORT 3004 • ONLINE</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin:6px 0;">Blue-Collar & Tech Talent</div>
          <p style="font-size:11px; color:#cbd5e1; line-height:1.4;">Voice-based AI interviews, skill scoring, and hyper-local hiring radar.</p>
        </div>
        <div class="card" style="border-left:3px solid var(--cyan);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fff; font-size:15px;">JORVISH AI Studio</strong>
            <span class="model-pill" style="color:var(--green);">PORT 3005 • ONLINE</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin:6px 0;">Autonomous Agent Orchestration</div>
          <p style="font-size:11px; color:#cbd5e1; line-height:1.4;">Multi-agent mission dispatch, swarm execution, and episodic memory sync.</p>
        </div>
        <div class="card" style="border-left:3px solid var(--pink);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fff; font-size:15px;">Desi Arcade 3D</strong>
            <span class="model-pill" style="color:var(--green);">PORT 3006 • ONLINE</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin:6px 0;">Gaming & Neural Media</div>
          <p style="font-size:11px; color:#cbd5e1; line-height:1.4;">Procedural 3D physics engines, desi games (Kancha, Gilli Danda), and media art.</p>
        </div>
        <div class="card" style="border-left:3px solid var(--green);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fff; font-size:15px;">GovAI Citizen Hub</strong>
            <span class="model-pill" style="color:var(--green);">PORT 3007 • ONLINE</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin:6px 0;">National Schemes & Citizen Verification</div>
          <p style="font-size:11px; color:#cbd5e1; line-height:1.4;">PM-JAY, PM SVANidhi, DigiLocker automated document verification.</p>
        </div>
        <div class="card" style="border-left:3px solid var(--blue);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fff; font-size:15px;">PetsJanu Tele-Vet</strong>
            <span class="model-pill" style="color:var(--green);">PORT 3008 • ONLINE</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin:6px 0;">24x7 Veterinary Care</div>
          <p style="font-size:11px; color:#cbd5e1; line-height:1.4;">Instant tele-health triage, emergency prescription delivery, and pet care.</p>
        </div>
      </div>
    `;

  } else if (currentTab === "kanban") {
    const inProgress = tasks.filter(t => t.status === "in_progress");
    const review = tasks.filter(t => t.status === "review");
    const done = tasks.filter(t => t.status === "done");

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h2 style="font-size:20px; font-weight:800;">Office Kanban Task Board</h2>
        <button class="btn btn-primary" onclick="promptNewTask()">+ Create New Task</button>
      </div>
      <div class="kanban-grid">
        <div class="kanban-col">
          <h3>In Progress (${inProgress.length})</h3>
          ${inProgress.map(t => `
            <div class="task-item">
              <strong style="font-size:13px; color:#fff;">${t.title}</strong>
              <div style="font-size:11px; color:var(--text-muted); margin-top:6px;">Assignee: <strong>${t.assignee}</strong></div>
              <div style="font-size:10px; color:var(--gold); margin-top:4px;">Workspace: ${t.workspace}</div>
            </div>
          `).join('')}
        </div>
        <div class="kanban-col">
          <h3>Ready for Review (${review.length})</h3>
          ${review.map(t => `
            <div class="task-item">
              <strong style="font-size:13px; color:#fff;">${t.title}</strong>
              <div style="font-size:11px; color:var(--text-muted); margin-top:6px;">Assignee: <strong>${t.assignee}</strong></div>
              <div style="font-size:10px; color:var(--blue); margin-top:4px;">Workspace: ${t.workspace}</div>
            </div>
          `).join('')}
        </div>
        <div class="kanban-col">
          <h3>Completed / Verified (${done.length})</h3>
          ${done.map(t => `
            <div class="task-item" style="border-left:3px solid var(--green);">
              <strong style="font-size:13px; color:#fff;">${t.title}</strong>
              <div style="font-size:11px; color:var(--text-muted); margin-top:6px;">Auditor: <strong>${t.assignee}</strong></div>
              <div style="font-size:10px; color:var(--green); margin-top:4px;">Verified on ProofLedger</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentTab === "cli") {
    container.innerHTML = `
      <h2 style="font-size:20px; font-weight:800; margin-bottom:16px;">Multi-Model CLI Terminal & Dispatcher</h2>
      <div class="card" style="margin-bottom:20px;">
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:16px;">Run commands using any CLI model provider configured in Munder Difflin:</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div>
            <label style="font-size:12px; color:var(--text-muted); font-weight:600; display:block; margin-bottom:4px;">CLI Provider</label>
            <select id="cli-provider" class="input">
              <option value="antigravity">Antigravity CLI (agy)</option>
              <option value="claude">Claude Code CLI (claude)</option>
              <option value="gemini">Google Gemini CLI (gemini)</option>
              <option value="cursor">Cursor Agent CLI (cursor-agent)</option>
            </select>
          </div>
          <div>
            <label style="font-size:12px; color:var(--text-muted); font-weight:600; display:block; margin-bottom:4px;">Target Coworker</label>
            <select id="cli-coworker" class="input">
              ${coworkers.map(c => `<option value="${c.id}">${c.name} (${c.role})</option>`).join('')}
            </select>
          </div>
        </div>
        <div style="margin-top:14px;">
          <label style="font-size:12px; color:var(--text-muted); font-weight:600; display:block; margin-bottom:4px;">Prompt / Command</label>
          <textarea id="cli-prompt" class="textarea" rows="3" placeholder="Enter directive to run..."></textarea>
        </div>
        <button class="btn btn-primary" style="margin-top:12px;" onclick="runCliPrompt()">⚡ Execute CLI Command</button>
      </div>

      <div class="card">
        <h3 style="font-size:14px; margin-bottom:8px;">CLI Execution Output</h3>
        <div id="cli-output" style="background:#070b13; padding:12px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:11px; color:#38bdf8; min-height:120px;">
          &gt; Waiting for CLI command execution...
        </div>
      </div>
    `;
  }
}

window.openDispatchModal = function(id) {
  selectedCoworker = coworkers.find(c => c.id === id);
  if (!selectedCoworker) return;
  document.getElementById("modal-coworker-name").innerText = `Dispatch Mission to ${selectedCoworker.name}`;
  
  const wsSelect = document.getElementById("modal-workspace-select");
  wsSelect.innerHTML = workspaces.map(w => `<option value="${w.id}">${w.name}</option>`).join('');

  document.getElementById("dispatch-modal").classList.remove("hidden");
};

document.getElementById("btn-close-modal").onclick = () => {
  document.getElementById("dispatch-modal").classList.add("hidden");
};

document.getElementById("btn-submit-dispatch").onclick = async () => {
  if (!selectedCoworker) return;
  const prompt = document.getElementById("modal-prompt").value;
  const [provider, model] = document.getElementById("modal-model-select").value.split('|');
  const workspace = document.getElementById("modal-workspace-select").value;

  const res = await fetch('/api/dispatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      coworkerId: selectedCoworker.id,
      prompt,
      provider,
      model,
      workspace
    })
  });

  if (res.ok) {
    document.getElementById("dispatch-modal").classList.add("hidden");
    await loadData();
    alert(`🚀 Mission successfully dispatched to ${selectedCoworker.name}!\nModel: ${model}`);
  }
};

window.advanceSchedule = async function() {
  const res = await fetch('/api/schedule/advance', { method: 'POST' });
  if (res.ok) {
    const next = await res.json();
    await loadData();
  }
};

const topAdvBtn = document.getElementById("btn-advance-shift");
if (topAdvBtn) topAdvBtn.onclick = window.advanceSchedule;

window.triggerAutonomousCycle = async function() {
  const res = await fetch('/api/director/tick', { method: 'POST' });
  if (res.ok) {
    const cycle = await res.json();
    await loadData();
    alert(`🤖 Autonomous Cycle Completed!\nDecisions:\n` + cycle.decisions.join('\n'));
  }
};

window.triggerStandup = async function() {
  const res = await fetch('/api/standup', { method: 'POST' });
  if (res.ok) {
    const data = await res.json();
    alert(data.report);
    await loadData();
  }
};

document.getElementById("btn-call-standup").onclick = window.triggerStandup;

window.promptHireContractor = async function() {
  const name = prompt("Enter contractor name (e.g. Stanley Hudson, Phyllis Vance):");
  if (!name) return;
  const role = prompt("Enter specialty role (e.g. Crossword Analytics, Logistics Negotiator):");
  if (!role) return;

  await fetch('/api/workforce/hire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role, hoursPerWeek: 15 })
  });
  await loadData();
};

window.promptNewTask = async function() {
  const title = prompt("Enter task title:");
  if (!title) return;
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      workspace: "01-engineering-dev",
      assignee: "unassigned"
    })
  });
  await loadData();
};

window.runCliPrompt = async function() {
  const provider = document.getElementById("cli-provider").value;
  const coworkerId = document.getElementById("cli-coworker").value;
  const prompt = document.getElementById("cli-prompt").value;

  const res = await fetch('/api/dispatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, coworkerId, prompt })
  });

  if (res.ok) {
    const data = await res.json();
    document.getElementById("cli-output").innerText = data.simulatedExecution;
    await loadData();
  }
};

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    currentTab = btn.dataset.tab;
    render();
  };
});

document.getElementById("btn-refresh").onclick = loadData;

loadData();
setInterval(loadData, 5000);
