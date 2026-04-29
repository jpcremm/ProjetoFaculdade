// ════════════════════════════════════════════
// DASHBOARD · DARK KITCHEN - DESIGN DO 2º CÓDIGO
// ════════════════════════════════════════════

/* DATA */
const DATA = {
  hoje:{
    stats:{cozinha:'5 pedidos',entrega:'3 pedidos',taxa:'98.5%'},
    kpis:{fat:'R$ 8.450',fatD:'▲ 12.5%',fatUp:true,ped:'142',pedD:'▲ 8.3%',pedUp:true,tkt:'R$ 59,50',tktD:'▲ 2.1%',tktUp:true,tmp:'28 min',tmpD:'▼ 5.4%',tmpUp:false},
    sellers:[{nome:'Cheeseburger Clássico',sold:45,rev:'R$ 1.480,50'},{nome:'Pizza Margherita',sold:38,rev:'R$ 1.710,00'},{nome:'X-Salada',sold:25,rev:'R$ 747,50'}],
    orders:[{id:'#DK7845',nome:'Carlos Silva',preco:'R$ 78,90',status:'prep',label:'Preparando'},{id:'#DK7844',nome:'Ana Santos',preco:'R$ 55,00',status:'ready',label:'Pronto'},{id:'#DK7843',nome:'João Oliveira',preco:'R$ 89,90',status:'deliv',label:'Saiu para entrega'}]
  },
  semana:{
    stats:{cozinha:'18 pedidos',entrega:'9 pedidos',taxa:'97.2%'},
    kpis:{fat:'R$ 54.300',fatD:'▲ 9.1%',fatUp:true,ped:'892',pedD:'▲ 6.7%',pedUp:true,tkt:'R$ 60,87',tktD:'▲ 1.3%',tktUp:true,tmp:'31 min',tmpD:'▲ 2.1%',tmpUp:false},
    sellers:[{nome:'Cheeseburger Clássico',sold:310,rev:'R$ 10.230,00'},{nome:'Pizza Margherita',sold:265,rev:'R$ 11.925,00'},{nome:'X-Salada',sold:180,rev:'R$ 5.220,00'}],
    orders:[{id:'#DK7845',nome:'Carlos Silva',preco:'R$ 78,90',status:'prep',label:'Preparando'},{id:'#DK7844',nome:'Ana Santos',preco:'R$ 55,00',status:'ready',label:'Pronto'},{id:'#DK7840',nome:'Marcos Lima',preco:'R$ 122,00',status:'deliv',label:'Saiu para entrega'}]
  },
  mes:{
    stats:{cozinha:'62 pedidos',entrega:'31 pedidos',taxa:'98.9%'},
    kpis:{fat:'R$ 214.500',fatD:'▲ 14.3%',fatUp:true,ped:'3.820',pedD:'▲ 11.2%',pedUp:true,tkt:'R$ 56,15',tktD:'▼ 0.8%',tktUp:false,tmp:'27 min',tmpD:'▼ 7.0%',tmpUp:true},
    sellers:[{nome:'Cheeseburger Clássico',sold:1230,rev:'R$ 40.590,00'},{nome:'Pizza Margherita',sold:980,rev:'R$ 44.100,00'},{nome:'X-Salada',sold:720,rev:'R$ 21.480,00'}],
    orders:[{id:'#DK7845',nome:'Carlos Silva',preco:'R$ 78,90',status:'prep',label:'Preparando'},{id:'#DK7844',nome:'Ana Santos',preco:'R$ 55,00',status:'ready',label:'Pronto'},{id:'#DK7843',nome:'João Oliveira',preco:'R$ 89,90',status:'deliv',label:'Saiu para entrega'}]
  }
};

