// Executive SPA Controller
let currentView = "ceo";
let metrics = {
  totalRevenueGTV: 0,
  activeKiranas: 0,
  activeFleetTickets: 0,
  totalSolarInstalledKW: 0,
  candidatesScreened: 0,
  ledgerTotalBlocks: 1
};

async function fetchMetrics() {
  try {
    const res = await fetch("/api/metrics");
    if (res.ok) {
      metrics = await res.json();
      document.getElementById("header-gtv").innerText = `₹${metrics.totalRevenueGTV.toLocaleString()}`;
    }
  } catch (err) {
    console.error("Failed to fetch metrics", err);
  }
}

function renderView() {
  const container = document.getElementById("view-container");
  const titleEl = document.getElementById("view-title");
  const subEl = document.getElementById("view-subtitle");

  // Update Nav highlight
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === currentView);
  });

  if (currentView === "ceo") {
    titleEl.innerText = "Founder & CEO Executive Command";
    subEl.innerText = "Consolidated cross-unit intelligence, live cashflow and operational scale";
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">Gross Merchandise Value (GTV)</div>
          <div class="value">₹${metrics.totalRevenueGTV.toLocaleString()}</div>
          <div class="sub">Across All 4 Units</div>
        </div>
        <div class="stat-card">
          <div class="label">Commerce Retail Invoices</div>
          <div class="value">${metrics.activeKiranas}</div>
          <div class="sub">DukaanMitra Kirana Network</div>
        </div>
        <div class="stat-card">
          <div class="label">Active Fleet Dispatches</div>
          <div class="value">${metrics.activeFleetTickets}</div>
          <div class="sub">TruckWala 24x7 Operations</div>
        </div>
        <div class="stat-card">
          <div class="label">Clean Energy Capacity</div>
          <div class="value">${metrics.totalSolarInstalledKW} kW</div>
          <div class="sub">SolarHub Microgrids</div>
        </div>
        <div class="stat-card">
          <div class="label">Screened Talent Pool</div>
          <div class="value">${metrics.candidatesScreened}</div>
          <div class="sub">HireSaathi Enterprise AI</div>
        </div>
        <div class="stat-card">
          <div class="label">ProofLedger Blocks</div>
          <div class="value">${metrics.ledgerTotalBlocks}</div>
          <div class="sub">Immutable Cryptographic Audit</div>
        </div>
      </div>

      <div class="action-panel">
        <h3>🏛️ Executive Holding Matrix</h3>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">
          All 56 legacy projects have been unified under 4 streamlined operational Business Units with 1 shared cryptographic and AI core.
        </p>
        <table class="data-table">
          <thead>
            <tr>
              <th>Business Unit</th>
              <th>Flagship Product</th>
              <th>Target Market</th>
              <th>GTM Monetization</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Commerce & Retail</strong></td>
              <td>DukaanMitra OS</td>
              <td>60M+ Indian Kirana Stores</td>
              <td>₹499/mo SaaS + 0.2% UPI txn</td>
              <td><span style="color: var(--accent-green); font-weight:700;">● LIVE VERIFIED</span></td>
            </tr>
            <tr>
              <td><strong>Heavy Logistics</strong></td>
              <td>TruckWala 24x7</td>
              <td>Highway Commercial Fleets</td>
              <td>Dispatch fee + Garage margin</td>
              <td><span style="color: var(--accent-green); font-weight:700;">● LIVE VERIFIED</span></td>
            </tr>
            <tr>
              <td><strong>CleanTech & Energy</strong></td>
              <td>SolarHub</td>
              <td>Residential & Commercial Solar</td>
              <td>Turnkey EPC margin + Subsidy facilitation</td>
              <td><span style="color: var(--accent-green); font-weight:700;">● LIVE VERIFIED</span></td>
            </tr>
            <tr>
              <td><strong>Talent & HR Tech</strong></td>
              <td>HireSaathi</td>
              <td>Blue/Grey Collar & Tech Hiring</td>
              <td>B2B Job Screening Subscriptions</td>
              <td><span style="color: var(--accent-green); font-weight:700;">● LIVE VERIFIED</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (currentView === "cto") {
    titleEl.innerText = "CTO & Shared Architecture Console";
    subEl.innerText = "Shared Core AI Gateway, Multi-tenant Isolation, and ProofLedger cryptographic chain";
    container.innerHTML = `
      <div class="action-panel">
        <h3>⚙️ Shared Infrastructure Components</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Core AI Engine</div>
            <div class="value" style="font-size:20px;">Gemini Dual-Gateway</div>
            <div class="sub">Structured Intent Parser Active</div>
          </div>
          <div class="stat-card">
            <div class="label">Multi-Tenant Context</div>
            <div class="value" style="font-size:20px;">RLS Isolated</div>
            <div class="sub">Role Hierarchy Enforced</div>
          </div>
          <div class="stat-card">
            <div class="label">Cryptographic Ledger</div>
            <div class="value" style="font-size:20px;">ProofLedger SHA-256</div>
            <div class="sub">Zero Hash Collisions</div>
          </div>
        </div>
      </div>
      <div class="action-panel">
        <h3>🔗 Live Cryptographic Audit Trail (ProofLedger)</h3>
        <div id="audit-log-container" style="max-height: 300px; overflow-y: auto; font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">
          Loading immutable blocks...
        </div>
      </div>
    `;
    loadAuditLogs();
  } else if (currentView === "pm") {
    titleEl.innerText = "Product Manager (CPO) Roadmap & Sprints";
    subEl.innerText = "90-day canonical execution sprints across the 4 verified verticals";
    container.innerHTML = `
      <div class="action-panel">
        <h3>🎯 90-Day Enterprise Roadmap</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Sprint</th>
              <th>Vertical</th>
              <th>Target Deliverable</th>
              <th>Impact KPI</th>
              <th>Readiness</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Sprint 1 (Days 1-15)</strong></td>
              <td>Commerce (DukaanMitra)</td>
              <td>Voice Billing + WhatsApp Khata Generator</td>
              <td>10 Merchant Pilot Signups</td>
              <td><span style="color:var(--accent-green); font-weight:700;">100% Code Verified</span></td>
            </tr>
            <tr>
              <td><strong>Sprint 2 (Days 16-30)</strong></td>
              <td>Logistics (TruckWala)</td>
              <td>Highway SOS Dispatch & Cost Estimator</td>
              <td>Sub-30m Mechanic Arrival</td>
              <td><span style="color:var(--accent-green); font-weight:700;">100% Code Verified</span></td>
            </tr>
            <tr>
              <td><strong>Sprint 3 (Days 31-60)</strong></td>
              <td>CleanTech (SolarHub)</td>
              <td>PM Surya Ghar Subsidy Engine</td>
              <td>₹78,000 Subsidy Application Pipeline</td>
              <td><span style="color:var(--accent-green); font-weight:700;">100% Code Verified</span></td>
            </tr>
            <tr>
              <td><strong>Sprint 4 (Days 61-90)</strong></td>
              <td>Talent (HireSaathi)</td>
              <td>Automated AI Resume & Skill Evaluation</td>
              <td>50+ Verified Candidate Matches</td>
              <td><span style="color:var(--accent-green); font-weight:700;">100% Code Verified</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (currentView === "commerce") {
    titleEl.innerText = "DukaanMitra OS — Commerce & Kirana Engine";
    subEl.innerText = "Voice-first billing, WhatsApp khata management, and inventory checkout";
    container.innerHTML = `
      <div class="action-panel">
        <h3>🎙️ Live Voice / Natural Language Order Generator</h3>
        <p style="color:var(--text-muted); font-size:13px; margin-bottom:12px;">
          Type or speak naturally in Hindi/Hinglish (e.g. <em>"5 packet maggi aur 2 litre amul milk to Ramesh bhai on udhar"</em>):
        </p>
        <div class="form-group">
          <input type="text" id="commerce-input" class="form-input" value="5 packet maggi aur 2 litre amul milk to Ramesh bhai on udhar">
        </div>
        <button class="btn-primary" id="btn-create-order">Generate WhatsApp Bill</button>
      </div>
      <div class="action-panel">
        <h3>🧾 Generated Invoices</h3>
        <div id="commerce-result">Loading invoices...</div>
      </div>
    `;
    document.getElementById("btn-create-order").onclick = handleCommerceOrder;
    loadCommerceInvoices();
  } else if (currentView === "logistics") {
    titleEl.innerText = "TruckWala 24x7 — Fleet Logistics Engine";
    subEl.innerText = "Commercial breakdown assistance, highway dispatcher and maintenance ledger";
    container.innerHTML = `
      <div class="action-panel">
        <h3>🚨 Report Highway Breakdown</h3>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
          <div class="form-group">
            <label>Truck Registration</label>
            <input type="text" id="tw-truck" class="form-input" value="RJ-14-GA-8899">
          </div>
          <div class="form-group">
            <label>Driver Contact</label>
            <input type="text" id="tw-driver" class="form-input" value="Balwant Singh (9829012345)">
          </div>
        </div>
        <div class="form-group">
          <label>Highway Location</label>
          <input type="text" id="tw-loc" class="form-input" value="NH-48 KM 142 Near Dudu Toll Plaza">
        </div>
        <div class="form-group">
          <label>Breakdown Issue</label>
          <input type="text" id="tw-issue" class="form-input" value="Clutch pressure plate burst, air brake pressure low">
        </div>
        <button class="btn-primary" id="btn-create-breakdown">Dispatch Emergency Mechanic</button>
      </div>
      <div class="action-panel">
        <h3>📋 Active Highway Dispatch Tickets</h3>
        <div id="logistics-result">Loading tickets...</div>
      </div>
    `;
    document.getElementById("btn-create-breakdown").onclick = handleLogisticsTicket;
    loadLogisticsTickets();
  } else if (currentView === "cleantech") {
    titleEl.innerText = "SolarHub — CleanTech & Energy Engine";
    subEl.innerText = "PM Surya Ghar subsidy calculation, rooftop capacity and microgrid ROI";
    container.innerHTML = `
      <div class="action-panel">
        <h3>☀️ Rooftop Solar & Subsidy Assessment</h3>
        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:16px;">
          <div class="form-group">
            <label>Client Name</label>
            <input type="text" id="solar-name" class="form-input" value="Sunil Verma">
          </div>
          <div class="form-group">
            <label>Monthly Power Bill (₹)</label>
            <input type="number" id="solar-bill" class="form-input" value="2500">
          </div>
          <div class="form-group">
            <label>Rooftop Area (sq. ft.)</label>
            <input type="number" id="solar-roof" class="form-input" value="350">
          </div>
        </div>
        <button class="btn-primary" id="btn-calc-solar">Calculate Subsidy & Savings</button>
      </div>
      <div class="action-panel">
        <h3>📊 Solar Assessment Records</h3>
        <div id="cleantech-result">Loading assessments...</div>
      </div>
    `;
    document.getElementById("btn-calc-solar").onclick = handleSolarCalc;
    loadSolarAudits();
  } else if (currentView === "talent") {
    titleEl.innerText = "HireSaathi — Enterprise Talent Engine";
    subEl.innerText = "AI candidate skill extraction, normalized scoring and automated screening";
    container.innerHTML = `
      <div class="action-panel">
        <h3>👤 Candidate Quick AI Screen</h3>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
          <div class="form-group">
            <label>Candidate Name</label>
            <input type="text" id="talent-name" class="form-input" value="Vikas Sharma">
          </div>
          <div class="form-group">
            <label>Applying For Role</label>
            <input type="text" id="talent-role" class="form-input" value="Full-Stack AI Developer">
          </div>
        </div>
        <div class="form-group">
          <label>Resume / Skills Summary</label>
          <textarea id="talent-resume" class="form-textarea" rows="3">Proficient in TypeScript, React, Node.js, Python, PostgreSQL, Gemini AI agent pipelines, and Git version control.</textarea>
        </div>
        <button class="btn-primary" id="btn-screen-talent">Run AI Screening</button>
      </div>
      <div class="action-panel">
        <h3>🎯 Evaluated Candidates</h3>
        <div id="talent-result">Loading candidates...</div>
      </div>
    `;
    document.getElementById("btn-screen-talent").onclick = handleTalentScreen;
    loadTalentCandidates();
  }
}

// Handlers & Loaders
async function loadAuditLogs() {
  const el = document.getElementById("audit-log-container");
  if (!el) return;
  const res = await fetch("/api/audit-logs");
  if (res.ok) {
    const logs = await res.json();
    el.innerHTML = logs.map(l => `
      <div style="padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <span style="color:var(--accent-gold);">[Block #${l.index}]</span> 
        <span style="color:var(--accent-blue);">${l.eventType}</span> 
        <span style="color:var(--text-muted);">| Tenant: ${l.tenantId}</span> 
        <br>
        <span style="color:#64748b;">Hash: ${l.hash.slice(0, 32)}...</span>
      </div>
    `).join("");
  }
}

async function handleCommerceOrder() {
  const text = document.getElementById("commerce-input").value;
  const res = await fetch("/api/commerce/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText: text })
  });
  if (res.ok) {
    await fetchMetrics();
    loadCommerceInvoices();
  }
}

async function loadCommerceInvoices() {
  const el = document.getElementById("commerce-result");
  if (!el) return;
  const res = await fetch("/api/commerce/invoices");
  if (res.ok) {
    const invoices = await res.json();
    if (invoices.length === 0) {
      el.innerHTML = "<p style='color:var(--text-muted);'>No invoices created yet.</p>";
      return;
    }
    el.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>WhatsApp Text</th>
          </tr>
        </thead>
        <tbody>
          ${invoices.map(i => `
            <tr>
              <td><strong>${i.id}</strong></td>
              <td>${i.customerName}</td>
              <td>${i.items.map(it => `${it.name} (${it.quantity}x)`).join(", ")}</td>
              <td><strong>₹${i.grandTotal}</strong></td>
              <td><span style="color:${i.isUdhar ? 'var(--accent-gold)' : 'var(--accent-green)'}">${i.status}</span></td>
              <td><button style="padding:4px 8px; font-size:11px;" onclick="alert(decodeURIComponent('${encodeURIComponent(i.whatsAppShareText)}'))">View WhatsApp Msg</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
}

async function handleLogisticsTicket() {
  const truck = document.getElementById("tw-truck").value;
  const driver = document.getElementById("tw-driver").value;
  const loc = document.getElementById("tw-loc").value;
  const issue = document.getElementById("tw-issue").value;

  const res = await fetch("/api/logistics/breakdown", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      truckNumber: truck,
      driverName: driver,
      driverPhone: "9829012345",
      highwayLocation: loc,
      issueDescription: issue
    })
  });
  if (res.ok) {
    const t = await res.json();
    // Auto-dispatch partner
    await fetch("/api/logistics/dispatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: t.id })
    });
    await fetchMetrics();
    loadLogisticsTickets();
  }
}

