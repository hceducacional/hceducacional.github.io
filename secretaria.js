/* =========================================================
   SECRETARIA — base de alunos do polo (só administradores)
   Banco: supabase/22-secretaria.sql (tabelas sec_*). As regras de acesso
   ficam no banco; aqui é só a interface.
   Endereços: #secretaria (início) · /alunos · /aluno/<id|novo> · /cursos ·
   /relatorios · /cadastros · /mapa
   ========================================================= */
const SEC = { ready: false, loading: null, listas: [], cursos: [], alunos: [], mats: [], pend: [], tarefas: [] };
const SEC_STATUS = {
  ativo: ['Ativo', '#1f9d55'], concluido: ['Concluído', '#0a6cdf'], cancelado: ['Cancelado', '#d70015'],
  trancado: ['Trancado', '#6e6e73'], pendente: ['Pendente', '#c76a00'],
};
const SEC_LISTAS = {
  faculdade: 'Faculdades', tipo_curso: 'Tipos de curso', area: 'Áreas dos cursos', periodo: 'Períodos', turma: 'Turmas',
  instrucao: 'Grau de instrução', formacao: 'Formação', conhecimento: 'Como conheceu o polo', etnia: 'Etnia', documento: 'Documentos exigidos',
};
const SEC_MAT_COLS = 'id,aluno_id,curso_id,numero,turma,periodo,status,inicio,expiracao,avaliacao,login,tem_senha,documentos,obs,created_at,updated_at';
const SEC_UF = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
const SEC_SEXO = ['Feminino', 'Masculino', 'Outro', 'Prefiro não informar'];
const SEC_AVISO_DIAS = 30; // alerta de expiração: quantos dias antes

