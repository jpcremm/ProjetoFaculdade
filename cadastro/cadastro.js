'use strict';

/* ── Elementos ── */
var form          = document.getElementById('signup-form');
var submitBtn     = document.getElementById('submit-btn');
var btnText       = submitBtn.querySelector('.btn-text');
var btnSpinner    = submitBtn.querySelector('.btn-spinner');

var fields = {
  name:    document.getElementById('full-name'),
  email:   document.getElementById('email'),
  pass:    document.getElementById('password'),
  confirm: document.getElementById('confirm-password'),
};

var errors = {
  name:    document.getElementById('full-name-error'),
  email:   document.getElementById('email-error'),
  pass:    document.getElementById('password-error'),
  confirm: document.getElementById('confirm-password-error'),
};

/* ── Toast ── */
function showToast(msg, type) {
  type = type || 'success';
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();

  var toast = document.createElement('output');
  toast.className = 'toast toast--' + type;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = msg;
  document.body.appendChild(toast);

  toast.getBoundingClientRect();
  toast.classList.add('toast--visible');

  setTimeout(function() {
    toast.classList.remove('toast--visible');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

/* ── Helpers de validação ── */
function setError(key, msg) {
  errors[key].textContent = msg;
  fields[key].setAttribute('aria-invalid', 'true');
}

function clearError(key) {
  errors[key].textContent = '';
  fields[key].removeAttribute('aria-invalid');
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* Valida um campo individualmente; retorna true se válido */
function validateField(key) {
  var val = fields[key].value.trim();

  if (key === 'name') {
    if (!val) { setError('name', 'Informe seu nome completo.'); return false; }
    if (val.length < 2) { setError('name', 'Nome muito curto.'); return false; }
  }

  if (key === 'email') {
    if (!val) { setError('email', 'Informe seu e-mail.'); return false; }
    if (!isValidEmail(val)) { setError('email', 'E-mail inválido.'); return false; }
  }

  if (key === 'pass') {
    if (!val) { setError('pass', 'Crie uma senha.'); return false; }
    if (val.length < 6) { setError('pass', 'A senha deve ter pelo menos 6 caracteres.'); return false; }
  }

  if (key === 'confirm') {
    if (!val) { setError('confirm', 'Confirme sua senha.'); return false; }
    if (val !== fields.pass.value) { setError('confirm', 'As senhas não coincidem.'); return false; }
  }

  clearError(key);
  return true;
}

/* ── Validação em tempo real (blur) ── */
Object.keys(fields).forEach(function(key) {
  fields[key].addEventListener('blur', function() { validateField(key); });
  fields[key].addEventListener('input', function() {
    if (fields[key].getAttribute('aria-invalid')) validateField(key);
  });
});

/* ── Mostrar/ocultar senha ── */
document.querySelectorAll('.toggle-password').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var targetId = btn.getAttribute('data-target');
    var input    = document.getElementById(targetId);
    var isHidden = input.type === 'password';

    input.type = isHidden ? 'text' : 'password';
    btn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');

    /* Troca o ícone */
    var svg = btn.querySelector('svg');
    if (isHidden) {
      svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
      svg.innerHTML = '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>';
    }
  });
});

/* ── Loading state ── */
function setLoading(active) {
  submitBtn.disabled = active;
  btnText.textContent = active ? 'Criando conta…' : 'Criar conta';
  btnSpinner.hidden = !active;
}

/* ── Submit ── */
form.addEventListener('submit', async function(e) {
  e.preventDefault();

  var keys   = ['name', 'email', 'pass', 'confirm'];
  var valid  = keys.map(function(k) { return validateField(k); }).every(Boolean);

  if (!valid) {
    var first = keys.find(function(k) {
      return fields[k].getAttribute('aria-invalid') === 'true';
    });
    if (first) fields[first].focus();
    return;
  }

  var email    = fields.email.value.trim();
  var password = fields.pass.value;
  var fullName = fields.name.value.trim();

  setLoading(true);

  try {
    var userCredential = await register(email, password);
    var uid = userCredential.user.uid;

    await setUserData(uid, {
      nome: fullName,
      email: email,
      role: 'cliente',
      createdAt: new Date().toISOString()
    });

    showToast('✓ Conta criada com sucesso!', 'success');
    form.reset();
    keys.forEach(function(k) { clearError(k); });

    setTimeout(function() {
      window.location.href = '../login/login.html';
    }, 1500);

  } catch (err) {
    console.error('[Auth] Erro no cadastro:', err);
    var msg = 'Erro ao criar conta. Tente novamente.';
    if (err.code === 'auth/email-already-in-use') msg = 'Este e-mail já está cadastrado.';
    if (err.code === 'auth/invalid-email') msg = 'E-mail inválido.';
    if (err.code === 'auth/weak-password') msg = 'A senha é muito fraca.';
    showToast(msg, 'error');
  } finally {
    setLoading(false);
  }
});
