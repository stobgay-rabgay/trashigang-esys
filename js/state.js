const defaultAccounts = [
  { username: "DZONGDAG", cid: "11101000001", eid: "E9991", name: "Ugyen Dorji", password: "123", roleType: "DZONGDAG_DZONGRAB", role: "Dasho Dzongdag", sector: "Dzongkhag Executive Scope", email: "dzongdag@trashigang.gov.bt" },
  { username: "DZONGRAB", cid: "11101000002", eid: "E9992", name: "Karma Tshering", password: "123", roleType: "DZONGDAG_DZONGRAB", role: "Dzongrab", sector: "Dzongkhag Executive Scope", email: "dzongrab@trashigang.gov.bt" },
  { username: "11105001133", cid: "11105001133", eid: "E202611", name: "Sonam Tobgay", password: "123", roleType: "SUB_STAFF", role: "Cultural Officer", sector: "Culture Sector", email: "stobgay@trashigang.gov.bt" }
];

const defaultMultiTierBudget = {
  dzongkhag: [
    { id: "CAP-DZ-01", obc: "51.01", activity: "Bartsham Chorten Structural Restoration", allocated: 500000, sanctioned: 185000, balance: 500000, tier: "Culture Sector", category: "Capital", settledExpenditures: [] },
    { id: "CUR-DZ-02", obc: "11.01", activity: "Travel allowance for Mask Dancers", allocated: 1000000, sanctioned: 0, balance: 1000000, tier: "Culture Sector", category: "Current", settledExpenditures: [] }
  ]
};

const defaultNotesheets = [
  {
    id: "#DAT/CULTURE/2026/101",
    dispatchNo: "DAT/DISPATCH/2026/101",
    type: "financial",
    budgetId: "CAP-DZ-01",
    subject: "Restoration Work at Bartsham Chorten",
    officer: "Sonam Tobgay (Cultural Officer)",
    initiatorSector: "Culture Sector",
    targetExecutive: "Dasho Dzongdag",
    budget: 185000,
    status: "Sanctioned",
    date: "2026-10-08",
    approvedBy: "Ugyen Dorji (Dasho Dzongdag)",
    remarksText: "Approved as submitted."
  }
];

const defaultBillSettlements = [];

function getUsers() { return JSON.parse(localStorage.getItem('tg_m_users')) || defaultAccounts; }
function saveUsers(u) { localStorage.setItem('tg_m_users', JSON.stringify(u)); }

function getNotesheets() { return JSON.parse(localStorage.getItem('tg_m_notesheets')) || defaultNotesheets; }
function saveNotesheets(n) { localStorage.setItem('tg_m_notesheets', JSON.stringify(n)); }

function getBillSettlements() { return JSON.parse(localStorage.getItem('tg_m_settlements')) || defaultBillSettlements; }
function saveBillSettlements(s) { localStorage.setItem('tg_m_settlements', JSON.stringify(s)); }

function getMultiBudget() { return JSON.parse(localStorage.getItem('tg_m_budget')) || defaultMultiTierBudget; }
function saveMultiBudget(b) { localStorage.setItem('tg_m_budget', JSON.stringify(b)); }

let currentUser = defaultAccounts[0];
