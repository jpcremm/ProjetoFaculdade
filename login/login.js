document.getElementById('btnLogin').addEventListener('click', handleLogin);
document.getElementById('btnStaff').addEventListener('click', goToStaff);

function handleLogin() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert('Preencha e-mail e senha para continuar.');
    return;
  }

  if (!isValidEmail(email)) {
    alert('Informe um e-mail válido.');
    return;
  }

  // TODO: replace with real authentication call
  alert('Login realizado com sucesso!');
}

function goToStaff() {
  window.location.href = '../staff/staff.html';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}