const DISHES = [
  {nome:'Cheeseburger Clássico',cat:'hamburguer',classe:'salgado',desc:'180g de carne angus, queijo cheddar, bacon crocante e molho especial',tempo:15,margem:68,preco:'R$ 32,90',alerta:'low',ativo:true},
  {nome:'X-Bacon Duplo',cat:'hamburguer',classe:'salgado',desc:'Duplo blend com queijo, bacon artesanal e maionese defumada',tempo:18,margem:62,preco:'R$ 38,90',alerta:null,ativo:true},
  {nome:'Pizza Margherita',cat:'pizza',classe:'salgado',desc:'Molho de tomate, mussarela de búfala, manjericão fresco e azeite',tempo:25,margem:65,preco:'R$ 45,00',alerta:'low',ativo:true},
  {nome:'X-Salada',cat:'hamburguer',classe:'salgado',desc:'Blend suculento, mix de folhas, tomate e molho especial',tempo:12,margem:70,preco:'R$ 29,90',alerta:null,ativo:true},
  {nome:'Salada Caesar',cat:'salada',classe:'salgado',desc:'Alface romana, croutons, parmesão e molho caesar',tempo:8,margem:72,preco:'R$ 28,50',alerta:null,ativo:true},
  {nome:'Sushi California',cat:'japones',classe:'salgado',desc:'20 peças variadas com salmão, atum e camarão',tempo:30,margem:58,preco:'R$ 89,90',alerta:null,ativo:true},
  {nome:'Lasanha à Bolonhesa',cat:'massa',classe:'salgado',desc:'Massa fresca, molho branco com parmesão e ervas finas',tempo:20,margem:67,preco:'R$ 39,90',alerta:null,ativo:true},
  {nome:'Bolo Brigadeiro',cat:'sobremesa',classe:'doce',desc:'Bolo de chocolate quente com sorvete de creme e calda',tempo:10,margem:70,preco:'R$ 22,00',alerta:null,ativo:true}
];

const STOCK = [
  {nome:'Carne Bovina 5kg',cat:'carnes',afetado:'Cheeseburger Clássico',qtd:8,unidade:'kg',min:10,max:50,custo:45.00,alert:'low'},
  {nome:'Queijo Muçarela',cat:'laticinios',afetado:'Pizza Margherita',qtd:5,unidade:'kg',min:8,max:30,custo:28.00,alert:'low'},
  {nome:'Salmão Fresco',cat:'peixes',afetado:'Sushi California',qtd:2,unidade:'kg',min:5,max:15,custo:89.00,alert:'low'},
  {nome:'Farinha de Trigo',cat:'graos',afetado:'Pizza Margherita',qtd:0,unidade:'kg',min:10,max:50,custo:4.50,alert:'out'},
  {nome:'Alface Americana',cat:'vegetais',afetado:'X-Salada',qtd:18,unidade:'un',min:5,max:30,custo:3.20,alert:'ok'},
  {nome:'Pão Brioche',cat:'graos',afetado:'Cheeseburger Clássico',qtd:240,unidade:'un',min:50,max:300,custo:1.80,alert:'ok'},
  {nome:'Queijo Cheddar',cat:'laticinios',afetado:'X-Bacon Duplo',qtd:8,unidade:'kg',min:5,max:20,custo:22.00,alert:'ok'}
];

let currentFilter = 'hoje';
let currentCpCat  = 'todos';
let currentStCat  = 'todos';
let starred = new Set();

