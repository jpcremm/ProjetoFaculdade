// =============================================
// dashboard-garcom.js — Profit Brain
// =============================================

const PRATOS = [
  { id:1, nome:'Hambúrguer Artesanal', desc:'Blend especial 180g, queijo cheddar, alface americana, tomate e molho da casa.', tempo:12, margem:72, preco:38.90, emoji:'🍔', tags:['todos','lucrativos'], rec:true,  hint:'Alta margem e preparo rápido — ideal para aumentar lucro' },
  { id:2, nome:'Brownie de Chocolate',  desc:'Brownie artesanal 70% cacau, quente e úmido, com sorvete de baunilha.',           tempo:4,  margem:85, preco:18.90, emoji:'🍫', tags:['todos','rapidos','lucrativos'], rec:true,  hint:'Alta margem e preparo rápido — ideal para aumentar lucro' },
  { id:3, nome:'Frango Grelhado Premium', desc:'Peito de frango 200g marinado 24h em ervas, com arroz integral e legumes.',     tempo:8,  margem:68, preco:34.50, emoji:'🍗', tags:['todos','rapidos'],              rec:true,  hint:'Preparo super rápido e boa margem' },
  { id:4, nome:'Batata Frita Especial',  desc:'Batatas rústicas temperadas com alecrim, alho e flor de sal.',                    tempo:7,  margem:90, preco:16.90, emoji:'🍟', tags:['todos','rapidos','lucrativos'], rec:true,  hint:'Preparo super rápido e boa margem' },
  { id:5, nome:'Massa ao Molho Sugo',   desc:'Massa artesanal al dente ao molho San Marzano com manjericão fresco.',             tempo:15, margem:78, preco:32.00, emoji:'🍝', tags:['todos','lucrativos'],          rec:true,  hint:'Ótimo equilíbrio entre lucro e velocidade' },
  { id:6, nome:'Salada Especial da Casa', desc:'Mix de folhas nobres, tomate cereja, pepino, azeitonas e vinagrete de mel.',     tempo:5,  margem:82, preco:24.90, emoji:'🥗', tags:['todos','rapidos','lucrativos'], rec:false, hint:'Preparo super rápido e boa margem' },
  { id:7, nome:'Salmão Grelhado',       desc:'Filé de salmão 200g grelhado com crosta de ervas, purê de batata-doce e aspargos.', tempo:18, margem:58, preco:59.90, emoji:'🐟', tags:['todos','estoque'],            rec:false, hint:'Ajuda a reduzir desperdício de estoque' },
  { id:8, nome:'Risoto de Cogumelos',   desc:'Risoto cremoso com mix de cogumelos Paris, Shitake e Porcini, finalizado com manteiga e parmesão.', tempo:20, margem:62, preco:48.00, emoji:'🍄', tags:['todos'], rec:false, hint:null }
];

let PEDIDOS = [
  { id:'p001', mesa:5,  num:'#001', status:'preparo', haMin:12, estimMin:12,   itens:[{qtd:2,nome:'Hambúrguer Artesanal'},{qtd:1,nome:'Batata Frita Especial'}], info:'Cozinha trabalhando neste pedido' },
  { id:'p002', mesa:12, num:'#002', status:'pronto',  haMin:22, estimMin:null, itens:[{qtd:1,nome:'Frango Grelhado Premium',obs:'Sem cebola'},{qtd:1,nome:'Salada Especial'}], info:null },
  { id:'p003', mesa:3,  num:'#003', status:'preparo', haMin:15, estimMin:18,   itens:[{qtd:1,nome:'Salmão Grelhado'}], info:'Cozinha trabalhando neste pedido' },
  { id:'p004', mesa:8,  num:'#004', status:'pronto',  haMin:30, estimMin:null, itens:[{qtd:2,nome:'Massa ao Molho Sugo'},{qtd:2,nome:'Brownie de Chocolate'}], info:null }
];

const ALERTAS_ESTOQUE = [
  { tipo:'risco', nome:'Salmão Grelhado', qtd:'4 filés', label:'Risco de falta', sug:'Reabastecer urgente ou promover combo rápido', combo:'Combo sugerido: Salada Especial', acoes:[{label:'Criar Combo',tipo:'primary'},{label:'Remover',tipo:'secondary'}] },
  { tipo:'venc',  nome:'Massa ao Molho Sugo', qtd:'12 porções', label:'Ingredientes próximos do vencimento', sug:'Priorizar no cardápio hoje para reduzir perda', combo:null, acoes:[{label:'Priorizar Hoje',tipo:'primary'}] }
];

