let currentTab = "overview";

const SERVICES = {
  commerce: { name: "DukaanMitra OS", port: 3001, url: "http://localhost:3001" },
  logistics: { name: "TruckWala 24x7", port: 3002, url: "http://localhost:3002" },
  cleantech: { name: "SolarHub CleanTech", port: 3003, url: "http://localhost:3003" },
  talent: { name: "HireSaathi AI", port: 3004, url: "http://localhost:3004" },
  ai_agents: { name: "AI Agent & JORVISH Studio", port: 3005, url: "http://localhost:3005" },
  gaming_arcade: { name: "Desi Arcade Gaming Studio", port: 3006, url: "http://localhost:3006" },
  govtech: { name: "GovAI India Central Portal", port: 3007, url: "http://localhost:3007" },
  petcare: { name: "PetsJanu Veterinary Care", port: 3008, url: "http://localhost:3008" }
};

async function checkStatus() {
  try {
    const res = await fetch("/api/gateway/status");
    if (res.ok) {
      const data = await res.json();
      for (const [key, svc] of Object.entries(data.microServices)) {
        const el = document.getElementById(`stat-${key}`);
        if (el) {
          const isOnline = svc.status === "ONLINE";
          el.className = `svc-status ${isOnline ? 'online' : 'offline'}`;
        }
      }
    }
  } catch {}

  try {
    const res = await fetch("/api/gateway/metrics");
    if (res.ok) {
      const m = await res.json();
      document.getElementById("top-gtv").innerText = `₹${(m.totalGTV || 0).toLocaleString()}`;
    }
  } catch {}
}

