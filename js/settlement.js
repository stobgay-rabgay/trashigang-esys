function renderBillSettlementTab(ws) {
  const notesheets = getNotesheets().filter(n => n.status === "Sanctioned");
  const settlements = getBillSettlements();

  ws.innerHTML = `
    <div class="bg-white rounded-lg shadow border p-6 space-y-6">
      <div class="border-b pb-3">
        <h2 class="text-base font-extrabold text-gray-800 uppercase">🧾 BILL SETTLEMENT NOTESHEET MODULE</h2>
        <p class="text-xs text-gray-500 italic">Submitting a bill settlement deducts the actual amount from Available Balance.</p>
      </div>

      <form onsubmit="submitBillSettlement(event)" class="bg-slate-50 border p-4 rounded-lg space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-gray-700 mb-1">SELECT SANCTIONED NOTESHEET *</label>
            <select id="settle-notesheet-id" onchange="autoFillSanctionDetails(this.value)" required class="w-full border rounded px-2.5 py-1.5 font-bold">
              <option value="">-- Choose Approved Sanctioned Notesheet --</option>
              ${notesheets.map(n => `<option value="${n.id}">${n.id} — ${n.subject} (Sanctioned: Nu.${n.budget.toLocaleString()})</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">SANCTIONED AMOUNT REFERENCE</label>
            <input type="text" id="settle-sanctioned-ref" readonly placeholder="Nu. 0" class="w-full border bg-gray-100 rounded px-2.5 py-1.5 font-bold text-blue-900">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-gray-700 mb-1">FINAL ACTUAL SETTLED BILL AMOUNT (Nu.) *</label>
            <input type="number" id="settle-actual-amount" required placeholder="e.g. 185000" class="w-full border rounded px-2.5 py-1.5 font-bold text-emerald-800">
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">BILL / INVOICE VOUCHER NO. *</label>
            <input type="text" id="settle-voucher-no" required placeholder="e.g. INV-2026-991" class="w-full border rounded px-2.5 py-1.5 font-semibold">
          </div>
        </div>

        <button type="submit" class="bg-emerald-700 text-white font-bold px-5 py-2 rounded shadow text-xs uppercase">
          💳 Submit & Deduct Budget Balance
        </button>
      </form>

      <div class="space-y-2 pt-2">
        <h3 class="font-bold text-gray-800 uppercase text-xs">Settled Expenditure History</h3>
        ${settlements.map(s => `
          <div class="border rounded p-3 bg-white flex justify-between items-center text-xs">
            <div>
              <span class="font-bold text-emerald-800">${s.id}</span> (Ref:${s.notesheetId})
              <p class="text-gray-600">Voucher: ${s.voucherNo}</p>
            </div>
            <div class="text-right font-extrabold text-red-700">- Nu. ${s.amount.toLocaleString()}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function autoFillSanctionDetails(notesheetId) {
  const found = getNotesheets().find(n => n.id === notesheetId);
  if (found) {
    document.getElementById('settle-sanctioned-ref').value = `Nu. ${found.budget.toLocaleString()}`;
    document.getElementById('settle-actual-amount').value = found.budget;
  }
}

function submitBillSettlement(e) {
  e.preventDefault();
  const notesheetId = document.getElementById('settle-notesheet-id').value;
  const actualAmount = parseFloat(document.getElementById('settle-actual-amount').value) || 0;
  const voucherNo = document.getElementById('settle-voucher-no').value.trim();

  const note = getNotesheets().find(n => n.id === notesheetId);
  if (!note) return;

  const mb = getMultiBudget();
  const b = (mb[selectedGovernanceScope] || []).find(x => x.id === note.budgetId);

  if (b) {
    // DEDUCT AVAILABLE BALANCE HERE WITHOUT AFFECTING OTHER FUNCTIONS
    b.balance -= actualAmount;
    if (!b.settledExpenditures) b.settledExpenditures = [];
    b.settledExpenditures.push({ refId: notesheetId, amount: actualAmount, date: new Date().toISOString().split('T')[0] });
    saveMultiBudget(mb);
  }

  const settlements = getBillSettlements();
  settlements.unshift({ id: "SETTLE-" + Math.floor(100 + Math.random() * 900), notesheetId, amount: actualAmount, voucherNo, date: new Date().toISOString().split('T')[0] });
  saveBillSettlements(settlements);

  alert(`Submitted! Nu. ${actualAmount.toLocaleString()} deducted from Available Balance.`);
  renderWorkspace();
}