/* ---------- datas (sempre "AAAA-MM-DD", sem fuso) ---------- */
const secToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const secDate = (s) => (s ? s.split('-').reverse().join('/') : '—');
const secAddMonths = (s, n) => {
  if (!s || !n) return '';
  const [y, m, d] = s.split('-').map(Number);
  const t = new Date(y, m - 1 + n, 1), last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  t.setDate(Math.min(d, last));
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
};
const secDays = (s) => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); const t = new Date(); return Math.round((new Date(y, m - 1, d) - new Date(t.getFullYear(), t.getMonth(), t.getDate())) / 864e5); };
const secSameMonth = (s) => s && s.slice(0, 7) === secToday().slice(0, 7);
const secCpfFmt = (c = '') => (c.length === 11 ? `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}` : c);
const secPhoneDigits = (p = '') => String(p).replace(/\D/g, '');
const secFold = (s = '') => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* ---------- consultas ---------- */
const secLista = (tipo, all = false) => SEC.listas.filter((l) => l.tipo === tipo && (all || l.ativo)).sort((a, b) => a.ordem - b.ordem || a.nome.localeCompare(b.nome, 'pt'));
const secLNome = (id) => SEC.listas.find((l) => l.id === id)?.nome || '';
const secCurso = (id) => SEC.cursos.find((c) => c.id === id);
const secAluno = (id) => SEC.alunos.find((a) => a.id === id);
const secMatsDe = (alunoId) => SEC.mats.filter((m) => m.aluno_id === alunoId).sort((a, b) => (b.inicio || '').localeCompare(a.inicio || ''));
const secTipoDoCurso = (c) => SEC.listas.find((l) => l.id === c?.tipo_id);
function secJanela(m) {
  if (m.status !== 'ativo' || !m.expiracao) return null;
  const tipo = secTipoDoCurso(secCurso(m.curso_id)); if (!tipo?.meses || tipo.meses >= 12) return null; // só cursos por período (graduação)
  const [y, mo, d] = m.expiracao.split('-').map(Number);
  const ab = new Date(y, mo - 1 - (d < 25 ? 1 : 0), 25), fe = new Date(ab.getFullYear(), ab.getMonth() + 1, 10);
  const iso = (t) => `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  const abre = iso(ab), fecha = iso(fe), hoje = secToday();
  if (hoje < abre) return { fase: 'antes', abre, fecha, dias: secDays(abre) };
  if (hoje <= fecha) { const r = secDays(fecha); return { fase: r <= 3 ? 'fechando' : 'aberta', abre, fecha, dias: r }; }
  return { fase: 'atrasada', abre, fecha, dias: -secDays(m.expiracao < fecha ? m.expiracao : fecha) };
}
/* Período do curso: o campo "período" da matrícula diz em que período o aluno estava na data de início.
   A cada ciclo do tipo do curso (6 meses na graduação) ele avança sozinho, até o nº de períodos do curso. */
const secPerNum = (txt) => { const n = parseInt(String(txt || '').match(/\d+/)?.[0], 10); return n > 0 ? n : null; };
const secPerNome = (n) => `${n}º Período`;
function secPeriodo(m, hoje = secToday()) {
  const p0 = secPerNum(m?.periodo); if (!p0) return null;
  const c = secCurso(m.curso_id), tipo = secTipoDoCurso(c), meses = tipo?.meses && tipo.meses < 12 ? tipo.meses : 0;
  const total = c?.periodos || null;
  if (!meses || !m.inicio) return { n: p0, total, nome: secPerNome(p0), fim: null, final: total ? p0 >= total : false, passou: false };
  let k = 0; while (k < 60 && secAddMonths(m.inicio, meses * (k + 1)) <= hoje) k++; // ciclos completos desde o início
  const corrido = m.status === 'ativo' ? p0 + k : p0; // só avança enquanto a matrícula está ativa
  const n = total ? Math.min(corrido, total) : corrido;
  const fim = total && total >= p0 ? secAddMonths(m.inicio, meses * (total - p0 + 1)) : null;
  return { n, total, nome: secPerNome(n), fim, final: total ? n >= total : false, passou: !!(fim && fim <= hoje) };
}
const secPerTxt = (pp) => pp ? `${pp.n}º${pp.total ? ` de ${pp.total}` : ''}` : '';
const SEC_JANELA = { aberta: ['Rematrícula aberta', 'ok'], fechando: ['Rematrícula fechando', 'warn'], atrasada: ['Rematrícula atrasada', 'bad'] };
const secJanelaTxt = (j) => j.fase === 'aberta' ? `aberta até ${secDate(j.fecha).slice(0, 5)}` : j.fase === 'fechando' ? (j.dias === 0 ? 'fecha hoje' : `fecha em ${j.dias} ${j.dias === 1 ? 'dia' : 'dias'}`) : `há ${j.dias} ${j.dias === 1 ? 'dia' : 'dias'} sem rematrícula`;
const secStatusPill = (s) => `<span class="sc-pill" style="--c:${SEC_STATUS[s]?.[1] || '#6e6e73'}"><i></i>${SEC_STATUS[s]?.[0] || s}</span>`;

async function secFetchAll(table, cols, order) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from(table).select(cols).order(order).range(from, from + 999);
    if (error) throw error;
    out.push(...data);
    if (data.length < 1000) return out;
  }
}
function secLoad(force = false) {
  if (SEC.ready && !force) return Promise.resolve();
  if (SEC.loading) return SEC.loading;
  SEC.loading = Promise.all([
    secFetchAll('sec_listas', '*', 'ordem'),
    secFetchAll('sec_cursos', '*', 'nome'),
    secFetchAll('sec_alunos', '*', 'nome'),
    secFetchAll('sec_matriculas', SEC_MAT_COLS, 'created_at'),
    secFetchAll('sec_pendencias', '*', 'created_at'),
    secFetchAll('sec_tarefas', '*', 'created_at'),
  ]).then(([l, c, a, m, p, t]) => {
    Object.assign(SEC, { listas: l, cursos: c, alunos: a, mats: m, pend: p, tarefas: t, ready: true });
  }).finally(() => { SEC.loading = null; });
  return SEC.loading;
}
const secErr = (error) => {
  console.error(error);
  const m = String(error?.message || error || '');
  if (/relation .* does not exist|could not find the table/i.test(m)) return 'O banco da Secretaria ainda não foi criado. Rode o script supabase/22-secretaria.sql no Supabase.';
  if (/sec_alunos_cpf|duplicate key.*cpf/i.test(m)) return 'Já existe um aluno com esse CPF.';
  if (/sec_listas_unico|duplicate key/i.test(m)) return 'Esse item já existe na lista.';
  return 'Não foi possível salvar. Verifique a internet e tente de novo.';
};

/* ---------- moldura das páginas ---------- */
const SEC_NAV = [['', 'Início', 'grid', '#5a5a5e', '#1d1d1f'], ['alunos', 'Alunos', 'users', '#34c759', '#1f9d55'], ['cursos', 'Cursos', 'cap', '#4aa3ff', '#0a5fd7'],
  ['relatorios', 'Relatórios', 'report', '#b18cff', '#7c4dff'], ['cadastros', 'Cadastros', 'settings', '#ffb340', '#f08a00'], ['mapa', 'Mapeamento', 'map', '#2dd4bf', '#0d9488']];
let secSoft = false; // true quando a troca foi só do conteúdo (a moldura já estava na tela)
function secShell(view, tab, title, sub, body, extra = '') {
  const head = `
      <div>
        <p class="page-kicker">Secretaria</p>
        <h1 class="page-title">${title}</h1>
        ${sub ? `<p class="page-sub">${sub}</p>` : ''}
      </div>
      <div class="sc-head-act">${extra}<a class="btn-dark sc-new" href="#secretaria/aluno/novo"><i data-icon="userPlus"></i>Novo aluno</a></div>`;
  const shell = view.querySelector(':scope > .sc-shell');
  if (shell) {
    // a moldura já está na tela: troca só o título e o conteúdo de baixo; a pílula desliza até a aba
    secSoft = true;
    shell.querySelector('.sc-head').innerHTML = head;
    const nav = shell.querySelector('.sc-nav');
    nav.querySelectorAll('[data-t]').forEach((a) => { const on = a.dataset.t === tab; a.classList.toggle('on', on); a.setAttribute('aria-selected', on); });
    const box = shell.querySelector('.sc-body');
    const changed = box.dataset.scTab !== tab || box.dataset.title !== title;
    box.dataset.scTab = tab; box.dataset.title = title;
    box.innerHTML = body;
    paintIcons(shell.querySelector('.sc-head')); paintIcons(box);
    shell._moveInd?.();
    if (changed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      [...box.children].slice(0, 6).forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
        { duration: 480, delay: i * 60, easing: 'cubic-bezier(.28, .11, .32, 1)', fill: 'backwards' }));
    }
    return;
  }
  secSoft = false;
  view.innerHTML = `
  <div class="wrap sc sc-shell">
    <header class="sc-head">${head}</header>
    <nav class="sc-nav ap-pills" role="tablist" aria-label="Seções da secretaria">
      <span class="ap-pill-ind" aria-hidden="true"></span>
      ${SEC_NAV.map(([r, t, ico, a, b]) => `<a href="#secretaria${r ? '/' + r : ''}" data-t="${r}" role="tab" aria-selected="${tab === r}" class="ap-pill ${tab === r ? 'on' : ''}" style="--a:${a};--b:${b}"><i data-icon="${ico}"></i><span>${t}</span></a>`).join('')}
    </nav>
    <div class="sc-body" data-sc-tab="${tab}" data-title="${esc(title)}">${body}</div>
  </div>`;
  paintIcons(view);
  const shellEl = view.querySelector('.sc-shell'), nav = shellEl.querySelector('.sc-nav'), ind = nav.querySelector('.ap-pill-ind');
  // mesma pílula colorida das notícias: desliza até a aba escolhida, na cor dela
  shellEl._moveInd = (instant) => {
    const on = nav.querySelector('.ap-pill.on'); if (!on) return;
    if (instant) ind.style.transition = 'none';
    ind.style.width = on.offsetWidth + 'px';
    ind.style.transform = `translateX(${on.offsetLeft}px)`;
    ind.style.setProperty('--a', on.style.getPropertyValue('--a'));
    ind.style.setProperty('--b', on.style.getPropertyValue('--b'));
    if (instant) { void ind.offsetWidth; ind.style.transition = ''; }
    if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: on.offsetLeft - (nav.clientWidth - on.offsetWidth) / 2, behavior: instant ? 'auto' : 'smooth' });
  };
  shellEl._moveInd(true);
  new ResizeObserver(() => shellEl._moveInd(true)).observe(nav);
  document.fonts?.ready.then(() => shellEl._moveInd(true));
}
function secLoading(view) {
  view.innerHTML = '<div class="wrap sc"><div class="sc-loading"><span></span>Carregando a secretaria…</div></div>';
}

/* ---------- janela (painel) genérica ---------- */
function secSheet(title, html, { onSave, saveLabel = 'Salvar', wide = false, danger } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'sc-sheet';
  wrap.innerHTML = `
    <div class="sc-sheet-bg" data-close></div>
    <form class="sc-sheet-card${wide ? ' wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}" novalidate>
      <header><h2>${esc(title)}</h2><button type="button" class="sc-x" data-close aria-label="Fechar"><i data-icon="x"></i></button></header>
      <div class="sc-sheet-body">${html}</div>
      <p class="sc-msg" role="alert"></p>
      <footer>
        ${danger ? `<button type="button" class="btn-soft sc-danger" data-danger>${esc(danger.label)}</button>` : ''}
        <span class="sc-grow"></span>
        <button type="button" class="btn-soft" data-close>Cancelar</button>
        ${onSave ? `<button type="submit" class="btn-dark">${esc(saveLabel)}</button>` : ''}
      </footer>
    </form>`;
  document.body.appendChild(wrap);
  document.body.classList.add('modal-open');
  paintIcons(wrap);
  const form = wrap.querySelector('form'), msg = wrap.querySelector('.sc-msg');
  const close = () => { wrap.classList.remove('in'); document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onKey); setTimeout(() => wrap.remove(), 280); };
  const onKey = (e) => { if (e.key === 'Escape' && !document.querySelector('.lk')) close(); };
  document.addEventListener('keydown', onKey);
  wrap.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!onSave) return;
    const btn = form.querySelector('[type=submit]'); btn.disabled = true; msg.textContent = '';
    try { const r = await onSave(form, (t) => { msg.textContent = t; }); if (r !== false) close(); }
    catch (err) { msg.textContent = secErr(err); }
    finally { btn.disabled = false; }
  });
  wrap.querySelector('[data-danger]')?.addEventListener('click', async () => { if ((await danger.run()) !== false) close(); });
  requestAnimationFrame(() => wrap.classList.add('in'));
  setTimeout(() => form.querySelector('input:not([type=hidden]),select,textarea')?.focus({ preventScroll: true }), 120);
  return { wrap, form, close };
}
const secOpts = (items, sel, empty = 'Selecione') => `<option value="">${empty}</option>` + items.map((it) => {
  const [v, t] = Array.isArray(it) ? it : [it, it];
  return `<option value="${esc(v)}"${String(v) === String(sel ?? '') ? ' selected' : ''}>${esc(t)}</option>`;
}).join('');
const secField = (label, input, cls = '') => `<label class="sc-f ${cls}"><span>${label}</span>${input}</label>`;
const secVal = (form, name) => { const v = form.elements[name]?.value?.trim() ?? ''; return v === '' ? null : v; };

/* =========================================================
   INÍCIO — alertas e quadros do dia
   ========================================================= */
const SEC_MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
// mini calendário (mês pequeno, dia grande) usado nas linhas dos widgets
const secCal = (s, tone = '') => (s ? `<span class="sw-cal ${tone}"><small>${SEC_MES[+s.slice(5, 7) - 1]}</small><b>${+s.slice(8, 10)}</b></span>` : '');
function secHome(view) {
  const ativos = SEC.mats.filter((m) => m.status === 'ativo');
  const vence = ativos.filter((m) => m.expiracao && secDays(m.expiracao) <= SEC_AVISO_DIAS).sort((a, b) => a.expiracao.localeCompare(b.expiracao));
  const vencidas = vence.filter((m) => secDays(m.expiracao) < 0).length;
  const hoje = secToday().slice(5);
  const niver = SEC.alunos.filter((a) => a.nascimento && a.nascimento.slice(5) === hoje);
  const aval = ativos.filter((m) => secSameMonth(m.avaliacao)).sort((a, b) => a.avaliacao.localeCompare(b.avaliacao));
  const ordemJ = { atrasada: 0, fechando: 1, aberta: 2 };
  const remat = ativos.map((m) => [m, secJanela(m)]).filter(([, j]) => j && j.fase !== 'antes')
    .sort(([a, ja], [b, jb]) => ordemJ[ja.fase] - ordemJ[jb.fase] || a.expiracao.localeCompare(b.expiracao));
  const pend = SEC.pend.filter((p) => p.status === 'aberta').sort((a, b) => b.created_at.localeCompare(a.created_at));
  const tarefas = SEC.tarefas.filter((t) => !t.feita).length;
  const counts = Object.keys(SEC_STATUS).map((s) => [s, SEC.mats.filter((m) => m.status === s).length]);
  const totalMats = SEC.mats.length;

  // saudação e frase do dia
  const now = new Date(), h = now.getHours();
  const hello = h >= 5 && h < 12 ? 'Bom dia' : h >= 12 && h < 18 ? 'Boa tarde' : 'Boa noite';
  const first = (typeof meName === 'function' ? String(meName() || '') : '').trim().split(/\s+/)[0];
  const plural = (n, a, b) => `${n} ${n === 1 ? a : b}`;
  const resumo = [vence.length && plural(vence.length, 'matrícula pede atenção', 'matrículas pedem atenção'), niver.length && plural(niver.length, 'aniversariante', 'aniversariantes'),
    remat.length && plural(remat.length, 'rematrícula na janela', 'rematrículas na janela'), pend.length && plural(pend.length, 'pendência aberta', 'pendências abertas'), tarefas && plural(tarefas, 'tarefa do setor', 'tarefas do setor')].filter(Boolean);

  // anel das situações (conic-gradient)
  let acc = 0;
  const ring = totalMats ? counts.filter(([, n]) => n).map(([s, n]) => { const a = acc; acc += (n / totalMats) * 360; return `${SEC_STATUS[s][1]} ${a.toFixed(1)}deg ${acc.toFixed(1)}deg`; }).join(', ') : '#e5e5ea 0deg 360deg';

  const person = (m, date, tag = '', tone = '') => {
    const a = secAluno(m.aluno_id), c = secCurso(m.curso_id);
    return `<a class="sw-row" href="#secretaria/aluno/${m.aluno_id}">${secCal(date, tone)}
      <span class="sw-row-t"><b>${esc(a?.nome || 'Aluno')}</b><small>${esc(c?.nome || 'Curso não informado')}</small></span>${tag}</a>`;
  };
  const venceTone = (m) => { const d = secDays(m.expiracao); return d < 0 ? 'bad' : d <= 7 ? 'warn' : ''; };
  const venceTag = (m) => { const d = secDays(m.expiracao); return `<span class="sw-chip ${venceTone(m)}">${d < 0 ? `venceu há ${-d} d` : d === 0 ? 'hoje' : `em ${d} d`}</span>`; };
  const empty = (ico, t) => `<div class="sw-empty"><i data-icon="${ico}"></i><span>${t}</span></div>`;
  const widget = (cls, ico, title, n, body, act = '') => `
    <section class="sw ${cls}">
      <header><span class="sw-ico"><i data-icon="${ico}"></i></span><h2>${title}</h2>${act}${n != null ? `<b class="sw-n">${n}</b>` : ''}</header>
      <div class="sw-body">${body}</div>
    </section>`;

  const body = `
    <div class="sw-grid">
      <section class="sw sw-hero">
        <span class="sw-hero-glow" aria-hidden="true"></span>
        <p class="sw-hero-hi">${hello}${first ? ', ' + esc(first) : ''}</p>
        <h2>${DIAS[now.getDay()]}, ${now.getDate()} de ${MESES[now.getMonth()]}</h2>
        <p class="sw-hero-sum">${resumo.length ? resumo.join(' · ') : 'Tudo em dia por aqui. Nenhum alerta para hoje.'}</p>
        <div class="sw-hero-kpis">
          <a href="#secretaria/alunos"><b>${SEC.alunos.length}</b><span>alunos</span></a>
          <a href="#secretaria/alunos/ativo"><b>${counts[0][1]}</b><span>matrículas ativas</span></a>
          <a href="#secretaria/cursos"><b>${SEC.cursos.filter((c) => c.ativo).length}</b><span>cursos</span></a>
        </div>
      </section>

      <section class="sw sw-ring">
        <header><span class="sw-ico"><i data-icon="report"></i></span><h2>Matrículas</h2></header>
        <div class="sw-ring-in">
          <div class="sw-donut" style="--ring:conic-gradient(${ring})"><span><b>${totalMats}</b><small>no total</small></span></div>
          <ul>${counts.map(([s, n]) => `<li><a href="#secretaria/alunos/${s}" style="--c:${SEC_STATUS[s][1]}"><i></i>${SEC_STATUS[s][0]}<b>${n}</b></a></li>`).join('')}</ul>
        </div>
      </section>

      <section class="sw sw-alert${vence.length ? ' on' : ''}">
        <header><span class="sw-ico"><i data-icon="alert"></i></span><h2>Atenção</h2></header>
        <div class="sw-alert-n"><b>${vence.length}</b><span>${vence.length === 1 ? 'matrícula vence' : 'matrículas vencem'} em até ${SEC_AVISO_DIAS} dias</span></div>
        <div class="sw-alert-foot"><span><b>${vencidas}</b>já ${vencidas === 1 ? 'venceu' : 'venceram'}</span><span><b>${remat.length}</b>na janela de rematrícula</span></div>
      </section>

      ${widget('sw-exp', 'clock', 'Expiração próxima', vence.length, vence.length ? vence.slice(0, 40).map((m) => person(m, m.expiracao, venceTag(m), venceTone(m))).join('') : empty('check', `Nenhuma matrícula ativa vence nos próximos ${SEC_AVISO_DIAS} dias.`))}

      <section class="sw sw-bday">
        <header><span class="sw-ico"><i data-icon="party"></i></span><h2>Aniversariantes</h2><b class="sw-n">${niver.length}</b></header>
        <div class="sw-body">${niver.length ? niver.map((a) => {
          const tel = secPhoneDigits(a.celular), anos = a.nascimento ? now.getFullYear() - +a.nascimento.slice(0, 4) : 0;
          return `<div class="sw-bday-row"><span class="sw-av">${esc(initials(a.nome))}</span><a class="sw-row-t" href="#secretaria/aluno/${a.id}"><b>${esc(a.nome)}</b><small>${anos ? `faz ${anos} anos hoje` : 'aniversário hoje'}</small></a>
            ${tel ? `<a class="sw-wa" target="_blank" rel="noopener" href="https://wa.me/55${tel}?text=${encodeURIComponent(`Feliz aniversário, ${a.nome.split(' ')[0]}! 🎉 Toda a equipe do HC Instituto Educacional deseja um dia muito especial.`)}">Parabéns</a>` : ''}</div>`;
        }).join('') : '<p class="sw-bday-none">Ninguém faz aniversário hoje.</p>'}</div>
      </section>

      ${widget('sw-aval', 'report', 'Avaliações do mês', aval.length, aval.length ? aval.map((m) => person(m, m.avaliacao)).join('') : empty('report', 'Nenhuma avaliação marcada para este mês.'))}
      ${widget('sw-remat', 'refresh', 'Rematrículas', remat.length, remat.length ? remat.map(([m, j]) => person(m, j.fecha, `<span class="sw-chip ${SEC_JANELA[j.fase][1]}">${secJanelaTxt(j)}</span>`, j.fase === 'atrasada' ? 'bad' : j.fase === 'fechando' ? 'warn' : '')).join('') : empty('refresh', 'Nenhum aluno na janela de rematrícula (dia 25 ao dia 10).'))}
      ${widget('sw-pend', 'bell', 'Pendências', pend.length, pend.length ? pend.map(secPendRow).join('') : empty('check', 'Nenhuma pendência em aberto.'), '<button type="button" class="sw-add" data-pend-new aria-label="Nova pendência"><i data-icon="plus"></i></button>')}
      ${widget('sw-task', 'check', 'Tarefas do setor', tarefas, secTarefas())}
    </div>`;
  secShell(view, '', 'Início', '', body);
  secBindPend(view); secBindTarefas(view);
}

/* ---------- pendências ---------- */
function secPendRow(p) {
  const a = p.aluno_id && secAluno(p.aluno_id);
  return `<div class="sc-pend" data-pend="${p.id}">
    <button type="button" class="sc-check${p.status === 'resolvida' ? ' on' : ''}" data-pend-done aria-label="${p.status === 'resolvida' ? 'Resolvida' : 'Marcar como resolvida'}"><i data-icon="check"></i></button>
    <button type="button" class="sc-pend-t" data-pend-open><b>${esc(p.titulo)}</b>
      <small>${a ? esc(a.nome) + ' · ' : ''}${p.protocolo ? 'Protocolo ' + esc(p.protocolo) + ' · ' : ''}${secDate(p.created_at.slice(0, 10))}${p.status === 'resolvida' && p.resolvida_em ? ' · resolvida em ' + secDate(p.resolvida_em.slice(0, 10)) : ''}</small>
      ${p.obs ? `<span>${esc(p.obs)}</span>` : ''}</button>
  </div>`;
}
function secPendSheet(p = null, alunoId = null) {
  const alunos = SEC.alunos.map((a) => [a.id, `${a.nome} · ${secCpfFmt(a.cpf)}`]);
  const sel = p?.aluno_id || alunoId || '';
  secSheet(p ? 'Pendência' : 'Nova pendência', `
    ${secField('O que precisa ser resolvido *', `<input name="titulo" maxlength="200" required value="${esc(p?.titulo || '')}" placeholder="Ex.: Solicitar declaração de matrícula">`)}
    ${secField('Aluno', `<select name="aluno_id">${secOpts(alunos, sel, 'Sem aluno (do setor)')}</select>`)}
    ${secField('Nº do protocolo', `<input name="protocolo" maxlength="60" value="${esc(p?.protocolo || '')}">`)}
    ${secField('Observações', `<textarea name="obs" rows="4" maxlength="2000">${esc(p?.obs || '')}</textarea>`)}`, {
    onSave: async (f, say) => {
      const row = { titulo: secVal(f, 'titulo'), aluno_id: secVal(f, 'aluno_id'), protocolo: secVal(f, 'protocolo'), obs: secVal(f, 'obs') };
      if (!row.titulo || row.titulo.length < 2) return say('Escreva o que precisa ser resolvido.'), false;
      const q = p ? sb.from('sec_pendencias').update(row).eq('id', p.id) : sb.from('sec_pendencias').insert(row);
      const { data, error } = await q.select().single(); if (error) throw error;
      if (p) Object.assign(p, data); else SEC.pend.push(data);
      toast(p ? 'Pendência atualizada.' : 'Pendência registrada.'); route();
    },
    danger: p && { label: 'Excluir', run: async () => {
      if (!(await confirmDialog({ title: 'Excluir esta pendência?', sub: 'Ela some do histórico. Para encerrar normalmente, marque como resolvida.' }))) return false;
      const { error } = await sb.from('sec_pendencias').delete().eq('id', p.id); if (error) return toast(secErr(error)), false;
      SEC.pend = SEC.pend.filter((x) => x.id !== p.id); route();
    } },
  });
}
function secBindPend(root, alunoId = null) {
  root.querySelector('[data-pend-new]')?.addEventListener('click', () => secPendSheet(null, alunoId));
  root.querySelectorAll('[data-pend]').forEach((el) => {
    const p = SEC.pend.find((x) => x.id === el.dataset.pend);
    el.querySelector('[data-pend-open]').addEventListener('click', () => secPendSheet(p));
    el.querySelector('[data-pend-done]').addEventListener('click', async () => {
      const done = p.status !== 'resolvida';
      const row = done ? { status: 'resolvida', resolvida_em: new Date().toISOString(), resolvida_por: auth.user?.id } : { status: 'aberta', resolvida_em: null, resolvida_por: null };
      const { error } = await sb.from('sec_pendencias').update(row).eq('id', p.id);
      if (error) return toast(secErr(error));
      Object.assign(p, row); toast(done ? 'Pendência resolvida.' : 'Pendência reaberta.'); route();
    });
  });
}

/* ---------- tarefas ---------- */
function secTarefas() {
  const list = [...SEC.tarefas].sort((a, b) => a.feita - b.feita || b.created_at.localeCompare(a.created_at));
  return `
    <form class="sc-task-add" data-task-add><input name="t" maxlength="300" placeholder="Anotar uma tarefa…" aria-label="Nova tarefa"><button class="sc-mini" type="submit"><i data-icon="plus"></i>Anotar</button></form>
    ${list.length ? list.map((t) => `<div class="sc-task${t.feita ? ' done' : ''}" data-task="${t.id}">
      <button type="button" class="sc-check${t.feita ? ' on' : ''}" data-task-done aria-label="${t.feita ? 'Desmarcar' : 'Marcar como feita'}"><i data-icon="check"></i></button>
      <span>${esc(t.texto)}</span><button type="button" class="sc-x sm" data-task-del aria-label="Apagar tarefa"><i data-icon="x"></i></button></div>`).join('') : '<p class="sc-empty">Nenhuma tarefa anotada.</p>'}`;
}
function secBindTarefas(root) {
  root.querySelector('[data-task-add]')?.addEventListener('submit', async (e) => {
    e.preventDefault(); const texto = e.target.t.value.trim(); if (!texto) return;
    const { data, error } = await sb.from('sec_tarefas').insert({ texto }).select().single();
    if (error) return toast(secErr(error));
    SEC.tarefas.push(data); route();
  });
  root.querySelectorAll('[data-task]').forEach((el) => {
    const t = SEC.tarefas.find((x) => x.id === el.dataset.task);
    el.querySelector('[data-task-done]').addEventListener('click', async () => {
      const row = { feita: !t.feita, feita_em: t.feita ? null : new Date().toISOString() };
      const { error } = await sb.from('sec_tarefas').update(row).eq('id', t.id); if (error) return toast(secErr(error));
      Object.assign(t, row); route();
    });
    el.querySelector('[data-task-del]').addEventListener('click', async () => {
      const { error } = await sb.from('sec_tarefas').delete().eq('id', t.id); if (error) return toast(secErr(error));
      SEC.tarefas = SEC.tarefas.filter((x) => x.id !== t.id); route();
    });
  });
}

/* =========================================================
   ALUNOS — lista com busca e filtros
   ========================================================= */
const secListState = { q: '', status: '', fac: '', page: 1 };
const SEC_POR_PAGINA = 25;
function secAlunos(view, status) {
  if (status != null && status !== secListState.status) { secListState.status = status; secListState.page = 1; }
  const facs = secLista('faculdade', true);
  const body = `
    <div class="sc-tools">
      <label class="sc-search"><i data-icon="search"></i><input type="search" id="sc-q" placeholder="Buscar por nome, CPF ou código" value="${esc(secListState.q)}" autocomplete="off"></label>
      <select id="sc-fac" aria-label="Faculdade">${secOpts(facs.map((f) => [f.id, f.nome]), secListState.fac, 'Todas as faculdades')}</select>
    </div>
    <div class="sc-chips" role="tablist">
      <button type="button" data-st="" class="${!secListState.status ? 'on' : ''}">Todos</button>
      ${Object.entries(SEC_STATUS).map(([s, [t, c]]) => `<button type="button" data-st="${s}" style="--c:${c}" class="${secListState.status === s ? 'on' : ''}"><i></i>${t}</button>`).join('')}
    </div>
    <p class="sc-result" id="sc-count"></p>
    <div class="sc-list" id="sc-list"></div>
    <nav class="sc-pager" id="sc-pager" aria-label="Páginas da lista"></nav>`;
  secShell(view, 'alunos', 'Alunos', 'Toque num aluno para abrir a ficha completa.', body);
  const draw = () => {
    const q = secFold(secListState.q.trim()), qd = q.replace(/\D/g, '');
    let list = SEC.alunos.filter((a) => {
      if (q && !(secFold(a.nome).includes(q) || (qd && (a.cpf.includes(qd) || String(a.codigo) === qd)))) return false;
      const ms = secMatsDe(a.id);
      if (secListState.status && !ms.some((m) => m.status === secListState.status)) return false;
      if (secListState.fac && !ms.some((m) => secCurso(m.curso_id)?.faculdade_id === secListState.fac)) return false;
      return true;
    });
    // páginas de 50: 1 2 3 … (a página escolhida fica guardada ao abrir uma ficha e voltar)
    const total = list.length, pages = Math.max(1, Math.ceil(total / SEC_POR_PAGINA));
    const pg = secListState.page = Math.min(Math.max(1, secListState.page), pages);
    const de = (pg - 1) * SEC_POR_PAGINA;
    const fmt = (n) => n.toLocaleString('pt-BR');
    $('#sc-count').textContent = total > SEC_POR_PAGINA ? `${fmt(de + 1)}–${fmt(Math.min(de + SEC_POR_PAGINA, total))} de ${fmt(total)} alunos` : `${fmt(total)} ${total === 1 ? 'aluno' : 'alunos'}`;
    list = list.slice(de, de + SEC_POR_PAGINA);
    $('#sc-list').innerHTML = list.length ? list.map((a) => {
      const ms = secMatsDe(a.id), m = ms[0], c = m && secCurso(m.curso_id);
      return `<a class="sc-item" href="#secretaria/aluno/${a.id}">
        <span class="sc-av">${esc(initials(a.nome))}</span>
        <span class="sc-item-t"><b>${esc(a.nome)}</b><small>Cód. ${a.codigo} · CPF ${secCpfFmt(a.cpf)}${a.celular ? ' · ' + esc(a.celular) : ''}</small></span>
        <span class="sc-item-c">${c ? `<small>${esc(c.nome)}${ms.length > 1 ? ` <em>+${ms.length - 1}</em>` : ''}</small>` : '<small class="sc-faint">Sem matrícula</small>'}${m ? secStatusPill(m.status) : ''}</span>
        <i data-icon="right" class="sc-go"></i></a>`;
    }).join('')
      : `<div class="sc-none"><p>Nenhum aluno encontrado.</p><a class="btn-dark" href="#secretaria/aluno/novo">Cadastrar aluno</a></div>`;
    paintIcons($('#sc-list'));
    // números das páginas: sempre a 1ª e a última, e as vizinhas da atual (1 … 4 5 6 … 42)
    const nums = [...new Set([1, pg - 2, pg - 1, pg, pg + 1, pg + 2, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
    const btns = []; nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) btns.push('<span class="sc-pg-gap">…</span>'); btns.push(`<button type="button" data-pg="${n}" class="${n === pg ? 'on' : ''}"${n === pg ? ' aria-current="page"' : ''}>${n}</button>`); });
    $('#sc-pager').innerHTML = pages > 1 ? `
      <button type="button" class="sc-pg-arrow" data-pg="${pg - 1}" ${pg === 1 ? 'disabled' : ''} aria-label="Página anterior"><i data-icon="left"></i></button>
      ${btns.join('')}
      <button type="button" class="sc-pg-arrow" data-pg="${pg + 1}" ${pg === pages ? 'disabled' : ''} aria-label="Próxima página"><i data-icon="right"></i></button>` : '';
    paintIcons($('#sc-pager'));
  };
  $('#sc-pager').addEventListener('click', (e) => {
    const b = e.target.closest('[data-pg]'); if (!b || b.disabled) return;
    secListState.page = +b.dataset.pg; draw();
    const top = $('.sc-tools').getBoundingClientRect().top + window.scrollY - 110;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
  });
  $('#sc-q').addEventListener('input', (e) => { secListState.q = e.target.value; secListState.page = 1; draw(); });
  $('#sc-fac').addEventListener('change', (e) => { secListState.fac = e.target.value; secListState.page = 1; draw(); });
  view.querySelectorAll('[data-st]').forEach((b) => b.addEventListener('click', () => {
    secListState.status = b.dataset.st; secListState.page = 1; history.replaceState(null, '', '#secretaria/alunos' + (b.dataset.st ? '/' + b.dataset.st : ''));
    view.querySelectorAll('[data-st]').forEach((x) => x.classList.toggle('on', x === b)); draw();
  }));
  draw();
}

/* =========================================================
   FICHA DO ALUNO
   ========================================================= */
let secTab = 'matriculas', secOpenMat = null;
const SEC_FICHA_TABS = ['matriculas', 'pendencias', 'convalidacao'];
function secFicha(view, id) {
  const a = id === 'novo' ? null : secAluno(id);
  if (id !== 'novo' && !a) { secShell(view, 'alunos', 'Aluno não encontrado', 'Ele pode ter sido excluído.', '<a class="btn-dark" href="#secretaria/alunos">Ver alunos</a>'); return; }
  const v = (k) => esc(a?.[k] ?? '');
  const sel = (k, tipo) => `<select name="${k}">${secOpts(secLista(tipo).map((l) => l.nome).concat(a?.[k] && !secLista(tipo).some((l) => l.nome === a[k]) ? [a[k]] : []), a?.[k])}</select>`;
  const form = `
  <form class="sc-ficha" id="sc-ficha" novalidate autocomplete="off">
    <section class="sc-block"><h3><i data-icon="user"></i>Dados pessoais</h3>
      <div class="sc-cols">
        ${secField('Nome completo *', `<input name="nome" required maxlength="160" value="${v('nome')}">`, 'span2')}
        ${secField('CPF *', `<input name="cpf" inputmode="numeric" maxlength="14" value="${a ? secCpfFmt(a.cpf) : ''}" placeholder="000.000.000-00">`)}
        ${secField('Data de nascimento', `<input type="date" name="nascimento" value="${v('nascimento')}">`)}
        ${secField('RG (identidade)', `<input name="rg" maxlength="30" value="${v('rg')}">`)}
        ${secField('Sexo', `<select name="sexo">${secOpts(SEC_SEXO, a?.sexo)}</select>`)}
        ${secField('Etnia', sel('etnia', 'etnia'))}
        ${secField('Naturalidade', `<input name="naturalidade" maxlength="80" value="${v('naturalidade')}" placeholder="Cidade - UF">`)}
        ${secField('Nome da mãe', `<input name="mae" maxlength="160" value="${v('mae')}">`, 'span2')}
        ${secField('Nome do pai', `<input name="pai" maxlength="160" value="${v('pai')}">`, 'span2')}
      </div>
    </section>
    <section class="sc-block"><h3><i data-icon="phone"></i>Contato e endereço</h3>
      <div class="sc-cols">
        ${secField('Celular / WhatsApp', `<input name="celular" inputmode="tel" maxlength="20" value="${v('celular')}" placeholder="(98) 90000-0000">`)}
        ${secField('Telefone', `<input name="telefone" inputmode="tel" maxlength="20" value="${v('telefone')}">`)}
        ${secField('E-mail', `<input type="email" name="email" maxlength="120" value="${v('email')}">`, 'span2')}
        ${secField('CEP', `<input name="cep" inputmode="numeric" maxlength="9" value="${v('cep')}" placeholder="00000-000"><small class="sc-hint" id="sc-cep-hint">Digite o CEP para preencher o endereço.</small>`)}
        ${secField('Endereço', `<input name="endereco" maxlength="160" value="${v('endereco')}">`, 'span2')}
        ${secField('Nº', `<input name="numero" maxlength="12" value="${v('numero')}">`)}
        ${secField('Complemento', `<input name="complemento" maxlength="80" value="${v('complemento')}">`)}
        ${secField('Bairro', `<input name="bairro" maxlength="80" value="${v('bairro')}">`)}
        ${secField('Cidade', `<input name="cidade" maxlength="80" value="${v('cidade')}">`)}
        ${secField('Estado', `<select name="estado">${secOpts(SEC_UF, a?.estado || (a ? '' : 'MA'), 'UF')}</select>`)}
      </div>
    </section>
    <section class="sc-block"><h3><i data-icon="cap"></i>Formação e origem</h3>
      <div class="sc-cols">
        ${secField('Grau de instrução', sel('instrucao', 'instrucao'))}
        ${secField('Formação', sel('formacao', 'formacao'))}
        ${secField('Instituição onde estudou', `<input name="instituicao" maxlength="120" value="${v('instituicao')}">`)}
        ${secField('Ano de conclusão', `<input name="ano_formacao" inputmode="numeric" maxlength="4" value="${v('ano_formacao')}">`)}
        ${secField('Como conheceu o polo', sel('conhecimento', 'conhecimento'))}
        ${secField('Indicado por', `<input name="indicacao" maxlength="160" value="${v('indicacao')}" placeholder="Nome de quem indicou">`)}
        ${secField('Observações', `<textarea name="obs" rows="3" maxlength="3000">${v('obs')}</textarea>`, 'span4')}
      </div>
    </section>
    <div class="sc-savebar">
      <p class="sc-msg" id="sc-ficha-msg" role="alert"></p>
      ${a ? '<button type="button" class="btn-soft sc-danger" id="sc-del">Excluir aluno</button>' : ''}
      <button type="submit" class="btn-dark">${a ? 'Salvar alterações' : 'Cadastrar aluno'}</button>
    </div>
  </form>`;

  if (!SEC_FICHA_TABS.includes(secTab)) secTab = 'matriculas';
  const mats = a ? secMatsDe(a.id) : [];
  const pend = a ? SEC.pend.filter((p) => p.aluno_id === a.id).sort((x, y) => (x.status === 'aberta' ? -1 : 1) - (y.status === 'aberta' ? -1 : 1) || y.created_at.localeCompare(x.created_at)) : [];
  const tabs = a ? `
  <section class="sc-tabs-wrap">
    <div class="sc-tabs" role="tablist">
      ${[['matriculas', `Matrículas <em>${mats.length}</em>`], ['pendencias', `Pendências <em>${pend.filter((p) => p.status === 'aberta').length}</em>`], ['convalidacao', 'Convalidação']]
        .map(([k, t]) => `<button type="button" role="tab" data-tab="${k}" class="${secTab === k ? 'on' : ''}">${t}</button>`).join('')}
    </div>
    <div class="sc-tab" data-pane="matriculas"${secTab === 'matriculas' ? '' : ' hidden'}>
      <button type="button" class="btn-dark sc-addmat" data-mat-new><i data-icon="plus"></i>Nova matrícula</button>
      ${mats.length ? mats.map(secMatCard).join('') : '<p class="sc-empty">Este aluno ainda não tem matrícula.</p>'}
    </div>
    <div class="sc-tab" data-pane="pendencias"${secTab === 'pendencias' ? '' : ' hidden'}>
      <button type="button" class="btn-dark sc-addmat" data-pend-new><i data-icon="plus"></i>Nova pendência</button>
      ${pend.length ? pend.map(secPendRow).join('') : '<p class="sc-empty">Nenhuma pendência para este aluno.</p>'}
    </div>
    ${['convalidacao'].map((k) => `<div class="sc-tab" data-pane="${k}"${secTab === k ? '' : ' hidden'}><p class="sc-empty">Em breve.</p></div>`).join('')}
  </section>` : '';

  secShell(view, 'alunos', a ? esc(a.nome) : 'Novo aluno',
    a ? `Código ${a.codigo} · cadastrado em ${secDate(a.created_at.slice(0, 10))}${a.updated_at && a.updated_at.slice(0, 16) !== a.created_at.slice(0, 16) ? ' · alterado em ' + secDate(a.updated_at.slice(0, 10)) : ''}` : 'Preencha os dados. Só nome e CPF são obrigatórios.',
    `<a class="sc-back" href="#secretaria/alunos"><i data-icon="left"></i>Alunos</a>${a ? tabs : ''}${form}`);

  const f = $('#sc-ficha'), msg = $('#sc-ficha-msg');
  // máscaras simples
  f.cpf.addEventListener('input', () => { const d = f.cpf.value.replace(/\D/g, '').slice(0, 11); f.cpf.value = d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2'); });
  ['celular', 'telefone'].forEach((k) => f[k].addEventListener('input', () => {
    const d = f[k].value.replace(/\D/g, '').slice(0, 11);
    f[k].value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
  }));
  // CEP: preenche o endereço (serviço público ViaCEP; só o CEP é enviado)
  f.cep.addEventListener('input', async () => {
    const d = f.cep.value.replace(/\D/g, '').slice(0, 8);
    f.cep.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    if (d.length !== 8) return;
    const hint = $('#sc-cep-hint'); hint.textContent = 'Buscando endereço…';
    try {
      const r = await (await fetch(`https://viacep.com.br/ws/${d}/json/`)).json();
      if (r.erro) { hint.textContent = 'CEP não encontrado. Preencha o endereço à mão.'; return; }
      if (r.logradouro) f.endereco.value = r.logradouro;
      if (r.bairro) f.bairro.value = r.bairro;
      if (r.localidade) f.cidade.value = r.localidade;
      if (r.uf) f.estado.value = r.uf;
      hint.textContent = 'Endereço preenchido. Confira e complete o número.'; f.numero.focus();
    } catch { hint.textContent = 'Não foi possível buscar o CEP agora.'; }
  });
  f.addEventListener('submit', async (e) => {
    e.preventDefault(); msg.textContent = '';
    const row = {};
    ['nome', 'nascimento', 'rg', 'sexo', 'etnia', 'naturalidade', 'mae', 'pai', 'instrucao', 'formacao', 'instituicao', 'indicacao', 'conhecimento',
      'cep', 'endereco', 'numero', 'complemento', 'bairro', 'estado', 'cidade', 'email', 'celular', 'telefone', 'obs'].forEach((k) => { row[k] = secVal(f, k); });
    row.cpf = f.cpf.value.replace(/\D/g, '');
    row.ano_formacao = secVal(f, 'ano_formacao') ? +secVal(f, 'ano_formacao') : null;
    if (!row.nome || row.nome.length < 3) { msg.textContent = 'Informe o nome completo.'; return f.nome.focus(); }
    if (!cpfOk(row.cpf)) { msg.textContent = 'CPF inválido. Confira os números.'; return f.cpf.focus(); }
    const dup = SEC.alunos.find((x) => x.cpf === row.cpf && x.id !== a?.id);
    if (dup) { msg.innerHTML = `Já existe um aluno com esse CPF: <a href="#secretaria/aluno/${dup.id}">${esc(dup.nome)}</a>.`; return; }
    if (row.ano_formacao && (row.ano_formacao < 1900 || row.ano_formacao > 2100)) { msg.textContent = 'Ano de conclusão inválido.'; return f.ano_formacao.focus(); }
    const btn = f.querySelector('[type=submit]'); btn.disabled = true;
    const q = a ? sb.from('sec_alunos').update(row).eq('id', a.id) : sb.from('sec_alunos').insert(row);
    const { data, error } = await q.select().single();
    btn.disabled = false;
    if (error) { msg.textContent = secErr(error); return; }
    if (a) { Object.assign(a, data); toast('Ficha salva.'); route(); }
    else { SEC.alunos.push(data); toast('Aluno cadastrado. Agora escolha o curso.'); secTab = 'matriculas'; secOpenMat = data.id; location.hash = `#secretaria/aluno/${data.id}`; }
  });
  $('#sc-del')?.addEventListener('click', async () => {
    if (!(await confirmDialog({ title: `Excluir ${a.nome}?`, sub: 'A ficha, as matrículas e as pendências deste aluno serão apagadas. Não dá para desfazer.' }))) return;
    const { error } = await sb.from('sec_alunos').delete().eq('id', a.id);
    if (error) return toast(secErr(error));
    SEC.alunos = SEC.alunos.filter((x) => x.id !== a.id); SEC.mats = SEC.mats.filter((m) => m.aluno_id !== a.id); SEC.pend = SEC.pend.filter((p) => p.aluno_id !== a.id);
    toast('Aluno excluído.'); location.hash = '#secretaria/alunos';
  });
  if (!a) return;
  view.querySelectorAll('.sc-tabs [data-tab]').forEach((b) => b.addEventListener('click', () => {
    secTab = b.dataset.tab;
    view.querySelectorAll('.sc-tabs [data-tab]').forEach((x) => x.classList.toggle('on', x === b));
    view.querySelectorAll('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== secTab; });
  }));
  view.querySelector('[data-mat-new]').addEventListener('click', () => secMatSheet(a));
  if (secOpenMat === a.id) { secOpenMat = null; setTimeout(() => secMatSheet(a), 350); } // aluno recém-cadastrado: já pede o curso
  view.querySelectorAll('[data-mat]').forEach((el) => {
    const m = SEC.mats.find((x) => x.id === el.dataset.mat);
    el.querySelector('[data-mat-edit]').addEventListener('click', () => secMatSheet(a, m));
    el.querySelector('[data-mat-renew]')?.addEventListener('click', () => secRenew(m));
    el.querySelectorAll('[data-doc]').forEach((b) => b.addEventListener('click', async () => {
      const docs = { ...(m.documentos || {}) };
      if (docs[b.dataset.doc]) delete docs[b.dataset.doc]; else docs[b.dataset.doc] = secToday();
      const { error } = await sb.from('sec_matriculas').update({ documentos: docs }).eq('id', m.id);
      if (error) return toast(secErr(error));
      m.documentos = docs; secOpenDocs = m.id; route();
    }));
    el.querySelector('[data-pass-show]')?.addEventListener('click', (e) => secShowPass(m, e.currentTarget));
    el.querySelector('[data-pass-copy]')?.addEventListener('click', () => secCopyPass(m));
    el.querySelector('[data-login-copy]')?.addEventListener('click', () => navigator.clipboard?.writeText(m.login).then(() => toast('Login copiado.')));
  });
  secBindPend(view.querySelector('[data-pane="pendencias"]'), a.id);
}

