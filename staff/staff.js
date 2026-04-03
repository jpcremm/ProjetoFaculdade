const roleLabels = {
  gerente:     'Gerente',
  cozinha:     'Cozinha',
  entregador:  'Entregador',
};

document.querySelectorAll('.role-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const role = btn.dataset.role;
    selectRole(role);
  });
});

function selectRole(role) {
  // TODO: replace with real role-based redirect or auth
  alert('Acessando como: ' + roleLabels[role]);
  // window.location.href = 'dashboard-' + role + '.html';
}