/**
 * Profit Brain Delivery - Auth Service
 * Serviços de autenticação usando Firebase Auth (Compat API)
 */

/**
 * Realiza login com e-mail e senha
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.User>}
 */
function login(email, password) {
  return firebaseAuth.signInWithEmailAndPassword(email, password);
}

/**
 * Cria uma nova conta com e-mail e senha
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.User>}
 */
function register(email, password) {
  return firebaseAuth.createUserWithEmailAndPassword(email, password);
}

/**
 * Envia e-mail de recuperação de senha
 * @param {string} email
 * @returns {Promise<void>}
 */
function sendPasswordReset(email) {
  return firebaseAuth.sendPasswordResetEmail(email);
}

/**
 * Realiza logout do usuário atual
 * @returns {Promise<void>}
 */
function logout() {
  return firebaseAuth.signOut();
}

/**
 * Observa mudanças no estado de autenticação
 * @param {function} callback - Recebe user (ou null)
 * @returns {function} Função de unsubscribe
 */
function onAuthStateChanged(callback) {
  return firebaseAuth.onAuthStateChanged(callback);
}

/**
 * Retorna o usuário atual (síncrono)
 * @returns {firebase.User|null}
 */
function getCurrentUser() {
  return firebaseAuth.currentUser;
}

/**
 * Realiza login anônimo (modo convidado)
 * @returns {Promise<firebase.User>}
 */
function loginAnonymously() {
  return firebaseAuth.signInAnonymously();
}
