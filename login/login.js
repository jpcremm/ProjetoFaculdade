/* ── Login de Cliente ── */
document.getElementById('btnLogin').addEventListener('click', handleLogin);
document.getElementById('btnGuest').addEventListener('click', handleGuestLogin);
document.getElementById('btnStaff').addEventListener('click', goToStaff);

/* ── Verifica se já está logado (Firebase opcional) ── */
try {
  if (typeof onAuthStateChanged === 'function') {
    onAuthStateChanged(function(user) {
      if (user) {
        console.log('[Auth] Usuário já logado:', user.email);
      }
    });
  }
} catch (e) {
  console.warn('[Login] Firebase não disponível:', e.message);
}

async function handleLogin() {
  var email    = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value;

  if (!email || !password) {
    alert('Preencha e-mail e senha para continuar.');
    return;
  }

  if (!isValidEmail(email)) {
    alert('Informe um e-mail válido.');
    return;
  }

  var btn = document.getElementById('btnLogin');
  btn.disabled = true;
  btn.textContent = 'Entrando…';

  try {
    /* Tenta login via Firebase, senão fallback para navegação direta */
    if (typeof login === 'function') {
      await login(email, password);
      alert('Login realizado com sucesso!');
    } else {
      console.warn('[Login] Firebase não carregado. Navegando sem autenticação.');
    }
    window.location.href = '../cardapio/cardapio.html';
  } catch (err) {
    console.error('[Auth] Erro no login:', err);
    var msg = 'Erro ao fazer login. Tente novamente.';
    if (err.code === 'auth/user-not-found') msg = 'Usuário não encontrado.';
    if (err.code === 'auth/wrong-password') msg = 'Senha incorreta.';
    if (err.code === 'auth/invalid-credential') msg = 'E-mail ou senha incorretos.';
    if (err.code === 'auth/invalid-email') msg = 'E-mail inválido.';
    if (err.code === 'auth/user-disabled') msg = 'Conta desativada.';
    alert(msg);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Entrar e fazer pedido';
  }
}

async function handleGuestLogin() {
  var btn = document.getElementById('btnGuest');
  btn.disabled = true;
  btn.textContent = 'Entrando…';

  try {
    if (typeof loginAnonymously === 'function') {
      await loginAnonymously();
      console.log('[Auth] Login anônimo realizado');
    } else {
      console.warn('[Login] Firebase não carregado. Navegando sem autenticação.');
    }
    window.location.href = '../cardapio/cardapio.html';
  } catch (err) {
    console.error('[Auth] Erro no login anônimo:', err);
    var msg = 'Erro ao entrar como convidado. Tente novamente.';
    if (err.code === 'auth/operation-not-allowed') {
      msg = 'Login anônimo não está habilitado no Firebase Console.\n\n' +
            'Para habilitar:\n' +
            '1. Acesse https://console.firebase.google.com\n' +
            '2. Vá em Authentication → Sign-in method\n' +
            '3. Ative "Anonymous"';
    }
    alert(msg);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Entrar como convidado';
  }
}

function goToStaff() {
  window.location.href = '../staff/staff.html';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
