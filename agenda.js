/* =========================================================
   AGENDAR — provas e tutoria presencial
   Formulário público (sem precisar de conta) e painel para administradores.
   As regras de dias, turnos e vagas também são conferidas no banco
   (supabase/04-agendamentos.sql), então ninguém agenda além do limite.
   ========================================================= */
const AG = {
  kinds: {
    prova: { label: 'Prova presencial', short: 'Prova', sub: 'Seg, ter, qui, sex e sáb (manhã) · 6 vagas por turno', cap: 6,
      days: { 1: ['manha', 'tarde'], 2: ['manha', 'tarde'], 4: ['manha', 'tarde'], 5: ['manha', 'tarde'], 6: ['manha'] } },
    tutoria: { label: 'Tutoria presencial', short: 'Tutoria', sub: 'Ter, qui, sex e sáb (manhã) · 2 vagas por turno', cap: 2,
      days: { 2: ['manha', 'tarde'], 4: ['manha', 'tarde'], 5: ['manha', 'tarde'], 6: ['manha'] } },
  },
  shifts: { manha: { label: 'Manhã', time: '08h30', start: 510 }, tarde: { label: 'Tarde', time: '14h30', start: 870 } },
  colleges: ['Unifaveni', 'Uniabeu', 'Futura', 'Dom Alberto'],
  phone: '5598984861475', phoneTxt: '98 98486-1475',
  address: 'Rua Santa Cruz, São Bernardo, Humberto de Campos – MA', manager: 'Adriane Carvalho',
  maxDays: 120,
};
const AG_STATUS = { confirmado: 'Confirmado', compareceu: 'Compareceu', faltou: 'Não compareceu', cancelado: 'Cancelado' };
const MESES_AG = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/* datas no fuso do polo (Maranhão) */
function agNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Fortaleza', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, min: +p.hour * 60 + +p.minute };
}
const isoAdd = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const dow = (iso) => new Date(iso + 'T12:00:00').getDay();
const brDate = (iso) => iso ? iso.split('-').reverse().join('/') : '';
const cpfDigits = (v) => String(v || '').replace(/\D/g, '').slice(0, 11);
const cpfMask = (v) => { const d = cpfDigits(v); return d.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2'); };
function cpfOk(v) {
  const c = cpfDigits(v); if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const dv = (n) => { let s = 0; for (let i = 0; i < n; i++) s += +c[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
  return dv(9) === +c[9] && dv(10) === +c[10];
}

/* ---------- vagas e bloqueios ---------- */
const agData = { counts: new Map(), blocked: [], loaded: 0 };
async function agLoad(force) {
  if (!sb || (!force && Date.now() - agData.loaded < 20000)) return;
  const t = agNow().date;
  const [c, b] = await Promise.all([
    sb.rpc('slot_counts', { d1: t, d2: isoAdd(t, AG.maxDays) }),
    sb.from('blocked_dates').select('date, scope, reason').gte('date', t).order('date'),
  ]);
  agData.counts = new Map((c.data || []).map((r) => [`${r.date}|${r.kind}|${r.shift}`, r.used]));
  agData.blocked = b.data || [];
  agData.loaded = Date.now();
}
const agBlocked = (date, kind) => agData.blocked.find((b) => b.date === date && (b.scope === 'todos' || b.scope === kind));
/* situação de um turno: 'off' (não tem), 'past' (já começou), 'full' (lotado) ou o número de vagas livres */
function agShiftState(kind, date, shift) {
  const k = AG.kinds[kind]; if (!(k.days[dow(date)] || []).includes(shift)) return 'off';
  const now = agNow();
  if (date < now.date || (date === now.date && now.min >= AG.shifts[shift].start)) return 'past';
  const free = k.cap - (agData.counts.get(`${date}|${kind}|${shift}`) || 0);
  return free > 0 ? free : 'full';
}
function agDayOpen(kind, date) {
  const now = agNow();
  if (date < now.date || date > isoAdd(now.date, AG.maxDays) || agBlocked(date, kind)) return false;
  return ['manha', 'tarde'].some((s) => typeof agShiftState(kind, date, s) === 'number');
}

/* ---------- página pública ---------- */
const agForm = { kind: 'prova', date: '', shift: '', month: '' };
function renderAgenda(view) {
  const me = auth.user ? { name: auth.profile?.name || '' } : {};
  view.innerHTML = `
  <div class="wrap ag-page">
    <header class="ag-hero">
      <div class="ag-hero-glow" aria-hidden="true"><span></span><span></span></div>
      <p class="ag-kicker"><i data-icon="calendar"></i>Polo Humberto de Campos</p>
      <h1>Agende sua <span class="ap-grad">prova</span> ou <span class="ap-grad">tutoria</span> presencial.</h1>
      <p class="ag-lead">O agendamento é obrigatório para as provas presenciais e a tutoria presencial dos cursos de graduação. Escolha o tipo, a data e o turno disponíveis e compareça ao polo no horário marcado.</p>
    </header>

    <section class="ag-card" id="ag-box">
      <form id="ag-form" novalidate>
        <div class="ag-step"><span class="ag-n">1</span><h3>Tipo de agendamento</h3></div>
        <div class="ag-kinds" role="radiogroup" aria-label="Tipo de agendamento">
          ${Object.entries(AG.kinds).map(([k, v]) => `
            <button type="button" role="radio" class="ag-opt ${agForm.kind === k ? 'on' : ''}" data-kind="${k}" aria-checked="${agForm.kind === k}">
              <span class="ag-opt-ico"><i data-icon="${k === 'prova' ? 'report' : 'users'}"></i></span>
              <strong>${v.label}</strong><small>${v.sub}</small>
            </button>`).join('')}
        </div>

        <div class="ag-step"><span class="ag-n">2</span><h3>Seus dados</h3></div>
        <div class="ag-grid">
          <label class="ag-field full"><span>Nome completo</span><input id="ag-name" autocomplete="name" maxlength="120" placeholder="Seu nome completo" value="${esc(me.name || '')}"></label>
          <label class="ag-field"><span>CPF</span><input id="ag-cpf" inputmode="numeric" autocomplete="off" placeholder="000.000.000-00" maxlength="14"></label>
          <label class="ag-field"><span>Curso</span><input id="ag-course" maxlength="80" placeholder="Ex.: Pedagogia"></label>
          <div class="ag-field full"><span>Faculdade</span>
            <div class="ag-chips" role="radiogroup" aria-label="Faculdade">${AG.colleges.map((c) => `<button type="button" role="radio" aria-checked="false" data-college="${c}">${c}</button>`).join('')}</div>
          </div>
        </div>

        <div class="ag-step"><span class="ag-n">3</span><h3>Data e turno</h3></div>
        <div class="ag-when">
          <div class="ag-cal" id="ag-cal" aria-label="Escolha a data"></div>
          <div class="ag-shifts" id="ag-shifts"></div>
        </div>

        <p class="ag-msg" id="ag-msg" role="alert"></p>
        <button class="ag-submit" type="submit" id="ag-go">Confirmar agendamento</button>
      </form>
    </section>

    <section class="ag-polo">
      <h2>Polo Faveni HC</h2>
      <p>Informações de contato e localização</p>
      <div class="ag-info">
        <div><i data-icon="building"></i><span>Endereço do polo</span><strong>${AG.address}</strong></div>
        <div><i data-icon="phone"></i><span>WhatsApp de suporte</span><strong>${AG.phoneTxt}</strong></div>
        <div><i data-icon="user"></i><span>Gestora responsável</span><strong>${AG.manager}</strong></div>
      </div>
      <div class="ag-links">
        <a class="btn-dark" href="https://wa.me/${AG.phone}" target="_blank" rel="noopener">${WA_SVG}Falar com o suporte no WhatsApp</a>
        <a class="btn-soft" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(AG.address)}" target="_blank" rel="noopener"><i data-icon="external"></i>Ver no Google Maps</a>
      </div>
    </section>
  </div>`;
  paintIcons(view);

  const form = $('#ag-form');
  let college = '';
  const msg = (t) => { $('#ag-msg').textContent = t || ''; };
  const now = agNow();
  if (!agForm.month) agForm.month = now.date.slice(0, 7);

  const drawCal = () => {
    const [y, m] = agForm.month.split('-').map(Number);
    const first = `${agForm.month}-01`;
    const days = new Date(y, m, 0).getDate();
    const pad = dow(first);
    const minMonth = now.date.slice(0, 7), maxMonth = isoAdd(now.date, AG.maxDays).slice(0, 7);
    let cells = '';
    for (let i = 0; i < pad; i++) cells += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const iso = `${agForm.month}-${String(d).padStart(2, '0')}`;
      const open = agDayOpen(agForm.kind, iso);
      const bl = agBlocked(iso, agForm.kind);
      cells += `<button type="button" class="ag-day ${iso === agForm.date ? 'on' : ''} ${iso === now.date ? 'today' : ''} ${bl && iso >= now.date ? 'blocked' : ''}" data-date="${iso}" ${open ? '' : 'disabled'} title="${bl && iso >= now.date ? esc('Bloqueado' + (bl.reason ? ': ' + bl.reason : '')) : ''}">${d}</button>`;
    }
    $('#ag-cal').innerHTML = `
      <div class="ag-cal-head">
        <button type="button" class="ag-nav" data-mv="-1" ${agForm.month <= minMonth ? 'disabled' : ''} aria-label="Mês anterior"><i data-icon="left"></i></button>
        <strong>${MESES_AG[m - 1]} ${y}</strong>
        <button type="button" class="ag-nav" data-mv="1" ${agForm.month >= maxMonth ? 'disabled' : ''} aria-label="Próximo mês"><i data-icon="right"></i></button>
      </div>
      <div class="ag-wk">${['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((w) => `<span>${w}</span>`).join('')}</div>
      <div class="ag-days">${cells}</div>`;
    paintIcons($('#ag-cal'));
  };
  const drawShifts = () => {
    const box = $('#ag-shifts');
    if (!agForm.date) { box.innerHTML = `<p class="ag-hint"><i data-icon="calendar"></i>Escolha uma data no calendário para ver os turnos e as vagas.</p>`; paintIcons(box); return; }
    const d = new Date(agForm.date + 'T12:00:00');
    box.innerHTML = `<p class="ag-date-t">${d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>` + ['manha', 'tarde'].map((s) => {
      const st = agShiftState(agForm.kind, agForm.date, s);
      const ok = typeof st === 'number';
      const note = st === 'off' ? 'Sem atendimento' : st === 'past' ? 'Já começou' : st === 'full' ? 'Lotado' : `${st} ${st === 1 ? 'vaga' : 'vagas'}`;
      return `<button type="button" class="ag-shift ${agForm.shift === s ? 'on' : ''}" data-shift="${s}" ${ok ? '' : 'disabled'}>
        <strong>${AG.shifts[s].label}</strong><small>Início às ${AG.shifts[s].time}</small><em class="${ok && st <= 2 ? 'few' : ''}">${note}</em></button>`;
    }).join('');
  };
  const redraw = () => { drawCal(); drawShifts(); };
  redraw();
  agLoad(true).then(() => {
    if (agForm.date && !agDayOpen(agForm.kind, agForm.date)) { agForm.date = ''; agForm.shift = ''; }
    redraw();
  });

  form.addEventListener('click', (e) => {
    const k = e.target.closest('[data-kind]');
    if (k) {
      agForm.kind = k.dataset.kind;
      form.querySelectorAll('[data-kind]').forEach((b) => { const on = b === k; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      if (agForm.date && !agDayOpen(agForm.kind, agForm.date)) agForm.date = '';
      if (agForm.date && typeof agShiftState(agForm.kind, agForm.date, agForm.shift) !== 'number') agForm.shift = '';
      redraw(); msg(); return;
    }
    const c = e.target.closest('[data-college]');
    if (c) { college = c.dataset.college; form.querySelectorAll('[data-college]').forEach((b) => { const on = b === c; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); }); msg(); return; }
    const mv = e.target.closest('[data-mv]');
    if (mv) { const [y, m] = agForm.month.split('-').map(Number); const d = new Date(y, m - 1 + +mv.dataset.mv, 1); agForm.month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; drawCal(); return; }
    const day = e.target.closest('[data-date]');
    if (day && !day.disabled) {
      agForm.date = day.dataset.date;
      const free = ['manha', 'tarde'].filter((s) => typeof agShiftState(agForm.kind, agForm.date, s) === 'number');
      if (!free.includes(agForm.shift)) agForm.shift = free.length === 1 ? free[0] : '';
      redraw(); msg();
      if (PHONE()) $('#ag-shifts').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const sh = e.target.closest('[data-shift]');
    if (sh && !sh.disabled) { agForm.shift = sh.dataset.shift; drawShifts(); msg(); }
  });
  $('#ag-cpf').addEventListener('input', (e) => { e.target.value = cpfMask(e.target.value); msg(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#ag-name').value.trim().replace(/\s+/g, ' '), cpf = $('#ag-cpf').value, course = $('#ag-course').value.trim();
    const fail = (t, el) => { msg(t); el?.focus?.(); };
    if (name.split(' ').length < 2) return fail('Digite o seu nome completo.', $('#ag-name'));
    if (!cpfOk(cpf)) return fail('CPF inválido. Confira os números.', $('#ag-cpf'));
    if (course.length < 2) return fail('Digite o seu curso.', $('#ag-course'));
    if (!college) return fail('Escolha a sua faculdade.');
    if (!agForm.date) return fail('Escolha a data no calendário.');
    if (!agForm.shift) return fail('Escolha o turno.');
    const go = $('#ag-go'); go.disabled = true; go.textContent = 'Agendando…';
    const { data, error } = await sb.rpc('book_appointment', { p_kind: agForm.kind, p_name: name, p_cpf: cpfDigits(cpf), p_course: course, p_college: college, p_date: agForm.date, p_shift: agForm.shift });
    go.disabled = false; go.textContent = 'Confirmar agendamento';
    if (error) { msg(error.message || 'Não foi possível agendar. Tente de novo.'); agLoad(true).then(redraw); return; }
    const a = { kind: agForm.kind, name, cpf: cpfMask(cpf), course, college, date: agForm.date, shift: agForm.shift, ...(data?.[0] || {}) };
    agForm.date = ''; agForm.shift = ''; agData.loaded = 0;
    agSuccess(a);
  });
}

function agWhatsText(a) {
  const k = AG.kinds[a.kind], s = AG.shifts[a.shift];
  return `Olá, suporte Faveni HC! Foi realizado um novo agendamento (${k.label}):\n\nNome completo: ${a.name}\nCPF: ${a.cpf}\nCurso: ${a.course}\nFaculdade: ${a.college}\nTipo: ${k.label}\nData: ${brDate(a.date)}\nTurno: ${s.label}\nHorário: ${s.time}`;
}
function agSuccess(a) {
  const k = AG.kinds[a.kind], s = AG.shifts[a.shift];
  const wa = `https://wa.me/${AG.phone}?text=${encodeURIComponent(agWhatsText(a))}`;
  const box = $('#ag-box');
  box.innerHTML = `
    <div class="ag-done">
      <span class="ag-check"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="m15 27 7 7 15-16"/></svg></span>
      <h2>Agendamento confirmado!</h2>
      <p>Compareça ao Polo Faveni Humberto de Campos no dia e horário abaixo.</p>
      <div class="ag-ticket">
        <div class="ag-ticket-top"><span>${k.label}</span><strong>${new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong><em>${s.label} · início às ${s.time}</em></div>
        <dl>
          <div><dt>Nome</dt><dd>${esc(a.name)}</dd></div>
          <div><dt>CPF</dt><dd>${esc(a.cpf)}</dd></div>
          <div><dt>Curso</dt><dd>${esc(a.course)}</dd></div>
          <div><dt>Faculdade</dt><dd>${esc(a.college)}</dd></div>
        </dl>
      </div>
      <p class="ag-small">Envie o agendamento para o suporte no WhatsApp para concluir.</p>
      <div class="ag-done-actions">
        <a class="ag-submit ag-wa" href="${esc(wa)}" target="_blank" rel="noopener">${WA_SVG}Enviar para o suporte no WhatsApp</a>
        <button class="btn-soft" type="button" id="ag-new">Novo agendamento</button>
      </div>
    </div>`;
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('#ag-new').addEventListener('click', () => route());
  window.open(wa, '_blank', 'noopener'); // tenta abrir o WhatsApp sozinho; se o navegador bloquear, fica o botão
}

/* ---------- painel dos administradores ---------- */
const agAdm = { list: [], tab: 'agendados', f: { d1: '', d2: '', kind: '', shift: '', q: '' } };
function renderAgendaAdmin(view) {
  waitAuth(view, async () => {
    if (!isAdmin()) return adminOnly(view, 'Agendamentos');
    const now = agNow().date, m1 = now.slice(0, 8) + '01';
    const mEnd = isoAdd(isoAdd(m1, 32).slice(0, 8) + '01', -1);
    view.innerHTML = `
    <div class="wrap ag-adm">
      <a class="ag-back" href="#agendar"><i data-icon="left"></i>Página de agendamento</a>
      ${pageHead('Painel', 'Agendamentos.', 'Acompanhe as vagas, marque presença, remarque e gere relatórios das provas e tutorias presenciais.')}

      <section class="ag-panel">
        <h3><i data-icon="report"></i>Relatório em PDF</h3>
        <div class="ag-row">
          <label class="ag-field"><span>Início</span><input type="date" id="rp-d1" value="${m1}"></label>
          <label class="ag-field"><span>Fim</span><input type="date" id="rp-d2" value="${mEnd}"></label>
          <label class="ag-field"><span>Tipo</span><select id="rp-k"><option value="">Provas e tutorias</option><option value="prova">Só provas</option><option value="tutoria">Só tutorias</option></select></label>
          <button class="btn-dark" type="button" id="rp-go"><i data-icon="report"></i>Gerar relatório PDF</button>
        </div>
      </section>

      <section class="ag-panel">
        <h3><i data-icon="search"></i>Filtros</h3>
        <div class="ag-row">
          <label class="ag-field"><span>Data inicial</span><input type="date" data-f="d1"></label>
          <label class="ag-field"><span>Data final</span><input type="date" data-f="d2"></label>
          <label class="ag-field"><span>Tipo</span><select data-f="kind"><option value="">Todos</option><option value="prova">Prova</option><option value="tutoria">Tutoria</option></select></label>
          <label class="ag-field"><span>Turno</span><select data-f="shift"><option value="">Todos</option><option value="manha">Manhã</option><option value="tarde">Tarde</option></select></label>
          <label class="ag-field"><span>Nome ou CPF</span><input type="search" data-f="q" placeholder="Digite para buscar"></label>
          <div class="ag-row-btns"><button class="btn-soft" type="button" id="f-clear">Limpar</button><button class="btn-soft" type="button" id="f-reload"><i data-icon="refresh"></i>Atualizar</button></div>
        </div>
      </section>

      <section class="ag-panel"><h3><i data-icon="calendar"></i>Vagas por data, tipo e turno</h3><div class="ag-slots" id="ag-slots"></div></section>

      <section class="ag-panel">
        <h3><i data-icon="lock"></i>Datas bloqueadas</h3>
        <p class="ag-desc">Feriados, fechamento do polo ou balanço: nessas datas o site não aceita novos agendamentos.</p>
        <div class="ag-row">
          <label class="ag-field"><span>Data</span><input type="date" id="bl-d" min="${now}"></label>
          <label class="ag-field"><span>Bloquear para</span><select id="bl-s"><option value="todos">Todos os agendamentos</option><option value="prova">Somente provas</option><option value="tutoria">Somente tutorias</option></select></label>
          <label class="ag-field"><span>Motivo (opcional)</span><input id="bl-r" maxlength="80" placeholder="Ex.: Feriado municipal"></label>
          <button class="btn-dark" type="button" id="bl-go">Bloquear data</button>
        </div>
        <div class="ag-blocks" id="ag-blocks"></div>
      </section>

      <section class="ag-panel ag-list-panel">
        <div class="ag-tabs" id="ag-tabs"></div>
        <div class="ag-list" id="ag-list"><p class="me-loading">Carregando agendamentos…</p></div>
      </section>
    </div>`;
    paintIcons(view);
    view.querySelectorAll('[data-f]').forEach((el) => { el.value = agAdm.f[el.dataset.f] || ''; el.addEventListener('input', () => { agAdm.f[el.dataset.f] = el.value; agDraw(); }); });
    $('#f-clear').addEventListener('click', () => { agAdm.f = { d1: '', d2: '', kind: '', shift: '', q: '' }; view.querySelectorAll('[data-f]').forEach((el) => { el.value = ''; }); agDraw(); });
    $('#f-reload').addEventListener('click', () => agReload());
    $('#ag-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { agAdm.tab = b.dataset.tab; agDraw(); } });
    $('#ag-list').addEventListener('click', agAction);
    $('#ag-blocks').addEventListener('click', async (e) => {
      const b = e.target.closest('[data-unblock]'); if (!b) return;
      const [date, scope] = b.dataset.unblock.split('|');
      const { error } = await sb.from('blocked_dates').delete().eq('date', date).eq('scope', scope);
      if (error) return toast(authError(error));
      toast('Data desbloqueada'); agReload();
    });
    $('#bl-go').addEventListener('click', async () => {
      const date = $('#bl-d').value, scope = $('#bl-s').value, reason = $('#bl-r').value.trim();
      if (!date) return toast('Escolha a data para bloquear.');
      const { error } = await sb.from('blocked_dates').insert({ date, scope, reason });
      if (error) return toast(/duplicate/i.test(error.message) ? 'Essa data já está bloqueada.' : authError(error));
      const busy = agAdm.list.filter((a) => a.date === date && a.status === 'confirmado' && (scope === 'todos' || a.kind === scope)).length;
      toast(busy ? `Data bloqueada. Atenção: ${busy} agendamento(s) já marcados nesse dia.` : 'Data bloqueada');
      $('#bl-d').value = ''; $('#bl-r').value = ''; agReload();
    });
    $('#rp-go').addEventListener('click', () => agReport($('#rp-d1').value, $('#rp-d2').value, $('#rp-k').value));
    agReload();
  });
}
async function agReload() {
  const [a, b] = await Promise.all([
    sb.from('appointments').select('*').order('date').order('shift').order('created_at'),
    sb.from('blocked_dates').select('*').order('date'),
  ]);
  if (a.error) { $('#ag-list') && ($('#ag-list').innerHTML = `<p class="me-loading">${esc(authError(a.error))}</p>`); return; }
  agAdm.list = a.data || []; agAdm.blocked = b.data || [];
  agDraw();
}
const agTabOf = (a) => (a.status === 'confirmado' ? 'agendados' : a.status === 'cancelado' ? 'cancelados' : 'realizados');
function agFiltered() {
  const f = agAdm.f, q = fold(f.q.trim()), qd = cpfDigits(f.q);
  return agAdm.list.filter((a) => (!f.d1 || a.date >= f.d1) && (!f.d2 || a.date <= f.d2) && (!f.kind || a.kind === f.kind) && (!f.shift || a.shift === f.shift)
    && (!q || fold(a.name).includes(q) || (qd.length >= 3 && a.cpf.includes(qd))));
}
function agDraw() {
  if (!$('#ag-list')) return;
  const rows = agFiltered();
  const now = agNow().date;
  // vagas: das datas filtradas (ou de hoje em diante) com atendimento
  const from = agAdm.f.d1 || now, to = agAdm.f.d2 || isoAdd(now, 14);
  const slots = [];
  for (let d = from; d <= to && slots.length < 60; d = isoAdd(d, 1)) {
    for (const k of Object.keys(AG.kinds)) {
      if (agAdm.f.kind && agAdm.f.kind !== k) continue;
      const shifts = AG.kinds[k].days[dow(d)]; if (!shifts) continue;
      slots.push({ d, k, shifts, blocked: (agAdm.blocked || []).find((b) => b.date === d && (b.scope === 'todos' || b.scope === k)) });
    }
  }
  const used = (d, k, s) => agAdm.list.filter((a) => a.date === d && a.kind === k && a.shift === s && a.status !== 'cancelado').length;
  $('#ag-slots').innerHTML = slots.length ? slots.map(({ d, k, shifts, blocked }) => `
    <div class="ag-slot ${blocked ? 'blocked' : ''}">
      <div class="ag-slot-h"><strong>${brDate(d)}</strong><span class="ag-tag t-${k}">${AG.kinds[k].label}</span></div>
      ${blocked ? `<p class="ag-slot-bl">Bloqueado${blocked.reason ? ' · ' + esc(blocked.reason) : ''}</p>` : shifts.map((s) => { const u = used(d, k, s), c = AG.kinds[k].cap; return `<div class="ag-slot-r"><span>${AG.shifts[s].label}</span><b class="${u >= c ? 'full' : ''}">${u}/${c}</b><i style="--p:${u / c}"></i></div>`; }).join('')}
    </div>`).join('') : '<p class="ag-desc">Nenhuma data com atendimento nesse período.</p>';

  $('#ag-blocks').innerHTML = (agAdm.blocked || []).filter((b) => b.date >= now).map((b) => `
    <div class="ag-block"><strong>${brDate(b.date)}</strong><span class="ag-tag">${b.scope === 'todos' ? 'Todos os agendamentos' : b.scope === 'prova' ? 'Somente provas' : 'Somente tutorias'}</span><em>${esc(b.reason || '')}</em>
    <button class="btn-soft sm" type="button" data-unblock="${b.date}|${b.scope}"><i data-icon="trash"></i>Desbloquear</button></div>`).join('') || '<p class="ag-desc">Nenhuma data bloqueada.</p>';

  const count = (t) => { const r = rows.filter((a) => agTabOf(a) === t); return `${r.length} <small>${r.filter((a) => a.kind === 'prova').length}P · ${r.filter((a) => a.kind === 'tutoria').length}T</small>`; };
  $('#ag-tabs').innerHTML = [['agendados', 'Agendados'], ['realizados', 'Realizados'], ['cancelados', 'Cancelados']].map(([t, l]) => `<button type="button" data-tab="${t}" class="${agAdm.tab === t ? 'on' : ''}">${l} <b>${count(t)}</b></button>`).join('');

  const list = rows.filter((a) => agTabOf(a) === agAdm.tab);
  if (agAdm.tab !== 'agendados') list.reverse();
  $('#ag-list').innerHTML = list.length ? `
    <div class="ag-tr ag-th"><span>Aluno</span><span>Curso · Faculdade</span><span>Tipo</span><span>Data · Turno</span><span>Status</span><span></span></div>
    ${list.map((a) => `
    <div class="ag-tr" data-id="${a.id}">
      <span class="ag-who"><strong>${esc(a.name)}</strong><small>CPF ${cpfMask(a.cpf)}</small></span>
      <span class="ag-c"><strong>${esc(a.course)}</strong><small>${esc(a.college)}</small></span>
      <span><span class="ag-tag t-${a.kind}">${AG.kinds[a.kind].short}</span></span>
      <span class="ag-c"><strong>${brDate(a.date)}</strong><small>${AG.shifts[a.shift].label} · ${AG.shifts[a.shift].time}</small></span>
      <span><span class="ag-st s-${a.status}">${AG_STATUS[a.status]}</span></span>
      <span class="ag-acts">
        ${a.status === 'confirmado' ? `
          <button class="btn-dark sm ok" data-ag="compareceu"><i data-icon="check"></i>Compareceu</button>
          <button class="btn-soft sm no" data-ag="faltou"><i data-icon="x"></i>Não compareceu</button>
          <button class="btn-soft sm" data-ag="remarcar"><i data-icon="calendar"></i>Remarcar</button>
          <button class="icon-btn" data-ag="cancelar" title="Cancelar agendamento"><i data-icon="trash"></i></button>` : `
          <button class="btn-soft sm" data-ag="desfazer"><i data-icon="left"></i>Voltar para agendado</button>`}
        ${a.history?.length ? `<button class="icon-btn neutral" data-ag="hist" title="Histórico"><i data-icon="clock"></i></button>` : ''}
      </span>
    </div>`).join('')}` : `<p class="us-empty">Nenhum agendamento ${agAdm.tab === 'agendados' ? 'marcado' : agAdm.tab === 'realizados' ? 'realizado' : 'cancelado'} com esses filtros.</p>`;
  paintIcons($('.ag-adm'));
}
async function agUpdate(a, patch, note) {
  const history = [...(a.history || []), { em: new Date().toISOString(), por: meName(), ...note }];
  const { error } = await sb.from('appointments').update({ ...patch, history }).eq('id', a.id);
  if (error) { toast(authError(error)); return false; }
  Object.assign(a, patch, { history }); agDraw(); return true;
}
async function agAction(e) {
  const b = e.target.closest('[data-ag]'); if (!b) return;
  const a = agAdm.list.find((x) => x.id === b.closest('[data-id]').dataset.id); if (!a) return;
  const act = b.dataset.ag;
  if (act === 'compareceu' || act === 'faltou') {
    if (await agUpdate(a, { status: act }, { acao: AG_STATUS[act] })) toast(`${a.name.split(' ')[0]}: ${AG_STATUS[act].toLowerCase()}`);
  }
  if (act === 'desfazer' && await agUpdate(a, { status: 'confirmado' }, { acao: 'Voltou para agendado' })) toast('Voltou para agendados');
  if (act === 'cancelar') {
    if (!(await confirmDialog({ title: `Cancelar o agendamento de ${a.name.split(' ')[0]}?`, sub: `${AG.kinds[a.kind].label} em ${brDate(a.date)}, ${AG.shifts[a.shift].label.toLowerCase()}. A vaga fica livre de novo.`, ok: 'Cancelar agendamento' }))) return;
    if (await agUpdate(a, { status: 'cancelado' }, { acao: 'Cancelado' })) toast('Agendamento cancelado');
  }
  if (act === 'remarcar') agRemarcar(a);
  if (act === 'hist') {
    openAuth('info', { title: 'Histórico', icon: 'clock', tone: 'ok', text: `<span class="ag-hist">${a.history.map((h) => `<span><b>${new Date(h.em).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</b> · ${esc(h.acao || '')}${h.de ? ` de ${brDate(h.de.date)} (${AG.shifts[h.de.shift].label}) para ${brDate(h.para.date)} (${AG.shifts[h.para.shift].label})` : ''}${h.por ? ` · por ${esc(h.por)}` : ''}</span>`).join('')}</span>` });
  }
}
function agRemarcar(a) {
  if (document.querySelector('.lk')) return;
  const wrap = document.createElement('div');
  wrap.className = 'lk au';
  wrap.innerHTML = `<div class="lk-backdrop"></div>
    <form class="lk-card au-card" role="dialog" aria-modal="true" aria-labelledby="rm-t" novalidate>
      <span class="lk-icon au-ico"><i data-icon="calendar"></i></span>
      <h2 id="rm-t">Remarcar</h2>
      <p class="lk-sub">${esc(a.name)} · ${AG.kinds[a.kind].label}<br>Hoje: ${brDate(a.date)}, ${AG.shifts[a.shift].label.toLowerCase()}</p>
      <label class="au-label" for="rm-d">Nova data</label><div class="lk-field"><input type="date" id="rm-d" value="${a.date}"></div>
      <label class="au-label" for="rm-s">Turno</label><div class="lk-field"><select id="rm-s" class="ag-select">${['manha', 'tarde'].map((s) => `<option value="${s}" ${s === a.shift ? 'selected' : ''}>${AG.shifts[s].label} (${AG.shifts[s].time})</option>`).join('')}</select></div>
      <p class="lk-msg" role="alert"></p>
      <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark lk-go">Remarcar</button></div>
    </form>`;
  document.body.appendChild(wrap); paintIcons(wrap);
  const close = () => { wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 300); };
  wrap.querySelector('.lk-backdrop').addEventListener('click', close);
  wrap.querySelector('.lk-cancel').addEventListener('click', close);
  const msg = wrap.querySelector('.lk-msg');
  wrap.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = $('#rm-d').value, shift = $('#rm-s').value;
    if (!date) return (msg.textContent = 'Escolha a nova data.');
    if (date === a.date && shift === a.shift) return close();
    const cap = (AG.kinds[a.kind].days[dow(date)] || []).includes(shift) ? AG.kinds[a.kind].cap : 0;
    if (!cap) return (msg.textContent = `Não há ${AG.kinds[a.kind].short.toLowerCase()} nesse dia e turno.`);
    const u = agAdm.list.filter((x) => x.id !== a.id && x.date === date && x.kind === a.kind && x.shift === shift && x.status !== 'cancelado').length;
    if (u >= cap && !msg.dataset.force) { msg.textContent = `Esse turno já está lotado (${u}/${cap}). Clique em Remarcar de novo para encaixar mesmo assim.`; msg.dataset.force = '1'; return; }
    if (await agUpdate(a, { date, shift }, { acao: 'Remarcado', de: { date: a.date, shift: a.shift }, para: { date, shift } })) { close(); toast('Agendamento remarcado'); }
  });
  requestAnimationFrame(() => wrap.classList.add('in'));
}

/* relatório: monta uma página e abre a janela de impressão (salvar como PDF) */
async function agReport(d1, d2, kind) {
  if (!d1 || !d2 || d1 > d2) return toast('Escolha um período válido.');
  let q = sb.from('appointments').select('*').gte('date', d1).lte('date', d2).order('date').order('shift').order('name');
  if (kind) q = q.eq('kind', kind);
  const { data, error } = await q;
  if (error) return toast(authError(error));
  const tot = (st) => data.filter((a) => a.status === st).length;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório de agendamentos ${brDate(d1)} a ${brDate(d2)}</title>
  <style>body{font:12px/1.4 Inter,Arial,sans-serif;color:#1d1d1f;margin:28px}h1{font-size:20px;margin:0 0 2px}p{margin:0 0 14px;color:#555}
  .k{display:flex;gap:10px;margin:0 0 16px}.k div{border:1px solid #ddd;border-radius:10px;padding:8px 12px}.k b{display:block;font-size:18px}
  table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #e5e5e5;vertical-align:top}th{background:#f5f5f7;font-size:11px;text-transform:uppercase;letter-spacing:.03em}
  td small{color:#777}@page{margin:14mm}</style></head><body>
  <h1>Agendamentos — Polo Faveni Humberto de Campos</h1>
  <p>${kind ? AG.kinds[kind].label + 's' : 'Provas e tutorias'} · ${brDate(d1)} a ${brDate(d2)} · gerado em ${new Date().toLocaleString('pt-BR')}</p>
  <div class="k"><div><b>${data.length}</b>Total</div><div><b>${tot('confirmado')}</b>Agendados</div><div><b>${tot('compareceu')}</b>Compareceram</div><div><b>${tot('faltou')}</b>Não compareceram</div><div><b>${tot('cancelado')}</b>Cancelados</div></div>
  <table><thead><tr><th>Data</th><th>Turno</th><th>Tipo</th><th>Nome</th><th>CPF</th><th>Curso</th><th>Faculdade</th><th>Status</th></tr></thead><tbody>
  ${data.map((a) => `<tr><td>${brDate(a.date)}</td><td>${AG.shifts[a.shift].label}</td><td>${AG.kinds[a.kind].short}</td><td>${esc(a.name)}${a.history?.some((h) => h.de) ? '<br><small>remarcado</small>' : ''}</td><td>${cpfMask(a.cpf)}</td><td>${esc(a.course)}</td><td>${esc(a.college)}</td><td>${AG_STATUS[a.status]}</td></tr>`).join('') || '<tr><td colspan="8">Nenhum agendamento no período.</td></tr>'}
  </tbody></table></body></html>`;
  const frame = Object.assign(document.createElement('iframe'), { style: 'position:fixed;width:0;height:0;border:0;right:0;bottom:0' });
  document.body.appendChild(frame);
  frame.contentDocument.open(); frame.contentDocument.write(html); frame.contentDocument.close();
  setTimeout(() => { frame.contentWindow.focus(); frame.contentWindow.print(); setTimeout(() => frame.remove(), 60000); }, 300);
}

window.HC_ROUTES = Object.assign(window.HC_ROUTES || {}, { agendar: renderAgenda, 'agendar/painel': renderAgendaAdmin });
