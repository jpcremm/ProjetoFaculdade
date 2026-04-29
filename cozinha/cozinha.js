/* ── Estado global ── */
var estados = ['pendente', 'preparando', 'pronto', 'concluido'];
var picoAtivo = false;

var contadores = {
  pendente:   0,
  preparando: 0,
  pronto:     0
};

var unsubscribeOrders = null;
var firebaseDisponivel = false;

/* ── Toast ── */
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(function () { t.style.display = 'none'; }, 2500);
}

/* ── Atualiza contadores no topo e contagens nos h2 ── */
function updateStats() {
  var elPendente   = document.getElementById('count-pendentes');
  var elPreparando = document.getElementById('count-preparando');
  var elProntos    = document.getElementById('count-prontos');

  if (elPendente)   elPendente.textContent   = contadores.pendente;
  if (elPreparando) elPreparando.textContent = contadores.preparando;
  if (elProntos)    elProntos.textContent    = contadores.pronto;

  var titlePendentes  = document.querySelector('#title-pendentes  .col-count');
  var titlePreparando = document.querySelector('#title-preparando .col-count');
  var titleProntos    = document.querySelector('#title-prontos    .col-count');

  if (titlePendentes)  titlePendentes.textContent  = contadores.pendente;
  if (titlePreparando) titlePreparando.textContent = contadores.preparando;
  if (titleProntos)    titleProntos.textContent    = contadores.pronto;

  var total = contadores.pendente + contadores.preparando + contadores.pronto;
  var activeLabel = document.getElementById('active-label');
  if (activeLabel) {
    activeLabel.textContent = total + ' pedido' + (total !== 1 ? 's' : '') + ' em andamento';
  }

  var emptyPendentes  = document.getElementById('empty-pendentes');
  var emptyPreparando = document.getElementById('empty-preparando');
  var emptyProntos    = document.getElementById('empty-prontos');

  if (emptyPendentes)  emptyPendentes.style.display  = contadores.pendente   === 0 ? 'block' : 'none';
  if (emptyPreparando) emptyPreparando.style.display = contadores.preparando === 0 ? 'block' : 'none';
  if (emptyProntos)    emptyProntos.style.display    = contadores.pronto     === 0 ? 'block' : 'none';
}

/* ── Limpa todas as listas ── */
function clearLists() {
  var listPendentes  = document.getElementById('list-pendentes');
  var listPreparando = document.getElementById('list-preparando');
  var listProntos    = document.getElementById('list-prontos');

  if (listPendentes)  listPendentes.innerHTML  = '';
  if (listPreparando) listPreparando.innerHTML = '';
  if (listProntos)    listProntos.innerHTML    = '';
  contadores = { pendente: 0, preparando: 0, pronto: 0 };
}

/* ── Renderiza um card de pedido ── */
function renderCard(order) {
  var listaId = '';
  var badgeConfig = {};

  if (order.status === 'pendente') {
    listaId = 'list-pendentes';
    badgeConfig = { cls: 'orange', txt: '🕐 Pendente' };
  } else if (order.status === 'preparando') {
    listaId = 'list-preparando';
    badgeConfig = { cls: 'blue', txt: '📦 Preparando' };
  } else if (order.status === 'pronto') {
    listaId = 'list-prontos';
    badgeConfig = { cls: 'green', txt: '✅ Pronto' };
  } else {
    return; /* ignora concluido/entregue */
  }

  var listEl = document.getElementById(listaId);
  if (!listEl) return;

  var itensArr = (order.itens || []).map(function(item) {
    return '<li class="item-row"><b class="item-qty">' + (item.qty || 1) + '</b> ' + (item.nome || item) + '</li>';
  }).join('');

  var botaoAvancar = order.status !== 'pronto'
    ? '<button class="btn orange" data-action="avancar" data-id="' + order.id + '">Avançar</button>'
    : '';

  var timerText = '🕐 agora';
  if (order.createdAt && order.createdAt.toDate) {
    var diff = Math.floor((Date.now() - order.createdAt.toDate().getTime()) / 60000);
    timerText = '🕐 ' + diff + 'min';
  }

  var card = document.createElement('li');
  card.className = 'card';
  card.id = 'card-' + order.id;
  card.setAttribute('data-estado', order.status);
  card.setAttribute('data-nome', order.nome || '—');
  card.setAttribute('data-itens', (order.itens || []).map(function(i) {
    return (typeof i === 'string' ? i : (i.qty + ' ' + i.nome));
  }).join('|'));
  card.setAttribute('data-endereco', order.endereco || '—');
  card.setAttribute('data-valor', order.valor || 'R$ 0,00');

  card.innerHTML =
    '<header class="card-header">' +
      '<div class="card-header-left">' +
        '<span class="card-id">#' + order.id + '</span>' +
        '<mark class="badge ' + badgeConfig.cls + '">' + badgeConfig.txt + '</mark>' +
      '</div>' +
      '<time class="timer">' + timerText + '</time>' +
    '</header>' +
    '<p class="customer-name">👤 ' + (order.nome || '—') + '</p>' +
    '<ul class="itens-list" aria-label="Itens do pedido">' + itensArr + '</ul>' +
    '<address class="address-row">📍 ' + (order.endereco || '—') + '</address>' +
    '<footer class="card-footer">' +
      '<strong class="price green">' + (order.valor || 'R$ 0,00') + '</strong>' +
      botaoAvancar +
    '</footer>';

  listEl.appendChild(card);
  contadores[order.status]++;
}

