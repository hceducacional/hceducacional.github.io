/* =========================================================
   PLATAFORMA DE INFORMÁTICA — teclado virtual ABNT2
   (o mesmo padrão dos computadores do polo)

   - cada área de dedo tem uma cor (como nos teclados de treino);
   - destaca a próxima tecla e diz qual dedo deve apertá-la;
   - pisca verde no acerto e vermelho no erro.
   Usado pelo curso/licao.js: HC_teclado(container) → { target(ch), flash(ch, ok), layout() }.
   ========================================================= */
(() => {
  /* [id, rótulo de cima, rótulo de baixo, largura] — id é o caractere sem Shift */
  const ROWS = [
    [["'", '"', "'"], ['1', '!', '1'], ['2', '@', '2'], ['3', '#', '3'], ['4', '$', '4'], ['5', '%', '5'], ['6', '¨', '6'], ['7', '&', '7'], ['8', '*', '8'], ['9', '(', '9'], ['0', ')', '0'], ['-', '_', '-'], ['=', '+', '='], ['backspace', '', 'apagar ⌫', 2]],
    [['tab', '', 'tab ⇥', 1.5], ['q'], ['w'], ['e'], ['r'], ['t'], ['y'], ['u'], ['i'], ['o'], ['p'], ['´', '`', '´'], ['[', '{', '['], ['enter', '', 'enter ⏎', 1.5]],
    [['caps', '', 'caps lock', 1.75], ['a'], ['s'], ['d'], ['f'], ['g'], ['h'], ['j'], ['k'], ['l'], ['ç'], ['~', '^', '~'], [']', '}', ']'], ['enter', '', '', 1.25]],
    [['shiftl', '', '⇧ shift', 1.25], ['\\', '|', '\\'], ['z'], ['x'], ['c'], ['v'], ['b'], ['n'], ['m'], [',', '<', ','], ['.', '>', '.'], [';', ':', ';'], ['/', '?', '/'], ['shiftr', '', '⇧ shift', 1.75]],
    [['ctrll', '', 'ctrl', 1.5], ['win', '', '', 1.25], ['alt', '', 'alt', 1.25], [' ', '', '', 7], ['altgr', '', 'alt gr', 1.25], ['menu', '', '', 1.25], ['ctrlr', '', 'ctrl', 1.5]],
  ];
  /* dedo de cada tecla (digitação com os dez dedos) */
  const FINGERS = {
    lp: "' 1 q a z \\ tab caps shiftl ctrll", lr: '2 w s x', lm: '3 e d c', li: '4 5 r t f g v b',
    ri: '6 7 y u h j n m', rm: '8 i k ,', rr: '9 o l .', rp: '0 - = p ´ [ ç ~ ] ; / shiftr enter backspace',
  };
  const FINGER_OF = {};
  Object.entries(FINGERS).forEach(([f, keys]) => keys.split(' ').forEach((k) => { FINGER_OF[k] = f; }));
  FINGER_OF[' '] = 'rt';
  const FNAME = { lp: 'mínimo esquerdo', lr: 'anelar esquerdo', lm: 'médio esquerdo', li: 'indicador esquerdo', lt: 'polegar', rt: 'polegar', ri: 'indicador direito', rm: 'médio direito', rr: 'anelar direito', rp: 'mínimo direito' };
  const SHIFTED = { '"': "'", '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '¨': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=', '`': '´', '{': '[', '^': '~', '}': ']', '|': '\\', '<': ',', '>': '.', ':': ';', '?': '/' };
  const idOf = (ch) => {
    if (ch == null) return null;
    if (ch === ' ' || ch === 'Spacebar') return ' ';
    const k = String(ch);
    if (k.length > 1) return k.toLowerCase(); // enter, backspace, tab…
    return SHIFTED[k] || k.toLowerCase();
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function HC_teclado(container) {
    const wrap = document.createElement('div');
    wrap.className = 'kb';
    wrap.innerHTML = `
      <div class="kb-board">
        ${ROWS.map((row) => `<div class="kb-row">${row.map(([id, top, bottom, w = 1]) => {
          const letter = top === undefined; // letras: só o id (q, w, e…)
          const f = id.length === 1 && id !== ' ' ? FINGER_OF[id] : ''; // cor da área de cada dedo
          return `<span class="kb-key${letter ? ' letter' : ''}${id.length > 1 ? ' mod' : ''}${'fj'.includes(id) && id.length === 1 ? ' nub' : ''}"${f ? ` data-f="${f}"` : ''} data-id="${esc(id)}" style="--w:${w}">${letter ? `<b>${esc(id.toUpperCase())}</b>` : `${top ? `<small>${esc(top)}</small>` : ''}<b>${esc(bottom)}</b>`}</span>`;
        }).join('')}</div>`).join('')}
      </div>
      <p class="kb-finger" aria-live="polite"></p>`;
    container.appendChild(wrap);
    const fingerTxt = wrap.querySelector('.kb-finger');
    const keysOf = (id) => [...wrap.querySelectorAll('.kb-key')].filter((k) => k.dataset.id === id);
    let current = null; // id da tecla alvo

    /* tecla alvo: acende a tecla e diz qual dedo usar */
    function target(ch) {
      const id = idOf(ch);
      if (id === current) return;
      current = id;
      wrap.querySelectorAll('.kb-key.target').forEach((k) => k.classList.remove('target'));
      if (id) keysOf(id).forEach((k) => k.classList.add('target'));
      const fid = id ? FINGER_OF[id] : null;
      fingerTxt.innerHTML = id && fid ? `Use o <b>${FNAME[fid]}</b>` : '';
    }

    /* tecla apertada: pisca verde (acerto) ou vermelho (erro) */
    function flash(ch, ok) {
      const id = idOf(ch); if (!id) return;
      keysOf(id).forEach((k) => { k.classList.remove('hit', 'miss'); void k.offsetWidth; k.classList.add(ok ? 'hit' : 'miss'); setTimeout(() => k.classList.remove('hit', 'miss'), 260); });
    }

    return { el: wrap, target, flash, layout: () => {}, destroy: () => {} };
  }

  window.HC_teclado = HC_teclado;
  window.HC_tecladoIdOf = idOf;
})();
