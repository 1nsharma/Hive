async function loadData() {
  const [bRes, rRes, wRes] = await Promise.all([
    fetch('/api/breakdowns'),
    fetch('/api/rates'),
    fetch('/api/workshops')
  ]);
  const breakdowns = await bRes.json();
  const rates = await rRes.json();
  const workshops = await wRes.json();

  // Render Rates
  document.getElementById('rates-table').innerHTML = rates.map(r => `
    <tr><td>${r.service}</td><td style="color:#38bdf8; font-weight:600;">${r.rate}</td></tr>
  `).join('');

  // Render Garages
  document.getElementById('workshops-list').innerHTML = workshops.map(w => `
    <li style="margin-bottom:6px;">📍 <strong>${w.name}</strong> (${w.highway}) • ⭐ ${w.rating} • ${w.activeMechanics} vans ready</li>
  `).join('');

  // Render Tickets
  document.getElementById('tickets-table').innerHTML = breakdowns.map(t => `
    <tr>
      <td><strong>${t.id}</strong></td>
      <td><span style="color:#ef4444; font-weight:700;">${t.truckNumber}</span></td>
      <td>${t.driverName} (${t.driverPhone})</td>
      <td>${t.location}</td>
      <td>${t.assignedWorkshop}</td>
      <td>₹${t.costEstimate}</td>
      <td><span style="color:#10b981; font-weight:700;">${t.status}</span></td>
    </tr>
  `).join('');
}

document.getElementById('btn-dispatch').onclick = async () => {
  const truck = document.getElementById('tw-truck').value;
  const driver = document.getElementById('tw-driver').value;
  const phone = document.getElementById('tw-phone').value;
  const loc = document.getElementById('tw-loc').value;
  const issue = document.getElementById('tw-issue').value;

  const res = await fetch('/api/dispatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ truckNumber: truck, driverName: driver, driverPhone: phone, location: loc, issue })
  });

  if (res.ok) {
    const t = await res.json();
    alert(`🚨 Emergency Van Dispatched! Ticket: ${t.id}\nAssigned Garage: ${t.assignedWorkshop}`);
    loadData();
  }
};

loadData();
