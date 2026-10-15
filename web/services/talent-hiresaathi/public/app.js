async function loadData() {
  const [cRes, jRes] = await Promise.all([
    fetch('/api/candidates'),
    fetch('/api/jobs')
  ]);
  const candidates = await cRes.json();
  const jobs = await jRes.json();

  document.getElementById('jobs-list').innerHTML = jobs.map(j => `
    <div style="padding:10px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:8px; margin-bottom:8px;">
      <div style="display:flex; justify-content:space-between;">
        <strong style="color:#fff;">${j.title}</strong>
        <span style="color:#a855f7; font-weight:700;">${j.openings} Openings</span>
      </div>
      <div style="font-size:12px; color:#9ca3af; margin-top:2px;">Reqs: ${j.tech} (${j.minExpYears}+ yrs exp)</div>
    </div>
  `).join('');

  document.getElementById('candidates-table').innerHTML = candidates.map(c => `
    <tr>
      <td><strong>${c.id}</strong></td>
      <td>${c.name} (${c.phone})</td>
      <td>${c.appliedRole}</td>
      <td><span style="color:#38bdf8;">${c.skills.join(', ')}</span></td>
      <td><strong style="color:#a855f7;">${c.score} / 100</strong></td>
      <td><span style="color:${c.score >= 70 ? '#10b981' : '#f59e0b'}; font-weight:700;">${c.decision}</span></td>
    </tr>
  `).join('');
}

document.getElementById('btn-screen').onclick = async () => {
  const name = document.getElementById('hs-name').value;
  const phone = document.getElementById('hs-phone').value;
  const role = document.getElementById('hs-role').value;
  const resume = document.getElementById('hs-resume').value;

  const res = await fetch('/api/screen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, appliedRole: role, resumeText: resume })
  });

  if (res.ok) {
    const c = await res.json();
    alert(`🎯 Candidate Evaluated!\nScore: ${c.score}/100\nDecision: ${c.decision}\nExtracted Skills: ${c.skills.join(', ')}`);
    loadData();
  }
};

loadData();
