/* =========================================================
   SETOR PEDAGÓGICO — aviso ao vivo no cabeçalho (só no computador)
   Para quem tem a tag "Setor pedagógico" (painel de Usuários). O site
   confere a cada 15 s se chegou agendamento novo; quando chega, o nome
   do instituto dá lugar a uma pílula que cresce da esquerda para a
   direita avisando que há agendamentos para analisar. Ela fica fixa
   (também ao abrir o site) até todos serem confirmados no painel.
   Toca um som curto quando a pílula aparece e a cada agendamento novo.
   Não é aviso no celular (push): só aparece com o site aberto.
   Dados vêm da função pedagogico_feed (supabase/15-setor-pedagogico.sql).
   ========================================================= */
(() => {
  const EVERY = 15000;
  const DESKTOP = () => matchMedia('(min-width: 861px)').matches;
  const eligible = () => !!(sb && auth.user && auth.profile?.pedagogico && auth.profile?.status === 'approved' && DESKTOP());

  // a pílula fica fixa enquanto houver agendamento aguardando confirmação;
  // só some quando todos forem confirmados (ou cancelados) no painel
  let baseline = null, lastPending = 0, timer = null, busy = false, broken = false;
  const bar = document.querySelector('.topbar');
  const title = bar?.querySelector('.tb-title');
  if (!bar || !title) return;

  const box = document.createElement('div');
  box.className = 'pd'; box.id = 'pd'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite');
  title.after(box);

  const firstName = (n) => String(n || '').trim().split(/\s+/)[0] || 'Um aluno';
  const kindTxt = (k) => (k === 'tutoria' ? 'Tutoria presencial' : 'Prova');
  const plural = (n) => (n === 1 ? '1 agendamento para analisar' : `${n} agendamentos para analisar`);

  function paint(head, sub, count) {
    const link = isAdmin();
    box.innerHTML = `
      <${link ? 'a href="#agendar/painel"' : 'div'} class="pd-pill${link ? ' link' : ''}" ${link ? 'title="Abrir os agendamentos para confirmar"' : ''}>
        <span class="pd-bell" aria-hidden="true">${icon('bell')}</span>
        <span class="pd-text"><b>${esc(head)}</b><small>${esc(sub)}</small></span>
        <span class="pd-count" aria-label="${esc(plural(count))}">${count}</span>
        ${link ? `<span class="pd-go" aria-hidden="true">${icon('right')}</span>` : ''}
      </${link ? 'a' : 'div'}>`;
  }

  /* som de aviso: três notas graves e longas, feito pelo próprio navegador (sem arquivo).
     O navegador só libera som depois do primeiro clique ou tecla na página;
     se o aviso chegar antes disso, o som toca no primeiro clique. */
  let actx = null, owed = false;
  function chime() {
    try {
      actx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state !== 'running') { owed = true; actx.resume().catch(() => {}); return; }
      owed = false;
      const t0 = actx.currentTime + 0.02;
      const out = actx.createGain(); out.gain.value = 0.3; out.connect(actx.destination);
      // três notas graves (ré, lá, ré), com eco longo, como um sino suave
      [[293.66, 0], [440, 0.2], [587.33, 0.4]].forEach(([f, d]) => {
        [[f, 1], [f * 2, 0.12], [f * 3, 0.04]].forEach(([hz, vol]) => {
          const o = actx.createOscillator(), g = actx.createGain();
          o.type = 'sine'; o.frequency.value = hz;
          g.gain.setValueAtTime(0, t0 + d);
          g.gain.linearRampToValueAtTime(vol, t0 + d + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 2.4);
          o.connect(g); g.connect(out); o.start(t0 + d); o.stop(t0 + d + 2.5);
        });
      });
    } catch (e) { /* navegador sem som: segue sem */ }
  }
  ['pointerdown', 'keydown'].forEach((ev) => document.addEventListener(ev, () => {
    if (!actx) return;
    actx.resume().then(() => { if (owed && bar.classList.contains('pd-on')) chime(); }).catch(() => {});
  }, { passive: true }));

  function show(head, sub, count, ring) {
    const opening = !bar.classList.contains('pd-on') && !bar.classList.contains('pd-out');
    if (opening || ring) chime();
    paint(head, sub, count);
    if (bar.classList.contains('pd-on') || bar.classList.contains('pd-out')) { // já aberta: troca o texto
      if (ring) { box.classList.remove('pd-bump'); void box.offsetWidth; box.classList.add('pd-bump'); }
      else box.querySelectorAll('.pd-pill, .pd-pill *').forEach((el) => { el.style.animation = 'none'; });
    } else {
      bar.classList.remove('pd-closing'); bar.classList.add('pd-out');
      setTimeout(() => { bar.classList.remove('pd-out'); bar.classList.add('pd-on'); }, 320);
    }
  }
  function hide() {
    if (!bar.classList.contains('pd-on')) { bar.classList.remove('pd-out'); box.innerHTML = ''; return; }
    bar.classList.add('pd-closing');
    setTimeout(() => { bar.classList.remove('pd-on', 'pd-closing'); box.innerHTML = ''; }, 420);
  }
  const summary = (n) => [n === 1 ? 'Há 1 agendamento para analisar' : `Há ${n} agendamentos para analisar`, 'Aguardando a sua confirmação'];

  async function tick() {
    if (busy || broken) return;
    if (!eligible()) { baseline = null; lastPending = 0; hide(); return; }
    busy = true;
    try {
      const { data, error } = await sb.rpc('pedagogico_feed');
      if (error) {
        if (/pedagogico_feed|function|schema cache/i.test(error.message || '')) { broken = true; console.warn('Setor pedagógico: rode o script 15-setor-pedagogico.sql no Supabase.'); }
        return;
      }
      const r = (data && data[0]) || { pending: 0, last_at: null };
      const n = r.pending || 0;
      const last = r.last_at ? new Date(r.last_at).getTime() : 0;
      const arrived = baseline !== null && last > baseline;
      if (last > (baseline || 0)) baseline = last;
      if (baseline === null) baseline = last;
      if (!n) { lastPending = 0; hide(); return; }
      if (arrived) show(`Novo agendamento de ${firstName(r.last_name)}`, `${kindTxt(r.last_kind)} · ${n} para analisar`, n, true);
      else if (n !== lastPending || !bar.classList.contains('pd-on')) show(...summary(n), n, false);
      lastPending = n;
    } catch (e) { /* sem internet: tenta de novo na próxima */ }
    finally { busy = false; }
  }

  function start() { clearInterval(timer); timer = setInterval(tick, EVERY); tick(); }
  window.pdKick = () => { broken = false; tick(); }; // quando muda quem está logado e ao confirmar no painel
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  matchMedia('(min-width: 861px)').addEventListener('change', tick);
  start();
})();
