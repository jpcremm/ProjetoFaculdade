var unsubscribeProntos = null;
var unsubscribeEmRota = null;
var firebaseDisponivel = false;

/* ── Hora atual formatada ── */
function horaAgora() {
  var d = new Date();
  var h = String(d.getHours()).padStart(2, '0');
  var m = String(d.getMinutes()).padStart(2, '0');
  return h + ':' + m;
}

/* ── Formata valor em reais ── */
function formatarValor(str) {
  var num = parseFloat(str.replace('R$', '').replace(',', '.').trim());
  return isNaN(num) ? 0 : num;
}

/* ── Toast ── */
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(function () { t.style.display = 'none'; }, 2500);
}

/* ── Estado local ── */
var entreguesCount = 0;
var totalValor = 0;
var historicoEntregas = [];

/* ── Atualiza contadores e textos ── */
function updateStats(prontos, rota) {
  prontos = prontos || [];
  rota = rota || [];

  var coletarEl = document.getElementById('count-coletar');
  var rotaEl = document.getElementById('count-rota');
  var entreguesEl = document.getElementById('count-entregues');
  var labelEl = document.getElementById('active-label');

  if (coletarEl)   coletarEl.textContent   = prontos.length;
  if (rotaEl)      rotaEl.textContent      = rota.length;
  if (entreguesEl) entreguesEl.textContent = entreguesCount;

  var total = prontos.length + rota.length;
  if (labelEl) {
    labelEl.textContent = total + ' entrega' + (total !== 1 ? 's' : '') + ' ativa' + (total !== 1 ? 's' : '');
  }

  var prontosTitle = document.getElementById('prontos-title');
  var rotaTitle = document.getElementById('rota-title');

  if (prontosTitle) prontosTitle.textContent = 'Prontos para retirada (' + prontos.length + ')';
  if (rotaTitle)    rotaTitle.textContent    = 'Em rota (' + rota.length + ')';

  var prontosEmpty = document.getElementById('prontos-empty');
  var rotaEmpty = document.getElementById('rota-empty');

  if (prontosEmpty) prontosEmpty.style.display = prontos.length === 0 ? 'block' : 'none';
  if (rotaEmpty)    rotaEmpty.style.display    = rota.length    === 0 ? 'block' : 'none';
}

/* ── Atualiza aba e painel de realizadas ── */
function updateRealizadas() {
  var tabBadge = document.getElementById('tab-badge');
  var resumoTotal = document.getElementById('resumo-total');
  var resumoValor = document.getElementById('resumo-valor');
  var lista = document.getElementById('realizadas-list');
  var empty = document.getElementById('realizadas-empty');

  if (tabBadge)    tabBadge.textContent    = entreguesCount;
  if (resumoTotal) resumoTotal.textContent = entreguesCount;
  if (resumoValor) resumoValor.textContent = 'R$ ' + totalValor.toFixed(2).replace('.', ',');

  if (lista) {
    lista.innerHTML = '';
    historicoEntregas.forEach(function (e) {
      var card = document.createElement('div');
      card.className = 'card-realizada';
      card.innerHTML =
        '<div class="realizada-info">' +
          '<div class="realizada-top">' +
            '<span class="card-id">#' + e.id + '</span>' +
            '<span class="badge entregue">✓ Entregue</span>' +
          '</div>' +
          '<div class="realizada-nome">' + e.nome + '</div>' +
          '<div class="realizada-endereco">📍 ' + e.endereco + '</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">' +
          '<div class="realizada-hora">🕐 ' + e.hora + '</div>' +
          '<div class="realizada-valor">' + e.valor + '</div>' +
        '</div>';
      lista.appendChild(card);
    });
  }

  if (empty) empty.style.display = entreguesCount === 0 ? 'block' : 'none';
}

