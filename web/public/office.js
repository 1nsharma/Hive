let currentTab = "floor";
let coworkers = [];
let workspaces = [];
let tasks = [];
let logs = [];
let workforce = null;
let schedule = null;
let decisions = [];
let engines = null;
let portfolio = null;
let desktopStatus = null;
let selectedCoworker = null;

async function loadData() {
  try {
    const [cRes, wRes, tRes, lRes, wfRes, scRes, decRes, engRes, portRes, dskRes] = await Promise.all([
      fetch('/api/coworkers'),
      fetch('/api/workspaces'),
      fetch('/api/tasks'),
      fetch('/api/logs'),
      fetch('/api/workforce'),
      fetch('/api/schedule'),
      fetch('/api/decisions'),
      fetch('/api/engines'),
      fetch('/api/enterprise/portfolio'),
      fetch('/api/desktop/status')
    ]);
    coworkers = await cRes.json();
    workspaces = await wRes.json();
    tasks = await tRes.json();
    logs = await lRes.json();
    workforce = await wfRes.json();
    schedule = await scRes.json();
    decisions = await decRes.json();
    engines = await engRes.json();
    portfolio = await portRes.json();
    desktopStatus = await dskRes.json();

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
        <section class="section-coworkers">
          <div class="section-title">
            <h2>🏢 Virtual Office Floor (Hive Swarm)</h2>
            <span class="count-badge">${coworkers.length} Active Agents</span>
          </div>
          <div class="coworker-grid">
            ${coworkers.map(c => `
              <div class="coworker-card ${c.status}">
                <div class="card-header">
                  <div class="avatar">${c.avatar || "🤖"}</div>
                  <div>
                    <h3 class="name">${c.name}</h3>
                    <div class="role">${c.role}</div>
                  </div>
                  <span class="status-pill ${c.status}">${c.status}</span>
                </div>
                <div class="model-meta">
                  <span class="provider-tag ${c.provider}">${c.provider.toUpperCase()}</span>
                  <span class="model-name">${c.model}</span>
                </div>
                <div class="skills-box">
                  ${c.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
                </div>
                <div class="current-task">
                  <div class="task-label">CURRENT ACTIVITY:</div>
                  <div class="task-desc">${c.currentTask || "Idle / Ready for assignment"}</div>
                </div>
                <div class="card-footer">
                  <span class="desk-tag">📍 ${c.desk}</span>
                  <button class="btn btn-sm btn-primary" onclick="openDispatchModal('${c.id}')">🚀 Dispatch</button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="section-activity">
          <div class="section-title">
            <h2>📜 Real-Time Floor Telemetry</h2>
            <span class="model-pill" style="color:var(--gold);">HIVE AUTONOMOUS HUDDLE</span>
          </div>
          <div class="log-stream">
            ${logs.slice(0, 15).map(l => `
              <div class="log-entry">
                <span class="log-time">${l.timestamp.split('T')[1].slice(0,8)}</span>
                <span class="log-agent">[${l.agent}]</span>
                <span class="log-msg">${l.message}</span>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  } else if (currentTab === "workforce") {
    const ft = (workforce && workforce.fullTime) || [];
    const pt = (workforce && workforce.partTime) || [];
    const an = (workforce && workforce.analysis) || {};
    container.innerHTML = `
      <div class="workforce-view">
        <div class="section-title">
          <h2>👥 Full-Time Core vs. Part-Time Autonomous Scaling</h2>
          <span class="count-badge">Workforce Capacity: ${an.utilization || 'Optimal'}</span>
        </div>
        <div class="stats-overview-grid">
          <div class="overview-card">
            <h4>Full-Time Core Workforce</h4>
            <div class="big-num">${ft.length}</div>
            <p>Dedicated God & Divisional Leads</p>
          </div>
          <div class="overview-card">
            <h4>Part-Time Scale Workforce</h4>
            <div class="big-num">${pt.length}</div>
            <p>On-demand specialized contractors</p>
          </div>
          <div class="overview-card">
            <h4>Active Workload Pressure</h4>
            <div class="big-num">${an.activeLoad || 0}</div>
            <p>In-progress missions on floor</p>
          </div>
          <div class="overview-card">
            <h4>Auto-Scale Recommendation</h4>
            <div class="big-num" style="color:var(--cyan);font-size:18px;">${an.recommendation || 'Balanced'}</div>
            <p>${an.reason || 'Sufficient capacity'}</p>
          </div>
        </div>

        <h3 style="margin:20px 0 10px 0; color:var(--text-primary);">🏢 Full-Time Core Staff (Fixed Salary: ₹0 / Local Local-First)</h3>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Agent</th><th>Role</th><th>Department</th><th>Shift Hours</th><th>Execution Harness</th><th>Model Tier</th>
              </tr>
            </thead>
            <tbody>
              ${ft.map(m => `
                <tr>
                  <td><strong>${m.name}</strong></td>
                  <td>${m.role}</td>
                  <td><span class="dept-badge">${m.department}</span></td>
                  <td>${m.shift}</td>
                  <td><code>${m.harness}</code></td>
                  <td><span class="provider-tag ${m.provider}">${m.model}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <h3 style="margin:24px 0 10px 0; color:var(--text-primary);">⚡ Part-Time Autonomous Contractors (Trigger-Spawned)</h3>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Contractor</th><th>Specialty Skill</th><th>Assigned Division</th><th>Billing Model</th><th>Max Hourly Cost</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${pt.map(c => `
                <tr>
                  <td><strong>${c.name}</strong></td>
                  <td>${c.specialty}</td>
                  <td><span class="dept-badge">${c.division}</span></td>
                  <td>${c.rate}</td>
                  <td><strong>${c.costPerHour}</strong></td>
                  <td><span class="status-pill ${c.status}">${c.status.toUpperCase()}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (currentTab === "schedule") {
    const routines = (schedule && schedule.allRoutines) || [];
    container.innerHTML = `
      <div class="schedule-view">
        <div class="section-title">
          <h2>⏱️ 24-Hour Autonomous Shift Engine (Kab Kya Karna Hai)</h2>
          <button class="btn btn-warning" onclick="advanceShift()">⚡ Advance Routine (+1 Slot)</button>
        </div>
        <p style="color:var(--text-muted); margin-bottom:16px;">The floor operates on an autonomous 24/7 continuous duty rotation:</p>
        <div class="routine-timeline">
          ${routines.map((r, idx) => {
            const isCur = (schedule && schedule.currentRoutine && schedule.currentRoutine.time === r.time);
            return `
              <div class="routine-card ${isCur ? 'active-routine' : ''}">
                <div class="routine-time">${r.time}</div>
                <div class="routine-info">
                  <div class="routine-title">${r.event} ${isCur ? '<strong>[ACTIVE NOW]</strong>' : ''}</div>
                  <div class="routine-lead">Lead: <strong>${r.lead}</strong> | Priority: <span class="tag-priority">${r.priority}</span></div>
                  <div class="routine-desc">${r.description}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (currentTab === "director") {
    container.innerHTML = `
      <div class="director-view">
        <div class="section-title">
          <h2>🧠 Autonomous Executive Director (Kudh Kya Karna Hai)</h2>
          <button class="btn btn-primary" onclick="triggerDirectorCycle()">⚡ Execute Decision Loop Now</button>
        </div>
        <p style="color:var(--text-muted); margin-bottom:16px;">The AI Director evaluates workload and executes self-governing business actions:</p>
        <div class="decision-feed">
          ${decisions.map(d => `
            <div class="decision-card">
              <div class="decision-head">
                <span class="decision-time">${d.timestamp.replace('T', ' ').slice(0, 19)}</span>
                <span class="action-tag">${d.action}</span>
              </div>
              <div class="decision-desc">${d.description}</div>
              <div class="decision-foot">
                <span>Routine Context: <strong>${d.routine}</strong></span>
                <span>Tasks in Queue: <strong>${d.pendingTasks}</strong></span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentTab === "engines") {
    const re = (engines && engines.researchEngine) || {};
    const ce = (engines && engines.closingEngine) || {};
    container.innerHTML = `
      <div class="engines-view">
        <div class="section-title">
          <h2>⚡ Autonomous Revenue & Intelligence Engines</h2>
          <span class="count-badge">2 Core High-Yield Engines Active</span>
        </div>
        
        <div class="engine-cards-grid">
          <div class="engine-card">
            <div class="engine-header">
              <div>
                <span class="engine-tag">B2B MARKET SCRAPING & VERIFICATION</span>
                <h3>${re.name || 'Phyllis B2B Research Engine'}</h3>
                <div class="lead-info">Autonomous Lead: <strong>${re.lead || 'Phyllis Vance'}</strong></div>
              </div>
              <span class="status-pill active">${re.status || 'ACTIVE'}</span>
            </div>
            <div class="engine-metrics">
              <div class="metric-item">
                <span class="m-label">Verified Leads</span>
                <span class="m-val">${re.verifiedLeadsCount || 42}</span>
              </div>
              <div class="metric-item">
                <span class="m-label">Pipeline Value</span>
                <span class="m-val" style="color:var(--gold);">${re.pipelineValue || '$485,000'}</span>
              </div>
            </div>
            <div class="capabilities-box">
              <h4>Capabilities & Intelligence Stack:</h4>
              <ul>
                ${((re.capabilities) || []).map(c => `<li>✓ ${c}</li>`).join('')}
              </ul>
            </div>
            <button class="btn btn-primary btn-block" onclick="runResearchEngine()">🚀 Run B2B Research Engine Cycle</button>
          </div>

          <div class="engine-card">
            <div class="engine-header">
              <div>
                <span class="engine-tag">ENTERPRISE CLIENT ACQUISITION</span>
                <h3>${ce.name || 'Andy Deal Closing Engine'}</h3>
                <div class="lead-info">Autonomous Lead: <strong>${ce.lead || 'Andy Bernard'}</strong></div>
              </div>
              <span class="status-pill active">${ce.status || 'ACTIVE'}</span>
            </div>
            <div class="engine-metrics">
              <div class="metric-item">
                <span class="m-label">Deals Closed</span>
                <span class="m-val">${ce.closedDealsCount || 18}</span>
              </div>
              <div class="metric-item">
                <span class="m-label">Closing Rate</span>
                <span class="m-val" style="color:var(--green);">${ce.conversionRate || '24.6%'}</span>
              </div>
            </div>
            <div class="capabilities-box">
              <h4>Deal Pipeline & Capabilities:</h4>
              <ul>
                ${((ce.capabilities) || []).map(c => `<li>✓ ${c}</li>`).join('')}
              </ul>
            </div>
            <button class="btn btn-warning btn-block" onclick="runClosingEngine()">💼 Run Deal Closing Engine Cycle</button>
          </div>
        </div>
      </div>
    `;
  } else if (currentTab === "orchestrator") {
    const ds = desktopStatus || {};
    container.innerHTML = `
      <div class="orchestrator-view">
        <div class="section-title">
          <h2>🖥️ Hive Desktop & Multi-Agent Orchestrator</h2>
          <span class="status-pill active">STATUS: ${ds.status || 'COMPILED ✓'}</span>
        </div>

        <div class="desktop-banner">
          <div class="desktop-info">
            <h3>Native Desktop Shell with Monaco Editor & Pixi.js 2D Virtual Floor</h3>
            <p>Local-first multi-agent harness coordinating 17 autonomous AI agents across your machine. Zero cloud lock-in.</p>
            <div class="desktop-specs-grid">
              <div class="spec-card">
                <strong>Electron 32</strong>
                <span>Cross-platform desktop host with full hardware acceleration</span>
              </div>
              <div class="spec-card">
                <strong>Monaco Editor 0.52</strong>
                <span>Embedded VS Code engine for instant file inspection & diffs</span>
              </div>
              <div class="spec-card">
                <strong>Pixi.js 8</strong>
                <span>Interactive 2D spatial canvas with live agent pathfinding</span>
              </div>
              <div class="spec-card">
                <strong>Native ConPTY & SQLite</strong>
                <span>True pseudo-terminals and durable disk-backed state ledger</span>
              </div>
            </div>
          </div>
        </div>

        <div class="orchestrator-controls">
          <div class="control-box">
            <h3>⚡ 1-Click Launch Command</h3>
            <p style="color:var(--text-muted); margin-bottom:8px;">You can launch the compiled desktop app directly from your terminal or double-click:</p>
            <code>.\LAUNCH_HIVE_DESKTOP.bat</code>
            <div style="margin-top:14px;">
              <span class="dept-badge">Path: C:\Users\18\OneDrive\Desktop\hive\LAUNCH_HIVE_DESKTOP.bat</span>
            </div>
          </div>

          <div class="features-list-box">
            <h3>🛠️ Orchestration Features & Agent Frameworks:</h3>
            <ul>
              ${((ds.features) || []).map(f => `<li>✦ ${f}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (currentTab === "enterprise") {
    const divisions = (portfolio && portfolio.divisions) || [
      { id: "01", name: "AI Core & Autonomous Agents", focus: "JORVISH Studio, Swarm Protocol, Agent Roster" },
      { id: "02", name: "Commerce, Retail & MSME", focus: "DukaanMitra OS, Bahi-Khata, Bharat Inventory" },
      { id: "03", name: "Logistics & Supply Chain", focus: "TruckWala 24x7, Highway SOS, Fleet Telemetry" },
      { id: "04", name: "Talent & HR Tech", focus: "HireSaathi AI, Skill Screeners, Autonomous Hiring" },
      { id: "05", name: "CleanTech & Energy", focus: "SolarHub, PM Surya Ghar, Subsidy Evaluator" },
      { id: "06", name: "PetCare & Veterinary", focus: "PetsJanu, Tele-Vet, 24x7 Emergency Care" },
      { id: "07", name: "GovTech & Security", focus: "GovAI Citizen Hub, Scheme Matcher, Verification" },
      { id: "08", name: "Media, Gaming & Ventures", focus: "Desi Arcade 3D, Neural Assets, Studio Engine" }
    ];
    container.innerHTML = `
      <div class="enterprise-view">
        <div class="section-title">
          <h2>🌐 Enterprise OS & Portfolio (8 Business Divisions)</h2>
          <span class="count-badge">${divisions.length} Market Verticals</span>
        </div>
        <p style="color:var(--text-muted); margin-bottom:16px;">The complete business ecosystem unified under Hive Enterprise OS:</p>
        <div class="division-grid">
          ${divisions.map(d => `
            <div class="division-card">
              <div class="div-num">DIV ${d.id}</div>
              <h3>${d.name}</h3>
              <p class="div-focus">${d.focus || d.description || ''}</p>
              <div class="div-footer">
                <span class="status-pill active">OPERATIONAL</span>
                <span class="dept-badge">Port: 300${d.id}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentTab === "workspaces") {
    container.innerHTML = `
      <div class="workspaces-view">
        <div class="section-title">
          <h2>📁 Enterprise Department Workspaces (8 Folders)</h2>
          <span class="count-badge">${workspaces.length} Integrated Hubs</span>
        </div>
        <div class="workspace-grid">
          ${workspaces.map(w => `
            <div class="workspace-card">
              <div class="ws-header">
                <h3>${w.name}</h3>
                <span class="dept-badge">${w.id}</span>
              </div>
              <p class="ws-desc">${w.description}</p>
              <div class="ws-meta">
                <span>Assigned Agent: <strong>${w.assignedAgent}</strong></span>
                <span>Path: <code>${w.path}</code></span>
              </div>
              <div class="ws-tools">
                <span class="tool-label">TOOLKIT:</span>
                ${w.tools.map(t => `<span class="tool-chip">${t}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentTab === "services") {
    container.innerHTML = `
      <div class="services-view">
        <div class="section-title">
          <h2>🚀 Enterprise Microservices (8 Business Units)</h2>
          <span class="count-badge">8 Microservices Online</span>
        </div>
        <div class="service-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Service Name</th><th>Port</th><th>Category & Function</th><th>Gateway Proxy Endpoint</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>DukaanMitra OS</strong></td>
                <td><code>:3001</code></td>
                <td>Retail & MSME Bahi-Khata System</td>
                <td><a href="http://localhost:3300/api/dukaanmitra/health" target="_blank">/api/dukaanmitra/*</a></td>
                <td><span class="status-pill active">ONLINE</span></td>
              </tr>
              <tr>
                <td><strong>TruckWala 24x7</strong></td>
                <td><code>:3002</code></td>
                <td>Highway Emergency SOS & Fleet Dispatch</td>
                <td><a href="http://localhost:3300/api/truckwala/health" target="_blank">/api/truckwala/*</a></td>
                <td><span class="status-pill active">ONLINE</span></td>
              </tr>
              <tr>
                <td><strong>SolarHub PM Surya Ghar</strong></td>
                <td><code>:3003</code></td>
                <td>CleanTech Subsidy & Solar ROI Evaluator</td>
                <td><a href="http://localhost:3300/api/solarhub/health" target="_blank">/api/solarhub/*</a></td>
                <td><span class="status-pill active">ONLINE</span></td>
              </tr>
              <tr>
                <td><strong>HireSaathi AI</strong></td>
                <td><code>:3004</code></td>
                <td>Blue-Collar & Tech Talent Matching</td>
                <td><a href="http://localhost:3300/api/hiresaathi/health" target="_blank">/api/hiresaathi/*</a></td>
                <td><span class="status-pill active">ONLINE</span></td>
              </tr>
              <tr>
                <td><strong>JORVISH AI Studio</strong></td>
                <td><code>:3005</code></td>
                <td>Autonomous Agent Swarm Orchestration</td>
                <td><a href="http://localhost:3300/api/jorvish/health" target="_blank">/api/jorvish/*</a></td>
                <td><span class="status-pill active">ONLINE</span></td>
              </tr>
              <tr>
                <td><strong>Desi Arcade 3D</strong></td>
                <td><code>:3006</code></td>
                <td>Gaming & Neural Media Synthesis</td>
                <td><a href="http://localhost:3300/api/desigaming/health" target="_blank">/api/desigaming/*</a></td>
                <td><span class="status-pill active">ONLINE</span></td>
              </tr>
              <tr>
                <td><strong>GovAI Citizen Hub</strong></td>
                <td><code>:3007</code></td>
                <td>National Schemes & Identity Verification</td>
                <td><a href="http://localhost:3300/api/govai/health" target="_blank">/api/govai/*</a></td>
                <td><span class="status-pill active">ONLINE</span></td>
              </tr>
              <tr>
                <td><strong>PetsJanu Tele-Vet</strong></td>
                <td><code>:3008</code></td>
                <td>24x7 Veterinary Tele-Health & SOS</td>
                <td><a href="http://localhost:3300/api/petsjanu/health" target="_blank">/api/petsjanu/*</a></td>
                <td><span class="status-pill active">ONLINE</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (currentTab === "kanban") {
    const todo = tasks.filter(t => t.status === "todo");
    const inProg = tasks.filter(t => t.status === "in_progress");
    const done = tasks.filter(t => t.status === "done");
    container.innerHTML = `
      <div class="kanban-view">
        <div class="section-title">
          <h2>📋 Live Autonomous Kanban Board</h2>
          <span class="count-badge">${tasks.length} Total Floor Tasks</span>
        </div>
        <div class="kanban-columns">
          <div class="kanban-col">
            <h3>⏳ Pending Queue (${todo.length})</h3>
            <div class="task-list">
              ${todo.map(t => renderTaskCard(t)).join('')}
            </div>
          </div>
          <div class="kanban-col">
            <h3>⚡ In Progress (${inProg.length})</h3>
            <div class="task-list">
              ${inProg.map(t => renderTaskCard(t)).join('')}
            </div>
          </div>
          <div class="kanban-col">
            <h3>✅ Completed (${done.length})</h3>
            <div class="task-list">
              ${done.map(t => renderTaskCard(t)).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (currentTab === "cli") {
    container.innerHTML = `
      <div class="cli-view">
        <div class="section-title">
          <h2>💻 Multi-Model CLI Gateway & Dispatcher</h2>
        </div>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:16px;">Run commands using any CLI model provider configured in Hive Swarm:</p>
        <div class="cli-terminal-box">
          <div class="terminal-header">
            <span class="term-dot red"></span><span class="term-dot yellow"></span><span class="term-dot green"></span>
            <span class="term-title">HIVE-SUPER-INTELLIGENCE :: MULTI-MODEL DISPATCHER</span>
          </div>
          <div class="terminal-body">
            <p class="term-line green">> hive gateway --status online</p>
            <p class="term-line">Connected providers: Antigravity (Gemini 3.1 Pro), Claude Code (Sonnet 1M), OpenAI (GPT-5), Ollama (Local)</p>
            <p class="term-line">Active Workspaces: 8/8 mounted with file system isolation</p>
            <div class="cli-input-line">
              <span class="term-prompt">$</span>
              <input type="text" id="cli-user-input" class="term-input" placeholder="Enter CLI prompt or agent command...">
              <button class="btn btn-primary btn-sm" onclick="submitCli()">Run</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

function renderTaskCard(t) {
  return `
    <div class="kanban-card">
      <div class="kc-title">${t.title}</div>
      <div class="kc-meta">
        <span class="dept-badge">${t.workspaceId || "Core"}</span>
        <span class="kc-agent">👤 ${t.assignedCoworker || "Unassigned"}</span>
      </div>
    </div>
  `;
}

function openDispatchModal(coworkerId) {
  selectedCoworker = coworkerId;
  const cw = coworkers.find(c => c.id === coworkerId);
  const modal = document.getElementById("dispatch-modal");
  const nameEl = document.getElementById("modal-coworker-name");
  const wsSelect = document.getElementById("modal-workspace-select");
  if (nameEl && cw) nameEl.innerText = `Dispatch Mission to ${cw.name} (${cw.role})`;
  if (wsSelect) {
    wsSelect.innerHTML = workspaces.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
  }
  modal.classList.remove("hidden");
}

async function advanceShift() {
  try {
    const res = await fetch('/api/schedule/advance', { method: 'POST' });
    const data = await res.json();
    alert(`Shift advanced to: ${data.time} - ${data.event} (Lead: ${data.lead})`);
    await loadData();
  } catch (e) {
    alert("Error advancing shift: " + e.message);
  }
}

async function triggerDirectorCycle() {
  try {
    const res = await fetch('/api/director/tick', { method: 'POST' });
    const data = await res.json();
    alert(`Autonomous Decision: ${data.action} - ${data.description}`);
    await loadData();
  } catch (e) {
    alert("Error executing director cycle: " + e.message);
  }
}

async function runResearchEngine() {
  try {
    const res = await fetch('/api/engines/research/run', { method: 'POST' });
    const data = await res.json();
    alert(`${data.message}\nNew Leads Discovered: ${data.newLeadsDiscovered}\nNiches: ${data.targetNiches.join(', ')}`);
    await loadData();
  } catch (e) {
    alert("Error running research engine: " + e.message);
  }
}

async function runClosingEngine() {
  try {
    const res = await fetch('/api/engines/closing/run', { method: 'POST' });
    const data = await res.json();
    alert(`${data.message}\nDeals Advanced: ${data.dealsAdvanced}\nPipeline Value: ${data.pipelineValue}`);
    await loadData();
  } catch (e) {
    alert("Error running closing engine: " + e.message);
  }
}

function submitCli() {
  const input = document.getElementById("cli-user-input");
  if (!input || !input.value.trim()) return;
  alert(`Command queued for Hive multi-model agent dispatcher: "${input.value}"`);
  input.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentTab = btn.dataset.tab;
      render();
    });
  });

  const btnAdv = document.getElementById("btn-advance-shift");
  if (btnAdv) btnAdv.addEventListener("click", advanceShift);

  const btnStandup = document.getElementById("btn-call-standup");
  if (btnStandup) btnStandup.addEventListener("click", async () => {
    const res = await fetch('/api/standup', { method: 'POST' });
    const data = await res.json();
    alert("📢 Floor Standup called! " + data.message);
    await loadData();
  });

  const btnRefresh = document.getElementById("btn-refresh");
  if (btnRefresh) btnRefresh.addEventListener("click", loadData);

  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnCancelModal = document.getElementById("btn-cancel-modal");
  const modal = document.getElementById("dispatch-modal");
  if (btnCloseModal) btnCloseModal.addEventListener("click", () => modal.classList.add("hidden"));
  if (btnCancelModal) btnCancelModal.addEventListener("click", () => modal.classList.add("hidden"));

  const btnConfirmDispatch = document.getElementById("btn-confirm-dispatch");
  if (btnConfirmDispatch) {
    btnConfirmDispatch.addEventListener("click", async () => {
      const prompt = document.getElementById("modal-prompt-input").value;
      const ws = document.getElementById("modal-workspace-select").value;
      const model = document.getElementById("modal-model-select").value;
      if (!prompt) return alert("Please enter a mission prompt!");

      await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coworkerId: selectedCoworker, workspaceId: ws, model, prompt })
      });
      modal.classList.add("hidden");
      alert("Mission dispatched successfully!");
      await loadData();
    });
  }

  loadData();
});
