var roleLabels = {
  gerente:     'Gerente',
  cozinha:     'Cozinha',
  entregador:  'Entregador',
};

/* ── Inicialização segura ── */
function init() {
  console.log('[Staff] Página de staff carregada.');

  /* Tenta verificar autenticação, mas não bloqueia se falhar */
  try {
    if (typeof onAuthStateChanged === 'function') {
      onAuthStateChanged(function(user) {
        if (user) {
          console.log('[Staff] Usuário autenticado:', user.email);
        } else {
          console.log('[Staff] Usuário não autenticado. Modo visitante.');
        }
      });
    } else {
      console.warn('[Staff] Firebase Auth não disponível.');
    }
  } catch (e) {
    console.warn('[Staff] Erro ao verificar auth:', e.message);
  }

  /* Configura botões de role */
  setupRoleButtons();
}

function setupRoleButtons() {
  var buttons = document.querySelectorAll('.role-btn');
  if (buttons.length === 0) {
    console.error('[Staff] Nenhum botão .role-btn encontrado!');
    return;
  }

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var role = btn.dataset.role;
      selectRole(role);
    });
  });

  console.log('[Staff]', buttons.length, 'botões configurados.');
}

function selectRole(role) {
  console.log('[Staff] Selecionado:', role);

  if (role === 'cozinha') {
    window.location.href = '../cozinha/cozinha.html';
  } else if (role === 'entregador') {
    window.location.href = '../entregador/entregador.html';
  } else if (role === 'gerente') {
    window.location.href = '../gerente/gerente.html';
  } else {
    console.error('[Staff] Role desconhecido:', role);
  }
}

/* ── Inicia quando DOM estiver pronto ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