/* ── Renderiza card pronto ── */
function renderPronto(order) {
  var list = document.getElementById('prontos-list');
  if (!list) return;

  var card = document.createElement('div');
  card.className = 'card';
  card.id = 'card-' + order.id;
  card.innerHTML =
    '<div class="card-header">' +
      '<div class="card-header-left">' +
        '<span class="card-id">#' + order.id + '</span>' +
        '<span class="badge pronto">✓ Pronto</span>' +
      '</div>' +
      '<div class="timer">🕐 agora</div>' +
    '</div>' +
    '<div class="customer-name">' + (order.nome || '—') + '</div>' +
    '<div class="customer-phone">📞 ' + (order.telefone || '—') + '</div>' +
    '<div class="address-box">' +
      '<span class="address-icon">📍</span>' +
      '<div>' +
        '<div class="address-street">' + (order.endereco || '—') + '</div>' +
        '<div class="address-detail">' + (order.enderecoDetalhe || '') + '</div>' +
        '<div class="address-dist">' + (order.distancia || '') + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="card-footer">' +
      '<span class="price">' + (order.valor || 'R$ 0,00') + '</span>' +
      '<button class="btn green" data-action="iniciar" data-id="' + order.id + '"' +
        ' data-nome="' + (order.nome || '').replace(/"/g, '"') + '"' +
        ' data-tel="' + (order.telefone || '') + '"' +
        ' data-endereco="' + (order.endereco || '').replace(/"/g, '"') + '"' +
        ' data-valor="' + (order.valor || '') + '"' +
      '>✈ Iniciar entrega</button>' +
    '</div>';
  list.appendChild(card);
}

/* ── Renderiza card em rota ── */
function renderEmRota(order) {
  var list = document.getElementById('rota-list');
  if (!list) return;

  var card = document.createElement('div');
  card.className = 'card active-delivery';
  card.id = 'card-' + order.id;
  card.innerHTML =
    '<div class="card-header">' +
      '<div class="card-header-left">' +
        '<span class="card-id">#' + order.id + '</span>' +
        '<span class="badge em-rota">✈ Saiu para entrega</span>' +
      '</div>' +
    '</div>' +
    '<div class="customer-name">' + (order.nome || '—') + '</div>' +
    '<div class="customer-phone">📞 ' + (order.telefone || '—') + '</div>' +
    '<div class="address-box dark">' +
      '<span class="address-icon">📍</span>' +
      '<div>' +
        '<div class="address-street">' + (order.endereco || '—') + '</div>' +
        '<div class="address-detail">' + (order.enderecoDetalhe || '') + '</div>' +
        '<div class="address-dist">' + (order.distancia || '') + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="delivery-actions">' +
      '<button class="btn ghost" data-action="ligar" data-tel="' + (order.telefone || '') + '">📞 Ligar</button>' +
      '<button class="btn green" data-action="entregar" data-id="' + order.id + '"' +
        ' data-nome="' + (order.nome || '').replace(/"/g, '"') + '"' +
        ' data-tel="' + (order.telefone || '') + '"' +
        ' data-endereco="' + (order.endereco || '').replace(/"/g, '"') + '"' +
        ' data-valor="' + (order.valor || '') + '"' +
      '>✓ Entregar</button>' +
    '</div>';
  list.appendChild(card);
}

/* ── Move card de "prontos" para "em rota" localmente ── */
function moverParaRotaLocal(id, nome, tel, endereco, valor) {
  var card = document.getElementById('card-' + id);
  if (!card) return false;

  var rotaList = document.getElementById('rota-list');
  if (!rotaList) return false;

  card.className = 'card active-delivery';
  card.innerHTML =
    '<div class="card-header">' +
      '<div class="card-header-left">' +
        '<span class="card-id">#' + id + '</span>' +
        '<span class="badge em-rota">✈ Saiu para entrega</span>' +
      '</div>' +
    '</div>' +
    '<div class="customer-name">' + (nome || '—') + '</div>' +
    '<div class="customer-phone">📞 ' + (tel || '—') + '</div>' +
    '<div class="address-box dark">' +
      '<span class="address-icon">📍</span>' +
      '<div>' +
        '<div class="address-street">' + (endereco || '—') + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="delivery-actions">' +
      '<button class="btn ghost" data-action="ligar" data-tel="' + (tel || '') + '">📞 Ligar</button>' +
      '<button class="btn green" data-action="entregar" data-id="' + id + '"' +
        ' data-nome="' + (nome || '').replace(/"/g, '"') + '"' +
        ' data-tel="' + (tel || '') + '"' +
        ' data-endereco="' + (endereco || '').replace(/"/g, '"') + '"' +
        ' data-valor="' + (valor || '') + '"' +
      '>✓ Entregar</button>' +
    '</div>';

  rotaList.appendChild(card);
  showToast('Entrega #' + id + ' iniciada!');
  updateStatsFromDOM();
  return true;
}

/* ── Confirma entrega localmente ── */
function confirmarEntregaLocal(id, nome, endereco, valor) {
  var card = document.getElementById('card-' + id);
  if (card) card.remove();

  entreguesCount++;
  totalValor += formatarValor(valor || 'R$ 0,00');
  historicoEntregas.unshift({
    id: id,
    nome: nome || '—',
    endereco: endereco || '—',
    valor: valor || 'R$ 0,00',
    hora: horaAgora()
  });

  updateRealizadas();
  updateStatsFromDOM();
  showToast('✓ Entrega para ' + (nome || '—') + ' confirmada!');
  return true;
}

/* ── Iniciar entrega (Firebase + fallback) ── */
async function iniciarEntrega(id, nome, tel, endereco, valor) {
  if (firebaseDisponivel && typeof updateOrderStatus === 'function') {
    try {
      await updateOrderStatus(id, 'em_entrega', {
        deliveryPerson: (typeof getCurrentUser === 'function' && getCurrentUser()) ? getCurrentUser().email : '—',
        startedDeliveryAt: (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) ?
          firebase.firestore.FieldValue.serverTimestamp() : new Date()
      });
      showToast('Entrega #' + id + ' iniciada!');
      return;
    } catch (err) {
      console.warn('[Entregador] Firebase falhou ao iniciar:', err.message);
    }
  }
  moverParaRotaLocal(id, nome, tel, endereco, valor);
}

/* ── Confirmar entrega (Firebase + fallback) ── */
async function confirmarEntrega(id, nome, endereco, valor) {
  if (firebaseDisponivel && typeof updateOrderStatus === 'function' && typeof addDelivery === 'function') {
    try {
      await updateOrderStatus(id, 'entregue', {
        deliveredAt: (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) ?
          firebase.firestore.FieldValue.serverTimestamp() : new Date()
      });

      await addDelivery({
        orderId: id,
        nome: nome,
        endereco: endereco,
        valor: valor,
        deliveryPersonId: (typeof getCurrentUser === 'function' && getCurrentUser()) ? getCurrentUser().uid : null,
        hora: horaAgora()
      });

      entreguesCount++;
      totalValor += formatarValor(valor || 'R$ 0,00');
      historicoEntregas.unshift({
        id: id,
        nome: nome || '—',
        endereco: endereco || '—',
        valor: valor || 'R$ 0,00',
        hora: horaAgora()
      });

      updateRealizadas();
      showToast('✓ Entrega para ' + (nome || '—') + ' confirmada!');
      return;
    } catch (err) {
      console.warn('[Entregador] Firebase falhou ao confirmar:', err.message);
    }
  }

  confirmarEntregaLocal(id, nome, endereco, valor);
}

/* ── Ligar ── */
function ligar(tel) {
  showToast('Ligando para ' + (tel || '—') + '...');
}

/* ── Atualiza stats baseado no DOM atual ── */
function updateStatsFromDOM() {
  var prontos = document.querySelectorAll('#prontos-list .card').length;
  var rota = document.querySelectorAll('#rota-list .card').length;
  updateStats(Array(prontos), Array(rota));
}

/* ── Troca de abas ── */
document.querySelectorAll('.tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');

    var alvo = tab.getAttribute('data-tab');
    var painelAtivas = document.getElementById('painel-ativas');
    var painelRealizadas = document.getElementById('painel-realizadas');

    if (painelAtivas)     painelAtivas.classList.toggle('hidden', alvo !== 'ativas');
    if (painelRealizadas) painelRealizadas.classList.toggle('hidden', alvo !== 'realizadas');
  });
});

/* ── Event delegation ── */
document.addEventListener('click', function (e) {
  var btn = e.target.closest('[data-action]');
  if (!btn) return;

  var action   = btn.getAttribute('data-action');
  var id       = btn.getAttribute('data-id');
  var nome     = btn.getAttribute('data-nome');
  var tel      = btn.getAttribute('data-tel');
  var endereco = btn.getAttribute('data-endereco');
  var valor    = btn.getAttribute('data-valor');

  if (action === 'iniciar')  { iniciarEntrega(id, nome, tel, endereco, valor); }
  if (action === 'entregar') { confirmarEntrega(id, nome, endereco, valor); }
  if (action === 'ligar')    { ligar(tel); }
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

/* ── Carrega cards estáticos do HTML ── */
function loadStaticCards() {
  var prontosList = document.getElementById('prontos-list');
  var rotaList = document.getElementById('rota-list');

  if (prontosList) {
    var prontosCards = prontosList.querySelectorAll('.card');
    prontosCards.forEach(function(card) {
      var btn = card.querySelector('[data-action="iniciar"]');
      if (btn) {
        var nome = card.querySelector('.customer-name') ? card.querySelector('.customer-name').textContent.trim() : '—';
        var tel = card.querySelector('.customer-phone') ? card.querySelector('.customer-phone').textContent.replace('📞', '').trim() : '—';
        var endereco = card.querySelector('.address-street') ? card.querySelector('.address-street').textContent.trim() : '—';
        var valor = card.querySelector('.price') ? card.querySelector('.price').textContent.trim() : 'R$ 0,00';
        var id = card.id.replace('card-', '') || ('local-' + Math.random().toString(36).substr(2, 5));

        btn.setAttribute('data-id', id);
        btn.setAttribute('data-nome', nome);
        btn.setAttribute('data-tel', tel);
        btn.setAttribute('data-endereco', endereco);
        btn.setAttribute('data-valor', valor);
      }
    });
  }

  if (rotaList) {
    var rotaCards = rotaList.querySelectorAll('.card');
    rotaCards.forEach(function(card) {
      var btnEntregar = card.querySelector('[data-action="entregar"]');
      var btnLigar = card.querySelector('[data-action="ligar"]');
      if (btnEntregar) {
        var nome = card.querySelector('.customer-name') ? card.querySelector('.customer-name').textContent.trim() : '—';
        var tel = card.querySelector('.customer-phone') ? card.querySelector('.customer-phone').textContent.replace('📞', '').trim() : '—';
        var endereco = card.querySelector('.address-street') ? card.querySelector('.address-street').textContent.trim() : '—';
        var valor = card.querySelector('.price') ? card.querySelector('.price').textContent.trim() : 'R$ 0,00';
        var id = card.id.replace('card-', '') || ('local-' + Math.random().toString(36).substr(2, 5));

        btnEntregar.setAttribute('data-id', id);
        btnEntregar.setAttribute('data-nome', nome);
        btnEntregar.setAttribute('data-tel', tel);
        btnEntregar.setAttribute('data-endereco', endereco);
        btnEntregar.setAttribute('data-valor', valor);
      }
      if (btnLigar) {
        var tel = card.querySelector('.customer-phone') ? card.querySelector('.customer-phone').textContent.replace('📞', '').trim() : '—';
        btnLigar.setAttribute('data-tel', tel);
      }
    });
  }

  updateStatsFromDOM();
  console.log('[Entregador] Cards estáticos carregados.');
}

/* ── Init ── */
function init() {
  updateRealizadas();

  // DEMO MODE: Cards estáticos permanentes para teste CSS/Kanban. 
  // Esta parte substitui os listeners Firebase que limpam as listas (list.innerHTML = '').
  // Para reativar Firebase real: troque de volta o bloco original acima.
  firebaseDisponivel = false;
  loadStaticCards();
  console.log('[Entregador DEMO] Modo estático ativado - cards permanentes, teste "Iniciar/Entregar" buttons');
}

/* ── Cleanup ── */
window.addEventListener('beforeunload', function() {
  if (unsubscribeProntos) unsubscribeProntos();
  if (unsubscribeEmRota) unsubscribeEmRota();
});

init();