/* ---------- cartão de matrícula ---------- */
let secOpenDocs = null;
function secMatCard(m) {
  const c = secCurso(m.curso_id), tipo = secTipoDoCurso(c), d = m.expiracao ? secDays(m.expiracao) : null;
  let prog = null;
  if (m.inicio && m.expiracao) { const tot = secDays(m.expiracao) - secDays(m.inicio); prog = tot > 0 ? Math.min(1, Math.max(0, -secDays(m.inicio) / tot)) : 1; }
  if (m.status === 'concluido') prog = 1;
  const ativo = m.status === 'ativo', alerta = ativo && d != null && d <= SEC_AVISO_DIAS;
  const plural = (n) => `${n} ${n === 1 ? 'dia' : 'dias'}`;
  const prazo = !ativo ? SEC_STATUS[m.status]?.[0] : d == null ? 'Sem data de expiração' : d < 0 ? `Venceu há ${plural(-d)}` : d === 0 ? 'Vence hoje' : `Faltam ${plural(d)}`;
  const j = secJanela(m), docs = secLista('documento'), docOk = docs.filter((dc) => (m.documentos || {})[dc.id]).length;
  const pp = secPeriodo(m);
  const info = [['Turma', m.turma], ['Período', pp ? `${secPerTxt(pp)}${pp.final && m.status === 'ativo' && !pp.passou ? ' · último' : ''}` : m.periodo],
    ['Conclusão prevista', pp?.fim && m.status === 'ativo' ? `${secDate(pp.fim).slice(3)}${pp.passou ? ' (prazo encerrado)' : ''}` : ''], ['Nº da matrícula', m.numero], ['Próxima avaliação', m.avaliacao && secDate(m.avaliacao)]].filter(([, v]) => v);
  return `<article class="sm${alerta ? ' alert' : ''}" data-mat="${m.id}" style="--c:${SEC_STATUS[m.status]?.[1]}">
    <header class="sm-top">
      <span class="sm-ico"><i data-icon="cap"></i></span>
      <div class="sm-title"><h4>${esc(c?.nome || 'Curso não informado')}</h4><p>${[tipo?.nome, secLNome(c?.faculdade_id)].filter(Boolean).map(esc).join(' · ') || '&nbsp;'}</p></div>
      <span class="sm-status"><i></i>${SEC_STATUS[m.status]?.[0] || m.status}</span>
    </header>
    <div class="sm-time">
      <div class="sm-time-head"><b class="${alerta ? 'bad' : ''}">${prazo}</b>${prog != null ? `<span>${Math.round(prog * 100)}% do período</span>` : ''}</div>
      <span class="sm-bar"><i style="--p:${(prog ?? 0).toFixed(3)}"></i></span>
      <div class="sm-dates">
        <span><small>Início</small>${secCal(m.inicio) || '<em>—</em>'}<b>${m.inicio ? m.inicio.slice(0, 4) : ''}</b></span>
        <span class="r"><small>Expiração</small>${secCal(m.expiracao, alerta ? (d < 0 ? 'bad' : 'warn') : '') || '<em>—</em>'}<b>${m.expiracao ? m.expiracao.slice(0, 4) : ''}</b></span>
      </div>
    </div>
    ${j && j.fase !== 'antes' ? `<p class="sm-janela ${SEC_JANELA[j.fase][1]}"><i data-icon="refresh"></i><b>${SEC_JANELA[j.fase][0]}</b><span>${secJanelaTxt(j)}</span></p>`
      : j ? `<p class="sm-janela"><i data-icon="calendar"></i><b>Próxima rematrícula</b><span>${secDate(j.abre).slice(0, 5)} a ${secDate(j.fecha).slice(0, 5)}</span></p>` : ''}
    ${docs.length ? `<details class="sm-docs${docOk === docs.length ? ' done' : ''}"${secOpenDocs === m.id ? ' open' : ''}>
      <summary><span class="sm-docs-ring" style="--p:${(docOk / docs.length).toFixed(3)}"></span><b>Documentos</b><span>${docOk} de ${docs.length} enviados</span><i data-icon="chevron"></i></summary>
      <ul>${docs.map((dc) => { const em = (m.documentos || {})[dc.id]; return `<li><button type="button" class="sm-doc${em ? ' on' : ''}" data-doc="${dc.id}" aria-pressed="${!!em}">
        <span class="sc-check${em ? ' on' : ''}"><i data-icon="check"></i></span><span class="sm-doc-n">${esc(dc.nome)}</span><small>${em ? 'Enviado ' + secDate(em).slice(0, 5) : 'Pendente'}</small></button></li>`; }).join('')}</ul>
    </details>` : ''}
    ${info.length ? `<dl class="sm-info">${info.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
    ${m.login || m.tem_senha ? `<div class="sm-cred"><span class="sm-cred-ico"><i data-icon="key"></i></span><div class="sm-cred-in">
      ${m.login ? `<p><small>Login</small><b>${esc(m.login)}</b><button type="button" class="sc-ib" data-login-copy aria-label="Copiar login"><i data-icon="copy"></i></button></p>` : ''}
      ${m.tem_senha ? `<p><small>Senha</small><b class="sc-pass">••••••••</b><button type="button" class="sc-ib" data-pass-show aria-label="Mostrar senha"><i data-icon="eye"></i></button><button type="button" class="sc-ib" data-pass-copy aria-label="Copiar senha"><i data-icon="copy"></i></button></p>` : ''}
    </div></div>` : ''}
    ${m.obs ? `<p class="sm-obs">${esc(m.obs)}</p>` : ''}
    <footer class="sm-foot">
      ${ativo && tipo?.meses && tipo.meses < 12 ? `<button type="button" class="sm-btn" data-mat-renew><i data-icon="refresh"></i>Rematricular</button>` : ''}
      <button type="button" class="sm-btn" data-mat-edit><i data-icon="edit"></i>Editar</button>
    </footer>
  </article>`;
}
async function secShowPass(m, btn) {
  const span = btn.parentElement.querySelector('.sc-pass');
  if (span.dataset.open) { span.textContent = '••••••••'; delete span.dataset.open; return; }
  const { data, error } = await sb.rpc('sec_ver_senha', { p_matricula: m.id });
  if (error) return toast(secErr(error));
  span.textContent = data || ''; span.dataset.open = '1';
  setTimeout(() => { if (span.isConnected && span.dataset.open) { span.textContent = '••••••••'; delete span.dataset.open; } }, 15000); // esconde de novo sozinha
}
async function secCopyPass(m) {
  const { data, error } = await sb.rpc('sec_ver_senha', { p_matricula: m.id });
  if (error) return toast(secErr(error));
  try { await navigator.clipboard.writeText(data || ''); toast('Senha copiada.'); } catch { toast('Não foi possível copiar.'); }
}
// início do novo período pela data da rematrícula (calendário da FAVENI):
// do dia 25 ao fim do mês → dia 1º do mês seguinte; do dia 1 ao 10 → dia 1º do próprio mês;
// fora da janela (11 a 24) a faculdade não aceita rematrícula
const secForaJanela = (data) => { const d = +data.slice(8, 10); return d > 10 && d < 25; };
function secInicioPeriodo(data) {
  const [y, m, d] = data.split('-').map(Number);
  if (d >= 25) { const t = new Date(y, m, 1); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-01`; }
  if (d <= 10) return `${y}-${String(m).padStart(2, '0')}-01`;
  return data;
}
// período que começa na rematrícula: o atual + 1 (ou mais, se ficou mais de um ciclo sem rematricular)
function secProxPeriodo(m, ini) {
  const p0 = secPerNum(m.periodo), c = secCurso(m.curso_id), tipo = secTipoDoCurso(c); if (!p0 || !tipo?.meses) return null;
  let k = 0; if (m.inicio) while (k < 60 && secAddMonths(m.inicio, tipo.meses * (k + 1)) <= ini) k++;
  const n = p0 + Math.max(1, k);
  return c?.periodos ? Math.min(n, c.periodos) : n;
}
// renovação: o novo período conta a partir da rematrícula (atraso empurra o fim do curso)
function secRenew(m) {
  const tipo = secTipoDoCurso(secCurso(m.curso_id)); if (!tipo?.meses) return;
  const a = secAluno(m.aluno_id);
  const { form } = secSheet('Rematrícula', `
    <p class="sc-sheet-sub">${esc(a?.nome || '')} · ${esc(secCurso(m.curso_id)?.nome || '')}</p>
    ${secField('Data da rematrícula', `<input type="date" name="data" value="${secToday()}" required>`)}
    <p class="sc-hint" id="sc-renew-hint"></p>`, {
    saveLabel: 'Rematricular',
    onSave: async (f, say) => {
      const data = f.data.value; if (!data) return say('Informe a data da rematrícula.'), false;
      if (secForaJanela(data)) return say('Fora da janela: a rematrícula só é feita do dia 25 ao dia 10.'), false;
      const ini = secInicioPeriodo(data), row = { inicio: ini, expiracao: secAddMonths(ini, tipo.meses) };
      const prox = secProxPeriodo(m, ini); if (prox) row.periodo = secPerNome(prox);
      const { error } = await sb.from('sec_matriculas').update(row).eq('id', m.id); if (error) throw error;
      Object.assign(m, row); toast('Rematrícula registrada.'); route();
    },
  });
  const hint = () => {
    const v = form.data.value, el = $('#sc-renew-hint'), fora = v && secForaJanela(v), ini = v && secInicioPeriodo(v);
    el.classList.toggle('sc-warn', !!fora);
    el.textContent = !v ? '' : fora ? 'A faculdade só aceita rematrícula do dia 25 ao dia 10. Nos dias 11 a 24 ela fica fechada; aguarde a próxima janela.'
      : `Novo período: ${secDate(ini)} até ${secDate(secAddMonths(ini, tipo.meses))} (${tipo.meses} meses).${(() => {
        const prox = secProxPeriodo(m, ini), tot = secCurso(m.curso_id)?.periodos, p0 = secPeriodo(m)?.n;
        if (!prox) return '';
        if (tot && p0 >= tot) return ` O aluno já está no último período (${tot}º); se terminou o curso, marque a matrícula como Concluído.`;
        return ` Passa para o ${prox}º período${tot ? ` de ${tot}${prox === tot ? ' (último)' : ''}` : ''}.`;
      })()}`;
    form.querySelector('[type=submit]').disabled = !!fora;
  };
  form.data.addEventListener('input', hint); hint();
}

