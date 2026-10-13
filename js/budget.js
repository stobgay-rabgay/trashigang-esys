function renderHeaderAndSummary() {
  document.getElementById('user-display-name').innerText = `${currentUser.name} (${currentUser.role})`;
  document.getElementById('user-emp-id').innerText = `EID: ${currentUser.eid || 'Verified'}`;
  document.getElementById('user-avatar').innerText = currentUser.avatar;

  const mb = getMultiBudget();
  let curAlloc = 0, curSanc = 0, curBal = 0;
  let capAlloc = 0, capSanc = 0, capBal = 0;

  (mb[selectedGovernanceScope] || []).forEach(i => {
    if ((i.category || "Current").toLowerCase() === "capital") {
      capAlloc += i.allocated; capSanc += i.sanctioned; capBal += i.balance;
    } else {
      curAlloc += i.allocated; curSanc += i.sanctioned; curBal += i.balance;
    }
  });

  document.getElementById('current-allocated').innerText = `Nu. ${curAlloc.toLocaleString()}`;
  document.getElementById('current-sanctioned').innerText = `Nu. ${curSanc.toLocaleString()}`;
  document.getElementById('current-balance').innerText = `Nu. ${curBal.toLocaleString()}`;

  document.getElementById('capital-allocated').innerText = `Nu. ${capAlloc.toLocaleString()}`;
  document.getElementById('capital-sanctioned').innerText = `Nu. ${capSanc.toLocaleString()}`;
  document.getElementById('capital-balance').innerText = `Nu. ${capBal.toLocaleString()}`;

  document.getElementById('scope-total-allocated').innerText = `Nu. ${(curAlloc+capAlloc).toLocaleString()}`;
  document.getElementById('scope-total-sanctioned').innerText = `Nu. ${(curSanc+capSanc).toLocaleString()}`;
  document.getElementById('scope-total-balance').innerText = `Nu. ${(curBal+capBal).toLocaleString()}`;
}

function renderBudgetTab(ws) {
  const mb = getMultiBudget();
  const data = mb[selectedGovernanceScope] || [];

  ws.innerHTML = `
    <div class="bg-white rounded-lg shadow border p-6 space-y-4">
      <h2 class="text-base font-bold text-gray-800 uppercase">💰 BUDGET BALANCE MATRIX</h2>
      <table class="w-full text-left border-collapse border text-xs">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 border">Code</th>
            <th class="p-2 border">Activity Description</th>
            <th class="p-2 border">Allocated (Nu.)</th>
            <th class="p-2 border">Sanctioned (Nu.)</th>
            <th class="p-2 border">Available Balance (Nu.)</th>
            <th class="p-2 border">Settled Bill Deductions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(b => `
            <tr>
              <td class="p-2 border font-bold">${b.obc}</td>
              <td class="p-2 border">${b.activity}</td>
              <td class="p-2 border font-bold text-blue-900">Nu. ${b.allocated.toLocaleString()}</td>
              <td class="p-2 border font-bold text-amber-700">Nu. ${b.sanctioned.toLocaleString()}</td>
              <td class="p-2 border font-extrabold text-emerald-800">Nu. ${b.balance.toLocaleString()}</td>
              <td class="p-2 border text-[10px]">
                ${(b.settledExpenditures && b.settledExpenditures.length > 0) ? 
                  b.settledExpenditures.map(s => `<div class="text-red-700 font-bold">• Settled: Nu. ${s.amount.toLocaleString()}</div>`).join('') :
                  '<span class="text-gray-400 italic">No bill settlement deducted yet</span>'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
