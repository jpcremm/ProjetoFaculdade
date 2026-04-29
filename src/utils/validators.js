/**
 * Profit Brain Delivery - Validators
 * Validações reutilizáveis para formulários
 */

/**
 * Valida se é um e-mail válido
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valida se a senha tem no mínimo 6 caracteres
 * @param {string} password
 * @param {number} [minLength=6]
 * @returns {boolean}
 */
function isValidPassword(password, minLength) {
  minLength = minLength || 6;
  return typeof password === "string" && password.length >= minLength;
}

/**
 * Verifica se o campo não está vazio
 * @param {string} value
 * @returns {boolean}
 */
function isNotEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Exibe mensagem de erro em um elemento
 * @param {string} elementId - ID do elemento de erro
 * @param {string} message
 */
function showError(elementId, message) {
  var el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.hidden = false;
  }
}

/**
 * Limpa mensagem de erro
 * @param {string} elementId - ID do elemento de erro
 */
function clearError(elementId) {
  var el = document.getElementById(elementId);
  if (el) {
    el.textContent = "";
    el.hidden = true;
  }
}

/**
 * Valida todo o formulário de cadastro
 * @param {Object} fields - { fullName, email, password, confirmPassword }
 * @returns {Object|null} Objeto com erros ou null se válido
 */
function validateSignup(fields) {
  var errors = {};

  if (!isNotEmpty(fields.fullName)) {
    errors.fullName = "Nome completo é obrigatório.";
  }

  if (!isValidEmail(fields.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!isValidPassword(fields.password)) {
    errors.password = "A senha deve ter no mínimo 6 caracteres.";
  }

  if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Valida formulário de login
 * @param {Object} fields - { email, password }
 * @returns {Object|null}
 */
function validateLogin(fields) {
  var errors = {};

  if (!isValidEmail(fields.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!isNotEmpty(fields.password)) {
    errors.password = "Informe a senha.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Valida e-mail para recuperação de senha
 * @param {string} email
 * @returns {string|null} Mensagem de erro ou null
 */
function validateRecoveryEmail(email) {
  if (!isValidEmail(email)) {
    return "Informe um e-mail válido.";
  }
  return null;
}