let filtroCardapio = 'todos';
let filtroPedido   = 'todos';
let buscaAtual     = '';

// -----------------------------------------------
// NAVEGAÇÃO
// -----------------------------------------------
function navegarPara(tela) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('screen-' + tela).classList.add('active');
  document.getElementById('nav-' + tela).classList.add('active');
  document.getElementById('content-area').scrollTop = 0;
}

// -----------------------------------------------
// CARDÁPIO
// -----------------------------------------------
function setFiltro(filtro, btn) {
  filtroCardapio = filtro;
  document.querySelectorAll('#filter-bar .filter-btn').forEach(b => {
    b.className = 'filter-btn ' + (b.dataset.cat || '');
  });
  btn.className = 'filter-btn ' + (filtro === 'todos' ? 'bk' : btn.dataset.cat || '');
  renderCardapio();
}

function filtrarCardapio(q) {
  buscaAtual = q.toLowerCase();
  renderCardapio();
}

function renderCardapio() {
  const lista = document.getElementById('prato-list');
  const filtrados = PRATOS.filter(p =>
    (filtroCardapio === 'todos' || p.tags.includes(filtroCardapio)) &&
    (!buscaAtual || p.nome.toLowerCase().includes(buscaAtual))
  );

  if (!filtrados.length) {
    lista.innerHTML = '<p style="text-align:center;color:var(--muted);padding:32px;font-size:14px">Nenhum prato encontrado.</p>';
    return;
  }

  lista.innerHTML = filtrados.map((p, i) => `
    <div class="prato-card ${p.rec ? 'recomendado' : ''}">
      <div class="prato-main">
        <div class="prato-rank">${i + 1}</div>
        <div class="prato-emoji">${p.emoji}</div>
        <div class="prato-body">
          <div class="prato-nome">${p.nome}</div>
          <div class="prato-desc">${p.desc}</div>
          <div class="prato-meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${p.tempo} min
            <span class="prato-margem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
              ${p.margem}%
            </span>
          </div>
          <div class="prato-preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
        </div>
        <div class="prato-badge-wrap">${p.rec ? '<span class="badge-recomendado">Recomendado</span>' : ''}</div>
      </div>
      ${p.hint ? `<div class="prato-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>${p.hint}</div>` : ''}
    </div>`).join('');
}

// -----------------------------------------------
// PEDIDOS
// -----------------------------------------------
function setFiltroPedido(filtro, btn) {
  filtroPedido = filtro;
  document.querySelectorAll('#filter-bar-pedidos .filter-btn').forEach(b => {
    b.className = 'filter-btn ' + (b.dataset.cat || '');
  });
  btn.className = 'filter-btn ' + (filtro === 'todos' ? 'bk' : btn.dataset.cat || '');
  renderPedidos();
}

function renderPedidos() {
  const lista = document.getElementById('pedido-list');
  const filtrados = PEDIDOS.filter(p => filtroPedido === 'todos' || p.status === filtroPedido);

  if (!filtrados.length) {
    lista.innerHTML = '<p style="text-align:center;color:var(--muted);padding:32px;font-size:14px">Nenhum pedido encontrado.</p>';
    return;
  }

  const icons = {
    preparo:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>`,
    pronto:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    entregue: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`
  };
  const labels = { preparo:'Em Preparo', pronto:'Pronto', entregue:'Entregue' };

  lista.innerHTML = filtrados.map(p => `
    <div class="pedido-card ${p.status}" id="pedido-${p.id}">
      <div class="pedido-body">
        <div class="pedido-top">
          <div><span class="pedido-mesa">Mesa ${p.mesa}</span><span class="pedido-num">${p.num}</span></div>
          <div class="pedido-status ${p.status}">${icons[p.status]} ${labels[p.status]}</div>
        </div>
        <div class="pedido-tempo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          há ${p.haMin} min${p.estimMin ? ` • ~${p.estimMin} min` : ''}
        </div>
        <ul class="pedido-itens">
          ${p.itens.map(it => `<li><span class="qtd">${it.qtd}×</span>${it.nome}${it.obs ? `<span class="obs">${it.obs}</span>` : ''}</li>`).join('')}
        </ul>
        ${p.info ? `<div class="pedido-info"><span class="dot"></span>${p.info}</div>` : ''}
      </div>
      ${p.status === 'pronto' ? `
        <button class="btn-entregar" onclick="marcarEntregue('${p.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Marcar como Entregue
        </button>` : ''}
    </div>`).join('');
}

function marcarEntregue(id) {
  const p = PEDIDOS.find(x => x.id === id);
  if (!p) return;
  p.status = 'entregue';
  p.info = null;
  // Firestore: await updateDoc(doc(db, 'pedidos', id), { status: 'entregue' });
  renderPedidos();
}

// -----------------------------------------------
// ESTOQUE GRID
// -----------------------------------------------
function renderEstoque() {
  const items = [
    { nome:'Salmão',      desc:'Filés disponíveis',    qtd:'4 filés',    tipo:'baixo' },
    { nome:'Massa',       desc:'Próx. do vencimento',  qtd:'12 porções', tipo:'excesso' },
    { nome:'Hambúrguer',  desc:'Estoque saudável',     qtd:'22 unid.',   tipo:'' },
    { nome:'Frango',      desc:'Estoque saudável',     qtd:'18 unid.',   tipo:'' },
    { nome:'Brownie',     desc:'Estoque saudável',     qtd:'14 unid.',   tipo:'' },
    { nome:'Batata Frita',desc:'Estoque saudável',     qtd:'30 unid.',   tipo:'' },
  ];
  document.getElementById('estoque-grid').innerHTML = items.map(it => `
    <div class="estoque-item ${it.tipo}">
      <h4>${it.nome}</h4>
      <p>${it.desc}</p>
      <span class="qtd-badge">${it.qtd}</span>
    </div>`).join('');
}

// -----------------------------------------------
// DRAWER ESTOQUE
// -----------------------------------------------
function abrirDrawer() {
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('drawer-estoque').classList.add('open');
  renderDrawer();
}

function fecharDrawer() {
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('drawer-estoque').classList.remove('open');
}

function renderDrawer() {
  const icons = {
    risco: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>`,
    venc:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
  };

  document.getElementById('drawer-body').innerHTML = ALERTAS_ESTOQUE.map(a => `
    <div class="alerta-card ${a.tipo}">
      <div class="alerta-top">
        <div class="alerta-icon">${icons[a.tipo]}</div>
        <div>
          <div class="alerta-title">${a.nome}</div>
          <div class="alerta-sub"><span class="qtd">${a.qtd}</span><span class="label"> • ${a.label}</span></div>
        </div>
      </div>
      <div class="alerta-sugestao">
        <div class="sugestao-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Sugestão Automática
        </div>
        <div class="sugestao-desc">${a.sug}</div>
        ${a.combo ? `<div class="sugestao-combo">${a.combo}</div>` : ''}
      </div>
      <div class="alerta-actions">
        ${a.acoes.map(ac => `<button class="btn-acao-${ac.tipo}" onclick="alert('${ac.label} em breve!')">${ac.label}</button>`).join('')}
      </div>
    </div>`).join('');
}

// -----------------------------------------------
// PERFIL
// -----------------------------------------------
function carregarPerfil() {
  const tentativa = setInterval(() => {
    if (!window._firebase) return;
    clearInterval(tentativa);
    const user = window._firebase.auth.currentUser;
    if (!user) return;
    const nome = user.displayName || 'Garçom';
    document.getElementById('perfil-nome').textContent = nome;
    document.getElementById('perfil-email').textContent = user.email;
    document.getElementById('perfil-avatar').textContent = nome.charAt(0).toUpperCase();
  }, 200);
}

function fazerLogout() {
  if (!window._firebase) { window.location.href = 'login.html'; return; }
  window._firebase.auth.signOut().then(() => { window.location.href = 'login.html'; });
}

// -----------------------------------------------
// INICIALIZAÇÃO
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderCardapio();
  renderPedidos();
  renderEstoque();
  carregarPerfil();
});

window.navegarPara      = navegarPara;
window.setFiltro        = setFiltro;
window.setFiltroPedido  = setFiltroPedido;
window.filtrarCardapio  = filtrarCardapio;
window.marcarEntregue   = marcarEntregue;
window.abrirDrawer      = abrirDrawer;
window.fecharDrawer     = fecharDrawer;
window.fazerLogout      = fazerLogout;