/* ---------- nova matrícula / editar ---------- */
function secMatSheet(aluno, m = null) {
  const cursoAtual = m && secCurso(m.curso_id);
  const facs = secLista('faculdade', true);
  const cursosOpts = (fac) => SEC.cursos.filter((c) => (c.ativo || c.id === m?.curso_id) && (!fac || c.faculdade_id === fac))
    .sort((x, y) => x.nome.localeCompare(y.nome, 'pt')).map((c) => [c.id, `${c.nome}${secTipoDoCurso(c) ? ' · ' + secTipoDoCurso(c).nome : ''}`]);
  const listOpts = (tipo, cur) => secOpts(secLista(tipo).map((l) => l.nome).concat(cur && !secLista(tipo).some((l) => l.nome === cur) ? [cur] : []), cur);
  const { form } = secSheet(m ? 'Editar matrícula' : 'Nova matrícula', `
    <p class="sc-sheet-sub">${esc(aluno.nome)}</p>
    <div class="sc-cols c2">
      ${secField('Faculdade', `<select name="fac">${secOpts(facs.map((f) => [f.id, f.nome]), cursoAtual?.faculdade_id || (facs.length === 1 ? facs[0].id : ''), 'Todas')}</select>`)}
      ${secField('Situação *', `<select name="status">${Object.entries(SEC_STATUS).map(([s, [t]]) => `<option value="${s}"${(m?.status || 'ativo') === s ? ' selected' : ''}>${t}</option>`).join('')}</select>`)}
      ${secField('Curso *', `<select name="curso_id" required></select><small class="sc-hint" id="sc-curso-hint"></small>`, 'span2')}
      ${secField('Data de início', `<input type="date" name="inicio" value="${esc(m?.inicio || '')}">`)}
      ${secField('Expiração', `<input type="date" name="expiracao" value="${esc(m?.expiracao || '')}"><small class="sc-hint" id="sc-exp-hint"></small>`)}
      ${secField('Turma', `<select name="turma">${listOpts('turma', m?.turma)}</select>`)}
      ${secField('Período no início', `<select name="periodo">${listOpts('periodo', m?.periodo)}</select><small class="sc-hint" id="sc-per-hint"></small>`)}
      ${secField('Nº da matrícula', `<input name="numero" maxlength="40" value="${esc(m?.numero || '')}">`)}
      ${secField('Próxima avaliação', `<input type="date" name="avaliacao" value="${esc(m?.avaliacao || '')}">`)}
    </div>
    <fieldset class="sc-cred-box"><legend><i data-icon="key"></i>Acesso ao portal da faculdade</legend>
      <div class="sc-cols c2">
        ${secField('Login', `<input name="login" maxlength="120" value="${esc(m?.login || '')}" autocomplete="off">`)}
        ${secField(m?.tem_senha ? 'Nova senha <em>(em branco mantém a atual)</em>' : 'Senha', `<input name="senha" type="password" maxlength="120" autocomplete="new-password">`)}
      </div>
      <p class="sc-hint">A senha fica guardada criptografada e só administradores podem ver. Cada vez que alguém vê ou altera, fica registrado.</p>
      ${m?.tem_senha ? '<label class="sc-checkline"><input type="checkbox" name="apagar_senha"> Apagar a senha guardada</label>' : ''}
    </fieldset>
    ${secField('Observações', `<textarea name="obs" rows="3" maxlength="2000">${esc(m?.obs || '')}</textarea>`)}`, {
    wide: true,
    saveLabel: m ? 'Salvar' : 'Matricular',
    onSave: async (f, say) => {
      const row = { curso_id: secVal(f, 'curso_id'), status: f.status.value, inicio: secVal(f, 'inicio'), expiracao: secVal(f, 'expiracao'),
        turma: secVal(f, 'turma'), periodo: secVal(f, 'periodo'), numero: secVal(f, 'numero'), avaliacao: secVal(f, 'avaliacao'), login: secVal(f, 'login'), obs: secVal(f, 'obs') };
      if (!row.curso_id) return say('Escolha o curso.'), false;
      if (row.inicio && row.expiracao && row.expiracao < row.inicio) return say('A expiração não pode ser antes do início.'), false;
      if (!m) row.aluno_id = aluno.id;
      const q = m ? sb.from('sec_matriculas').update(row).eq('id', m.id) : sb.from('sec_matriculas').insert(row);
      const { data, error } = await q.select(SEC_MAT_COLS).single(); if (error) throw error;
      const senha = f.senha.value, apagar = f.apagar_senha?.checked;
      if (senha || apagar) {
        const { error: e2 } = await sb.rpc('sec_definir_senha', { p_matricula: data.id, p_senha: apagar ? '' : senha });
        if (e2) { toast('Matrícula salva, mas a senha não foi gravada.'); console.error(e2); } else data.tem_senha = !apagar;
      }
      if (m) Object.assign(m, data); else SEC.mats.push(data);
      toast(m ? 'Matrícula atualizada.' : 'Matrícula registrada.'); route();
    },
    danger: m && { label: 'Excluir matrícula', run: async () => {
      if (!(await confirmDialog({ title: 'Excluir esta matrícula?', sub: 'Para encerrar normalmente, prefira mudar a situação para Concluído, Cancelado ou Trancado.' }))) return false;
      const { error } = await sb.from('sec_matriculas').delete().eq('id', m.id); if (error) return toast(secErr(error)), false;
      SEC.mats = SEC.mats.filter((x) => x.id !== m.id); toast('Matrícula excluída.'); route();
    } },
  });
  // curso conforme a faculdade; expiração calculada pelo tipo do curso (pode ajustar à mão)
  let expManual = !!m?.expiracao;
  const fillCursos = () => {
    const cur = form.curso_id.value || m?.curso_id || '';
    const opts = cursosOpts(form.fac.value);
    form.curso_id.innerHTML = secOpts(opts, cur, opts.length ? 'Selecione o curso' : 'Nenhum curso cadastrado');
  };
  const calc = () => {
    const c = secCurso(form.curso_id.value), tipo = secTipoDoCurso(c);
    $('#sc-curso-hint').textContent = c ? [tipo?.nome, secLNome(c.area_id), c.ch && c.ch + ' h'].filter(Boolean).join(' · ') : (SEC.cursos.length ? '' : 'Cadastre os cursos na aba Cursos.');
    const hint = $('#sc-exp-hint');
    if (!tipo?.meses) { hint.textContent = ''; return; }
    if (!expManual && form.inicio.value) form.expiracao.value = secAddMonths(form.inicio.value, tipo.meses);
    hint.textContent = `${tipo.nome}: ${tipo.meses} meses após o início${expManual ? ' (ajustada à mão)' : ''}.`;
  };
  // período: mostra na hora em que período o aluno está hoje e quando termina o curso
  const perHint = () => {
    const el = $('#sc-per-hint'); if (!el) return;
    const pp = secPeriodo({ periodo: form.periodo.value, curso_id: form.curso_id.value, inicio: form.inicio.value, status: form.status.value });
    const c = secCurso(form.curso_id.value);
    el.textContent = !pp ? 'Em que período o aluno estava na data de início; depois avança sozinho.'
      : `Hoje: ${secPerTxt(pp)}${pp.fim ? ` · conclusão prevista ${secDate(pp.fim).slice(3)}` : ''}${c && !c.periodos ? ' · informe o nº de períodos do curso na aba Cursos' : ''}.`;
  };
  ['periodo', 'curso_id', 'inicio', 'status'].forEach((k) => form[k].addEventListener('change', perHint));
  form.inicio.addEventListener('input', perHint);
  fillCursos(); calc(); perHint();
  form.fac.addEventListener('change', () => { fillCursos(); calc(); });
  form.curso_id.addEventListener('change', () => { expManual = false; calc(); });
  form.inicio.addEventListener('input', () => { expManual = false; calc(); });
  form.expiracao.addEventListener('input', () => { expManual = true; calc(); });
}

