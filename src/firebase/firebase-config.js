/**
 * Profit Brain Delivery - Firebase Configuration
 *
 * INSTRUÇÕES:
 * 1. Vá ao Firebase Console (https://console.firebase.google.com/)
 * 2. Crie um novo projeto ou use um existente
 * 3. Clique no ícone de engrenagem ⚙️ → "Configurações do projeto"
 * 4. Na aba "Geral", role até "Seus apps" e clique no ícone </> (Web)
 * 5. Copie as credenciais e substitua os placeholders abaixo
 * 6. No Firebase Console, vá em "Authentication" → "Método de login" → ative "E-mail/Senha"
 * 7. Vá em "Firestore Database" → "Criar banco de dados" → modo "Iniciar no modo de teste"
 */

// ============ SUBSTITUA OS VALORES ABAIXO ============

const firebaseConfig = {
  apiKey: "AIzaSyAV_kfIUBESpMTq9L5FFUvUWOlx5_6VDAg",
  authDomain: "profit-brain.firebaseapp.com",
  projectId: "profit-brain",
  storageBucket: "profit-brain.firebasestorage.app",
  messagingSenderId: "625367535327",
  appId: "1:625367535327:web:8a55350169fa36d198236a"
};

// ======================================================

// Inicializa o Firebase App usando a variável global do CDN (compat)
const app = firebase.initializeApp(firebaseConfig);

// Inicializa serviços (API compat — firebase.auth() / firebase.firestore())
const auth = firebase.auth();
const db   = firebase.firestore();

// Analytics é opcional — pode falhar em file:// ou domínio não autorizado
var analytics;
try {
  analytics = firebase.analytics();
} catch (e) {
  console.warn("[Firebase] Analytics não inicializado:", e.message);
}

console.log("[Firebase] Inicializado com sucesso!");

// Disponibiliza globalmente para scripts que não usam module
window.firebaseApp  = app;
window.firebaseAuth = auth;
window.firebaseDB   = db;
