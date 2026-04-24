/* ── Estado global ── */
const estados = ['pendente', 'preparando', 'pronto', 'concluido'];
let picoAtivo = false;

let contadores = {
  pendente:   1,
  preparando: 2,
  pronto:     1
};

/* ── Toast ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(function () { t.style.display = 'none'; }, 2500);
}

/* ── Atualiza contadores no topo e contagens nos h2 ── */
function updateStats() {
  /* dd no topo */
  document.getElementById('count-pendentes').textContent  = contadores.pendente;
  document.getElementById('count-preparando').textContent = contadores.preparando;
  document.getElementById('count-prontos').textContent    = contadores.pronto;

  /* span.col-count dentro de cada h2 */
  document.querySelector('#title-pendentes  .col-count').textContent = contadores.pendente;
  document.querySelector('#title-preparando .col-count').textContent = contadores.preparando;
  document.querySelector('#title-prontos    .col-count').textContent = contadores.pronto;

  const total = contadores.pendente + contadores.preparando + contadores.pronto;
  document.getElementById('active-label').textContent =
    total + ' pedido' + (total !== 1 ? 's' : '') + ' em andamento';

  document.getElementById('empty-pendentes').style.display  = contadores.pendente   === 0 ? 'block' : 'none';
  document.getElementById('empty-preparando').style.display = contadores.preparando === 0 ? 'block' : 'none';
  document.getElementById('empty-prontos').style.display    = contadores.pronto     === 0 ? 'block' : 'none';
}

/* ── Avança um card para o próximo estado ── */
function avancarCard(id) {
  const card = document.getElementById('card-' + id);
  if (!card) return;

  const estadoAtual = card.getAttribute('data-estado');
  const idx = estados.indexOf(estadoAtual);
  if (idx === -1 || idx >= estados.length - 1) return;

  const proximo = estados[idx + 1];

  contadores[estadoAtual]--;
  card.remove();

  if (proximo === 'concluido') {
    updateStats();
    showToast('Pedido #' + id + ' concluído!');
    return;
  }

  const nome     = card.getAttribute('data-nome');
  const itens    = card.getAttribute('data-itens').split('|');
  const endereco = card.getAttribute('data-endereco');
  const valor    = card.getAttribute('data-valor');

  const badgeConfig = {
    preparando: { cls: 'blue',  txt: '📦 Preparando', lista: 'list-preparando' },
    pronto:     { cls: 'green', txt: '✅ Pronto',      lista: 'list-prontos'    }
  };

  const cfg = badgeConfig[proximo];

  /* Cria um <li> semântico (igual ao HTML estático) */
  const novoCard = document.createElement('li');
  novoCard.className = 'card';
  novoCard.id = 'card-' + id;
  novoCard.setAttribute('data-estado', proximo);
  novoCard.setAttribute('data-nome', nome);
  novoCard.setAttribute('data-itens', card.getAttribute('data-itens'));
  novoCard.setAttribute('data-endereco', endereco);
  novoCard.setAttribute('data-valor', valor);

  const itensHTML = itens.map(function (item) {
    const partes = item.trim().split(' ');
    const qty  = partes[0];
    const desc = partes.slice(1).join(' ');
    return '<li class="item-row"><b class="item-qty">' + qty + '</b> ' + desc + '</li>';
  }).join('');

  const botaoAvancar = proximo !== 'pronto'
    ? '<button class="btn orange" data-action="avancar" data-id="' + id + '">Avançar</button>'
    : '';

  novoCard.innerHTML =
    '<header class="card-header">' +
      '<div class="card-header-left">' +
        '<span class="card-id">#' + id + '</span>' +
        '<mark class="badge ' + cfg.cls + '">' + cfg.txt + '</mark>' +
      '</div>' +
      '<time class="timer">🕐 agora</time>' +
    '</header>' +
    '<p class="customer-name">👤 ' + nome + '</p>' +
    '<ul class="itens-list" aria-label="Itens do pedido">' + itensHTML + '</ul>' +
    '<address class="address-row">📍 ' + endereco + '</address>' +
    '<footer class="card-footer">' +
      '<strong class="price green">' + valor + '</strong>' +
      botaoAvancar +
    '</footer>';

  document.getElementById(cfg.lista).appendChild(novoCard);
  contadores[proximo]++;

  updateStats();
  showToast('Pedido #' + id + ' avançou para ' + proximo + '!');
}

/* ── Toggle Modo Pico ── */
function togglePico() {
  picoAtivo = !picoAtivo;

  const btn    = document.getElementById('pico-btn');
  const mode   = document.getElementById('pico-mode');
  const label  = document.getElementById('pico-label');
  const banner = document.getElementById('pico-banner');

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
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.getAttribute('data-action');
  if (action === 'avancar')     { avancarCard(btn.getAttribute('data-id')); }
  if (action === 'toggle-pico') { togglePico(); }
});

/* ── Init ── */
updateStats();