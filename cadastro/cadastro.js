'use strict';

/* ── Elementos ── */
const form          = document.getElementById('signup-form');
const submitBtn     = document.getElementById('submit-btn');
const btnText       = submitBtn.querySelector('.btn-text');
const btnSpinner    = submitBtn.querySelector('.btn-spinner');

const fields = {
  name:    document.getElementById('full-name'),
  email:   document.getElementById('email'),
  pass:    document.getElementById('password'),
  confirm: document.getElementById('confirm-password'),
};

const errors = {
  name:    document.getElementById('full-name-error'),
  email:   document.getElementById('email-error'),
  pass:    document.getElementById('password-error'),
  confirm: document.getElementById('confirm-password-error'),
};

/* ── Toast ── */
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('output');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = msg;
  document.body.appendChild(toast);

  // força reflow para a transição funcionar
  toast.getBoundingClientRect();
  toast.classList.add('toast--visible');

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
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
  const val = fields[key].value.trim();

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
Object.keys(fields).forEach(key => {
  fields[key].addEventListener('blur', () => validateField(key));
  fields[key].addEventListener('input', () => {
    if (fields[key].getAttribute('aria-invalid')) validateField(key);
  });
});

/* ── Mostrar/ocultar senha ── */
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const input    = document.getElementById(targetId);
    const isHidden = input.type === 'password';

    input.type = isHidden ? 'text' : 'password';
    btn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');

    /* Troca o ícone */
    const svg = btn.querySelector('svg');
    if (isHidden) {
      svg.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      `;
    } else {
      svg.innerHTML = `
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
        <circle cx="12" cy="12" r="3"/>
      `;
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
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const keys   = ['name', 'email', 'pass', 'confirm'];
  const valid  = keys.map(k => validateField(k)).every(Boolean);

  if (!valid) {
    // foca o primeiro campo inválido
    const first = keys.find(k => fields[k].getAttribute('aria-invalid') === 'true');
    if (first) fields[first].focus();
    return;
  }

  setLoading(true);

  /* Simula chamada à API */
  await new Promise(r => setTimeout(r, 1800));

  setLoading(false);
  showToast('✓ Conta criada com sucesso!', 'success');
  form.reset();
  keys.forEach(k => clearError(k));
});