/* ── Avança um card localmente no DOM ── */
function avancarCardLocal(id) {
  var card = document.getElementById('card-' + id);
  if (!card) return false;

  var estadoAtual = card.getAttribute('data-estado');
  var idx = estados.indexOf(estadoAtual);
  if (idx === -1 || idx >= estados.length - 1) return false;

  var proximo = estados[idx + 1];

  /* Move no DOM */
  if (proximo === 'concluido') {
    card.remove();
    contadores[estadoAtual]--;
    updateStats();
    showToast('Pedido #' + id + ' concluído!');
    return true;
  }

  var listaDestino = '';
  var badgeConfig = {};

  if (proximo === 'preparando') {
    listaDestino = 'list-preparando';
    badgeConfig = { cls: 'blue', txt: '📦 Preparando' };
  } else if (proximo === 'pronto') {
    listaDestino = 'list-prontos';
    badgeConfig = { cls: 'green', txt: '✅ Pronto' };
  } else {
    return false;
  }

  var destEl = document.getElementById(listaDestino);
  if (!destEl) return false;

  contadores[estadoAtual]--;
  contadores[proximo]++;

  card.setAttribute('data-estado', proximo);
  var badge = card.querySelector('.badge');
  if (badge) {
    badge.className = 'badge ' + badgeConfig.cls;
    badge.textContent = badgeConfig.txt;
  }

  var btnAvancar = card.querySelector('[data-action="avancar"]');
  if (proximo === 'pronto' && btnAvancar) {
    btnAvancar.remove();
  }

  destEl.appendChild(card);
  updateStats();
  showToast('Pedido #' + id + ' avançou para ' + proximo + '!');
  return true;
}

/* ── Avança um card (tenta Firebase primeiro, depois local) ── */
async function avancarCard(id) {
  if (firebaseDisponivel && typeof updateOrderStatus === 'function') {
    try {
      var card = document.getElementById('card-' + id);
      var estadoAtual = card ? card.getAttribute('data-estado') : '';
      var idx = estados.indexOf(estadoAtual);
      var proximo = estados[idx + 1] || '';

      var extraData = {};
      if (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) {
        if (proximo === 'preparando') extraData.startedAt = firebase.firestore.FieldValue.serverTimestamp();
        if (proximo === 'pronto') extraData.readyAt = firebase.firestore.FieldValue.serverTimestamp();
        if (proximo === 'concluido') extraData.completedAt = firebase.firestore.FieldValue.serverTimestamp();
      }

      await updateOrderStatus(id, proximo, extraData);
      return;
    } catch (err) {
      console.warn('[Cozinha] Firebase falhou, usando fallback local:', err.message);
    }
  }

  avancarCardLocal(id);
}

/* ── Carrega pedidos do Firestore ── */
function loadOrders(orders) {
  clearLists();
  orders.forEach(renderCard);
  updateStats();
}

