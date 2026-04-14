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

/* ── Atualiza contadores no topo e títulos das colunas ── */
function updateStats() {
  document.getElementById('count-pendentes').textContent  = contadores.pendente;
  document.getElementById('count-preparando').textContent = contadores.preparando;
  document.getElementById('count-prontos').textContent    = contadores.pronto;

  document.getElementById('title-pendentes').textContent  = 'Pendentes ('  + contadores.pendente   + ')';
  document.getElementById('title-preparando').textContent = 'Preparando (' + contadores.preparando + ')';
  document.getElementById('title-prontos').textContent    = 'Prontos ('    + contadores.pronto     + ')';

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

  /* Remove do estado atual */
  contadores[estadoAtual]--;
  card.remove();

  /* Se for "concluido", apenas remove da tela */
  if (proximo === 'concluido') {
    updateStats();
    showToast('Pedido #' + id + ' concluído!');
    return;
  }

  /* Monta o novo card no estado seguinte */
  const nome     = card.getAttribute('data-nome');
  const itens    = card.getAttribute('data-itens').split('|');
  const endereco = card.getAttribute('data-endereco');
  const valor    = card.getAttribute('data-valor');

  const badgeConfig = {
    preparando: { cls: 'blue',  txt: '📦 Preparando', lista: 'list-preparando' },
    pronto:     { cls: 'green', txt: '✅ Pronto',     lista: 'list-prontos'    }
  };

  const cfg = badgeConfig[proximo];

  const novoCard = document.createElement('div');
  novoCard.className = 'card';
  novoCard.id = 'card-' + id;
  novoCard.setAttribute('data-estado', proximo);
  novoCard.setAttribute('data-nome', nome);
  novoCard.setAttribute('data-itens', card.getAttribute('data-itens'));
  novoCard.setAttribute('data-endereco', endereco);
  novoCard.setAttribute('data-valor', valor);

  const itensHTML = itens.map(function (item) {
    const partes = item.trim().split(' ');
    const qty = partes[0];
    const desc = partes.slice(1).join(' ');
    return '<div class="item-row"><span class="item-qty">' + qty + '</span> ' + desc + '</div>';
  }).join('');

  const botaoAvancar = proximo !== 'pronto'
    ? '<button class="btn orange" data-action="avancar" data-id="' + id + '">Avançar</button>'
    : '';

  novoCard.innerHTML =
    '<div class="card-header">' +
      '<div class="card-header-left">' +
        '<span class="card-id">#' + id + '</span>' +
        '<span class="badge ' + cfg.cls + '">' + cfg.txt + '</span>' +
      '</div>' +
      '<div class="timer">🕐 agora</div>' +
    '</div>' +
    '<div class="customer-name">👤 ' + nome + '</div>' +
    '<div class="itens-list">' + itensHTML + '</div>' +
    '<div class="address-row">📍 ' + endereco + '</div>' +
    '<div class="card-footer">' +
      '<span class="price green">$ ' + valor + '</span>' +
      botaoAvancar +
    '</div>';

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
  if (action === 'avancar')      { avancarCard(btn.getAttribute('data-id')); }
  if (action === 'toggle-pico')  { togglePico(); }
});

/* ── Init ── */
updateStats();