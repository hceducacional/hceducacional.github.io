/* =========================================================
   PLATAFORMA DE INFORMÁTICA — LOJA DE ITENS (#informatica/loja)
   Aberta pelo botão "loja de itens" da tela de seleção (curso/menu.js). Mesmo visual do menu:
   fundo escuro com luzes de aurora e malha de pontinhos e a faixa branca na diagonal.
   - Faixa branca (vitrine): o item escolhido em destaque, o que ele faz, o preço e o botão
     Comprar / Equipar.
   - Lado escuro (prateleira): abas Personagens, Avatares e Parabéns, os itens e o que está equipado.
   O catálogo e o inventário ficam em curso/loja-itens.js (window.HC_loja); as moedas em HC_cash.
   Teclado: ← → escolhem o item, 1 2 3 trocam a aba, Enter compra ou equipa, Esc volta.
   ========================================================= */
(() => {
  const ICO = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z"/><path d="M9 12l2 2 4-4"/>',
    wand: '<path d="M15 4V2M15 10V8M11 6h2M17 6h2M4 20 14 10"/><path d="M19 13l1 1M19 1l1 1M11 1l-1 1"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    storm: '<path d="M7 16a5 5 0 1 1 1.6-9.7A6 6 0 0 1 20 9a4 4 0 0 1-1 7.9"/><path d="M13 12l-3 5h4l-3 5"/>',
    clock: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8Z"/>',
    magnet: '<path d="M6 3v8a6 6 0 0 0 12 0V3"/><path d="M6 7h4M14 7h4M10 3v8a2 2 0 0 0 4 0V3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>',
    bag: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[k] || ''}</svg>`;
  const COIN = 'assets/moeda/moeda.webp';
  const fmt = (v) => window.HC_cashFmt(v);
  const TABS = [
    { cat: 'personagens', nome: 'Personagens', tipo: 'Personagem com poder', slot: 'personagem' },
    { cat: 'avatares', nome: 'Avatares', tipo: 'Avatar', slot: 'avatar' },
    { cat: 'parabens', nome: 'Parabéns', tipo: 'Estilo do “Parabéns!”', slot: 'parabens' },
  ];
  const WORD = 'Parabéns!';
  const letters = (w) => [...w].map((c, n) => `<span class="lr-ch" style="--n:${n}">${c}</span>`).join('');
  const mem = (k, v) => { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch {} return null; };

  let run = 0;
  function render(view, d) {
    const id = ++run;
    const H = window.HC_loja, C = window.HC_cash;
    const items = (cat) => H.ALL.filter((x) => x.cat === cat); // itens de uma aba (com cat e slot)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const S = window.HC_menu?.SCENES || [{ b: '16 20 38', a1: '56 189 248', a2: '167 139 250', a3: '244 114 182' }];
    const sc = S[Math.floor(Math.random() * S.length)];
    let tab = Math.max(0, TABS.findIndex((t) => t.cat === mem('hc:lj:tab')));
    const sel = {}; // item escolhido em cada aba
    TABS.forEach((t) => { sel[t.cat] = mem('hc:lj:sel:' + t.cat) || items(t.cat)[0]?.id; });
    let shown = 0; // saldo mostrado na carteira (para contar até o novo valor)

    /* ---------- pedaços de HTML ---------- */
    const status = (it) => (H.equipped(it.slot)?.id === it.id ? 'eq' : H.owns(it.id) ? 'own' : 'buy');
    const priceTag = (v) => `<span class="lj-price"><img src="${COIN}" alt="" draggable="false">${fmt(v)}</span>`;
    const tileFoot = (it) => ({ eq: `<span class="lj-badge eq">${svg('check')}Equipado</span>`, own: '<span class="lj-badge own">No inventário</span>', buy: priceTag(it.preco) }[status(it)]);
    const tileArt = (it) => it.cat === 'personagens'
      ? `<span class="lj-ta-shape"></span><img class="lj-ta-char" src="${it.img}" alt="" draggable="false" decoding="async"><span class="lj-ta-pw">${svg(H.PODERES[it.poder]?.ico)}</span>`
      : it.cat === 'avatares' ? `<span class="lj-ta-av">${H.avatarSVG(it)}</span>`
        : `<span class="lj-ta-pb" style="--f1:${it.fundo[0]};--f2:${it.fundo[1]}"><b class="hcpb hcpb-${it.estilo}">${letters(WORD)}</b></span>`;
    const tile = (it, i) => `
      <button class="lj-tile k-${it.cat}" type="button" role="option" data-id="${it.id}" aria-selected="false" style="--i:${i};--c1:${it.cores?.[0] || '#93c5fd'};--c2:${it.cores?.[1] || '#2563eb'}">
        <span class="lj-tile-art">${tileArt(it)}</span>
        <span class="lj-tile-name">${esc(it.nome)}</span>
        <span class="lj-tile-foot">${tileFoot(it)}</span>
      </button>`;
    const stageHTML = (it) => {
      if (it.cat === 'personagens') {
        const pd = H.PODERES[it.poder];
        return `<div class="lj-st k-p" style="--c1:${it.cores[0]};--c2:${it.cores[1]}">
          <span class="lj-st-glow"></span><span class="lj-st-shape"><i class="lj-st-shine"></i></span><span class="lj-st-ring"></span>
          <img class="lj-st-char" src="${it.img}" alt="" draggable="false">
          <span class="lj-st-pw" title="${esc(pd?.nome || '')}">${svg(pd?.ico)}</span>
          ${[0, 1, 2, 3, 4].map((k) => `<i class="lj-st-spk" style="--k:${k}"></i>`).join('')}
        </div>`;
      }
      if (it.cat === 'avatares') return `<div class="lj-st k-a"><span class="lj-st-orbit"></span><span class="lj-st-av">${H.avatarSVG(it)}</span>${[0, 1, 2, 3, 4].map((k) => `<i class="lj-st-spk" style="--k:${k}"></i>`).join('')}</div>`;
      return `<div class="lj-st k-b" style="--f1:${it.fundo[0]};--f2:${it.fundo[1]}"><span class="lj-st-rays">${[0, 1, 2, 3, 4, 5].map((k) => `<i style="--k:${k}"></i>`).join('')}</span><b class="lj-st-word hcpb hcpb-${it.estilo}">${letters(WORD)}</b><small>como fica na tela final das lições</small></div>`;
    };
    const infoHTML = (it) => {
      const t = TABS.find((x) => x.cat === it.cat), st = status(it), pd = it.cat === 'personagens' ? H.PODERES[it.poder] : null;
      const action = st === 'buy'
        ? `${priceTag(it.preco)}<button class="lj-btn buy" type="button" data-act="buy">${svg('bag')}Comprar</button>`
        : st === 'own' ? `<span class="lj-have">${svg('check')}Você já tem</span><button class="lj-btn equip" type="button" data-act="equip">Equipar</button>`
          : `<span class="lj-have on">${svg('check')}Equipado</span><button class="lj-btn off" type="button" data-act="off">Tirar</button>`;
      return `
        <span class="lj-kind">${t.tipo}</span>
        <h2 class="lj-name">${esc(it.nome)}</h2>
        ${it.frase ? `<p class="lj-frase">${esc(it.frase)}</p>` : ''}
        ${pd ? `<div class="lj-power" style="--c1:${it.cores[0]};--c2:${it.cores[1]}"><span class="lj-pw-ico">${svg(pd.ico)}</span><div><b>${esc(pd.nome)}</b><p>${esc(pd.desc)}</p>
          <span class="lj-chips">${it.dur ? `<i>${svg('timer')}${it.dur} s de poder</i>` : `<i>${svg('bolt')}age na hora</i>`}<i>${svg('refresh')}recarrega em ${it.recarga} s</i></span></div></div>
          <p class="lj-note">Equipe e use o poder nas lições de teclado: clique no cartão do personagem ou aperte <kbd>Ctrl</kbd> + <kbd>Enter</kbd>.</p>` : ''}
        ${it.cat === 'avatares' ? '<p class="lj-note">O avatar equipado aparece no lugar da sua foto em toda a Plataforma de Informática.</p>' : ''}
        ${it.cat === 'parabens' ? '<p class="lj-note">O estilo equipado aparece na palavra “Parabéns!” quando você termina uma lição.</p>' : ''}
        <div class="lj-act">${action}</div>`;
    };
    const eqSlot = (t, k) => {
      const it = H.equipped(t.slot);
      const art = !it ? (t.slot === 'avatar' ? H.avatar(d.perfil, 'lj-eq-av') : `<span class="lj-eq-none">${t.slot === 'parabens' ? 'Aa' : '—'}</span>`)
        : t.slot === 'personagem' ? `<span class="lj-eq-char" style="--c1:${it.cores[0]};--c2:${it.cores[1]}"><img src="${it.img}" alt="" draggable="false"></span>`
          : t.slot === 'avatar' ? H.avatar(d.perfil, 'lj-eq-av') : `<span class="lj-eq-pb" style="--f1:${it.fundo[0]};--f2:${it.fundo[1]}"><b class="hcpb hcpb-${it.estilo}">${letters('Aa')}</b></span>`;
      const nome = it ? it.nome : t.slot === 'personagem' ? 'Nenhum' : t.slot === 'avatar' ? 'Sua foto' : 'Padrão';
      return `<button class="lj-eq-slot" type="button" data-tab="${k}" data-slot="${t.slot}"><span class="lj-eq-art">${art}</span><span class="lj-eq-txt"><small>${t.slot === 'personagem' ? 'Personagem' : t.slot === 'avatar' ? 'Avatar' : 'Parabéns'}</small><b>${esc(nome)}</b></span></button>`;
    };

    view.innerHTML = `
    <section class="lj${reduce ? ' still' : ''}" aria-label="Loja de itens da Plataforma de Informática">
      <div class="lj-bg" aria-hidden="true"><div class="ifm-sky on" style="--b:${sc.b};--a1:${sc.a1};--a2:${sc.a2};--a3:${sc.a3}"></div><div class="ifm-dots"></div></div>
      <div class="lj-white" aria-hidden="true"></div>

      <div class="lj-show">
        <a class="lj-back" href="#informatica">${svg('back')}Voltar</a>
        <h1 class="lj-title">loja de itens</h1>
        <div class="lj-stage" aria-hidden="true"><div class="lj-stage-in"></div><div class="lj-fx"></div></div>
        <div class="lj-info" aria-live="polite"></div>
      </div>

      <div class="lj-shelf">
        <div class="lj-wallet" role="status" aria-label="Saldo HC">
          <span class="lj-coin" aria-hidden="true"><i class="lj-coin-glow"></i><img src="${COIN}" alt="" draggable="false"></span>
          <span class="lj-wal-txt"><small>Saldo HC</small><b class="lj-cash">0,00</b></span>
          <span class="lj-wal-tip" aria-live="assertive"></span>
        </div>
        <nav class="lj-tabs" role="tablist" aria-label="Tipos de item"><i class="lj-tab-pill" aria-hidden="true"></i>
          ${TABS.map((t, k) => `<button class="lj-tab" type="button" role="tab" data-tab="${k}" aria-selected="false">${t.nome}<small>${items(t.cat).length}</small></button>`).join('')}
        </nav>
        <div class="lj-grid" role="listbox" aria-label="Itens"></div>
        <div class="lj-eq" aria-label="Equipados"><p class="lj-eq-t">Equipados</p><div class="lj-eq-row"></div></div>
      </div>

      <p class="lj-hint"><kbd>←</kbd><kbd>→</kbd> escolher · <kbd>Enter</kbd> comprar ou equipar · <kbd>Esc</kbd> voltar</p>
      <div class="lj-modal" hidden></div>
    </section>`;

    const stage = view.querySelector('.lj');
    const $ = (s) => stage.querySelector(s);
    const alive = () => id === run && stage.isConnected;
    const grid = $('.lj-grid'), info = $('.lj-info'), stIn = $('.lj-stage-in'), fx = $('.lj-fx'), cashEl = $('.lj-cash'), wallet = $('.lj-wallet'), modal = $('.lj-modal');
    const replay = (el, cls) => { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
    const cur = () => H.find(sel[TABS[tab].cat]);

    /* ---------- saldo: conta até o valor (subindo na entrada, descendo ao gastar) ---------- */
    let cashRaf = 0;
    function cashTo(to, ms = 1100) {
      cancelAnimationFrame(cashRaf);
      const from = shown; shown = to;
      if (reduce || from === to) { cashEl.textContent = fmt(to); return; }
      const t0 = performance.now();
      const step = (t) => {
        if (!alive()) return;
        const k = Math.min(1, (t - t0) / ms), e = 1 - (1 - k) ** 3;
        cashEl.textContent = fmt(from + (to - from) * e);
        if (k < 1) cashRaf = requestAnimationFrame(step);
      };
      cashRaf = requestAnimationFrame(step);
    }

    /* ---------- desenha ---------- */
    function paintTabs() {
      stage.querySelectorAll('.lj-tab').forEach((b, k) => { b.classList.toggle('on', k === tab); b.setAttribute('aria-selected', k === tab); });
      const b = stage.querySelectorAll('.lj-tab')[tab], pill = $('.lj-tab-pill');
      if (b) { pill.style.width = `${b.offsetWidth}px`; pill.style.transform = `translateX(${b.offsetLeft}px)`; }
    }
    function paintGrid(anim) {
      const t = TABS[tab];
      grid.className = `lj-grid g-${t.cat}${anim ? ' enter' : ''}`;
      grid.innerHTML = items(t.cat).map(tile).join('');
      grid.querySelectorAll('.lj-tile').forEach((b) => {
        b.addEventListener('click', () => pick(b.dataset.id, true));
        b.addEventListener('dblclick', () => primary());
      });
      markSel();
    }
    function markSel() {
      grid.querySelectorAll('.lj-tile').forEach((b) => { const on = b.dataset.id === sel[TABS[tab].cat]; b.classList.toggle('sel', on); b.setAttribute('aria-selected', on); });
    }
    function paintShow(anim) {
      const it = cur(); if (!it) return;
      stIn.innerHTML = stageHTML(it);
      info.innerHTML = infoHTML(it);
      if (anim) { replay(stIn, 'swap'); replay(info, 'swap'); }
      info.querySelector('[data-act]')?.addEventListener('click', primary);
    }
    function paintEq(popSlot) {
      $('.lj-eq-row').innerHTML = TABS.map(eqSlot).join('');
      stage.querySelectorAll('.lj-eq-slot').forEach((b) => {
        b.addEventListener('click', () => { const k = +b.dataset.tab, it = H.equipped(b.dataset.slot); setTab(k); if (it) pick(it.id); });
        if (popSlot && b.dataset.slot === popSlot) replay(b, 'pop');
      });
    }
    function refreshTile(itId) {
      const b = grid.querySelector(`.lj-tile[data-id="${itId}"]`); if (!b) return;
      const it = H.find(itId);
      b.querySelector('.lj-tile-foot').innerHTML = tileFoot(it);
      replay(b.querySelector('.lj-tile-foot'), 'pop');
    }
    function setTab(k) {
      if (k === tab && grid.children.length) return;
      tab = k; mem('hc:lj:tab', TABS[k].cat);
      paintTabs(); paintGrid(true); paintShow(true);
    }
    function pick(itId, fromTap) {
      const cat = TABS[tab].cat;
      if (sel[cat] === itId) return;
      sel[cat] = itId; mem('hc:lj:sel:' + cat, itId);
      markSel(); paintShow(true);
      if (matchMedia('(max-width: 860px)').matches && fromTap) $('.lj-stage').scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); // celular: sobe até a vitrine (onde fica o botão)
      else grid.querySelector('.lj-tile.sel')?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }

    /* ---------- ação principal: comprar, equipar ou tirar ---------- */
    function primary() {
      const it = cur(); if (!it || !modal.hidden) return;
      const st = status(it);
      if (st === 'buy') return askBuy(it);
      if (st === 'own') return doEquip(it);
      H.equip(it.slot, null);
      paintShow(false); refreshTile(it.id); paintEq(it.slot);
      if (it.slot === 'avatar') replay($('.lj-eq'), 'flash');
    }
    function noMoney(it) {
      const falta = Math.max(0.01, it.preco - C.get().saldo);
      const btn = info.querySelector('.lj-btn');
      replay(btn, 'shake'); replay(wallet, 'low');
      const tip = $('.lj-wal-tip');
      tip.innerHTML = `Saldo insuficiente: faltam <b>${fmt(falta)}</b> moedas`;
      replay(tip, 'show'); clearTimeout(tip._t); tip._t = setTimeout(() => tip.classList.remove('show'), 3200);
    }
    function askBuy(it) {
      const saldo = C.get().saldo;
      if (saldo < it.preco) return noMoney(it);
      const t = TABS.find((x) => x.cat === it.cat);
      modal.innerHTML = `
        <div class="lj-m-back" data-m="no"></div>
        <div class="lj-mbox" role="dialog" aria-modal="true" aria-labelledby="lj-m-t">
          <span class="lj-m-art k-${it.cat}" style="--c1:${it.cores?.[0] || '#93c5fd'};--c2:${it.cores?.[1] || '#2563eb'}">${tileArt(it)}</span>
          <h3 id="lj-m-t">Comprar ${esc(it.nome)}?</h3>
          <p class="lj-m-sub">${t.tipo}${it.poder ? ` · ${esc(H.PODERES[it.poder].nome)}` : ''}</p>
          <dl class="lj-m-calc">
            <dt>Seu saldo</dt><dd>${fmt(saldo)}</dd>
            <dt>Preço</dt><dd class="neg">− ${fmt(it.preco)}</dd>
            <dt class="tot">Saldo depois</dt><dd class="tot">${fmt(saldo - it.preco)}</dd>
          </dl>
          <div class="lj-m-acts"><button class="lj-mb no" type="button" data-m="no">Cancelar</button><button class="lj-mb ok" type="button" data-m="ok">Comprar <span><img src="${COIN}" alt="" draggable="false">${fmt(it.preco)}</span></button></div>
        </div>`;
      modal.hidden = false; replay(modal, 'open');
      modal.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => closeModal(b.dataset.m === 'ok' ? it : null)));
      modal.querySelector('.lj-mb.ok').focus({ preventScroll: true });
    }
    function closeModal(buyIt) {
      if (modal.hidden) return;
      modal.classList.remove('open'); modal.classList.add('close');
      setTimeout(() => { if (!alive()) return; modal.hidden = true; modal.classList.remove('close'); modal.innerHTML = ''; }, reduce ? 0 : 220);
      if (buyIt) doBuy(buyIt);
    }
    function doBuy(it) {
      const before = C.get().saldo, r = H.buy(it.id);
      if (!r.ok) return r.motivo === 'saldo' ? noMoney(it) : toast('Não foi possível comprar agora.');
      // moedas saem da carteira e voam até o item; o saldo desce contando
      flyCoins(); cashTo(C.get().saldo, 1300);
      const minus = document.createElement('span'); minus.className = 'lj-minus'; minus.textContent = `− ${fmt(before - C.get().saldo)}`;
      wallet.append(minus); setTimeout(() => minus.remove(), 1800);
      replay(wallet, 'spend');
      setTimeout(() => {
        if (!alive()) return;
        burst('buy', 'Novo!');
        paintShow(false); refreshTile(it.id);
        info.querySelector('.lj-btn')?.focus({ preventScroll: true });
      }, reduce ? 0 : 700);
    }
    function doEquip(it) {
      if (!H.equip(it.slot, it.id)) return;
      // o item que estava equipado neste espaço volta a "No inventário"
      grid.querySelectorAll('.lj-tile').forEach((b) => { if (b.dataset.id !== it.id) b.querySelector('.lj-tile-foot').innerHTML = tileFoot(H.find(b.dataset.id)); });
      burst('equip', 'Equipado!');
      paintShow(false); refreshTile(it.id); paintEq(it.slot);
    }

    /* ---------- efeitos ---------- */
    function burst(kind, word) {
      if (reduce) return;
      fx.className = 'lj-fx';
      fx.innerHTML = `<i class="lj-fx-flash"></i><i class="lj-fx-ring"></i><i class="lj-fx-ring r2"></i>${Array.from({ length: 14 }, (_, k) => `<i class="lj-fx-spark" style="--a:${k * (360 / 14)}deg;--d:${(k % 3) * 60}ms"></i>`).join('')}<b class="lj-fx-word">${word}</b>`;
      void fx.offsetWidth; fx.classList.add('go', kind);
      replay(stIn, 'hop');
      clearTimeout(fx._t); fx._t = setTimeout(() => { if (alive()) { fx.className = 'lj-fx'; fx.innerHTML = ''; } }, 1800);
    }
    function flyCoins() {
      if (reduce) return;
      const a = wallet.querySelector('.lj-coin').getBoundingClientRect(), b = $('.lj-stage').getBoundingClientRect();
      const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
      for (let k = 0; k < 12; k++) {
        const c = document.createElement('img');
        c.src = `assets/moeda/p${(k % 12) + 1}.webp`; c.alt = ''; c.className = 'lj-fly';
        stage.append(c);
        const x1 = b.left + b.width * (.3 + Math.random() * .4), y1 = b.top + b.height * (.35 + Math.random() * .3);
        const mx = (x0 + x1) / 2 + (Math.random() - .5) * 160, my = Math.min(y0, y1) - 90 - Math.random() * 120;
        const sr = stage.getBoundingClientRect(), ox = sr.left, oy = sr.top;
        c.animate([
          { transform: `translate(${x0 - ox}px, ${y0 - oy}px) scale(.4) rotate(0deg)`, opacity: 0 },
          { transform: `translate(${x0 - ox}px, ${y0 - oy}px) scale(1) rotate(30deg)`, opacity: 1, offset: .12 },
          { transform: `translate(${mx - ox}px, ${my - oy}px) scale(1.15) rotate(200deg)`, opacity: 1, offset: .55 },
          { transform: `translate(${x1 - ox}px, ${y1 - oy}px) scale(.35) rotate(400deg)`, opacity: 0 },
        ], { duration: 820 + k * 40, delay: k * 55, easing: 'cubic-bezier(.45,.05,.4,1)', fill: 'both' }).onfinish = () => c.remove();
      }
    }

    /* ---------- eventos ---------- */
    stage.querySelectorAll('.lj-tab').forEach((b) => b.addEventListener('click', () => setTab(+b.dataset.tab)));
    const onKey = (e) => {
      if (!alive()) return document.removeEventListener('keydown', onKey);
      if (e.target.closest?.('input, textarea, select, [contenteditable]') || e.ctrlKey || e.metaKey || e.altKey) return;
      if (!modal.hidden) {
        if (e.key === 'Escape') { e.preventDefault(); closeModal(null); }
        return; // dentro da confirmação, Enter aperta o botão focado
      }
      const list = items(TABS[tab].cat), at = list.findIndex((x) => x.id === sel[TABS[tab].cat]);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); pick(list[(at + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length].id); }
      else if (/^[123]$/.test(e.key)) { e.preventDefault(); setTab(+e.key - 1); }
      else if (e.key === 'Enter' && !e.target.closest?.('a, button:not(.lj-tile)')) { e.preventDefault(); primary(); }
      else if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); location.hash = '#informatica'; }
    };
    document.addEventListener('keydown', onKey);
    const onResize = () => { if (!alive()) return removeEventListener('resize', onResize); paintTabs(); };
    addEventListener('resize', onResize);

    /* ---------- entrada ---------- */
    paintGrid(false); paintShow(false); paintEq(); paintTabs();
    if (reduce) { stage.classList.add('in'); cashTo(C.get().saldo); return; }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!alive()) return;
      stage.classList.add('in'); paintTabs();
      setTimeout(() => { if (alive()) { cashTo(C.get().saldo, 1200); stage.classList.add('go'); } }, 450);
      setTimeout(() => { if (alive()) stage.classList.add('settled'); }, 1100);
    }));
  }

  window.HC_loja_tela = { render };
})();
