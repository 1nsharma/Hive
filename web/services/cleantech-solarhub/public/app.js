async function loadData() {
  const [aRes, vRes] = await Promise.all([
    fetch('/api/audits'),
    fetch('/api/vendors')
  ]);
  const audits = await aRes.json();
  const vendors = await vRes.json();

  document.getElementById('vendors-list').innerHTML = vendors.map(v => `
    <div style="padding:10px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:8px; margin-bottom:8px;">
      <strong style="color:#fff;">${v.name}</strong>
      <div style="font-size:12px; color:#9ca3af; margin-top:2px;">⭐ ${v.rating} • ${v.completedProjects}+ Solar Installations Verified</div>
    </div>
  `).join('');

  document.getElementById('audits-table').innerHTML = audits.map(a => `
    <tr>
      <td><strong>${a.id}</strong></td>
      <td>${a.clientName} (${a.city})</td>
      <td><span style="color:#f59e0b; font-weight:700;">${a.capacityKW} kW</span></td>
      <td>₹${a.grossCost.toLocaleString()}</td>
      <td><span style="color:#10b981; font-weight:700;">₹${a.govSubsidy.toLocaleString()}</span></td>
      <td><strong>₹${a.netCost.toLocaleString()}</strong></td>
      <td>₹${a.annualSavings.toLocaleString()}/yr</td>
      <td>${a.paybackYears} Years</td>
    </tr>
  `).join('');
}

document.getElementById('btn-calc').onclick = async () => {
  const name = document.getElementById('sh-name').value;
  const city = document.getElementById('sh-city').value;
  const bill = document.getElementById('sh-bill').value;
  const roof = document.getElementById('sh-roof').value;

  const res = await fetch('/api/assess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientName: name, city, monthlyBill: bill, roofArea: roof })
  });

  if (res.ok) {
    const a = await res.json();
    alert(`☀️ Solar Assessment Completed!\nRecommended: ${a.capacityKW} kW\nGovt Subsidy: ₹${a.govSubsidy.toLocaleString()}\nNet Client Cost: ₹${a.netCost.toLocaleString()}\nPayback: ${a.paybackYears} Years`);
    loadData();
  }
};

loadData();
