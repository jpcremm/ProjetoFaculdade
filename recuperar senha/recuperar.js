'use strict';

/* ── Elementos ── */
var form         = document.getElementById('recovery-form');
var submitBtn    = document.getElementById('submit-btn');
var btnText      = submitBtn.querySelector('.btn-text');
const btnSpinner   = submitBtn.querySelector('.btn-spinner');
const emailInput   = document.getElementById('email');
const emailError   = document.getElementById('email-error');
const formWrapper  = document.getElementById('recovery-form-wrapper');
const successState = document.getElementById('success-state');
const sentEmail    = document.getElementById('sent-email');
const resendBtn    = document.getElementById('resend-btn');

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

  toast.getBoundingClientRect();
  toast.classList.add('toast--visible');

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ── Validação ── */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateEmail() {
  const val = emailInput.value.trim();
  if (!val) {
    emailError.textContent = 'Informe seu e-mail.';
    emailInput.setAttribute('aria-invalid', 'true');
    return false;
  }
  if (!isValidEmail(val)) {
    emailError.textContent = 'E-mail inválido.';
    emailInput.setAttribute('aria-invalid', 'true');
    return false;
  }
  emailError.textContent = '';
  emailInput.removeAttribute('aria-invalid');
  return true;
}

emailInput.addEventListener('blur', validateEmail);
emailInput.addEventListener('input', () => {
  if (emailInput.getAttribute('aria-invalid')) validateEmail();
});

/* ── Loading state ── */
function setLoading(active) {
  submitBtn.disabled = active;
  btnText.textContent = active ? 'Enviando…' : 'Enviar link de recuperação';
  btnSpinner.hidden = !active;
}

/* ── Exibe estado de sucesso ── */
function showSuccess(email) {
  formWrapper.hidden = true;
  sentEmail.textContent = email;
  successState.hidden = false;
  successState.focus?.();
}

/* ── Simula reenvio ── */
async function handleResend() {
  resendBtn.disabled = true;
  resendBtn.textContent = 'Enviando…';
  await new Promise(r => setTimeout(r, 1500));
  resendBtn.disabled = false;
  resendBtn.textContent = 'reenviar';
  showToast('✓ E-mail reenviado!', 'success');
}

resendBtn.addEventListener('click', handleResend);

/* ── Submit ── */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateEmail()) {
    emailInput.focus();
    return;
  }

  const email = emailInput.value.trim();
  setLoading(true);

  /* Simula chamada à API */
  await new Promise(r => setTimeout(r, 1800));

  setLoading(false);
  showSuccess(email);
});