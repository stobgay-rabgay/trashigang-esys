function executeLogin(e) {
  if (e) e.preventDefault();
  const id = document.getElementById('login-username')?.value.trim() || "DZONGDAG";
  const users = getUsers();
  currentUser = users.find(u => u.username === id || u.cid === id) || users[0];
  currentUser.avatar = currentUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();

  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  renderWorkspace();
}

function loginWithNDI() {
  currentUser = { username: "NDI_USER", name: "Kinley Gyeltshen", role: "IT Officer", sector: "Planning Sector", avatar: "KG", eid: "NDI882" };
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  renderWorkspace();
}

function logoutDirectly() {
  document.getElementById('app-screen').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
}

function openProfileModal() {
  document.getElementById('edit-profile-username').value = currentUser.username;
  document.getElementById('edit-profile-cid').value = currentUser.cid || "";
  document.getElementById('edit-profile-eid').value = currentUser.eid || "";
  document.getElementById('edit-profile-name').value = currentUser.name;
  document.getElementById('edit-profile-role').value = currentUser.role;
  document.getElementById('edit-profile-sector').value = currentUser.sector;
  document.getElementById('edit-profile-email').value = currentUser.email || "";
  document.getElementById('profile-modal').classList.remove('hidden');
}

function closeProfileModal() { document.getElementById('profile-modal').classList.add('hidden'); }

function saveProfileUpdates(e) {
  e.preventDefault();
  currentUser.name = document.getElementById('edit-profile-name').value;
  currentUser.role = document.getElementById('edit-profile-role').value;
  currentUser.sector = document.getElementById('edit-profile-sector').value;
  closeProfileModal();
  renderHeaderAndSummary();
}
