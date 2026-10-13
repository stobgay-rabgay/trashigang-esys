function renderNotesheetTab(ws) {
  const notes = getNotesheets();
  const isSupervisor = ["DZONGDAG_DZONGRAB", "SECTOR_HEAD"].includes(currentUser.roleType);

  ws.innerHTML = `
    <div class="bg-white rounded-lg shadow border p-6 space-y-6">
      <h2 class="text-base font-extrabold text-gray-800 uppercase">📝 ${isSupervisor ? 'SUPERVISORY REVIEW CONSOLE' : 'CREATE NOTESHEET'}</h2>
      <div class="space-y-4">
        ${notes.map(n => `
          <div class="border rounded p-4 space-y-2 bg-gray-50">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-sm text-gray-900">${n.id} —${n.subject}</h3>
                <p class="text-xs text-gray-500">Initiated By: ${n.officer}</p>
              </div>
              <span class="px-2 py-1 text-xs font-bold ${n.status === 'Sanctioned' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}">${n.status}</span>
            </div>
            ${isSupervisor && n.status === 'Pending Sanction' ? `
              <div class="pt-2 flex gap-2">
                <input type="text" id="rem-${n.id.replace(/[^a-zA-Z0-9]/g, '')}" placeholder="Remarks" class="border rounded px-2 py-1 text-xs flex-grow">
                <button onclick="approveNotesheet('${n.id}')" class="bg-green-700 text-white font-bold px-3 py-1 rounded text-xs">Approve Sanction</button>
                <button onclick="rejectNotesheet('${n.id}')" class="bg-red-600 text-white font-bold px-3 py-1 rounded text-xs">Reject</button>
              </div>
            ` : ''}
            <div class="pt-2">
              <button onclick="openSanctionModal('${n.id}')" class="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded">📄 View Order PDF</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function approveNotesheet(id) {
  const notes = getNotesheets();
  const note = notes.find(n => n.id === id);
  if (note) {
    note.status = "Sanctioned";
    const mb = getMultiBudget();
    const b = (mb[selectedGovernanceScope] || []).find(x => x.id === note.budgetId);
    if (b) b.sanctioned += note.budget;
    saveMultiBudget(mb);
    saveNotesheets(notes);
    alert("Sanction Granted!");
    renderWorkspace();
  }
}

function rejectNotesheet(id) {
  const notes = getNotesheets();
  const note = notes.find(n => n.id === id);
  if (note) {
    note.status = "Rejected";
    saveNotesheets(notes);
    alert("Notesheet Rejected");
    renderWorkspace();
  }
}

function openSanctionModal(id) {
  const note = getNotesheets().find(n => n.id === id);
  if (!note) return;
  document.getElementById('sanction-ref').innerText = note.id;
  document.getElementById('sanction-subject').innerText = note.subject;
  document.getElementById('sanction-budget').innerText = "Nu. " + note.budget.toLocaleString();
  document.getElementById('sanction-remarks-text').innerText = note.remarksText || "Approved as submitted";
  document.getElementById('sanction-modal').classList.remove('hidden');
}

function closeSanctionModal() { document.getElementById('sanction-modal').classList.add('hidden'); }

function exportToPDF(elementId, filenamePrefix) {
  const element = document.getElementById(elementId);
  html2pdf().from(element).save(`${filenamePrefix}.pdf`);
}
