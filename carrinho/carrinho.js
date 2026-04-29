/* ==============================================
   PROFIT BRAIN DELIVERY — Carrinho (Testes de Transição)
   ============================================== */

'use strict';

console.log('[Carrinho] Arquivo JS carregado');

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Carrinho] DOM pronto');

  // ─── Estado ──────────────────────────────────
  var cart = {};
  var address = { rua: 'Rua das Flores', numero: '123', complemento: 'Apto 45' };
  var cupom = null;
  var paymentMethod = 'Cartão de crédito';
  var TAXA_ENTREGA = 8.00;

  // ─── Elementos ───────────────────────────────
  var stateEmpty      = document.getElementById('stateEmpty');
  var stateContent    = document.getElementById('stateContent');
  var footer          = document.getElementById('footer');
  var itemsList       = document.getElementById('itemsList');
  var headerCount     = document.getElementById('headerCount');
  var displayAddress  = document.getElementById('displayAddress');
  var displayCupom    = document.getElementById('displayCupom');
  var displayPayment  = document.getElementById('displayPayment');
  var sumSubtotal     = document.getElementById('sumSubtotal');
  var sumDiscount     = document.getElementById('sumDiscount');
  var rowDiscount     = document.getElementById('rowDiscount');
  var sumDelivery     = document.getElementById('sumDelivery');
  var sumTotal        = document.getElementById('sumTotal');
  var btnLogout       = document.getElementById('btnLogout');

  var modalAddress    = document.getElementById('modalAddress');
  var btnAddress      = document.getElementById('btnAddress');
  var btnSaveAddress  = document.getElementById('btnSaveAddress');
  var inputRua        = document.getElementById('inputRua');
  var inputNum        = document.getElementById('inputNum');
  var inputComp       = document.getElementById('inputComp');

  var modalCupom      = document.getElementById('modalCupom');
  var btnCupom        = document.getElementById('btnCupom');
  var btnRemoveCupom  = document.getElementById('btnRemoveCupom');
  var cupomOptions    = document.querySelectorAll('.ch-cupom-option');

  var modalPayment    = document.getElementById('modalPayment');
  var btnPayment      = document.getElementById('btnPayment');
  var paymentOptions  = document.querySelectorAll('.ch-payment-option');

  // ─── Utilitários ─────────────────────────────
  function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var closeBtn = modal.querySelector('[data-close]');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  function getCartEntries() {
    return Object.keys(cart).map(function(id) {
      return { id: id, name: cart[id].name, price: cart[id].price, qty: cart[id].qty };
    });
  }

  function getSubtotal() {
    var total = 0;
    var entries = getCartEntries();
    for (var i = 0; i < entries.length; i++) {
      total += entries[i].price * entries[i].qty;
    }
    return total;
  }

  function getDiscount(subtotal) {
    if (!cupom) return 0;
    if (subtotal < cupom.minValue) return 0;
    return subtotal * (cupom.discountPct / 100);
  }

  function getTotal() {
    var subtotal = getSubtotal();
    var discount = getDiscount(subtotal);
    return Math.max(0, subtotal - discount + TAXA_ENTREGA);
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ─── Carrinho: carregar / salvar ─────────────
  function loadCart() {
    try {
      var raw = sessionStorage.getItem('dk_cart');
      if (raw) {
        cart = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[Cart] Não foi possível carregar:', e);
      cart = {};
    }
  }

  function saveCart() {
    try {
      sessionStorage.setItem('dk_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('[Cart] Não foi possível salvar:', e);
    }
  }

  // ─── Renderizar itens ────────────────────────
  function renderItems() {
    if (!itemsList) return;
    itemsList.innerHTML = '';

    var entries = getCartEntries();
    for (var i = 0; i < entries.length; i++) {
      var item = entries[i];
      var li = document.createElement('li');
      li.className = 'ch-item';
      li.innerHTML =
        '<div class="ch-item__top">' +
          '<div>' +
            '<div class="ch-item__name">' + escapeHtml(item.name) + '</div>' +
            '<div class="ch-item__price">' + formatBRL(item.price * item.qty) + '</div>' +
          '</div>' +
          '<button class="ch-item__delete" data-id="' + item.id + '" aria-label="Remover ' + escapeHtml(item.name) + '">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="ch-item__bottom">' +
          '<span class="ch-item__unit">' + formatBRL(item.price) + ' / un</span>' +
          '<div class="ch-qty">' +
            '<button class="ch-qty__btn qty-minus" data-id="' + item.id + '" aria-label="Diminuir quantidade">−</button>' +
            '<span class="ch-qty__value">' + item.qty + '</span>' +
            '<button class="ch-qty__btn ch-qty__btn--plus qty-plus" data-id="' + item.id + '" aria-label="Aumentar quantidade">+</button>' +
          '</div>' +
        '</div>';
      itemsList.appendChild(li);
    }
  }

  // ─── Atualizar UI geral ──────────────────────
  function updateUI() {
    var entries = getCartEntries();
    var count = 0;
    for (var i = 0; i < entries.length; i++) count += entries[i].qty;

    var isEmpty = count === 0;
    if (stateEmpty) stateEmpty.hidden = !isEmpty;
    if (stateContent) stateContent.hidden = isEmpty;
    if (footer) footer.hidden = isEmpty;

    if (headerCount) {
      headerCount.textContent = count + ' ' + (count === 1 ? 'item' : 'itens');
    }

    renderItems();
    updateSummary();
  }

  function updateSummary() {
    var subtotal = getSubtotal();
    var discount = getDiscount(subtotal);
    var total = getTotal();

    if (sumSubtotal) sumSubtotal.textContent = formatBRL(subtotal);
    if (sumDelivery) sumDelivery.textContent = formatBRL(TAXA_ENTREGA);
    if (sumTotal) sumTotal.textContent = formatBRL(total);

    if (rowDiscount) rowDiscount.hidden = discount <= 0;
    if (sumDiscount) sumDiscount.textContent = '— ' + formatBRL(discount);

    if (displayAddress) {
      displayAddress.textContent = address.rua + ', ' + address.numero + (address.complemento ? ' — ' + address.complemento : '');
    }

    if (displayCupom) {
      displayCupom.textContent = cupom ? cupom.label : 'Selecionar cupom';
      displayCupom.classList.toggle('ch-row__value--dim', !cupom);
    }

    if (displayPayment) {
      displayPayment.textContent = paymentMethod;
    }
  }

  // ─── Ações do item ───────────────────────────
  function removeItem(id) {
    delete cart[id];
    saveCart();
    updateUI();
  }

  function incrementItem(id) {
    if (cart[id]) {
      cart[id].qty += 1;
      saveCart();
      updateUI();
    }
  }

  function decrementItem(id) {
    if (cart[id]) {
      cart[id].qty -= 1;
      if (cart[id].qty <= 0) {
        delete cart[id];
      }
      saveCart();
      updateUI();
    }
  }

  if (itemsList) {
    itemsList.addEventListener('click', function(event) {
      var btn = event.target.closest('button');
      if (!btn) return;
      var id = btn.dataset.id;
      if (!id) return;

      if (btn.classList.contains('ch-item__delete')) {
        removeItem(id);
      } else if (btn.classList.contains('qty-plus')) {
        incrementItem(id);
      } else if (btn.classList.contains('qty-minus')) {
        decrementItem(id);
      }
    });
  }

  // ─── Modal: Endereço ─────────────────────────
  if (btnAddress) {
    btnAddress.addEventListener('click', function() {
      if (inputRua) inputRua.value = address.rua;
      if (inputNum) inputNum.value = address.numero;
      if (inputComp) inputComp.value = address.complemento;
      openModal(modalAddress);
    });
  }

  if (btnSaveAddress) {
    btnSaveAddress.addEventListener('click', function() {
      address.rua = (inputRua && inputRua.value.trim()) || address.rua;
      address.numero = (inputNum && inputNum.value.trim()) || address.numero;
      address.complemento = (inputComp && inputComp.value.trim()) || '';
      updateSummary();
      closeModal(modalAddress);
    });
  }

  // ─── Modal: Cupom ────────────────────────────
  if (btnCupom) {
    btnCupom.addEventListener('click', function() {
      openModal(modalCupom);
    });
  }

  cupomOptions.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var discount = parseFloat(btn.dataset.discount);
      var min = parseFloat(btn.dataset.min);
      var label = btn.dataset.label;

      cupom = { discountPct: discount, minValue: min, label: label };

      cupomOptions.forEach(function(b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');

      updateSummary();
      closeModal(modalCupom);
    });
  });

  if (btnRemoveCupom) {
    btnRemoveCupom.addEventListener('click', function() {
      cupom = null;
      cupomOptions.forEach(function(b) { b.classList.remove('is-selected'); });
      updateSummary();
      closeModal(modalCupom);
    });
  }

  // ─── Modal: Pagamento ────────────────────────
  if (btnPayment) {
    btnPayment.addEventListener('click', function() {
      openModal(modalPayment);
    });
  }

  paymentOptions.forEach(function(btn) {
    btn.addEventListener('click', function() {
      paymentMethod = btn.dataset.method;
      paymentOptions.forEach(function(b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      updateSummary();
      closeModal(modalPayment);
    });
  });

  // ─── Fechar modais ───────────────────────────
  document.querySelectorAll('.ch-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(event) {
      if (event.target === overlay) closeModal(overlay);
    });
  });

  document.querySelectorAll('[data-close]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetId = btn.dataset.close;
      var modal = document.getElementById(targetId);
      closeModal(modal);
    });
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      [modalAddress, modalCupom, modalPayment].forEach(function(m) {
        if (m && !m.hidden) closeModal(m);
      });
    }
  });

  // ─── Checkout / Transição para CDP ───────────
  if (btnCheckout) {
    btnCheckout.addEventListener('click', function() {
      var entries = getCartEntries();
      if (entries.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
      }

      var subtotal = getSubtotal();
      var discount = getDiscount(subtotal);
      var total = getTotal();

      var items = entries.map(function(it) {
        return {
          id: it.id,
          name: it.name,
          price: it.price,
          qty: it.qty,
          total: it.price * it.qty
        };
      });

      var orderData = {
        items: items,
        subtotal: subtotal,
        discount: discount,
        deliveryFee: TAXA_ENTREGA,
        total: total,
        address: address,
        paymentMethod: paymentMethod,
        cupom: cupom ? cupom.label : null
      };

      var orderId = 'PED-' + Date.now();

      console.log('[Checkout] Pedido simulado:', orderId, orderData);

      sessionStorage.setItem('dk_lastOrderId', orderId);
      sessionStorage.setItem('dk_lastOrder', JSON.stringify(orderData));
      sessionStorage.removeItem('dk_cart');

      window.location.href = '../cdp/cdp.html?orderId=' + encodeURIComponent(orderId);
    });
  }

  // ─── Logout ──────────────────────────────────
  if (btnLogout) {
    btnLogout.addEventListener('click', function() {
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
    });
  }

  // ─── Inicialização ───────────────────────────
  loadCart();
  updateUI();

  paymentOptions.forEach(function(btn) {
    if (btn.dataset.method === paymentMethod) {
      btn.classList.add('is-selected');
    }
  });

  console.log('[Carrinho] Inicialização completa');
});

