// =============================================
// login.js — Profit Brain
// Lógica de autenticação e interação da tela
// =============================================

// Estado interno
let roleSelecionado      = 'gerente';
let roleSelecionadoCriar = 'gerente';

// -----------------------------------------------
// Tabs: alternar entre Entrar e Criar Conta
// -----------------------------------------------
function switchTab(tab) {
  const eEntrar = tab === 'entrar';

  document.getElementById('tab-entrar').classList.toggle('active',  eEntrar);
  document.getElementById('tab-criar').classList.toggle('active',  !eEntrar);
  document.getElementById('entrar-panel').classList.toggle('hide', !eEntrar);
  document.getElementById('criar-panel').classList.toggle('show',  !eEntrar);

  hideError();
}

// -----------------------------------------------
// Seleção de role — painel Entrar
// -----------------------------------------------
function selectRole(role) {
  roleSelecionado = role;
  document.getElementById('role-garcom').classList.toggle('active',  role === 'garcom');
  document.getElementById('role-gerente').classList.toggle('active', role === 'gerente');
}

// -----------------------------------------------
// Seleção de role — painel Criar Conta
// -----------------------------------------------
function selectRoleCriar(role) {
  roleSelecionadoCriar = role;
  document.getElementById('role-garcom-c').classList.toggle('active',  role === 'garcom');
  document.getElementById('role-gerente-c').classList.toggle('active', role === 'gerente');
}

// -----------------------------------------------
// Mensagens de erro / sucesso
// -----------------------------------------------
function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.remove('success');
  el.classList.add('show');
}

function showSuccess(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.add('show', 'success');
}

function hideError() {
  const el = document.getElementById('error-msg');
  el.classList.remove('show', 'success');
}

// -----------------------------------------------
// Tradução de códigos de erro do Firebase
// -----------------------------------------------
function traduzirErro(code) {
  const erros = {
    'auth/invalid-email':          'E-mail inválido.',
    'auth/user-not-found':         'Usuário não encontrado.',
    'auth/wrong-password':         'Senha incorreta.',
    'auth/invalid-credential':     'E-mail ou senha incorretos.',
    'auth/email-already-in-use':   'E-mail já cadastrado.',
    'auth/weak-password':          'Senha muito fraca (mínimo 6 caracteres).',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/too-many-requests':      'Muitas tentativas. Aguarde alguns minutos.',
  };
  return erros[code] || 'Ocorreu um erro. Tente novamente.';
}

// -----------------------------------------------
// Login com e-mail e senha
// -----------------------------------------------
async function fazerLogin() {
  hideError();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  if (!email || !senha) {
    showError('Preencha e-mail e senha.');
    return;
  }

  const btn = document.getElementById('btn-entrar');
  btn.classList.add('loading');

  try {
    const { auth, signInWithEmailAndPassword, db, doc, getDoc } = window._firebase;

    const cred = await signInWithEmailAndPassword(auth, email, senha);

    // Busca o perfil salvo no Firestore para confirmar o role
    const snap = await getDoc(doc(db, 'usuarios', cred.user.uid));
    const perfil = snap.exists() ? snap.data() : {};

    console.log('Usuário autenticado:', perfil);

    // Redireciona conforme o role selecionado na tela
    if (roleSelecionado === 'gerente') {
      window.location.href = 'dashboard-gerente.html';
    } else {
      window.location.href = 'dashboard-garcom.html';
    }

  } catch (err) {
    showError(traduzirErro(err.code));
    btn.classList.remove('loading');
  }
}

// -----------------------------------------------
// Criar nova conta
// -----------------------------------------------
async function criarConta() {
  hideError();

  const nome  = document.getElementById('nome').value.trim();
  const email = document.getElementById('email-novo').value.trim();
  const senha = document.getElementById('senha-nova').value;

  if (!nome || !email || !senha) {
    showError('Preencha todos os campos.');
    return;
  }

  if (senha.length < 6) {
    showError('Senha deve ter ao menos 6 caracteres.');
    return;
  }

  const btn = document.getElementById('btn-criar');
  btn.classList.add('loading');

  try {
    const { auth, createUserWithEmailAndPassword, db, doc, setDoc } = window._firebase;

    const cred = await createUserWithEmailAndPassword(auth, email, senha);

    // Salva o perfil do usuário no Firestore
    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      nome,
      email,
      role:      roleSelecionadoCriar,
      criadoEm: new Date().toISOString()
    });

    if (roleSelecionadoCriar === 'gerente') {
      window.location.href = 'dashboard-gerente.html';
    } else {
      window.location.href = 'dashboard-garcom.html';
    }

  } catch (err) {
    showError(traduzirErro(err.code));
    btn.classList.remove('loading');
  }
}

// -----------------------------------------------
// Recuperação de senha
// -----------------------------------------------
async function esqueceuSenha() {
  hideError();

  const email = document.getElementById('email').value.trim();

  if (!email) {
    showError('Digite seu e-mail para recuperar a senha.');
    return;
  }

  try {
    const { auth, sendPasswordResetEmail } = window._firebase;
    await sendPasswordResetEmail(auth, email);
    showSuccess('✉️ E-mail de recuperação enviado! Verifique sua caixa de entrada.');
  } catch (err) {
    showError(traduzirErro(err.code));
  }
}

// -----------------------------------------------
// Expõe as funções globalmente (usadas no HTML)
// -----------------------------------------------
window.switchTab       = switchTab;
window.selectRole      = selectRole;
window.selectRoleCriar = selectRoleCriar;
window.fazerLogin      = fazerLogin;
window.criarConta      = criarConta;
window.esqueceuSenha   = esqueceuSenha;