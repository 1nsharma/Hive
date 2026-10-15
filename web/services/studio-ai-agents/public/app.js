async function load() {
  const [aRes, pRes, tRes] = await Promise.all([
    fetch('/api/agents'),
    fetch('/api/pipelines'),
    fetch('/api/terminal')
  ]);
  const agents = await aRes.json();
  const pipelines = await pRes.json();
  const logs = await tRes.json();

  document.getElementById('agents-list').innerHTML = agents.map(a => `
    <div class="agent-item">
      <div>
        <strong style="color:#fff;">${a.name}</strong>
        <div style="font-size:11px; color:#9ca3af; margin-top:2px;">${a.role} • Mem: ${a.memoryTokens}</div>
      </div>
      <span style="font-size:11px; font-weight:700; color:${a.status === 'ACTIVE' ? '#10b981' : '#f59e0b'};">${a.status}</span>
    </div>
  `).join('');

  document.getElementById('pipelines-list').innerHTML = pipelines.map(p => `
    <div style="display:flex; justify-content:space-between; font-size:12px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
      <span>${p.title}</span>
      <strong style="color:#38bdf8;">${p.status}</strong>
    </div>
  `).join('');

  const term = document.getElementById('terminal');
  term.innerHTML = logs.map(l => `<div>&gt; ${l}</div>`).join('');
  term.scrollTop = term.scrollHeight;
}

document.getElementById('btn-dispatch').onclick = async () => {
  const prompt = document.getElementById('agent-prompt').value;
  await fetch('/api/dispatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  load();
};

load();
