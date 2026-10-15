async function load() {
  const res = await fetch('/api/schemes');
  const schemes = await res.json();
  document.getElementById('schemes-list').innerHTML = schemes.map(s => `
    <div class="scheme-row">
      <strong style="color:#fff;">${s.name}</strong>
      <div style="font-size:11px; color:#f97316; margin-top:2px;">${s.ministry} • Benefit: ${s.maxBenefit}</div>
      <div style="font-size:11px; color:#9ca3af;">Beneficiaries: ${s.beneficiaries}</div>
    </div>
  `).join('');
}

document.getElementById('btn-verify').onclick = async () => {
  const name = document.getElementById('cit-name').value;
  const scheme = document.getElementById('cit-scheme').value;
  const res = await fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, scheme })
  });
  if (res.ok) {
    const v = await res.json();
    alert(`🇮🇳 Verification Successful!\nCitizen: ${v.citizenName}\nScheme: ${v.scheme}\nStatus: ELIGIBLE & VERIFIED`);
  }
};

load();