/* =========================================================
   CURSOS
   ========================================================= */
const secCursoState = { q: '', fac: '', tipo: '', ativo: '1' };
function secCursos(view) {
  const facs = secLista('faculdade', true), tipos = secLista('tipo_curso', true);
  const body = `
    <div class="sc-tools">
      <label class="sc-search"><i data-icon="search"></i><input type="search" id="sc-cq" placeholder="Buscar curso" value="${esc(secCursoState.q)}" autocomplete="off"></label>
      <select id="sc-cfac" aria-label="Faculdade">${secOpts(facs.map((f) => [f.id, f.nome]), secCursoState.fac, 'Todas as faculdades')}</select>
      <select id="sc-ctipo" aria-label="Tipo">${secOpts(tipos.map((t) => [t.id, t.nome]), secCursoState.tipo, 'Todos os tipos')}</select>
      <select id="sc-cativo" aria-label="Situação">${secOpts([['1', 'Ativos'], ['0', 'Inativos']], secCursoState.ativo, 'Ativos e inativos')}</select>
    </div>
    <p class="sc-result" id="sc-ccount"></p>
    <div class="sc-table-wrap"><table class="sc-table"><thead><tr><th>Curso</th><th>Faculdade</th><th>Tipo</th><th>Área</th><th class="n">CH</th><th class="n">Períodos</th><th class="n">Mín–máx</th><th></th></tr></thead><tbody id="sc-cbody"></tbody></table></div>`;
  secShell(view, 'cursos', 'Cursos', 'Cadastre os cursos uma vez; na matrícula é só escolher.', body,
    '<button type="button" class="btn-soft" id="sc-cexp"><i data-icon="report"></i>Planilha</button><button type="button" class="btn-soft" id="sc-cnew"><i data-icon="plus"></i>Novo curso</button>');
  const filtered = () => {
    const q = secFold(secCursoState.q.trim());
    return SEC.cursos.filter((c) => (!q || secFold(c.nome).includes(q)) && (!secCursoState.fac || c.faculdade_id === secCursoState.fac)
      && (!secCursoState.tipo || c.tipo_id === secCursoState.tipo) && (secCursoState.ativo === '' || String(+c.ativo) === secCursoState.ativo))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
  };
  const draw = () => {
    const list = filtered();
    $('#sc-ccount').textContent = `${list.length} ${list.length === 1 ? 'curso' : 'cursos'}`;
    $('#sc-cbody').innerHTML = list.length ? list.map((c) => `<tr data-c="${c.id}" class="${c.ativo ? '' : 'off'}">
      <td><b>${esc(c.nome)}</b>${c.ativo ? '' : ' <span class="sc-tag">inativo</span>'}</td><td>${esc(secLNome(c.faculdade_id))}</td><td>${esc(secLNome(c.tipo_id))}</td><td>${esc(secLNome(c.area_id))}</td>
      <td class="n">${c.ch ?? ''}</td><td class="n">${c.periodos ?? ''}</td><td class="n">${c.tempo_min ?? ''}${c.tempo_max ? '–' + c.tempo_max : ''}${c.tempo_min || c.tempo_max ? ' m' : ''}</td><td class="n"><i data-icon="edit"></i></td></tr>`).join('')
      : '<tr><td colspan="8" class="sc-empty">Nenhum curso encontrado.</td></tr>';
    paintIcons($('#sc-cbody'));
    $('#sc-cbody').querySelectorAll('[data-c]').forEach((tr) => tr.addEventListener('click', () => secCursoSheet(SEC.cursos.find((c) => c.id === tr.dataset.c))));
  };
  $('#sc-cq').addEventListener('input', (e) => { secCursoState.q = e.target.value; draw(); });
  [['#sc-cfac', 'fac'], ['#sc-ctipo', 'tipo'], ['#sc-cativo', 'ativo']].forEach(([s, k]) => $(s).addEventListener('change', (e) => { secCursoState[k] = e.target.value; draw(); }));
  $('#sc-cnew').addEventListener('click', () => secCursoSheet());
  $('#sc-cexp').addEventListener('click', () => secCsv('cursos', ['Código', 'Curso', 'Faculdade', 'Tipo', 'Área', 'CH', 'Períodos', 'Tempo mínimo (meses)', 'Tempo máximo (meses)', 'Ativo'],
    filtered().map((c) => [c.codigo, c.nome, secLNome(c.faculdade_id), secLNome(c.tipo_id), secLNome(c.area_id), c.ch, c.periodos, c.tempo_min, c.tempo_max, c.ativo ? 'Sim' : 'Não'])));
  draw();
}
function secCursoSheet(c = null) {
  const o = (tipo) => secLista(tipo, true).map((l) => [l.id, l.nome]);
  secSheet(c ? 'Editar curso' : 'Novo curso', `
    ${secField('Nome do curso *', `<input name="nome" required maxlength="160" value="${esc(c?.nome || '')}" placeholder="Ex.: Pedagogia">`)}
    <div class="sc-cols c3">
      ${secField('Faculdade', `<select name="faculdade_id">${secOpts(o('faculdade'), c?.faculdade_id ?? (secLista('faculdade').length === 1 ? secLista('faculdade')[0].id : ''))}</select>`)}
      ${secField('Tipo *', `<select name="tipo_id">${secOpts(o('tipo_curso'), c?.tipo_id)}</select>`)}
      ${secField('Área', `<select name="area_id">${secOpts(o('area'), c?.area_id)}</select>`)}
      ${secField('Carga horária (h)', `<input name="ch" inputmode="numeric" maxlength="5" value="${c?.ch ?? ''}">`)}
      ${secField('Nº de períodos', `<input name="periodos" inputmode="numeric" maxlength="2" value="${c?.periodos ?? ''}">`)}
      ${secField('Situação', `<select name="ativo"><option value="1"${c?.ativo === false ? '' : ' selected'}>Ativo</option><option value="0"${c?.ativo === false ? ' selected' : ''}>Inativo</option></select>`)}
      ${secField('Tempo mínimo (meses)', `<input name="tempo_min" inputmode="numeric" maxlength="3" value="${c?.tempo_min ?? ''}">`)}
      ${secField('Tempo máximo (meses)', `<input name="tempo_max" inputmode="numeric" maxlength="3" value="${c?.tempo_max ?? ''}">`)}
    </div>`, {
    wide: true,
    onSave: async (f, say) => {
      const num = (k) => (secVal(f, k) ? parseInt(secVal(f, k), 10) || 0 : null);
      const row = { nome: secVal(f, 'nome'), faculdade_id: secVal(f, 'faculdade_id'), tipo_id: secVal(f, 'tipo_id'), area_id: secVal(f, 'area_id'),
        ch: num('ch'), periodos: num('periodos'), tempo_min: num('tempo_min'), tempo_max: num('tempo_max'), ativo: f.ativo.value === '1' };
      if (!row.nome || row.nome.length < 2) return say('Informe o nome do curso.'), false;
      if (!row.tipo_id) return say('Escolha o tipo do curso (ele define a expiração da matrícula).'), false;
      const q = c ? sb.from('sec_cursos').update(row).eq('id', c.id) : sb.from('sec_cursos').insert(row);
      const { data, error } = await q.select().single(); if (error) throw error;
      if (c) Object.assign(c, data); else SEC.cursos.push(data);
      toast(c ? 'Curso atualizado.' : 'Curso cadastrado.'); route();
    },
    danger: c && { label: 'Excluir curso', run: async () => {
      const n = SEC.mats.filter((m) => m.curso_id === c.id).length;
      if (!(await confirmDialog({ title: `Excluir ${c.nome}?`, sub: n ? `${n} ${n === 1 ? 'matrícula usa' : 'matrículas usam'} este curso e ficarão sem curso. Prefira marcar como Inativo.` : 'Não dá para desfazer.' }))) return false;
      const { error } = await sb.from('sec_cursos').delete().eq('id', c.id); if (error) return toast(secErr(error)), false;
      SEC.cursos = SEC.cursos.filter((x) => x.id !== c.id); SEC.mats.forEach((m) => { if (m.curso_id === c.id) m.curso_id = null; }); toast('Curso excluído.'); route();
    } },
  });
}