function renderTab() {
  const main = document.getElementById("shell-main");

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === currentTab);
  });

  if (currentTab === "overview") {
    main.innerHTML = `
      <div class="overview-pad">
        <h1 style="font-size:24px; font-weight:800; margin-bottom:8px;">Enterprise Executive Command</h1>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:24px;">Full-Stack Micro-Frontend & Multi-Studio Architecture: Real-time telemetry across 8 independent services.</p>

        <div class="grid-4">
          <div class="card">
            <div class="label">Retail Invoices</div>
            <div class="value" id="card-inv">...</div>
            <div class="sub">Port 3001 • DukaanMitra</div>
          </div>
          <div class="card">
            <div class="label">Highway SOS</div>
            <div class="value" id="card-sos">...</div>
            <div class="sub">Port 3002 • TruckWala</div>
          </div>
          <div class="card">
            <div class="label">Solar Audits</div>
            <div class="value" id="card-solar">...</div>
            <div class="sub">Port 3003 • SolarHub</div>
          </div>
          <div class="card">
            <div class="label">Screened Talent</div>
            <div class="value" id="card-talent">...</div>
            <div class="sub">Port 3004 • HireSaathi</div>
          </div>
        </div>

        <div class="panel">
          <h3>🏛️ Complete Holding Ecosystem (8 Independent Services)</h3>
          <p style="color:var(--text-muted); font-size:13px; line-height:1.6; margin-bottom:16px;">
            Every single vertical and workspace studio operates on its own dedicated port, isolated database, and frontend interface.
          </p>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
            <div style="padding:12px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px;">
              <strong style="color:#10b981;">1. Commerce (:3001)</strong>
              <div style="font-size:11px; color:#94a3b8; margin-top:4px;">WhatsApp Bahi Khata, Voice Orders</div>
            </div>
            <div style="padding:12px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px;">
              <strong style="color:#ef4444;">2. Logistics (:3002)</strong>
              <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Highway SOS, Live Dispatch</div>
            </div>
            <div style="padding:12px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px;">
              <strong style="color:#f59e0b;">3. CleanTech (:3003)</strong>
              <div style="font-size:11px; color:#94a3b8; margin-top:4px;">PM Surya Ghar ₹78K Subsidy</div>
            </div>
            <div style="padding:12px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px;">
              <strong style="color:#a855f7;">4. Talent (:3004)</strong>
              <div style="font-size:11px; color:#94a3b8; margin-top:4px;">AI Skill Screener, Matching</div>
            </div>
            <div style="padding:12px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px;">
              <strong style="color:#06b6d4;">5. AI Studio (:3005)</strong>
              <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Universal Autonomous Agents & JORVISH</div>
            </div>
            <div style="padding:12px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px;">
              <strong style="color:#ec4899;">6. Desi Arcade (:3006)</strong>
              <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Gaming Pipeline & Trend Radar</div>
            </div>
            <div style="padding:12px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px;">
              <strong style="color:#f97316;">7. GovAI (:3007)</strong>
              <div style="font-size:11px; color:#94a3b8; margin-top:4px;">India Central Schemes Discovery</div>
            </div>
            <div style="padding:12px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px;">
              <strong style="color:#14b8a6;">8. PetsJanu (:3008)</strong>
              <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Veterinary Health Hub & Clinics</div>
            </div>
          </div>
        </div>
      </div>
    `;
    loadOverviewCards();
  } else if (currentTab === "architecture") {
    main.innerHTML = `
      <div class="overview-pad">
        <h1 style="font-size:24px; font-weight:800; margin-bottom:8px;">ProofLedger Cryptographic Audit</h1>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:24px;">Central cryptographic SHA-256 chain securing all 8 services.</p>
        <div class="panel">
          <h3>🔗 Live Cryptographic Blocks</h3>
          <div id="ledger-blocks" style="font-family:'JetBrains Mono', monospace; font-size:12px; color:#94a3b8; max-height:400px; overflow-y:auto;">
            Loading blocks...
          </div>
        </div>
      </div>
    `;
    loadLedgerBlocks();
  } else if (SERVICES[currentTab]) {
    const svc = SERVICES[currentTab];
    main.innerHTML = `
      <div style="background:#0e1524; padding:8px 20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:12px; color:#94a3b8;">Embedding Live Full-Stack Service: <strong>${svc.name}</strong> on Port <strong>${svc.port}</strong></span>
        <a href="${svc.url}" target="_blank" style="font-size:12px; color:var(--blue); text-decoration:none; font-weight:700;">Open in Dedicated Tab ↗</a>
      </div>
      <iframe src="${svc.url}" class="micro-frame"></iframe>
    `;
  }
}

async function loadOverviewCards() {
  try {
    const res = await fetch("/api/gateway/metrics");
    if (res.ok) {
      const m = await res.json();
      const elInv = document.getElementById("card-inv");
      const elSos = document.getElementById("card-sos");
      const elSol = document.getElementById("card-solar");
      const elTal = document.getElementById("card-talent");
      if (elInv) elInv.innerText = m.invoicesCount || 0;
      if (elSos) elSos.innerText = m.activeSOSCount || 0;
      if (elSol) elSol.innerText = m.solarAuditsCount || 0;
      if (elTal) elTal.innerText = m.candidatesCount || 0;
    }
  } catch {}
}

async function loadLedgerBlocks() {
  const el = document.getElementById("ledger-blocks");
  if (!el) return;
  try {
    const res = await fetch("/api/gateway/ledger");
    if (res.ok) {
      const chain = await res.json();
      el.innerHTML = chain.map(b => `
        <div style="padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
          <span style="color:var(--gold);">[Block #${b.index}]</span> <span style="color:var(--blue);">${b.eventType}</span> <span style="color:#64748b;">(${b.service})</span>
          <br>
          <span style="color:#64748b;">Hash: ${b.hash}</span>
        </div>
      `).join("");
    }
  } catch {}
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    currentTab = btn.dataset.tab;
    renderTab();
  };
});

document.getElementById("btn-shell-refresh").onclick = () => {
  checkStatus();
  renderTab();
};

checkStatus();
renderTab();
setInterval(checkStatus, 4000);
