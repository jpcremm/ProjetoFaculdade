// ════════════════════════════════════════════
// HISTÓRICO DE PEDIDOS - Profit Brain Delivery
// Funciona com mock data (sem Firebase) ou real-time
// ════════════════════════════════════════════

/* ── Mock Data (para desenvolvimento sem Firebase) ── */
const MOCK_ORDERS = [
  {
    id: 'PED-1729123456789',
    cliente: 'Carlos Silva',
    telefone: '(11) 98765-4321',
    data: '2024-10-20T14:30:00',
    status: 'preparando',
    total: 78.90,
    itens: [
      {nome: 'Cheeseburger Clássico', qtd: 2, foto: '', emoji: '🍔'},
      {nome: 'X-Salada', qtd: 1, foto: '', emoji: '🥗'},
      {nome: 'Coca-Cola 350ml', qtd: 1, foto: '', emoji: '🥤'}
    ],
    tempoEntrega: '28 min'
  },
  {
    id: 'PED-1729121234567',
    cliente: 'Ana Santos',
    telefone: '(11) 91234-5678',
    data: '2024-10-20T12:15:00',
    status: 'pronto',
    total: 55.00,
    itens: [
      {nome: 'Pizza Margherita', qtd: 1, foto: ''},
      {nome: 'Refrigerante Guaraná', qtd: 2, foto: ''}
    ]
  },
  {
    id: 'PED-1729119876543',
    cliente: 'João Oliveira',
    telefone: '(11) 99876-5432',
    data: '2024-10-20T10:45:00',
    status: 'entregue',
    total: 89.90,
    itens: [
      {nome: 'X-Bacon Duplo', qtd: 1, foto: ''},
      {nome: 'Batata Frita Grande', qtd: 1, foto: ''},
      {nome: 'Cerveja Premium 600ml', qtd: 2, foto: ''}
    ]
  },
  {
    id: 'PED-1729118765432',
    cliente: 'Maria Costa',
    telefone: '(11) 92345-6789',
    data: '2024-10-19T20:30:00',
    status: 'entregue',
    total: 42.50,
    itens: [{nome: 'Salada Caesar', qtd: 1, foto: ''}]
  }
];

/* ── Config ── */
const STATUS_MAP = {
  pendente: { label: 'Pendente', icon: '⏳', class: 'badge--active' },
  preparando: { label: 'Preparando', icon: '🔥', class: 'badge--active' },
  pronto: { label: 'Pronto', icon: '✅', class: 'badge--active' },
  entregue: { label: 'Entregue', icon: '🚚', class: 'badge--done' },
  cancelado: { label: 'Cancelado', icon: '❌', class: 'badge--done' }
};

const ORDERS_ACTIVE = document.getElementById('activeList');
const ORDERS_PAST = document.getElementById('pastList');
const BTN_BACK = document.getElementById('btnBack');
const BTN_CARDAPIO = document.getElementById('btnCardapio');

let allOrders = [];
let unsubscribeOrders = null;

/* ── Utils ── */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function createOrderCard(order, index) {
  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.entregue;
  
  // Primeiros 4 itens para fotos
  const photoItems = order.itens.slice(0, 4);
  const moreCount = order.itens.length - 4;
  
  return `
    <li class="order-card" style="--i: ${index}">
      <div class="card-top">
        <div>
          <div class="card-id">
            <span class="dot dot--active"></span>
            #${order.id.slice(-6)}
          </div>
          <div class="card-date">${formatDate(order.data)}</div>
        </div>
        <div class="badge ${statusInfo.class}">
          ${statusInfo.icon} ${statusInfo.label}
        </div>
      </div>
      
      <div class="card-photos">
        ${photoItems.map(item => `
          <div class="card-photo">
            ${item.foto ? `<img src="${item.foto}" alt="${item.nome}" loading="lazy">` : (item.emoji || '🍔')}
          </div>
        `).join('')}
        ${moreCount > 0 ? `<div class="card-photo">+${moreCount}</div>` : ''}
      </div>
      
      <div class="card-desc">
        ${order.itens.slice(0, 2).map(i => `${i.qtd}x ${i.nome}`).join(', ')}
        ${order.itens.length > 2 ? '...' : ''}
      </div>
      
      <div class="card-footer">
        <div>
          <div class="card-total-label">Total</div>
          <div class="card-total-value">${formatCurrency(order.total)}</div>
        </div>
        <div class="card-actions">
          <button class="btn-phone" onclick="callClient('${order.telefone}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </button>
          <span class="badge-time">${order.tempoEntrega || '30 min'}</span>
          <button class="btn-repeat" onclick="repeatOrder('${order.id}')">
            Repetir
          </button>
        </div>
      </div>
    </li>
  `;
}

/* ── Render ── */
function renderOrders() {
  const active = allOrders.filter(o => !['entregue', 'cancelado'].includes(o.status));
  const past = allOrders.filter(o => ['entregue', 'cancelado'].includes(o.status));
  
  ORDERS_ACTIVE.innerHTML = active.length ? 
    active.map((o, i) => createOrderCard(o, i)).join('') : 
    '<li class="empty-state">Nenhum pedido em andamento</li>';
    
  ORDERS_PAST.innerHTML = past.length ? 
    past.map((o, i) => createOrderCard(o, i)).join('') : 
    '<li class="empty-state">Nenhum pedido anterior</li>';
}

/* ── Actions ── */
function callClient(phone) {
  window.location.href = `tel:${phone.replace(/\D/g, '')}`;
}

function repeatOrder(orderId) {
  // Simula recriar carrinho
  const order = allOrders.find(o => o.id === orderId);
  if (order) {
    sessionStorage.setItem('dk_cart', JSON.stringify(order.itens));
    window.location.href = '../carrinho/carrinho.html';
  }
}

/* ── Firebase Integration (quando DB existir) ── */
function startFirebaseOrders() {
  if (typeof listenOrders === 'function') {
    unsubscribeOrders = listenOrders(function(orders) {
      allOrders = orders.map(o => ({
        ...o,
        total: o.valor || o.total || 0,
        data: o.createdAt?.toDate ? o.createdAt.toDate().toISOString() : new Date().toISOString()
      }));
      renderOrders();
    });
    console.log('[History] Firebase listener ativo');
  } else {
    console.log('[History] Firebase não disponível - usando mock data');
  }
}

/* ── Auth Check ── */
function checkAuth() {
  if (typeof onAuthStateChanged === 'function') {
    onAuthStateChanged(function(user) {
      if (!user) {
        console.log('[History] Não autenticado - redirecionando...');
        window.location.href = '../staff/staff.html';
        return;
      }
      console.log('[History] Usuário OK:', user.email);
      // Carrega dados após auth
      setTimeout(() => {
        startFirebaseOrders();
      }, 500);
    });
  } else {
    console.log('[History] Sem Firebase Auth - modo dev');
    allOrders = [...MOCK_ORDERS];
    renderOrders();
  }
}

/* ── Event Listeners ── */
function bindEvents() {
  BTN_BACK.addEventListener('click', () => {
    window.history.back();
  });
  
  BTN_CARDAPIO.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../cardapio/cardapio.html';
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  console.log('[History] Inicializando...');
  bindEvents();
  checkAuth();
  
  // Loading state
  ORDERS_ACTIVE.innerHTML = '<li class="empty-state">Carregando...</li>';
  ORDERS_PAST.innerHTML = '<li class="empty-state">Carregando...</li>';
});

// Cleanup
window.addEventListener('beforeunload', function() {
  if (unsubscribeOrders) unsubscribeOrders();
});