/* ── Carrega cards estáticos do HTML como fallback ── */
function loadStaticCards() {
  // DEMO FIX: Não chama clearLists() para manter cards HTML visíveis/funcionais
  // clearLists(); <-- comentado - era o culpado por limpar antes de processar data-*

  var listPendentes  = document.getElementById('list-pendentes');
  var listPreparando = document.getElementById('list-preparando');
  var listProntos    = document.getElementById('list-prontos');

  var sources = [
    { el: listPendentes,  status: 'pendente' },
    { el: listPreparando, status: 'preparando' },
    { el: listProntos,    status: 'pronto' }
  ];

  var count = 0;
  sources.forEach(function(src) {
    if (!src.el) return;
    var cards = src.el.querySelectorAll('.card');
    cards.forEach(function(card) {
      var id = card.id.replace('card-', '') || ('local-' + count);
      var nome = card.getAttribute('data-nome') || '—';
      var endereco = card.getAttribute('data-endereco') || '—';
      var valor = card.getAttribute('data-valor') || 'R$ 0,00';
      var itensStr = card.getAttribute('data-itens') || '';
      var itens = itensStr.split('|').map(function(i) {
        var parts = i.trim().match(/^(\d+)\s+(.+)$/);
        return parts ? { qty: parseInt(parts[1]), nome: parts[2] } : { qty: 1, nome: i.trim() };
      }).filter(function(i) { return i.nome; });

      // card.remove(); <-- comentado para manter original + renderizado
      renderCard({ id: id, status: src.status, nome: nome, endereco: endereco, valor: valor, itens: itens });
      count++;
    });
  });

  updateStats();
  console.log('[Cozinha]', count, 'cards estáticos carregados.');
}

/* ── Toggle Modo Pico ── */
function togglePico() {
  picoAtivo = !picoAtivo;

  var btn    = document.getElementById('pico-btn');
  var mode   = document.getElementById('pico-mode');
  var label  = document.getElementById('pico-label');
  var banner = document.getElementById('pico-banner');

  if (!btn || !mode || !label || !banner) return;

  btn.setAttribute('aria-pressed', String(picoAtivo));

  if (picoAtivo) {
    btn.classList.add('ativo');
    mode.textContent  = 'Modo Pico Ativo';
    label.textContent = 'Desativar Pico';
    banner.classList.remove('hidden');
    showToast('⚡ Modo Pico ativado!');
  } else {
    btn.classList.remove('ativo');
    mode.textContent  = 'Modo Normal';
    label.textContent = 'Ativar Pico';
    banner.classList.add('hidden');
    showToast('Modo Pico desativado.');
  }
}

/* ── Event delegation ── */
document.addEventListener('click', function (e) {
  var btn = e.target.closest('[data-action]');
  if (!btn) return;

  var action = btn.getAttribute('data-action');
  if (action === 'avancar')     { avancarCard(btn.getAttribute('data-id')); }
  if (action === 'toggle-pico') { togglePico(); }
  if (action === 'logout') {
    try {
      if (typeof logout === 'function') {
        logout().then(function() {
          window.location.href = '../login/login.html';
        }).catch(function(err) {
          console.error('[Auth] Erro ao sair:', err);
          window.location.href = '../login/login.html';
        });
      } else {
        window.location.href = '../login/login.html';
      }
    } catch (e) {
      console.error('[Auth] Erro no logout:', e);
      window.location.href = '../login/login.html';
    }
  }
});

/* ── Init ── */
function init() {
  updateStats();

  // DEMO MODE: Cards estáticos permanentes para teste CSS/Kanban/produtos. 
  // Esta parte substitui os listeners Firebase que limpam as listas (clearLists/list.innerHTML='').
  // Para reativar Firebase real: troque de volta o bloco original acima.
  firebaseDisponivel = false;
  loadStaticCards();
  console.log('[Cozinha DEMO] Modo estático ativado - cards permanentes, teste "Avançar" buttons');
}

/* ── Cleanup ao sair da página ── */
window.addEventListener('beforeunload', function() {
  if (unsubscribeOrders) unsubscribeOrders();
});

init();
