async function load() {
  const res = await fetch('/api/vets');
  const vets = await res.json();
  document.getElementById('vets-list').innerHTML = vets.map(v => `
    <div class="vet-row">
      <strong style="color:#fff;">${v.name}</strong>
      <div style="font-size:11px; color:#14b8a6; margin-top:2px;">${v.specialization} • ⭐ ${v.rating}</div>
      <div style="font-size:11px; color:#9ca3af;">${v.clinic}</div>
    </div>
  `).join('');
}

document.getElementById('btn-book-vet').onclick = async () => {
  const pet = document.getElementById('pet-name').value;
  const owner = document.getElementById('owner-name').value;
  const issue = document.getElementById('pet-issue').value;

  const res = await fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ petName: pet, ownerName: owner, issue })
  });

  if (res.ok) {
    const c = await res.json();
    alert(`🐾 Consultation Booked!\nTicket: ${c.id}\nPet: ${c.petName}\nAssigned Vet: ${c.assignedVet}\nStatus: CONFIRMED`);
  }
};

load();