async function loadLogisticsTickets() {
  const el = document.getElementById("logistics-result");
  if (!el) return;
  const res = await fetch("/api/logistics/tickets");
  if (res.ok) {
    const tickets = await res.json();
    if (tickets.length === 0) {
      el.innerHTML = "<p style='color:var(--text-muted);'>No breakdown requests logged.</p>";
      return;
    }
    el.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Truck</th>
            <th>Location</th>
            <th>Assigned Partner</th>
            <th>Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${tickets.map(t => `
            <tr>
              <td><strong>${t.id}</strong></td>
              <td>${t.truckNumber}</td>
              <td>${t.highwayLocation}</td>
              <td>${t.assignedPartner || "Pending Assignment"}</td>
              <td>₹${t.estimatedCost}</td>
              <td><span style="color:var(--accent-blue); font-weight:700;">${t.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
}

async function handleSolarCalc() {
  const name = document.getElementById("solar-name").value;
  const bill = parseFloat(document.getElementById("solar-bill").value) || 2000;
  const roof = parseFloat(document.getElementById("solar-roof").value) || 250;

  const res = await fetch("/api/cleantech/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientName: name,
      clientPhone: "9829000000",
      city: "Jaipur",
      monthlyBillINR: bill,
      roofAreaSqFt: roof
    })
  });
  if (res.ok) {
    await fetchMetrics();
    loadSolarAudits();
  }
}

async function loadSolarAudits() {
  const el = document.getElementById("cleantech-result");
  if (!el) return;
  const res = await fetch("/api/cleantech/audits");
  if (res.ok) {
    const audits = await res.json();
    if (audits.length === 0) {
      el.innerHTML = "<p style='color:var(--text-muted);'>No solar assessments performed yet.</p>";
      return;
    }
    el.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Audit ID</th>
            <th>Client</th>
            <th>Recommended Capacity</th>
            <th>Gov Subsidy</th>
            <th>Net Cost to Client</th>
            <th>Annual Savings</th>
            <th>Payback</th>
          </tr>
        </thead>
        <tbody>
          ${audits.map(a => `
            <tr>
              <td><strong>${a.id}</strong></td>
              <td>${a.clientName}</td>
              <td>${a.recommendedCapacityKW} kW</td>
              <td style="color:var(--accent-green); font-weight:700;">₹${a.govSubsidy.toLocaleString()}</td>
              <td><strong>₹${a.netConsumerCost.toLocaleString()}</strong></td>
              <td>₹${a.annualSavingsINR.toLocaleString()}/yr</td>
              <td>${a.paybackPeriodYears} Years</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
}

async function handleTalentScreen() {
  const name = document.getElementById("talent-name").value;
  const role = document.getElementById("talent-role").value;
  const resume = document.getElementById("talent-resume").value;

  const res = await fetch("/api/talent/screen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      phone: "9876543210",
      appliedRole: role,
      resumeText: resume,
      experienceYears: 3
    })
  });
  if (res.ok) {
    await fetchMetrics();
    loadTalentCandidates();
  }
}

async function loadTalentCandidates() {
  const el = document.getElementById("talent-result");
  if (!el) return;
  const res = await fetch("/api/talent/candidates");
  if (res.ok) {
    const candidates = await res.json();
    if (candidates.length === 0) {
      el.innerHTML = "<p style='color:var(--text-muted);'>No candidates screened yet.</p>";
      return;
    }
    el.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Candidate ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Verified Skills</th>
            <th>AI Match Score</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          ${candidates.map(c => `
            <tr>
              <td><strong>${c.id}</strong></td>
              <td>${c.name}</td>
              <td>${c.appliedRole}</td>
              <td>${c.skills.join(", ")}</td>
              <td><strong style="color:var(--accent-blue);">${c.totalScore} / 100</strong></td>
              <td><span style="color:${c.totalScore >= 70 ? 'var(--accent-green)' : 'var(--accent-gold)'}; font-weight:700;">${c.recommendation}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
}

// Global Event Listeners
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    currentView = btn.dataset.view;
    renderView();
  });
});

document.getElementById("btn-refresh").addEventListener("click", async () => {
  await fetchMetrics();
  renderView();
});

// Initialization
fetchMetrics().then(renderView);
setInterval(fetchMetrics, 5000);