/* =========================================================
   CADASTROS — listas de base
   ========================================================= */
let secListaTab = 'faculdade';
function secCadastros(view) {
  const items = secLista(secListaTab, true);
  const isTipo = secListaTab === 'tipo_curso';
  const used = (l) => {
    if (['faculdade', 'tipo_curso', 'area'].includes(l.tipo)) return SEC.cursos.filter((c) => c[{ faculdade: 'faculdade_id', tipo_curso: 'tipo_id', area: 'area_id' }[l.tipo]] === l.id).length;
    if (['turma', 'periodo'].includes(l.tipo)) return SEC.mats.filter((m) => m[l.tipo] === l.nome).length;
    if (l.tipo === 'documento') return SEC.mats.filter((m) => (m.documentos || {})[l.id]).length;
    return SEC.alunos.filter((a) => a[l.tipo] === l.nome).length;
  };
  const body = `
    <div class="sc-split">
      <nav class="sc-side">${Object.entries(SEC_LISTAS).map(([k, t]) => `<button type="button" data-lt="${k}" class="${k === secListaTab ? 'on' : ''}">${t}<em>${secLista(k, true).length}</em></button>`).join('')}</nav>
      <section class="sc-card sc-lists">
        <header><h2>${SEC_LISTAS[secListaTab]}</h2></header>
        ${isTipo ? '<p class="sc-hint">Os meses definem a data de expiração calculada na matrícula (ex.: Graduação 6 meses, Pós 18 meses).</p>' : ''}
        <form class="sc-task-add" id="sc-ladd"><input name="nome" maxlength="120" placeholder="Adicionar item…" aria-label="Novo item">${isTipo ? '<input name="meses" inputmode="numeric" maxlength="3" placeholder="Meses" class="sc-meses" aria-label="Meses">' : ''}<button class="sc-mini" type="submit"><i data-icon="plus"></i>Adicionar</button></form>
        <div class="sc-litems">${items.length ? items.map((l) => `<div class="sc-litem${l.ativo ? '' : ' off'}" data-l="${l.id}">
          <input value="${esc(l.nome)}" maxlength="120" data-lname aria-label="Nome">
          ${isTipo ? `<input value="${l.meses ?? ''}" inputmode="numeric" maxlength="3" class="sc-meses" data-lmeses aria-label="Meses"><small>meses</small>` : ''}
          <small class="sc-faint">${used(l) ? `em uso (${used(l)})` : ''}</small>
          <button type="button" class="sc-mini" data-lativo>${l.ativo ? 'Ocultar' : 'Mostrar'}</button>
          <button type="button" class="sc-x sm" data-ldel aria-label="Excluir"><i data-icon="trash"></i></button></div>`).join('') : '<p class="sc-empty">Lista vazia.</p>'}</div>
      </section>
    </div>`;
  secShell(view, 'cadastros', 'Cadastros', 'Listas usadas nas fichas, matrículas e cursos. Itens ocultos não aparecem para escolher, mas continuam nos registros antigos.', body);
  view.querySelectorAll('[data-lt]').forEach((b) => b.addEventListener('click', () => { secListaTab = b.dataset.lt; secCadastros(view); }));
  $('#sc-ladd').addEventListener('submit', async (e) => {
    e.preventDefault(); const nome = e.target.nome.value.trim(); if (!nome) return;
    const row = { tipo: secListaTab, nome, ordem: (items.at(-1)?.ordem || 0) + 1 };
    if (isTipo) row.meses = parseInt(e.target.meses.value, 10) || null;
    const { data, error } = await sb.from('sec_listas').insert(row).select().single();
    if (error) return toast(secErr(error));
    SEC.listas.push(data); secCadastros(view); $('#sc-ladd input')?.focus();
  });
  view.querySelectorAll('[data-l]').forEach((el) => {
    const l = SEC.listas.find((x) => x.id === el.dataset.l);
    const save = async (row) => { const { error } = await sb.from('sec_listas').update(row).eq('id', l.id); if (error) { toast(secErr(error)); return false; } Object.assign(l, row); return true; };
    el.querySelector('[data-lname]').addEventListener('change', async (e) => {
      const nome = e.target.value.trim(), old = l.nome; if (!nome || nome === old) { e.target.value = old; return; }
      if (await save({ nome })) {
        // listas guardadas como texto nas fichas/matrículas acompanham o nome novo
        const col = l.tipo, tbl = ['turma', 'periodo'].includes(col) ? 'sec_matriculas' : !['faculdade', 'tipo_curso', 'area', 'documento'].includes(col) ? 'sec_alunos' : null;
        if (tbl) { await sb.from(tbl).update({ [col]: nome }).eq(col, old); (tbl === 'sec_matriculas' ? SEC.mats : SEC.alunos).forEach((r) => { if (r[col] === old) r[col] = nome; }); }
        toast('Nome atualizado.');
      } else e.target.value = old;
    });
    el.querySelector('[data-lmeses]')?.addEventListener('change', async (e) => { if (await save({ meses: parseInt(e.target.value, 10) || null })) toast('Meses atualizados.'); });
    el.querySelector('[data-lativo]').addEventListener('click', async () => { if (await save({ ativo: !l.ativo })) secCadastros(view); });
    el.querySelector('[data-ldel]').addEventListener('click', async () => {
      const n = used(l);
      if (!(await confirmDialog({ title: `Excluir "${l.nome}"?`, sub: n ? `Está em uso em ${n} ${n === 1 ? 'registro' : 'registros'}. Prefira "Ocultar".` : 'Não dá para desfazer.' }))) return;
      const { error } = await sb.from('sec_listas').delete().eq('id', l.id); if (error) return toast(secErr(error));
      SEC.listas = SEC.listas.filter((x) => x.id !== l.id); secCadastros(view);
    });
  });
}

/* =========================================================
   RELATÓRIOS — filtros, tabela, imprimir e planilha
   ========================================================= */
