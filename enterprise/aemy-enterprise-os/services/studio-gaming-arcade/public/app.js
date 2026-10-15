async function load() {
  const [gRes, tRes] = await Promise.all([
    fetch('/api/games'),
    fetch('/api/trends')
  ]);
  const games = await gRes.json();
  const trends = await tRes.json();

  document.getElementById('games-list').innerHTML = games.map(g => `
    <div class="game-row">
      <div>
        <strong style="color:#fff;">${g.title}</strong>
        <div style="font-size:11px; color:#9ca3af; margin-top:2px;">${g.genre} • DAU: ${g.dailyActive}</div>
      </div>
      <span style="font-size:11px; font-weight:700; color:#ec4899;">${g.status}</span>
    </div>
  `).join('');

  document.getElementById('trends-list').innerHTML = trends.map(t => `
    <div style="display:flex; justify-content:space-between; font-size:12px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
      <span>${t.tag}</span>
      <span style="color:#10b981; font-weight:700;">${t.momentum} (Score: ${t.viralScore})</span>
    </div>
  `).join('');
}

document.getElementById('btn-synth').onclick = async () => {
  const title = document.getElementById('game-title').value;
  const genre = document.getElementById('game-genre').value;
  await fetch('/api/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, genre })
  });
  load();
};

load();