class DarkKitchenDashboard {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderDashboard();
    this.renderDishes();
    this.renderStock();
    this.startRealTime();
  }

  bindEvents() {
    // Navegação
    document.querySelectorAll('[data-navigate]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.dataset.navigate;
        this.navigateTo(target);
      });
    });

    // Filtros período
    document.querySelectorAll('[data-action="filter"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-action="filter"]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentFilter = e.currentTarget.dataset.filter;
        this.renderDashboard();
      });
    });

    // Filtros categoria
    document.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        const cat = e.currentTarget.dataset.cat;
        document.querySelectorAll(`[data-page="${page}"]`).forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        if (page === 'cp') {
          currentCpCat = cat;
          this.renderDishes();
        } else {
          currentStCat = cat;
          this.renderStock();
        }
      });
    });

    // Logout
    document.querySelector('[data-action="logout"]')?.addEventListener('click', async () => {
      try {
        await logout();
        window.location.href = '../login/login.html';
      } catch (err) {
        this.showToast('Erro ao sair. Tente novamente.');
        console.error(err);
      }
    });

    // FAB
    document.querySelector('[data-action="new-dish"]')?.addEventListener('click', () => {
      this.openAddDishModal();
    });

    // Modal events
    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.closeAddDishModal());
    document.getElementById('btn-cancel-dish')?.addEventListener('click', () => this.closeAddDishModal());
    document.getElementById('modal-add-dish')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-add-dish') this.closeAddDishModal();
    });
    document.getElementById('form-add-dish')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const mode = document.getElementById('form-add-dish').dataset.mode;
      if (mode === 'edit') {
        this.saveEditDish();
      } else {
        this.saveNewDish();
      }
    });
  }

  navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  renderDashboard() {
    const d = DATA[currentFilter];
    
    // Status
    document.getElementById('stat-cozinha').textContent = d.stats.cozinha;
    document.getElementById('stat-entrega').textContent = d.stats.entrega;
    document.getElementById('stat-taxa').textContent = d.stats.taxa;
    
    // KPIs
    const k = d.kpis;
    this.set('kpi-fat', k.fat); this.setDelta('kpi-fat-delta', k.fatD, k.fatUp);
    this.set('kpi-ped', k.ped); this.setDelta('kpi-ped-delta', k.pedD, k.pedUp);
    this.set('kpi-tkt', k.tkt); this.setDelta('kpi-tkt-delta', k.tktD, k.tktUp);
    this.set('kpi-tmp', k.tmp); this.setDelta('kpi-tmp-delta', k.tmpD, k.tmpUp);
    
    // Best sellers
    document.getElementById('best-sellers').innerHTML = d.sellers.map((s,i)=>`
      <li class="rank-item">
        <span class="rank-num r${i+1}">${i+1}</span>
        <div class="rank-info">
          <p class="rank-name">${s.nome}</p>
          <p class="rank-sold">${s.sold} vendidos</p>
        </div>
        <span class="rank-revenue">${s.rev}</span>
      </li>
    `).join('');
    
    // Recent orders
    document.getElementById('recent-orders').innerHTML = d.orders.map(o=>`
      <li class="order-item">
        <div class="order-top">
          <span class="order-id">${o.id}</span>
          <span class="order-status ${o.status}">${o.label}</span>
        </div>
        <p class="order-name">${o.nome}</p>
        <p class="order-price">${o.preco}</p>
      </li>
    `).join('');
  }

  set(id, v) { document.getElementById(id).textContent = v; }
  setDelta(id, v, up) { 
    const el = document.getElementById(id); 
    el.textContent = v; 
    el.className = `kpi-delta ${up ? 'up' : 'down'}`; 
  }

  renderDishes() {
    const list = DISHES.filter(d => currentCpCat === 'todos' || d.cat === currentCpCat);
    const ativosCount = DISHES.filter(d => d.ativo).length;
    document.getElementById('cp-ativos').textContent = ativosCount;
    document.getElementById('cp-dest').textContent = starred.size;
    document.getElementById('cp-subtitle').textContent = `${DISHES.length} pratos cadastrados`;

    const container = document.getElementById('dish-list');
    container.innerHTML = list.length ? list.map((d, idx) => {
      const isStar = starred.has(d.nome);
      return `
        <article class="dish-row ${d.ativo ? '' : 'dish-inativo'}">
          <div class="dish-row-body">
            <div class="dish-row-title">
              <span class="dish-row-name">${d.nome}</span>
              ${d.classe ? `<span class="dish-row-classe ${d.classe}">${d.classe === 'doce' ? 'Doce' : 'Salgado'}</span>` : ''}
              <span class="dish-row-cat">${this.getCatLabel(d.cat)}</span>
              ${!d.ativo ? `<span class="dish-row-classe inativo">Inativo</span>` : ''}
            </div>
            <p class="dish-row-desc">${d.desc}</p>
            <div class="dish-row-meta">
              <span class="dish-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${d.tempo} min
              </span>
              <span class="dish-meta-item margin">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                ${d.margem}% margem
              </span>
              <span class="dish-price-big">${d.preco}</span>
            </div>
            ${d.alerta === 'low' ? `
              <div class="dish-alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Estoque baixo - Prato pode ser rebaixado no cardápio
              </div>
            ` : ''}
          </div>
          <div class="dish-actions-col">
            <button class="icon-btn eye ${d.ativo ? 'active' : ''}" title="${d.ativo ? 'Desativar prato' : 'Ativar prato'}" onclick="dashboard.toggleVisibility('${d.nome}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="icon-btn star ${isStar ? 'active' : ''}" title="${isStar ? 'Remover destaque' : 'Destacar prato'}" onclick="dashboard.toggleStar('${d.nome}')" style="${isStar ? 'border-color:var(--yellow);color:var(--yellow)' : ''}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isStar ? 'var(--yellow)' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
            <button class="icon-btn edit" title="Editar prato" onclick="dashboard.editDish('${d.nome}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="icon-btn del" title="Remover prato" onclick="dashboard.deleteDish('${d.nome}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </article>
      `;
    }).join('') : `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
        </div>
        <p>Nenhum prato nesta categoria.</p>
      </div>
    `;
  }

  toggleStar(nome) {
    if (starred.has(nome)) {
      starred.delete(nome);
      this.showToast('Prato removido dos destaques');
    } else {
      starred.add(nome);
      this.showToast('Prato destacado com sucesso!');
    }
    this.renderDishes();
  }

  toggleVisibility(nome) {
    const d = DISHES.find(x => x.nome === nome);
    if (!d) return;
    d.ativo = !d.ativo;
    this.showToast(`"${nome}" ${d.ativo ? 'ativado' : 'desativado'} no cardápio`);
    this.renderDishes();
  }

  editDish(nome) {
    const d = DISHES.find(x => x.nome === nome);
    if (!d) return;
    this.openAddDishModal(d);
  }

  deleteDish(nome) {
    if (confirm(`Tem certeza que deseja remover "${nome}" do cardápio?`)) {
      const idx = DISHES.findIndex(d => d.nome === nome);
      if (idx > -1) {
        DISHES.splice(idx, 1);
        starred.delete(nome);
        this.showToast(`"${nome}" removido do cardápio`);
        this.renderDishes();
      }
    }
  }

  openAddDishModal(dish = null) {
    const modal = document.getElementById('modal-add-dish');
    const form = document.getElementById('form-add-dish');
    const title = document.getElementById('modal-title');
    const submitBtn = document.getElementById('btn-save-dish');

    if (dish) {
      // Modo edição: NÃO chamar form.reset(), apenas preencher os campos
      form.dataset.mode = 'edit';
      title.textContent = 'Editar Prato';
      submitBtn.textContent = 'Atualizar Prato';
      document.getElementById('dish-original-name').value = dish.nome;
      document.getElementById('dish-name').value = dish.nome;
      document.getElementById('dish-classe').value = dish.classe || '';
      document.getElementById('dish-cat').value = dish.cat;
      document.getElementById('dish-preco').value = dish.preco.replace('R$ ', '').replace(',', '.');
      document.getElementById('dish-tempo').value = dish.tempo;
      document.getElementById('dish-desc').value = dish.desc;
    } else {
      // Modo criação: limpar formulário
      form.dataset.mode = 'create';
      title.textContent = 'Adicionar Prato';
      submitBtn.textContent = 'Salvar Prato';
      form.reset();
      document.getElementById('dish-original-name').value = '';
    }

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    document.getElementById('dish-name').focus();
  }

  closeAddDishModal() {
    const modal = document.getElementById('modal-add-dish');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('active');
  }

  _getFormValues() {
    return {
      nome: document.getElementById('dish-name').value.trim(),
      classe: document.getElementById('dish-classe').value,
      cat: document.getElementById('dish-cat').value,
      precoRaw: document.getElementById('dish-preco').value,
      tempo: parseInt(document.getElementById('dish-tempo').value, 10),
      desc: document.getElementById('dish-desc').value.trim()
    };
  }

  _validateDishForm(values) {
    const { nome, classe, cat, precoRaw, tempo, desc } = values;
    if (!nome || !classe || !cat || !precoRaw || !tempo || !desc) {
      this.showToast('Preencha todos os campos obrigatórios.');
      return null;
    }
    const precoNum = parseFloat(precoRaw);
    if (isNaN(precoNum) || precoNum <= 0) {
      this.showToast('Informe um preço válido.');
      return null;
    }
    return {
      nome,
      classe,
      cat,
      preco: `R$ ${precoNum.toFixed(2).replace('.', ',')}`,
      tempo,
      desc
    };
  }

  saveNewDish() {
    const values = this._getFormValues();
    const data = this._validateDishForm(values);
    if (!data) return;

    const novoPrato = {
      nome: data.nome,
      cat: data.cat,
      classe: data.classe,
      desc: data.desc,
      tempo: data.tempo,
      margem: 65,
      preco: data.preco,
      alerta: null,
      ativo: true
    };
    DISHES.push(novoPrato);
    this.showToast(`"${data.nome}" adicionado ao cardápio!`);
    this.renderDishes();
    this.closeAddDishModal();
  }

  saveEditDish() {
    const originalNome = document.getElementById('dish-original-name').value;
    const values = this._getFormValues();
    const data = this._validateDishForm(values);
    if (!data) return;

    const idx = DISHES.findIndex(d => d.nome === originalNome);
    if (idx > -1) {
      const existing = DISHES[idx];
      existing.nome = data.nome;
      existing.classe = data.classe;
      existing.cat = data.cat;
      existing.preco = data.preco;
      existing.tempo = data.tempo;
      existing.desc = data.desc;
      this.showToast(`"${data.nome}" atualizado com sucesso!`);
      this.renderDishes();
      this.closeAddDishModal();
    }
  }

  getCatLabel(cat) {
    const labels = {
      hamburguer: 'Hambúrgueres',
      pizza: 'Pizzas',
      salada: 'Saladas',
      japones: 'Japonês',
      massa: 'Massas',
      sobremesa: 'Sobremesas'
    };
    return labels[cat] || cat;
  }

  renderStock() {
    const list = STOCK.filter(s => currentStCat === 'todos' || s.cat === currentStCat);
    const container = document.getElementById('stock-list');
    
    container.innerHTML = list.length ? list.map((s, idx) => {
      const pct = Math.min(100, Math.round((s.qtd/s.max)*100));
      const barColor = s.alert === 'out' ? 'var(--red)' : s.alert === 'low' ? 'var(--yellow)' : 'var(--green)';
      const lbl = s.alert === 'out' ? 'Esgotado' : s.alert === 'low' ? 'Baixo' : 'OK';
      
      return `
        <article class="stock-row">
          <div class="stock-row-top">
            <div class="stock-row-left">
              <span class="stock-row-name">${s.nome}</span>
              <span class="stock-badge ${s.alert}">${lbl}</span>
              <span class="stock-cat-tag">${this.getStockCatLabel(s.cat)}</span>
            </div>
            <div class="stock-row-controls">
              <button class="qty-btn" onclick="dashboard.adjustQty('${s.nome}',-1)" aria-label="Diminuir">−</button>
              <button class="qty-btn" onclick="dashboard.adjustQty('${s.nome}',+1)" aria-label="Aumentar">+</button>
              <button class="btn-restock-sq" onclick="dashboard.requestRestock('${s.nome}')" title="Solicitar reposição">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              </button>
            </div>
          </div>
          <p class="stock-affected">Pratos afetados: <span>${s.afetado}</span></p>
          <div class="stock-bar-row">
            <span class="stock-qty-label">${s.qtd} ${s.unidade}</span>
            <div class="stock-bar-bg">
              <div class="stock-bar" style="width:${pct}%;background:${barColor}"></div>
            </div>
            <span class="stock-minmax">Min: ${s.min} | Max: ${s.max}</span>
          </div>
          <p class="stock-cost">Custo unitário: <span>R$ ${s.custo.toFixed(2)}</span></p>
          ${s.alert !== 'ok' ? `
            <div class="stock-alert-bar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Estoque ${s.alert === 'out' ? 'esgotado' : 'baixo'}. Considere repor em breve.
            </div>
          ` : ''}
        </article>
      `;
    }).join('') : `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <p>Nenhum item nesta categoria.</p>
      </div>
    `;
  }

  requestRestock(nome) {
    this.showToast(`Reposição solicitada: ${nome}`);
  }

  getStockCatLabel(cat) {
    const labels = {
      carnes: 'Carnes',
      laticinios: 'Laticínios',
      peixes: 'Peixes',
      vegetais: 'Vegetais',
      sobremesas: 'Sobremesas',
      graos: 'Grãos'
    };
    return labels[cat] || cat;
  }

  adjustQty(nome, delta) {
    const s = STOCK.find(x => x.nome === nome);
    if (!s) return;
    s.qtd = Math.max(0, s.qtd + delta);
    s.alert = s.qtd === 0 ? 'out' : s.qtd <= s.min ? 'low' : 'ok';
    this.renderStock();
  }

  showToast(msg, duration = 2800) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  startRealTime() {
    setInterval(() => {
      const cozinha = Math.floor(Math.random() * 10) + 1;
      const entrega = Math.floor(Math.random() * 5) + 1;
      const taxa = (98 + Math.floor(Math.random() * 3)).toFixed(1);
      document.getElementById('stat-cozinha').textContent = `${cozinha} pedidos`;
      document.getElementById('stat-entrega').textContent = `${entrega} pedidos`;
      document.getElementById('stat-taxa').textContent = `${taxa}%`;
    }, 5000);
  }
}

// Inicialização global
const dashboard = new DarkKitchenDashboard();