const secRel = { docs: '', fac: '', curso: '', tipo: '', status: '', turma: '', periodo: '', instrucao: '', formacao: '', estado: '', cidade: '', conhecimento: '', indicacao: '', campo: 'inclusao', de: '', ate: '', ordem: 'alfa' };
/* tipos de relatório: a lista com filtros e os relatórios prontos */
const SEC_REL_MODOS = [
  ['lista', 'Lista de alunos', 'users'], ['remat', 'Rematrículas do mês', 'refresh'], ['venc', 'Vencimentos do mês', 'clock'],
  ['fac', 'Por faculdade', 'building'], ['curso', 'Por curso', 'cap'], ['estado', 'Por estado', 'map'], ['cidade', 'Por cidade', 'map'],
  ['turma', 'Por turma', 'users'], ['periodo', 'Por período', 'calendar'], ['niver', 'Aniversariantes do mês', 'party'], ['docs', 'Documentos pendentes', 'report'],
];
let secRelModo = 'lista';
const secRelState = { mes: '', atrasadas: '1', ativas: '1' };
function secRelatorios(view) {
  const modos = `<div class="sc-chips sc-rel-modos" role="tablist">${SEC_REL_MODOS.map(([k, t, ico]) => `<button type="button" data-rmodo="${k}" class="${secRelModo === k ? 'on' : ''}"><i data-icon="${ico}"></i>${t}</button>`).join('')}</div>`;
  if (secRelModo !== 'lista') return secRelPronto(view, modos);
  const l = (t) => secLista(t, true).map((x) => x.nome);
  const sel = (k, label, opts) => secField(label, `<select data-r="${k}">${secOpts(opts, secRel[k], 'Todos')}</select>`);
  const cidades = [...new Set(SEC.alunos.filter((a) => !secRel.estado || a.estado === secRel.estado).map((a) => a.cidade).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt'));
  const body = `${modos}
    <section class="sc-card sc-filters">
      <div class="sc-cols c4">
        ${sel('fac', 'Faculdade', secLista('faculdade', true).map((f) => [f.id, f.nome]))}
        ${sel('tipo', 'Tipo de curso', secLista('tipo_curso', true).map((f) => [f.id, f.nome]))}
        ${sel('curso', 'Curso', SEC.cursos.filter((c) => (!secRel.fac || c.faculdade_id === secRel.fac) && (!secRel.tipo || c.tipo_id === secRel.tipo)).sort((a, b) => a.nome.localeCompare(b.nome, 'pt')).map((c) => [c.id, c.nome]))}
        ${sel('status', 'Situação da matrícula', Object.entries(SEC_STATUS).map(([s, [t]]) => [s, t]))}
        ${sel('turma', 'Turma', l('turma'))}
        ${sel('periodo', 'Período', l('periodo'))}
        ${sel('instrucao', 'Grau de instrução', l('instrucao'))}
        ${sel('formacao', 'Formação', l('formacao'))}
        ${sel('estado', 'Estado', SEC_UF)}
        ${sel('cidade', 'Cidade', cidades)}
        ${sel('conhecimento', 'Como conheceu', l('conhecimento'))}
        ${sel('docs', 'Documentos', [['pendente', 'Com documento pendente'], ['completo', 'Documentos completos']])}
        ${secField('Indicado por', `<input data-r="indicacao" value="${esc(secRel.indicacao)}" placeholder="Nome contém…">`)}
      </div>
      <div class="sc-cols c4 sc-period">
        ${secField('Período por', `<select data-r="campo">${secOpts([['inclusao', 'Data de cadastro'], ['alteracao', 'Última alteração'], ['aniversario', 'Aniversário'], ['inicio', 'Início da matrícula'], ['expiracao', 'Expiração da matrícula']], secRel.campo, 'Data de cadastro').replace('<option value="">Data de cadastro</option>', '')}</select>`)}
        ${secField('De', `<input type="date" data-r="de" value="${secRel.de}">`)}
        ${secField('Até', `<input type="date" data-r="ate" value="${secRel.ate}">`)}
        ${secField('Ordenar por', `<select data-r="ordem">${[['alfa', 'Nome (A–Z)'], ['codigo', 'Código'], ['cidade', 'Cidade e nome'], ['data', 'Data e nome']].map(([v, t]) => `<option value="${v}"${secRel.ordem === v ? ' selected' : ''}>${t}</option>`).join('')}</select>`)}
      </div>
      <div class="sc-rel-act"><button type="button" class="btn-soft" id="sc-rclear">Limpar filtros</button><span class="sc-grow"></span>
        <button type="button" class="btn-soft" id="sc-rcsv"><i data-icon="report"></i>Exportar planilha</button><button type="button" class="btn-dark" id="sc-rprint"><i data-icon="report"></i>Imprimir / PDF</button></div>
    </section>
    <p class="sc-result" id="sc-rcount"></p>
    <div class="sc-table-wrap sc-print"><h2 class="sc-print-title">Relatório de alunos · HC Instituto Educacional · ${secDate(secToday())}</h2>
      <table class="sc-table"><thead><tr><th class="n">Cód.</th><th>Aluno</th><th>CPF</th><th>Celular</th><th>Cidade</th><th>Curso</th><th>Situação</th><th>Início</th><th>Expiração</th></tr></thead><tbody id="sc-rbody"></tbody></table></div>`;
  secShell(view, 'relatorios', 'Relatórios', 'Escolha os filtros; a lista se atualiza na hora.', body);

  const rows = secRelRows();
  $('#sc-rcount').textContent = `${rows.length} ${rows.length === 1 ? 'resultado' : 'resultados'}`;
  $('#sc-rbody').innerHTML = rows.length ? rows.slice(0, 500).map(({ a, m, c }) => `<tr data-a="${a.id}"><td class="n">${a.codigo}</td><td><b>${esc(a.nome)}</b></td><td>${secCpfFmt(a.cpf)}</td><td>${esc(a.celular || '')}</td>
    <td>${esc([a.cidade, a.estado].filter(Boolean).join(' - '))}</td><td>${esc(c?.nome || '')}</td><td>${m ? secStatusPill(m.status) : ''}</td><td>${m ? secDate(m.inicio) : ''}</td><td>${m ? secDate(m.expiracao) : ''}</td></tr>`).join('')
    + (rows.length > 500 ? `<tr><td colspan="9" class="sc-empty">Mostrando 500 de ${rows.length}. A planilha traz todos.</td></tr>` : '')
    : '<tr><td colspan="9" class="sc-empty">Nenhum aluno com esses filtros.</td></tr>';
  $('#sc-rbody').querySelectorAll('[data-a]').forEach((tr) => tr.addEventListener('click', () => { location.hash = `#secretaria/aluno/${tr.dataset.a}`; }));

  view.querySelectorAll('[data-r]').forEach((el) => el.addEventListener(el.tagName === 'INPUT' && el.type !== 'date' ? 'change' : 'change', () => {
    secRel[el.dataset.r] = el.value;
    if (el.dataset.r === 'estado') secRel.cidade = '';
    if (['fac', 'tipo'].includes(el.dataset.r)) secRel.curso = '';
    secRelatorios(view);
  }));
  secRelModoBind(view);
  $('#sc-rclear').addEventListener('click', () => { Object.keys(secRel).forEach((k) => { secRel[k] = ''; }); secRel.campo = 'inclusao'; secRel.ordem = 'alfa'; secRelatorios(view); });
  $('#sc-rprint').addEventListener('click', () => { document.body.classList.add('sc-printing'); window.print(); setTimeout(() => document.body.classList.remove('sc-printing'), 500); });
  $('#sc-rcsv').addEventListener('click', () => secCsv('relatorio-alunos', ['Código', 'Nome', 'CPF', 'Nascimento', 'Sexo', 'Celular', 'Telefone', 'E-mail', 'Endereço', 'Nº', 'Bairro', 'Cidade', 'UF', 'CEP', 'Instrução', 'Formação', 'Como conheceu', 'Indicado por', 'Curso', 'Faculdade', 'Tipo', 'Situação', 'Turma', 'Período', 'Nº matrícula', 'Início', 'Expiração', 'Documentos pendentes', 'Cadastrado em'],
    rows.map(({ a, m, c }) => [a.codigo, a.nome, secCpfFmt(a.cpf), secDate(a.nascimento), a.sexo, a.celular, a.telefone, a.email, a.endereco, a.numero, a.bairro, a.cidade, a.estado, a.cep, a.instrucao, a.formacao, a.conhecimento, a.indicacao,
      c?.nome, secLNome(c?.faculdade_id), secLNome(c?.tipo_id), m ? SEC_STATUS[m.status]?.[0] : '', m?.turma, m ? (secPeriodo(m)?.nome || m.periodo) : '', m?.numero, m ? secDate(m.inicio) : '', m ? secDate(m.expiracao) : '', m ? secLista('documento').filter((d) => !(m.documentos || {})[d.id]).map((d) => d.nome).join(', ') : '', secDate(a.created_at.slice(0, 10))])));
}
function secRelModoBind(view) {
  view.querySelectorAll('[data-rmodo]').forEach((b) => b.addEventListener('click', () => { secRelModo = b.dataset.rmodo; secRelatorios(view); }));
}
const secRelPrint = () => { document.body.classList.add('sc-printing'); window.print(); setTimeout(() => document.body.classList.remove('sc-printing'), 500); };
const secMesNome = (ym) => { const [y, m] = ym.split('-').map(Number); return `${MESES[m - 1]} de ${y}`; };

/* relatórios prontos: rematrículas, vencimentos, aniversariantes, documentos e os agrupados */
function secRelPronto(view, modos) {
  const modo = secRelModo, [, titulo] = SEC_REL_MODOS.find(([k]) => k === modo);
  if (!secRelState.mes) secRelState.mes = secToday().slice(0, 7);
  const mes = secRelState.mes, fmt = (n) => n.toLocaleString('pt-BR');
  const porMes = ['remat', 'venc', 'niver'].includes(modo), agrupado = ['fac', 'curso', 'estado', 'cidade', 'turma', 'periodo'].includes(modo);
  const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);
  let head = [], rows = [], csvHead = [], csvRows = [], resumo = '', onRow = null, sub = '';

  if (modo === 'remat') {
    // matrículas ativas de graduação cuja janela (25 → 10) abre no mês escolhido; opcionalmente as atrasadas
    const itens = SEC.mats.map((m) => [m, secJanela(m)]).filter(([, j]) => j && (j.abre.slice(0, 7) === mes || (secRelState.atrasadas && j.fase === 'atrasada' && j.abre.slice(0, 7) < mes)))
      .sort(([a, ja], [b, jb]) => ja.abre.localeCompare(jb.abre) || secFold(secAluno(a.aluno_id)?.nome).localeCompare(secFold(secAluno(b.aluno_id)?.nome)));
    const fase = { antes: 'Ainda não abriu', aberta: 'Aberta', fechando: 'Fechando', atrasada: 'Atrasada' };
    const tone = { antes: '#6e6e73', aberta: '#1f9d55', fechando: '#c76a00', atrasada: '#d70015' };
    head = ['Aluno', 'Celular', 'Curso', 'Período', 'Expira', 'Janela', 'Situação'];
    rows = itens.map(([m, j]) => { const a = secAluno(m.aluno_id), c = secCurso(m.curso_id), pp = secPeriodo(m), prox = secProxPeriodo(m, secInicioPeriodo(j.fecha));
      return { id: a?.id, cells: [`<b>${esc(a?.nome || '')}</b>`, esc(a?.celular || ''), `${esc(c?.nome || '')}<small class="sc-sub">${esc(secLNome(c?.faculdade_id))}</small>`,
        pp ? `${pp.n}º${prox && prox !== pp.n ? ` → ${prox}º` : ''}${pp.total ? ` <small class="sc-sub">de ${pp.total}</small>` : ''}` : '', secDate(m.expiracao), `${secDate(j.abre).slice(0, 5)} a ${secDate(j.fecha).slice(0, 5)}`,
        `<span class="sc-pill" style="--c:${tone[j.fase]}"><i></i>${fase[j.fase]}</span>`] }; });
    csvHead = ['Aluno', 'CPF', 'Celular', 'Curso', 'Faculdade', 'Período atual', 'Próximo período', 'Expiração', 'Janela abre', 'Janela fecha', 'Situação'];
    csvRows = itens.map(([m, j]) => { const a = secAluno(m.aluno_id), c = secCurso(m.curso_id), pp = secPeriodo(m);
      return [a?.nome, secCpfFmt(a?.cpf || ''), a?.celular, c?.nome, secLNome(c?.faculdade_id), pp?.nome, secProxPeriodo(m, secInicioPeriodo(j.fecha)) ? secPerNome(secProxPeriodo(m, secInicioPeriodo(j.fecha))) : '', secDate(m.expiracao), secDate(j.abre), secDate(j.fecha), fase[j.fase]]; });
    const atr = itens.filter(([, j]) => j.fase === 'atrasada').length;
    resumo = `${fmt(itens.length)} ${itens.length === 1 ? 'rematrícula' : 'rematrículas'}${atr ? ` · ${atr} atrasada${atr > 1 ? 's' : ''}` : ''}`;
    sub = `Janela da faculdade do dia 25 ao dia 10. Só cursos por período (graduação).`;
  } else if (modo === 'venc') {
    const itens = SEC.mats.filter((m) => m.status === 'ativo' && m.expiracao?.slice(0, 7) === mes).sort((a, b) => a.expiracao.localeCompare(b.expiracao));
    head = ['Expira', 'Aluno', 'Celular', 'Curso', 'Período', 'Turma'];
    rows = itens.map((m) => { const a = secAluno(m.aluno_id), c = secCurso(m.curso_id); return { id: a?.id, cells: [secDate(m.expiracao), `<b>${esc(a?.nome || '')}</b>`, esc(a?.celular || ''), `${esc(c?.nome || '')}<small class="sc-sub">${esc(secLNome(c?.faculdade_id))}</small>`, esc(secPerTxt(secPeriodo(m))), esc(m.turma || '')] }; });
    csvHead = ['Expiração', 'Aluno', 'CPF', 'Celular', 'Curso', 'Faculdade', 'Período', 'Turma'];
    csvRows = itens.map((m) => { const a = secAluno(m.aluno_id), c = secCurso(m.curso_id); return [secDate(m.expiracao), a?.nome, secCpfFmt(a?.cpf || ''), a?.celular, c?.nome, secLNome(c?.faculdade_id), secPeriodo(m)?.nome || m.periodo, m.turma]; });
    resumo = `${fmt(itens.length)} ${itens.length === 1 ? 'matrícula vence' : 'matrículas vencem'} em ${secMesNome(mes).split(' de')[0]}`;
  } else if (modo === 'niver') {
    const mm = mes.slice(5), ano = +mes.slice(0, 4);
    const itens = SEC.alunos.filter((a) => a.nascimento?.slice(5, 7) === mm).sort((a, b) => a.nascimento.slice(8).localeCompare(b.nascimento.slice(8)) || secFold(a.nome).localeCompare(secFold(b.nome)));
    head = ['Dia', 'Aluno', 'Faz', 'Celular', 'Curso'];
    rows = itens.map((a) => { const m = secMatsDe(a.id)[0], c = m && secCurso(m.curso_id); return { id: a.id, cells: [a.nascimento.slice(8), `<b>${esc(a.nome)}</b>`, `${ano - +a.nascimento.slice(0, 4)} anos`, esc(a.celular || ''), esc(c?.nome || '')] }; });
    csvHead = ['Dia', 'Aluno', 'Nascimento', 'Idade no aniversário', 'Celular', 'E-mail', 'Curso'];
    csvRows = itens.map((a) => { const m = secMatsDe(a.id)[0]; return [a.nascimento.slice(8), a.nome, secDate(a.nascimento), ano - +a.nascimento.slice(0, 4), a.celular, a.email, m && secCurso(m.curso_id)?.nome]; });
    resumo = `${fmt(itens.length)} ${itens.length === 1 ? 'aniversariante' : 'aniversariantes'} em ${secMesNome(mes).split(' de')[0]}`;
  } else if (modo === 'docs') {
    const docs = secLista('documento');
    const itens = SEC.mats.filter((m) => m.status === 'ativo').map((m) => [m, docs.filter((d) => !(m.documentos || {})[d.id])]).filter(([, f]) => f.length)
      .sort(([a, fa], [b, fb]) => fb.length - fa.length || secFold(secAluno(a.aluno_id)?.nome).localeCompare(secFold(secAluno(b.aluno_id)?.nome)));
    head = ['Aluno', 'Celular', 'Curso', 'Faltam', 'Documentos pendentes'];
    rows = itens.map(([m, f]) => { const a = secAluno(m.aluno_id), c = secCurso(m.curso_id); return { id: a?.id, cells: [`<b>${esc(a?.nome || '')}</b>`, esc(a?.celular || ''), esc(c?.nome || ''), `${f.length} de ${docs.length}`, `<small>${f.map((d) => esc(d.nome)).join(', ')}</small>`] }; });
    csvHead = ['Aluno', 'CPF', 'Celular', 'Curso', 'Faculdade', 'Qtd. pendente', 'Documentos pendentes'];
    csvRows = itens.map(([m, f]) => { const a = secAluno(m.aluno_id), c = secCurso(m.curso_id); return [a?.nome, secCpfFmt(a?.cpf || ''), a?.celular, c?.nome, secLNome(c?.faculdade_id), f.length, f.map((d) => d.nome).join(', ')]; });
    resumo = docs.length ? `${fmt(itens.length)} ${itens.length === 1 ? 'matrícula ativa com documento pendente' : 'matrículas ativas com documento pendente'}` : 'Nenhum documento exigido cadastrado (aba Cadastros).';
  } else {
    // agrupados: faculdade, curso, turma e período contam matrículas; estado e cidade contam alunos
    const porMat = ['fac', 'curso', 'turma', 'periodo'].includes(modo), soAtivas = !!secRelState.ativas;
    const g = new Map();
    const add = (key, label, sub2, filtro, a, m) => {
      const e = g.get(key) || { label, sub: sub2, filtro, alunos: new Set(), st: {} }; g.set(key, e);
      e.alunos.add(a.id); if (m) e.st[m.status] = (e.st[m.status] || 0) + 1;
    };
    if (porMat) {
      SEC.mats.forEach((m) => {
        if (soAtivas && m.status !== 'ativo') return;
        const a = secAluno(m.aluno_id); if (!a) return; const c = secCurso(m.curso_id);
        if (modo === 'fac') { const f = c?.faculdade_id || ''; add(f, secLNome(f) || 'Sem faculdade', '', { fac: f }, a, m); }
        if (modo === 'curso') add(m.curso_id || '', c?.nome || 'Sem curso', secLNome(c?.faculdade_id), { fac: c?.faculdade_id || '', curso: m.curso_id || '' }, a, m);
        if (modo === 'turma') add(m.turma || '', m.turma || 'Sem turma', '', { turma: m.turma || '' }, a, m);
        if (modo === 'periodo') { const pp = secPeriodo(m); add(pp ? String(pp.n).padStart(3, '0') : '~', pp ? pp.nome : 'Sem período', '', { periodo: pp?.nome || '' }, a, m); }
      });
    } else {
      SEC.alunos.forEach((a) => {
        const ms = secMatsDe(a.id), ativa = ms.find((m) => m.status === 'ativo');
        if (soAtivas && !ativa) return;
        const uf = String(a.estado || '').trim().toUpperCase();
        if (modo === 'estado') add(uf || '~', uf ? `${uf} · ${BR_UF_NOME[uf] || uf}` : 'Sem estado informado', '', { estado: uf }, a, ativa || ms[0]);
        if (modo === 'cidade') { const ci = String(a.cidade || '').trim(); add(ci ? secFold(ci + uf) : '~', ci ? `${ci}${uf ? ' - ' + uf : ''}` : 'Sem cidade informada', '', { estado: uf, cidade: ci }, a, ativa || ms[0]); }
      });
    }
    const totAlunos = new Set([...g.values()].flatMap((e) => [...e.alunos])).size;
    const grupos = [...g.entries()].sort(([ka, a], [kb, b]) => (modo === 'periodo' || modo === 'turma' ? (ka === '' || ka === '~') - (kb === '' || kb === '~') || ka.localeCompare(kb) : b.alunos.size - a.alunos.size || a.label.localeCompare(b.label, 'pt')));
    const st = (e, k) => e.st[k] || 0;
    const max = Math.max(1, ...grupos.map(([, e]) => e.alunos.size));
    const nomeG = { fac: 'Faculdade', curso: 'Curso', estado: 'Estado', cidade: 'Cidade', turma: 'Turma', periodo: 'Período' }[modo];
    head = [nomeG, 'Alunos', 'Ativas', 'Concluídas', 'Canceladas / trancadas', '% dos alunos'];
    rows = grupos.map(([, e]) => ({ filtro: e.filtro, cells: [`<b>${esc(e.label)}</b>${e.sub ? `<small class="sc-sub">${esc(e.sub)}</small>` : ''}`, `<b>${fmt(e.alunos.size)}</b>`, fmt(st(e, 'ativo')), fmt(st(e, 'concluido')), fmt(st(e, 'cancelado') + st(e, 'trancado')),
      `<span class="sc-relbar"><i style="--p:${(e.alunos.size / max).toFixed(3)}"></i><em>${pct(e.alunos.size, totAlunos)}%</em></span>`] }));
    csvHead = [nomeG, ...(modo === 'curso' ? ['Faculdade'] : []), 'Alunos', 'Matrículas ativas', 'Concluídas', 'Canceladas', 'Trancadas', 'Pendentes', '% dos alunos'];
    csvRows = grupos.map(([, e]) => [e.label, ...(modo === 'curso' ? [e.sub] : []), e.alunos.size, st(e, 'ativo'), st(e, 'concluido'), st(e, 'cancelado'), st(e, 'trancado'), st(e, 'pendente'), pct(e.alunos.size, totAlunos) + '%']);
    resumo = `${fmt(grupos.length)} ${grupos.length === 1 ? 'grupo' : 'grupos'} · ${fmt(totAlunos)} alunos${soAtivas ? ' com matrícula ativa' : ''}`;
    sub = porMat ? 'Conta as matrículas (um aluno com dois cursos aparece nos dois).' : 'Conta cada aluno uma vez, pelo endereço da ficha.';
    onRow = (filtro) => { Object.keys(secRel).forEach((k) => { secRel[k] = ''; }); secRel.campo = 'inclusao'; secRel.ordem = 'alfa'; Object.assign(secRel, filtro); if (soAtivas) secRel.status = 'ativo'; secRelModo = 'lista'; secRelatorios(view); };
  }

  const body = `${modos}
    <section class="sc-card sc-filters sc-rel-bar">
      ${porMes ? secField('Mês', `<input type="month" id="sc-rmes" value="${mes}">`) : ''}
      ${modo === 'remat' ? `<label class="sc-checkline"><input type="checkbox" id="sc-ratr"${secRelState.atrasadas ? ' checked' : ''}> Incluir atrasadas de meses anteriores</label>` : ''}
      ${agrupado ? `<label class="sc-checkline"><input type="checkbox" id="sc-rati"${secRelState.ativas ? ' checked' : ''}> Só matrículas ativas</label>` : ''}
      <span class="sc-grow"></span>
      <button type="button" class="btn-soft" id="sc-rcsv"><i data-icon="report"></i>Exportar planilha</button><button type="button" class="btn-dark" id="sc-rprint"><i data-icon="report"></i>Imprimir / PDF</button>
    </section>
    <p class="sc-result">${resumo}${sub ? `<span class="sc-faint"> · ${sub}</span>` : ''}${onRow ? '<span class="sc-faint"> · Toque numa linha para ver os alunos.</span>' : ''}</p>
    <div class="sc-table-wrap sc-print"><h2 class="sc-print-title">${titulo}${porMes ? ' · ' + secMesNome(mes) : ''} · HC Instituto Educacional · ${secDate(secToday())}</h2>
      <table class="sc-table${agrupado ? ' sc-table-g' : ''}"><thead><tr>${head.map((h, i) => `<th${agrupado && i ? ' class="n"' : ''}>${h}</th>`).join('')}</tr></thead>
      <tbody id="sc-rbody">${rows.length ? rows.map((r, i) => `<tr data-i="${i}"${r.id || r.filtro ? ' class="go"' : ''}>${r.cells.map((c, j) => `<td${agrupado && j ? ' class="n"' : ''}>${c}</td>`).join('')}</tr>`).join('')
        : `<tr><td colspan="${head.length}" class="sc-empty">Nada para mostrar${porMes ? ' nesse mês' : ''}.</td></tr>`}</tbody></table></div>`;
  secShell(view, 'relatorios', 'Relatórios', 'Escolha um relatório; dá para imprimir ou baixar a planilha.', body);
  secRelModoBind(view);
  $('#sc-rbody').querySelectorAll('tr.go').forEach((tr) => tr.addEventListener('click', () => { const r = rows[+tr.dataset.i]; if (r.filtro) onRow(r.filtro); else location.hash = `#secretaria/aluno/${r.id}`; }));
  $('#sc-rmes')?.addEventListener('change', (e) => { if (e.target.value) { secRelState.mes = e.target.value; secRelatorios(view); } });
  $('#sc-ratr')?.addEventListener('change', (e) => { secRelState.atrasadas = e.target.checked ? '1' : ''; secRelatorios(view); });
  $('#sc-rati')?.addEventListener('change', (e) => { secRelState.ativas = e.target.checked ? '1' : ''; secRelatorios(view); });
  $('#sc-rprint').addEventListener('click', secRelPrint);
  $('#sc-rcsv').addEventListener('click', () => secCsv(`relatorio-${modo}${porMes ? '-' + mes : ''}`, csvHead, csvRows));
}
const BR_UF_NOME = { AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins' };

function secRelRows() {
  const r = secRel, ind = secFold(r.indicacao.trim());
  const docIds = secLista('documento').map((d) => d.id);
  const matFilter = r.docs || r.fac || r.curso || r.tipo || r.status || r.turma || r.periodo || (['inicio', 'expiracao'].includes(r.campo) && (r.de || r.ate));
  const inRange = (d) => d && (!r.de || d >= r.de) && (!r.ate || d <= r.ate);
  const out = [];
  SEC.alunos.forEach((a) => {
    if (r.instrucao && a.instrucao !== r.instrucao) return;
    if (r.formacao && a.formacao !== r.formacao) return;
    if (r.estado && a.estado !== r.estado) return;
    if (r.cidade && a.cidade !== r.cidade) return;
    if (r.conhecimento && a.conhecimento !== r.conhecimento) return;
    if (ind && !secFold(a.indicacao || '').includes(ind)) return;
    if (r.de || r.ate) {
      if (r.campo === 'inclusao' && !inRange(a.created_at.slice(0, 10))) return;
      if (r.campo === 'alteracao' && !inRange((a.updated_at || a.created_at).slice(0, 10))) return;
      if (r.campo === 'aniversario') { // compara só dia e mês
        if (!a.nascimento) return;
        const md = a.nascimento.slice(5), de = r.de ? r.de.slice(5) : '01-01', ate = r.ate ? r.ate.slice(5) : '12-31';
        if (de <= ate ? (md < de || md > ate) : (md < de && md > ate)) return;
      }
    }
    const ms = secMatsDe(a.id).filter((m) => {
      const c = secCurso(m.curso_id);
      if (r.fac && c?.faculdade_id !== r.fac) return false;
      if (r.curso && m.curso_id !== r.curso) return false;
      if (r.tipo && c?.tipo_id !== r.tipo) return false;
      if (r.status && m.status !== r.status) return false;
      if (r.turma && m.turma !== r.turma) return false;
      if (r.periodo && (secPeriodo(m)?.nome || m.periodo) !== r.periodo) return false;
      if (r.docs) { const ok = docIds.every((id) => (m.documentos || {})[id]); if ((r.docs === 'completo') !== ok) return false; }
      if ((r.de || r.ate) && ['inicio', 'expiracao'].includes(r.campo) && !inRange(m[r.campo])) return false;
      return true;
    });
    if (matFilter) ms.forEach((m) => out.push({ a, m, c: secCurso(m.curso_id) }));
    else { const m = secMatsDe(a.id)[0]; out.push({ a, m, c: m && secCurso(m.curso_id) }); }
  });
  const key = { alfa: (x) => secFold(x.a.nome), codigo: (x) => String(x.a.codigo).padStart(10, '0'), cidade: (x) => secFold((x.a.cidade || '~') + ' ' + x.a.nome),
    data: (x) => {
      const d = r.campo === 'aniversario' ? (x.a.nascimento || '').slice(5) : r.campo === 'inicio' || r.campo === 'expiracao' ? x.m?.[r.campo] || '' : r.campo === 'alteracao' ? x.a.updated_at : x.a.created_at;
      return (d || '9999') + ' ' + secFold(x.a.nome);
    } }[r.ordem] || ((x) => secFold(x.a.nome));
  return out.sort((x, y) => (key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0));
}

/* planilha (CSV com ; para abrir direto no Excel em português) */
function secCsv(name, head, rows) {
  const cell = (v) => { const s = v == null ? '' : String(v); return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const csv = '﻿' + [head, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = `${name}-${secToday()}.csv`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('Planilha baixada.');
}

/* =========================================================
   MAPEAMENTO — onde estão os alunos, por estado (e cidades)
   O desenho do mapa fica em assets/mapa-brasil.js e só é baixado ao abrir a aba.
   ========================================================= */
let secMapaUF = '';
let secMapaJS = null;
const secMapaLoad = () => secMapaJS || (secMapaJS = typeof BR_MAPA !== 'undefined' ? Promise.resolve() : new Promise((ok, no) => {
  const s = document.createElement('script');
  s.src = `assets/mapa-brasil.js?v=${window.HC_V || ''}`; s.onload = ok; s.onerror = () => { secMapaJS = null; no(new Error('mapa')); };
  document.head.appendChild(s);
}));
// cor do estado: do verde-água bem claro (poucos alunos) ao petróleo (muitos)
const secMapaCor = (t) => {
  const a = [204, 251, 241], b = [15, 118, 110], k = Math.sqrt(t);
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
};
// texto por cima da cor: escuro nos tons claros, branco nos escuros
const secMapaBadge = (t) => `--f:${secMapaCor(t)};--tx:${Math.sqrt(t) > .5 ? '#fff' : '#115e59'}`;
async function secMapa(view, soft) {
  const sub = 'Onde estão os alunos, pelo estado da ficha. Toque num estado para ver as cidades.';
  if (!soft) secShell(view, 'mapa', 'Mapeamento', sub, '<div class="mp-wait"><span class="mp-spin"></span>Carregando o mapa…</div>');
  try { await secMapaLoad(); } catch {
    const b = view.querySelector('.sc-body'); if (b) b.innerHTML = '<div class="mp-wait">Não foi possível carregar o mapa. Verifique a internet e tente de novo.</div>';
    return;
  }
  if (!(location.hash || '').startsWith('#secretaria/mapa')) return;
  const box = view.querySelector('.sc-body'); if (!box) return;

  const ativosDe = new Set(SEC.mats.filter((m) => m.status === 'ativo').map((m) => m.aluno_id));
  const por = {}; let sem = 0;
  SEC.alunos.forEach((a) => {
    const uf = String(a.estado || '').trim().toUpperCase();
    if (!BR_MAPA.uf[uf]) { sem++; return; }
    const e = por[uf] || (por[uf] = { n: 0, at: 0, cid: {} });
    e.n++; if (ativosDe.has(a.id)) e.at++;
    const c = String(a.cidade || '').trim(); if (c) e.cid[c] = (e.cid[c] || 0) + 1;
  });
  const ufs = Object.keys(por).sort((x, y) => por[y].n - por[x].n || x.localeCompare(y));
  const comUF = SEC.alunos.length - sem, max = Math.max(1, ...ufs.map((u) => por[u].n));
  if (secMapaUF && !por[secMapaUF]) secMapaUF = '';
  const pct = (n) => (comUF ? Math.round((n / comUF) * 100) : 0);
  const plural = (n, a, b) => `${n.toLocaleString('pt-BR')} ${n === 1 ? a : b}`;

  const svg = `<svg class="mp-svg" viewBox="0 0 ${BR_MAPA.w} ${BR_MAPA.h}" role="img" aria-label="Mapa do Brasil com a quantidade de alunos por estado">
    ${Object.entries(BR_MAPA.uf).map(([uf, d]) => `<path d="${d}" data-uf="${uf}" class="${por[uf] ? 'has' : ''} ${uf === secMapaUF ? 'sel' : ''}" style="${por[uf] ? `--f:${secMapaCor(por[uf].n / max)}` : ''}"><title>${BR_MAPA.n[uf]}: ${por[uf] ? plural(por[uf].n, 'aluno', 'alunos') : 'nenhum aluno'}</title></path>`).join('')}
    ${ufs.map((uf) => { const [x, y] = BR_MAPA.c[uf]; const r = 15 + Math.round(13 * Math.sqrt(por[uf].n / max)); return `<g class="mp-pin ${uf === secMapaUF ? 'sel' : ''}" data-uf="${uf}" transform="translate(${x} ${y})"><circle r="${r}"/><text dy=".35em" style="font-size:${Math.max(13, r * .78)}px">${por[uf].n}</text></g>`; }).join('')}
  </svg>`;

  const sel = secMapaUF && por[secMapaUF];
  const cidades = sel ? Object.entries(sel.cid).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt')) : [];
  const semCid = sel ? sel.n - cidades.reduce((t, [, n]) => t + n, 0) : 0;
  const detalhe = sel ? `
    <section class="mp-det">
      <header>
        <span class="mp-badge" style="${secMapaBadge(sel.n / max)}">${secMapaUF}</span>
        <div><h3>${BR_MAPA.n[secMapaUF]}</h3><p>${plural(sel.n, 'aluno', 'alunos')} · ${plural(sel.at, 'com matrícula ativa', 'com matrícula ativa')}</p></div>
        <button type="button" class="icon-btn neutral" data-mpx aria-label="Fechar"><i data-icon="x"></i></button>
      </header>
      <h4>Cidades</h4>
      ${cidades.length ? `<ul class="mp-cid">${cidades.slice(0, 12).map(([c, n]) => `<li><span>${esc(c)}</span><i style="--p:${n / cidades[0][1]}"></i><b>${n}</b></li>`).join('')}</ul>
        ${cidades.length > 12 ? `<p class="mp-note">e mais ${cidades.length - 12} cidades</p>` : ''}` : ''}
      ${semCid ? `<p class="mp-note">${plural(semCid, 'aluno ainda sem cidade na ficha', 'alunos ainda sem cidade na ficha')}</p>` : ''}
      <button type="button" class="btn-soft mp-rel" data-mprel><i data-icon="report"></i>Ver os alunos no relatório</button>
    </section>` : '';

  box.innerHTML = `
    <div class="mp">
      <section class="mp-map">
        <div class="mp-kpis">
          <div><b>${comUF.toLocaleString('pt-BR')}</b><span>com estado na ficha</span></div>
          <div><b>${ufs.length}</b><span>${ufs.length === 1 ? 'estado' : 'estados'}</span></div>
          <div class="${sem ? 'warn' : ''}"><b>${sem.toLocaleString('pt-BR')}</b><span>sem estado</span></div>
        </div>
        <div class="mp-canvas">${svg}
          ${ufs.length ? `<div class="mp-legend"><span>menos</span><i></i><span>mais alunos</span></div>` : ''}
        </div>
      </section>
      <aside class="mp-side">
        ${detalhe}
        ${ufs.length ? `<div class="mp-list">${ufs.map((uf) => `
          <button type="button" class="mp-uf ${uf === secMapaUF ? 'on' : ''}" data-uf="${uf}">
            <span class="mp-badge" style="${secMapaBadge(por[uf].n / max)}">${uf}</span>
            <span class="mp-uf-t"><b>${BR_MAPA.n[uf]}</b><small>${plural(por[uf].at, 'ativo', 'ativos')} · ${pct(por[uf].n)}%</small></span>
            <b class="mp-uf-n">${por[uf].n.toLocaleString('pt-BR')}</b>
            <i class="mp-bar" style="--p:${por[uf].n / max}"></i>
          </button>`).join('')}</div>` : `
          <div class="mp-empty"><i data-icon="map"></i><h3>O mapa ainda está em branco</h3><p>Nenhum aluno tem o estado preenchido na ficha. Assim que estados e cidades forem informados, cada estado ganha cor e um cartão aqui.</p></div>`}
        ${sem ? `<div class="mp-sem"><span class="mp-badge none">?</span><span class="mp-uf-t"><b>Sem estado informado</b><small>complete na ficha do aluno</small></span><b class="mp-uf-n">${sem.toLocaleString('pt-BR')}</b></div>` : ''}
      </aside>
    </div>`;
  paintIcons(box);
  const pick = (uf) => { secMapaUF = secMapaUF === uf ? '' : uf; secMapa(view, true); if (secMapaUF && window.innerWidth <= 1000) view.querySelector('.mp-det')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  box.querySelector('.mp-svg').addEventListener('click', (e) => { const t = e.target.closest('[data-uf]'); if (t && por[t.dataset.uf]) pick(t.dataset.uf); });
  box.querySelectorAll('.mp-uf').forEach((b) => b.addEventListener('click', () => pick(b.dataset.uf)));
  box.querySelector('[data-mpx]')?.addEventListener('click', () => pick(secMapaUF));
  box.querySelector('[data-mprel]')?.addEventListener('click', () => { Object.assign(secRel, { estado: secMapaUF, cidade: '' }); location.hash = '#secretaria/relatorios'; });
}

/* =========================================================
   ROTA
   ========================================================= */
window.HC_ROUTES = window.HC_ROUTES || {};
window.HC_ROUTES.secretaria = async (view, r = 'secretaria') => {
  const parts = r.split('/');
  const fresh = !secLastR.startsWith('secretaria'); // entrou agora na secretaria: busca os dados de novo (outro administrador pode ter mexido)
  const moved = secLastR !== r; secLastR = r;
  if (!SEC.ready || fresh) {
    secLoading(view);
    try { await secLoad(fresh); } catch (err) {
      view.innerHTML = `<div class="wrap sc"><section class="soon">${pageHead('Secretaria', 'Ops.', esc(secErr(err)))}<button type="button" class="btn-dark" onclick="route()">Tentar de novo</button></section></div>`;
      return;
    }
    if ((location.hash || '').slice(1) !== r) { secLastR = ''; return; } // a pessoa já foi para outra página
  }
  if (parts[1] === 'alunos') secAlunos(view, parts[2] ?? '');
  else if (parts[1] === 'aluno' && parts[2]) secFicha(view, parts[2]);
  else if (parts[1] === 'cursos') secCursos(view);
  else if (parts[1] === 'cadastros') secCadastros(view);
  else if (parts[1] === 'relatorios') secRelatorios(view);
  else if (parts[1] === 'mapa') secMapa(view);
  else secHome(view);
  // troca de aba: só sobe se a pessoa estava lá embaixo (a pílula fica à vista); depois de salvar, não pula
  if (moved) {
    const nav = view.querySelector('.sc-nav');
    if (!secSoft) window.scrollTo(0, 0);
    else if (nav && nav.getBoundingClientRect().top < 0) window.scrollTo({ top: window.scrollY + nav.getBoundingClientRect().top - 110, behavior: 'smooth' });
  }
};
let secLastR = '';
window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#secretaria')) secLastR = ''; });
