/* ==============================================
   PROFIT BRAIN DELIVERY — Cardápio
   ============================================== */

'use strict';

console.log('[Cardápio] Arquivo JS carregado');

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Cardápio] DOM pronto');

  // ─── Estado do carrinho ───────────────────────
  var cart = {};

  // ─── Elementos ───────────────────────────────
  var menuGrid        = document.getElementById('menuGrid');
  var emptyState      = document.getElementById('emptyState');
  var searchInput     = document.getElementById('searchInput');
  var sortSelect      = document.getElementById('sortSelect');
  var cartToast       = document.getElementById('cartToast');
  var cartCount       = document.getElementById('cartCount');
  var cartTotal       = document.getElementById('cartTotal');
  var cuponsOverlay   = document.getElementById('modalCupons');
  var btnCupons       = document.getElementById('btnCupons');
  var btnCloseCupons  = document.querySelector('[data-close="modalCupons"]');
  var userInfo        = document.getElementById('userInfo');
  var userEmail       = document.getElementById('userEmail');
  var btnLogout       = document.getElementById('btnLogout');

  // Verificação de elementos críticos
  if (!menuGrid) { console.error('[Cardápio] ERRO: menuGrid não encontrado'); return; }
  if (!searchInput) { console.error('[Cardápio] ERRO: searchInput não encontrado'); }
  if (!btnCupons) { console.error('[Cardápio] ERRO: btnCupons não encontrado'); }

  // ─── Utilitários ─────────────────────────────
  function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function getAllCards() {
    return menuGrid.querySelectorAll('.menu-card');
  }

  function saveCart() {
    try {
      sessionStorage.setItem('dk_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('[Cart] Não foi possível salvar no sessionStorage:', e);
    }
  }

  // ─── Autenticação (não bloqueante) ────────────
  try {
    if (typeof onAuthStateChanged === 'function') {
      onAuthStateChanged(function(user) {
        console.log('[Auth] Estado alterado:', user ? user.email : 'nenhum');
        if (!user) {
          console.log('[Auth] Redirecionando para login...');
          window.location.href = '../login/login.html';
        } else {
          if (userEmail) userEmail.textContent = user.email || 'Cliente';
          if (userInfo) userInfo.hidden = false;
        }
      });
    } else {
      console.warn('[Cardápio] Firebase Auth não disponível.');
    }
  } catch (e) {
    console.error('[Auth] Erro:', e);
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', function() {
      try {
        if (typeof logout === 'function') {
          logout().then(function() {
            window.location.href = '../login/login.html';
          }).catch(function(err) {
            console.error('[Auth] Erro ao sair:', err);
          });
        } else {
          window.location.href = '../login/login.html';
        }
      } catch (e) {
        console.error('[Auth] Erro no logout:', e);
      }
    });
  }

  // ─── Carrinho ────────────────────────────────
  function updateCartToast() {
    try {
      var entries = Object.values(cart);
      var totalQty = 0;
      var totalPrice = 0;
      for (var i = 0; i < entries.length; i++) {
        totalQty += entries[i].qty;
        totalPrice += entries[i].price * entries[i].qty;
      }

      if (totalQty === 0) {
        cartToast.hidden = true;
        return;
      }

      cartToast.hidden = false;
      cartCount.textContent = totalQty + ' ' + (totalQty === 1 ? 'item' : 'itens');
      cartTotal.textContent = formatBRL(totalPrice);
    } catch (e) {
      console.error('[Cart] Erro em updateCartToast:', e);
    }
  }

  function addToCart(card) {
    try {
      var id = card.dataset.id;
      var name = card.dataset.name;
      var price = parseFloat(card.dataset.price);

      if (cart[id]) {
        cart[id].qty += 1;
      } else {
        cart[id] = { name: name, price: price, qty: 1 };
      }

      saveCart();
      showQtyControl(card, id);
      updateCartToast();
      console.log('[Cart] Adicionado:', name, 'qty:', cart[id].qty);
    } catch (e) {
      console.error('[Cart] Erro em addToCart:', e);
    }
  }

  function incrementItem(id, card) {
    try {
      cart[id].qty += 1;
      saveCart();
      syncQtyDisplay(id, card);
      updateCartToast();
    } catch (e) {
      console.error('[Cart] Erro em incrementItem:', e);
    }
  }

  function decrementItem(id, card) {
    try {
      cart[id].qty -= 1;

      if (cart[id].qty <= 0) {
        delete cart[id];
        hideQtyControl(card);
      } else {
        syncQtyDisplay(id, card);
      }

      saveCart();
      updateCartToast();
    } catch (e) {
      console.error('[Cart] Erro em decrementItem:', e);
    }
  }

  function showQtyControl(card, id) {
    try {
      var btnAdd = card.querySelector('.btn-add');
      var qtyControl = card.querySelector('.qty-control');
      var qtyValue = card.querySelector('.qty-value');

      if (btnAdd) btnAdd.style.display = 'none';
      if (qtyControl) qtyControl.style.display = 'flex';
      if (qtyValue) qtyValue.textContent = cart[id].qty;
    } catch (e) {
      console.error('[Cart] Erro em showQtyControl:', e);
    }
  }

  function hideQtyControl(card) {
    try {
      var btnAdd = card.querySelector('.btn-add');
      var qtyControl = card.querySelector('.qty-control');

      if (qtyControl) qtyControl.style.display = 'none';
      if (btnAdd) btnAdd.style.display = '';
    } catch (e) {
      console.error('[Cart] Erro em hideQtyControl:', e);
    }
  }

  function syncQtyDisplay(id, card) {
    try {
      var qtyValue = card.querySelector('.qty-value');
      if (qtyValue) qtyValue.textContent = cart[id].qty;
    } catch (e) {
      console.error('[Cart] Erro em syncQtyDisplay:', e);
    }
  }

  // ─── Delegação de eventos no grid ────────────
  menuGrid.addEventListener('click', function(event) {
    try {
      var card = event.target.closest('.menu-card');
      if (!card) return;

      if (event.target.closest('.btn-add')) {
        addToCart(card);
        return;
      }

      if (event.target.closest('.qty-plus')) {
        incrementItem(card.dataset.id, card);
        return;
      }

      if (event.target.closest('.qty-minus')) {
        decrementItem(card.dataset.id, card);
        return;
      }
    } catch (e) {
      console.error('[Grid] Erro no click handler:', e);
    }
  });

  // ─── Filtro por categoria ─────────────────────
  var categoryButtons = document.querySelectorAll('.category-btn');
  console.log('[Filter] Botoes de categoria encontrados:', categoryButtons.length);

  categoryButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      try {
        categoryButtons.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var selectedCategory = btn.dataset.category;
        var searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
        filterCards({ category: selectedCategory, search: searchTerm });
        console.log('[Filter] Categoria selecionada:', selectedCategory);
      } catch (e) {
        console.error('[Filter] Erro no click de categoria:', e);
      }
    });
  });

  // ─── Busca ───────────────────────────────────
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      try {
        var activeBtn = document.querySelector('.category-btn.active');
        var selectedCategory = activeBtn ? activeBtn.dataset.category : 'todos';
        filterCards({ category: selectedCategory, search: searchInput.value.trim().toLowerCase() });
      } catch (e) {
        console.error('[Search] Erro no input:', e);
      }
    });
  }

  // ─── Ordenação ────────────────────────────────
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      try {
        sortCards(sortSelect.value);
      } catch (e) {
        console.error('[Sort] Erro:', e);
      }
    });
  }

  function sortCards(sortValue) {
    try {
      var cards = Array.from(getAllCards());

      cards.sort(function(a, b) {
        var priceA = parseFloat(a.dataset.price);
        var priceB = parseFloat(b.dataset.price);
        var nameA = a.dataset.name.toLowerCase();
        var nameB = b.dataset.name.toLowerCase();
        var timeA = getTimeFromCard(a);
        var timeB = getTimeFromCard(b);

        switch (sortValue) {
          case 'price-asc':  return priceA - priceB;
          case 'price-desc': return priceB - priceA;
          case 'name-asc':   return nameA.localeCompare(nameB);
          case 'time-asc':   return timeA - timeB;
          default:           return 0;
        }
      });

      cards.forEach(function(card) {
        menuGrid.appendChild(card);
      });
      console.log('[Sort] Ordenado por:', sortValue);
    } catch (e) {
      console.error('[Sort] Erro em sortCards:', e);
    }
  }

  function getTimeFromCard(card) {
    try {
      var timeBadge = card.querySelector('.badge--time');
      if (!timeBadge) return 999;
      var match = timeBadge.textContent.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 999;
    } catch (e) {
      return 999;
    }
  }

  function filterCards(filters) {
    try {
      var cards = getAllCards();
      var visibleCount = 0;

      cards.forEach(function(card) {
        var matchesCategory = filters.category === 'todos' || card.dataset.category === filters.category;
        var matchesSearch = true;

        if (filters.search) {
          var nameMatch = card.dataset.name.toLowerCase().includes(filters.search);
          var descEl = card.querySelector('.card-desc');
          var descMatch = descEl ? descEl.textContent.toLowerCase().includes(filters.search) : false;
          matchesSearch = nameMatch || descMatch;
        }

        var isVisible = matchesCategory && matchesSearch;
        card.hidden = !isVisible;

        if (isVisible) visibleCount++;
      });

      if (emptyState) emptyState.hidden = visibleCount > 0;
      console.log('[Filter] Visiveis:', visibleCount);
    } catch (e) {
      console.error('[Filter] Erro em filterCards:', e);
    }
  }

  // ─── Toast do carrinho → navegar para página de carrinho ──────
  if (cartToast) {
    cartToast.addEventListener('click', function() {
      console.log('[Cart] Navegando para carrinho.html');
      window.location.href = '../carrinho/carrinho.html';
    });
  }

  // ─── Modal de Cupons ──────────────────────────
  function openCuponsModal() {
    try {
      if (cuponsOverlay) {
        cuponsOverlay.hidden = false;
        document.body.style.overflow = 'hidden';
        var backBtn = cuponsOverlay.querySelector('.btn-back');
        if (backBtn) backBtn.focus();
      }
    } catch (e) {
      console.error('[Cupons] Erro ao abrir:', e);
    }
  }

  function closeCuponsModal() {
    try {
      if (cuponsOverlay) {
        cuponsOverlay.hidden = true;
        document.body.style.overflow = '';
      }
      if (btnCupons) btnCupons.focus();
    } catch (e) {
      console.error('[Cupons] Erro ao fechar:', e);
    }
  }

  if (btnCupons) {
    btnCupons.addEventListener('click', function() {
      console.log('[Cupons] Abrir modal');
      openCuponsModal();
    });
  }

  if (btnCloseCupons) {
    btnCloseCupons.addEventListener('click', closeCuponsModal);
  }

  if (cuponsOverlay) {
    cuponsOverlay.addEventListener('click', function(event) {
      if (event.target === cuponsOverlay) closeCuponsModal();
    });
  }

  document.addEventListener('keydown', function(event) {
    try {
      if (event.key === 'Escape' && cuponsOverlay && !cuponsOverlay.hidden) {
        closeCuponsModal();
      }
    } catch (e) {
      console.error('[Keydown] Erro:', e);
    }
  });

  // ─── Botão "Resgatar" do cupom ────────────────
  var btnResgatar = document.querySelector('.btn-resgatar');
  if (btnResgatar) {
    btnResgatar.addEventListener('click', function() {
      try {
        btnResgatar.textContent = 'Resgatado ✓';
        btnResgatar.disabled = true;
        btnResgatar.style.opacity = '.6';
      } catch (e) {
        console.error('[Cupons] Erro ao resgatar:', e);
      }
    });
  }

  console.log('[Cardápio] Inicialização completa');
});

