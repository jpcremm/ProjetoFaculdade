/* ==============================================
   PROFIT BRAIN DELIVERY — Confirmação do Pedido (Testes de Transição)
   ============================================== */

'use strict';

console.log('[CDP] Arquivo JS carregado');

document.addEventListener('DOMContentLoaded', function() {
  console.log('[CDP] DOM pronto');

  // ─── Elementos ───────────────────────────────
  var subtitle        = document.querySelector('.subtitle');
  var itemsCard       = document.querySelector('.items-card');
  var btnCardapio     = document.getElementById('btnCardapio');
  var btnPedidos      = document.getElementById('btnPedidos');

  // ─── Utilitários ─────────────────────────────
  function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // ─── Carregar dados do pedido ────────────────
  function loadOrder() {
    var orderId = getQueryParam('orderId');
    if (!orderId) {
      orderId = sessionStorage.getItem('dk_lastOrderId');
    }

    if (!orderId) {
      console.warn('[CDP] Nenhum orderId encontrado — exibindo fallback');
      return;
    }

    console.log('[CDP] Carregando pedido:', orderId);

    var orderRaw = sessionStorage.getItem('dk_lastOrder');
    var order = null;
    if (orderRaw) {
      try {
        order = JSON.parse(orderRaw);
      } catch (e) {
        console.warn('[CDP] Erro ao parsear pedido:', e);
      }
    }

    if (order) {
      renderOrder(orderId, order);
    } else {
      updateOrderNumber(orderId);
    }
  }

  function updateOrderNumber(orderId) {
    if (subtitle) {
      subtitle.textContent = 'Seu pedido #' + escapeHtml(orderId) + ' está sendo preparado';
    }
  }

  function renderOrder(orderId, order) {
    updateOrderNumber(orderId);

    if (!itemsCard) return;

    var h2 = itemsCard.querySelector('h2');
    itemsCard.innerHTML = '';
    if (h2) itemsCard.appendChild(h2);

    var items = order.items || [];
    var total = 0;

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML =
        '<span>' + it.qty + 'x ' + escapeHtml(it.name) + '</span>' +
        '<span class="item-price">' + formatBRL(it.total || (it.price * it.qty)) + '</span>';
      itemsCard.appendChild(row);
      total += it.total || (it.price * it.qty);
    }

    var totalRow = document.createElement('div');
    totalRow.className = 'total-row';
    totalRow.innerHTML =
      '<span>Total</span>' +
      '<span class="total-value">' + formatBRL(order.total || total) + '</span>';
    itemsCard.appendChild(totalRow);
  }

  // ─── Navegação ───────────────────────────────
  if (btnCardapio) {
    btnCardapio.addEventListener('click', function() {
      window.location.href = '../cardapio/cardapio.html';
    });
  }

  if (btnPedidos) {
    btnPedidos.addEventListener('click', function() {
      window.location.href = '../historicopedido/historicopedido.html';
    });
  }

  // ─── Inicialização ───────────────────────────
  loadOrder();

  console.log('[CDP] Inicialização completa');
});

