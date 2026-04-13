let prontos      = ['7842', '7841'];
let rota         = ['7840'];
let entregues    = 0;
let totalValor   = 0;
let historicoEntregas = [];

/* ── Hora atual formatada ── */
function horaAgora() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return h + ':' + m;
}

/* ── Formata valor em reais ── */
function formatarValor(str) {
  const num = parseFloat(str.replace('R$', '').replace(',', '.').trim());
  return isNaN(num) ? 0 : num;
}

/* ── Toast ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(function () { t.style.display = 'none'; }, 2500);
}

/* ── Atualiza contadores e textos ── */
function updateStats() {
  document.getElementById('count-coletar').textContent   = prontos.length;
  document.getElementById('count-rota').textContent      = rota.length;
  document.getElementById('count-entregues').textContent = entregues;

  const total = prontos.length + rota.length;
  document.getElementById('active-label').textContent =
    total + ' entrega' + (total !== 1 ? 's' : '') +
    ' ativa' + (total !== 1 ? 's' : '');

  document.getElementById('prontos-title').textContent =
    'Prontos para retirada (' + prontos.length + ')';
  document.getElementById('rota-title').textContent =
    'Em rota (' + rota.length + ')';

  document.getElementById('prontos-empty').style.display =
    prontos.length === 0 ? 'block' : 'none';
  document.getElementById('rota-empty').style.display =
    rota.length === 0 ? 'block' : 'none';
}

/* ── Atualiza aba e painel de realizadas ── */
function updateRealizadas() {
  /* Badge na aba */
  document.getElementById('tab-badge').textContent = entregues;

  /* Resumo */
  document.getElementById('resumo-total').textContent = entregues;
  document.getElementById('resumo-valor').textContent =
    'R$ ' + totalValor.toFixed(2).replace('.', ',');

  /* Lista de cards */
  const lista = document.getElementById('realizadas-list');
  lista.innerHTML = '';

  historicoEntregas.forEach(function (e) {
    const card = document.createElement('div');
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

  /* Mensagem vazia */
  document.getElementById('realizadas-empty').style.display =
    entregues === 0 ? 'block' : 'none';
}

/* ── Iniciar entrega ── */
function iniciarEntrega(id, nome, tel, endereco, valor) {
  const card = document.getElementById('card-' + id);
  if (!card) return;
  card.remove();
  prontos = prontos.filter(function (x) { return x !== id; });

  const novoCard = document.createElement('div');
  novoCard.className = 'card active-delivery';
  novoCard.id = 'card-' + id;
  novoCard.innerHTML =
    '<div class="card-header">' +
      '<div class="card-header-left">' +
        '<span class="card-id">#' + id + '</span>' +
        '<span class="badge em-rota">✈ Saiu para entrega</span>' +
      '</div>' +
    '</div>' +
    '<div class="customer-name">' + nome + '</div>' +
    '<div class="customer-phone">📞 ' + tel + '</div>' +
    '<div class="delivery-actions">' +
      '<button class="btn ghost" data-action="ligar" data-tel="' + tel + '">📞 Ligar</button>' +
      '<button class="btn green"' +
        ' data-action="entregar"' +
        ' data-id="' + id + '"' +
        ' data-nome="' + nome + '"' +
        ' data-tel="' + tel + '"' +
        ' data-endereco="' + endereco + '"' +
        ' data-valor="' + valor + '"' +
      '>✓ Entregar</button>' +
    '</div>';

  document.getElementById('rota-list').appendChild(novoCard);
  rota.push(id);
  updateStats();
  showToast('Entrega #' + id + ' iniciada!');
}

/* ── Confirmar entrega ── */
function confirmarEntrega(id, nome, endereco, valor) {
  const card = document.getElementById('card-' + id);
  if (card) card.remove();
  rota = rota.filter(function (x) { return x !== id; });
  entregues++;
  totalValor += formatarValor(valor);

  historicoEntregas.unshift({
    id: id,
    nome: nome,
    endereco: endereco || '—',
    valor: valor || 'R$ 0,00',
    hora: horaAgora()
  });

  updateStats();
  updateRealizadas();
  showToast('✓ Entrega para ' + nome + ' confirmada!');
}

/* ── Ligar ── */
function ligar(tel) {
  showToast('Ligando para ' + tel + '...');
}

/* ── Troca de abas ── */
document.querySelectorAll('.tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');

    const alvo = tab.getAttribute('data-tab');
    document.getElementById('painel-ativas').classList.toggle('hidden', alvo !== 'ativas');
    document.getElementById('painel-realizadas').classList.toggle('hidden', alvo !== 'realizadas');
  });
});

/* ── Event delegation ── */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action   = btn.getAttribute('data-action');
  const id       = btn.getAttribute('data-id');
  const nome     = btn.getAttribute('data-nome');
  const tel      = btn.getAttribute('data-tel');
  const endereco = btn.getAttribute('data-endereco');
  const valor    = btn.getAttribute('data-valor');

  if (action === 'iniciar')  { iniciarEntrega(id, nome, tel, endereco, valor); }
  if (action === 'entregar') { confirmarEntrega(id, nome, endereco, valor); }
  if (action === 'ligar')    { ligar(tel); }
});

/* ── Init ── */
updateStats();
updateRealizadas();