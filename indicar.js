/* =========================================================
   INDICAR — o aluno acompanha quem indicou; os administradores
   cadastram as indicações e confirmam cada uma.
   Banco: supabase/06-indicacoes.sql (tabela referrals). O aluno lê
   pela função my_referrals, que nunca devolve o CPF.
   ========================================================= */
const REF_GOAL = 10; // painel: quem chegou a 10 confirmadas (bolsas de 10 amigos)
const REF_STATUS = { pendente: 'Pendente', confirmada: 'Confirmada', usada: 'Usada no desconto' };
const REF_ICO = { pendente: 'clock', confirmada: 'check', usada: 'star' };
const REF_COLOR = { pendente: ['#fbbf24', '#f97316'], confirmada: ['#34d399', '#059669'], usada: ['#a78bfa', '#7c3aed'] };
const refAdm = { list: [], people: [], filter: '', q: '' };

const refStatusPill = (s) => `<span class="rf-st s-${s}"><i data-icon="${REF_ICO[s] || 'clock'}"></i>${REF_STATUS[s] || s}</span>`;
const refOrbit = (names) => {
  const pick = names.length ? names.slice(0, 3) : ['Ana Lima', 'João Pedro', 'Maria Clara'];
  const deg = [-70, 50, 170];
  return `<span class="orb-spin" style="--r:98px;--t:32s">${pick.map((n, k) => `
    <span class="orb-arm" style="--deg:${deg[k]}deg"><span class="orb-up"><span class="ref-av a${k + 1}">${esc(initials(n))}</span></span></span>`).join('')}</span>`;
};
/* ---------- Regulamento "Indique um amigo" (Grupo Educacional FAVENI) ----------
   Cada indicação confirmada já vale desconto (R$ 30 ou R$ 50 numa mensalidade, ou % no curso),
   ou o aluno junta indicações e troca por bolsa. Quem não é aluno também indica e recebe em depósito.
   Para mudar valores ou regras, edite as tabelas abaixo. */
const REF_ME = [['grad', 'Graduação'], ['seg', '2ª Graduação'], ['pos', 'Pós-graduação'], ['cap', 'Capacitação'], ['fora', 'Não sou aluno']];
const REF_FRIEND = [['grad', 'Graduação'], ['seg', '2ª Graduação'], ['pos', 'Pós-graduação']];
/* ganho por indicação: REF_GAIN[curso do amigo][curso que eu faço] = [valor numa mensalidade, ou % alternativo] */
const REF_GAIN = {
  pos: { grad: [30], seg: [30], pos: [30, '10% de desconto no curso todo'], cap: [30, '10% de desconto no curso todo'] },
  seg: { grad: [50], seg: [50, '5% de desconto no curso todo'], pos: [50, '10% de desconto no curso todo'], cap: [50, '10% de desconto no curso todo'] },
  grad: { grad: [50, '10% de desconto no semestre'], seg: [50, '5% de desconto no curso todo'], pos: [50, '10% de desconto no curso todo'], cap: [50, '10% de desconto no curso todo'] },
};
/* bolsas: juntando indicações confirmadas */
const REF_BOLSAS = {
  grad: [[10, 'Um semestre integral', '10 amigos no mesmo curso de graduação (ou de igual valor)'], [20, 'Um semestre integral', '20 amigos em graduação diferente ou de menor valor']],
  seg: [[10, 'Meia bolsa na 2ª Licenciatura', '10 amigos em cursos de 2ª graduação'], [20, 'Bolsa integral na 2ª Licenciatura', '20 amigos em cursos de 2ª graduação']],
  pos: [[5, 'Meia bolsa na Pós-graduação', '5 amigos em graduação, 2ª graduação ou pós'], [10, 'Bolsa integral na Pós-graduação', '10 amigos em graduação, 2ª graduação ou pós'],
    [6, 'Bolsa integral na Pós-graduação', 'Já é certificado em outra pós aqui? 6 amigos bastam']],
};
const REF_RULES = [
  'Vale para indicações feitas a partir de 25/01/2023, em qualquer instituição do Grupo Educacional FAVENI.',
  'Não vale para o curso de Engenharia de Segurança do Trabalho (880 horas).',
  'Na matrícula, o amigo precisa informar o seu nome como quem indicou. Se esquecer, ele mesmo envia um protocolo ao Financeiro com o seu nome completo e CPF.',
  'A indicação é confirmada quando o amigo paga a matrícula. Se ele se matricular por um Agente Educacional, vale no pagamento da 1ª mensalidade.',
  'Para receber, envie um protocolo ao setor Financeiro com o nome completo e o CPF do amigo indicado.',
  'Aluno: o desconto entra nas parcelas em aberto que ainda não venceram. Se já terminou de pagar, recebe em depósito ou usa o desconto num curso novo.',
  'Não é aluno: recebe o valor em depósito, pedindo por e-mail ao setor Financeiro.',
  'Cada indicação vale uma vez: ou vira desconto, ou conta para a bolsa. A indicação já usada como desconto não conta mais para a bolsa.',
  'Para a bolsa, abra um único protocolo com o nome de todos os indicados.',
  'O desconto não vale para matrícula e taxas. Os descontos em % são aplicados sobre o valor com desconto de pagamento antecipado (exceto cobertura de oferta).',
  'Conta o número de pessoas indicadas, não o número de cursos que elas fazem.',
  'Indicação cruzada não vale: você não pode indicar alguém que indicou você.',
  'Agentes Educacionais não ganham por indicação, e alunos não podem indicar Agentes Educacionais.',
  'Se algum desses requisitos não for cumprido, a indicação perde a validade.',
];
const refMoney = (v) => `R$ ${v},00`;
const refPick = (k, def) => { try { return localStorage.getItem(`hc-ref-${k}`) || def; } catch { return def; } };
const refKeep = (k, v) => { try { localStorage.setItem(`hc-ref-${k}`, v); } catch {} };

const refSteps = () => `
  <section class="ref-steps rf-steps4">
    ${[
      ['userPlus', 'Convide', 'Fale do HC Instituto Educacional para amigos, familiares e colegas. Não precisa ser aluno para indicar.'],
      ['users', 'Matrícula', 'Na matrícula, o amigo informa o seu nome como quem indicou. A secretaria do polo registra aqui.'],
      ['check', 'Confirmação', 'Quando o amigo paga a matrícula, a indicação passa para confirmada e já vale desconto.'],
      ['mail', 'Resgate', 'Envie um protocolo ao Financeiro com o nome completo e o CPF do amigo. Para bolsa, um protocolo só com todos.'],
    ].map(([ico, t, d], k) => `
    <article class="ref-step" style="--k:${k}">
      <span class="ref-num">0${k + 1}</span>
      <span class="ref-ico"><i data-icon="${ico}"></i></span>
      <h3>${t}</h3>
      <p>${d}</p>
    </article>`).join('')}
  </section>`;

/* as duas formas de ganhar, a calculadora, o passo a passo e as regras (com e sem conta) */
const refWays = () => `
    <section class="rf-ways">
      <article class="rf-way w-now">
        <span class="rf-way-ico"><i data-icon="check"></i></span>
        <small>Use já</small>
        <h3>Desconto desde a 1ª indicação</h3>
        <p>Cada amigo confirmado vale <b>R$ 30 a R$ 50</b> numa mensalidade, ou até <b>10% de desconto</b> no curso todo.</p>
      </article>
      <article class="rf-way w-save">
        <span class="rf-way-ico"><i data-icon="trophy"></i></span>
        <small>Ou acumule</small>
        <h3>Junte indicações e ganhe bolsa</h3>
        <p>Com <b>5, 10 ou 20 amigos</b>, troque por meia bolsa, um semestre integral ou bolsa integral.</p>
      </article>
      <p class="rf-either"><b>Cada indicação vale uma vez.</b> A que você usar como desconto não conta mais para a bolsa. Quer a bolsa? Guarde as indicações sem resgatar.</p>
      <p class="rf-out-note"><i data-icon="userPlus"></i><span><b>Não é aluno?</b> Você também pode indicar e recebe o valor em depósito.</span></p>
    </section>`;
/* simulador, passo a passo e regras (abaixo das duas colunas no computador) */
function refMore(conf) {
  const logged = conf != null;
  const chips = (name, opts, cur) => `<div class="rf-chips" role="radiogroup" data-chips="${name}">${opts.map(([k, t]) => `<button type="button" role="radio" aria-checked="${k === cur}" data-v="${k}" class="${k === cur ? 'on' : ''}">${t}</button>`).join('')}</div>`;
  return `
    <section class="rf-calc" id="rf-calc">
      <div class="rf-calc-a">
      <header><p class="rf-kick">Simulador</p><h2>Quanto eu ganho?</h2></header>
      <label class="rf-lbl">Eu faço</label>
      ${chips('me', REF_ME, refPick('me', 'grad'))}
      <label class="rf-lbl">Meu amigo vai fazer</label>
      ${chips('fr', REF_FRIEND, refPick('fr', 'grad'))}
      <div class="rf-gain" id="rf-gain" aria-live="polite"></div>
      </div>
      <div class="rf-calc-b">
      <h3 class="rf-sub-t">Bolsas acumulando indicações</h3>
      <p class="rf-sub-p">${logged ? 'Contam só as indicações confirmadas que você ainda não usou como desconto.' : 'Contam só as indicações confirmadas que ainda não foram usadas como desconto.'}</p>
      <div class="rf-bolsas" id="rf-bolsas"></div>
      ${logged ? '' : '<p class="rf-calc-foot">Entre na sua conta para ver quanto falta para cada bolsa.</p>'}
      </div>
    </section>

    <h2 class="rf-sec-t">Como funciona</h2>
    ${refSteps()}

    <details class="rf-rules">
      <summary><span class="rf-rules-ico"><i data-icon="alert"></i></span><span><b>Regras importantes</b><small>Regulamento da promoção “Indique um amigo”</small></span><i class="rf-rules-chev" data-icon="down"></i></summary>
      <ol>${REF_RULES.map((r) => `<li>${r}</li>`).join('')}</ol>
    </details>`;
}
/* liga os botões da calculadora e desenha o resultado */
function refBindCalc(root, conf) {
  const calc = root.querySelector('#rf-calc'); if (!calc) return;
  const draw = () => {
    const me = calc.querySelector('[data-chips="me"] .on').dataset.v, fr = calc.querySelector('[data-chips="fr"] .on').dataset.v;
    const fora = me === 'fora';
    const [v, alt] = fora ? [REF_GAIN[fr].grad[0]] : REF_GAIN[fr][me];
    calc.querySelector('#rf-gain').innerHTML = `
      <span class="rf-gain-v"><small>a cada amigo confirmado</small><b>${refMoney(v)}</b><em>${fora ? 'em depósito na sua conta' : 'de desconto em uma mensalidade'}</em></span>
      ${alt ? `<span class="rf-gain-or">ou</span><span class="rf-gain-v alt"><small>se preferir</small><b>${alt.split(' ')[0]}</b><em>${alt.split(' ').slice(1).join(' ')}</em></span>` : ''}`;
    const bs = REF_BOLSAS[me];
    calc.querySelector('#rf-bolsas').innerHTML = bs ? bs.map(([n, t, d]) => {
      const ok = conf >= n, p = conf == null ? 0 : Math.min(1, conf / n);
      return `<div class="rf-bolsa${ok ? ' ok' : ''}">
        <span class="rf-bolsa-n"><b>${n}</b><small>amigos</small></span>
        <span class="rf-bolsa-t"><strong>${t}</strong><small>${d}</small>
          ${conf != null ? `<span class="rf-meter sm"><i style="--p:${p}"></i></span><em>${ok ? 'Você já pode pedir esta bolsa' : `${conf} de ${n} · faltam ${n - conf}`}</em>` : ''}</span>
        ${ok ? '<span class="rf-st s-confirmada"><i data-icon="check"></i>Alcançada</span>' : ''}
      </div>`;
    }).join('') : `<p class="rf-bolsa-none">${fora ? 'As bolsas são para quem estuda aqui. Indicando sem ser aluno, você recebe o valor de cada indicação em depósito.' : 'As bolsas valem para quem faz graduação, 2ª graduação ou pós-graduação. Na capacitação, você ganha a cada indicação confirmada.'}</p>`;
    paintIcons(calc);
  };
  calc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-chips] button'); if (!b) return;
    const g = b.parentElement;
    g.querySelectorAll('button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
    refKeep(g.dataset.chips, b.dataset.v); draw();
  });
  draw();
}

/* ---------- Página do aluno ----------
   A animação (círculo, órbita e título) aparece na hora; os dados chegam
   depois e surgem abaixo dela, sem tela de "carregando". */
let refLoadId = 0;
function refHeroHTML(out) {
  const first = (auth.user && meName() || '').split(' ')[0];
  return `
  <section class="ref-hero rf-hero" data-mode="${out ? 'out' : 'in'}">
    <div class="ref-glow" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="ref-orb" aria-hidden="true">
      <span class="ref-ring r1"></span><span class="ref-ring r2"></span><span class="ref-ring r3"></span>
      ${out
        ? '<span class="ref-core"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg></span>'
        : '<span class="ref-core rf-core"><b id="rf-num">0</b><small id="rf-numl">disponíveis</small></span>'}
      ${refOrbit([])}
    </div>
    <p class="ref-badge"><span class="ref-dot"></span>Indicações</p>
    ${out
      ? '<h1 class="ref-title"><span>Indique.</span> <span class="ap-grad">Estudem juntos.</span></h1>'
      : `<h1 class="ref-title" id="rf-title"><span>${first ? esc(first) + ',' : 'Suas'}</span> <span class="ap-grad">${first ? 'suas indicações.' : 'indicações.'}</span></h1>`}
    <p class="ref-sub">${out
      ? 'Convide quem você conhece para estudar no HC Instituto Educacional. Cada amigo matriculado já vale desconto, ou junte indicações e ganhe uma bolsa. Não é aluno? Também pode indicar.'
      : 'Cada amigo que se matricula já vale desconto na sua mensalidade. Ou junte indicações e ganhe uma bolsa de estudos.'}</p>
    <p class="ref-prize"><span class="ref-prize-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M11.2 7.4C10 4.6 8.1 3 6.6 3.6c-1.4.6-1.1 2.9 1 3.8zM12.8 7.4C14 4.6 15.9 3 17.4 3.6c1.4.6 1.1 2.9-1 3.8z"/><rect x="2.5" y="8" width="8.4" height="4.4" rx="1.2"/><rect x="13.1" y="8" width="8.4" height="4.4" rx="1.2"/><rect x="4" y="13.6" width="6.9" height="7.4" rx="1.2"/><rect x="13.1" y="13.6" width="6.9" height="7.4" rx="1.2"/></svg></span><span><b class="ap-grad">Desconto</b> já na 1ª indicação</span></p>
    ${out ? '<div class="me-cta rf-cta"><button class="btn-dark" type="button" data-auth="login">Entrar</button><button class="btn-soft" type="button" data-auth="signup">Criar conta</button></div>' : ''}
  </section>`;
}
function renderReferral(view) {
  const out = auth.ready && !auth.user;
  const hero = view.querySelector('.rf-hero');
  // a sessão terminou de carregar com a página já aberta: só ajusta o título, sem reiniciar a animação
  if (hero && hero.dataset.mode === 'in' && !out) {
    const first = (meName() || '').split(' ')[0], t = $('#rf-title');
    if (t && first) t.innerHTML = `<span>${esc(first)},</span> <span class="ap-grad">suas indicações.</span>`;
  } else {
    view.innerHTML = `<div class="wrap ref">${refHeroHTML(out)}<div class="rf-body" id="rf-body">${out ? `<div class="rf-side">${refWays()}</div><div class="rf-rest">${refMore(null)}</div>` : ''}</div></div>`;
    paintIcons(view);
    if (out) refBindCalc(view, null);
  }
  if (out || !auth.ready) return; // sem conta: só a apresentação; sessão carregando: o roteador chama de novo
  refLoadMine(++refLoadId);
}
async function refLoadMine(id) {
  const { data, error } = await sb.rpc('my_referrals');
  const body = $('#rf-body');
  if (id !== refLoadId || !body || (location.hash || '').slice(1) !== 'indicar') return; // a pessoa já saiu ou a página foi redesenhada
  if (error) {
    body.innerHTML = `<section class="rf-card rf-in rf-err"><p>${esc(/my_referrals|schema cache/i.test(error.message || '') ? 'As indicações ainda estão sendo preparadas. Tente de novo mais tarde.' : authError(error))}</p><button class="btn-soft" type="button" onclick="route()"><i data-icon="refresh"></i>Tentar de novo</button></section>`;
    return paintIcons(body);
  }
  const list = data || [];
  const conf = list.filter((r) => r.status === 'confirmada').length;
  const pend = list.filter((r) => r.status === 'pendente').length;
  const used = list.filter((r) => r.status === 'usada').length;
  // círculo: conta até o número; órbita: iniciais de quem foi indicado
  const num = $('#rf-num');
  if (num) {
    $('#rf-numl').textContent = conf === 1 ? 'disponível' : 'disponíveis';
    const t0 = performance.now(), dur = Math.min(900, 120 * conf);
    const tick = (t) => { const k = Math.min(1, (t - t0) / dur); num.textContent = Math.round(conf * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(tick); };
    if (conf) requestAnimationFrame(tick);
  }
  list.slice(0, 3).forEach((r, k) => { const av = document.querySelector(`.rf-hero .ref-av.a${k + 1}`); if (av) av.textContent = initials(r.name); });

  const rs = (n) => `${n} ${n === 1 ? 'desconto' : 'descontos'}`;
  body.innerHTML = `<div class="rf-side">
    ${conf ? `
    <section class="rf-goal rf-in">
      <span class="rf-goal-ico"><i data-icon="star"></i></span>
      <div class="rf-goal-txt">
        <h2>Você já tem ${rs(conf)} para usar!</h2>
        <p>Envie um protocolo ao setor Financeiro com o nome completo e o CPF de cada amigo confirmado. Ou continue juntando para trocar por uma bolsa: a indicação usada como desconto não conta mais para ela.</p>
        <small>Dúvidas? Fale com a secretaria do polo: ${esc(AG.address)}</small>
      </div>
      <a class="btn-dark rf-goal-btn" href="https://wa.me/${AG.phone}?text=${encodeURIComponent(`Olá! Sou ${meName()} e tenho ${conf} ${conf === 1 ? 'indicação confirmada' : 'indicações confirmadas'} no site do HC Instituto Educacional. Como faço para usar o desconto?`)}" target="_blank" rel="noopener"><i data-icon="chat"></i>Falar com a secretaria</a>
    </section>` : ''}

    <section class="rf-card rf-in" style="--d:${conf ? 1 : 0}">
      <div class="rf-counts">
        <span><b>${list.length}</b>${list.length === 1 ? 'indicação' : 'indicações'}</span>
        <span class="c-pend"><b>${pend}</b>${pend === 1 ? 'pendente' : 'pendentes'}</span>
        <span class="c-conf"><b>${conf}</b>${conf === 1 ? 'disponível' : 'disponíveis'}</span>
        <span class="c-used"><b>${used}</b>${used === 1 ? 'usada' : 'usadas'}</span>
      </div>

      <h3 class="rf-list-title">Quem você indicou</h3>
      <div class="rf-list">
        ${list.length ? list.map((r) => `
        <div class="rf-row">
          <span class="aa-av" style="--a:${(REF_COLOR[r.status] || REF_COLOR.pendente)[0]};--b:${(REF_COLOR[r.status] || REF_COLOR.pendente)[1]}">${esc(initials(r.name))}</span>
          <span class="rf-who"><strong>${esc(r.name)}</strong><small>${esc(r.course)}</small></span>
          ${refStatusPill(r.status)}
        </div>`).join('') : `
        <div class="rf-empty">
          <span class="rf-empty-ico"><i data-icon="userPlus"></i></span>
          <strong>Nenhuma indicação ainda</strong>
          <p>Quando alguém que você indicou fizer a matrícula informando o seu nome, a secretaria do polo registra e ela aparece aqui.</p>
        </div>`}
      </div>
    </section>
    </div>
    <div class="rf-rest rf-in" style="--d:${conf ? 2 : 1}">${refWays()}${refMore(conf)}</div>`;
  refBindCalc(body, conf);
  paintIcons(body);
}

/* ---------- Painel dos administradores ---------- */
function renderReferralAdmin(view) {
  waitAuth(view, async () => {
    if (!isAdmin()) return adminOnly(view, 'Indicações');
    Object.assign(refAdm, { filter: '', q: '' });
    view.innerHTML = `
    <div class="wrap ag-adm rf-adm">
      <a class="ag-back" href="#indicar"><i data-icon="left"></i>Página de indicações</a>
      <header class="aa-head">
        <div><p class="page-kicker">Painel</p><h1 class="page-title">Indicações.</h1></div>
        <div class="aa-head-btns">
          <button class="btn-soft" type="button" id="rf-reload"><i data-icon="refresh"></i>Atualizar</button>
          <button class="btn-dark" type="button" id="rf-new"><i data-icon="userPlus"></i>Nova indicação</button>
        </div>
      </header>
      <div class="aa-kpis" id="rf-kpis"></div>
      <section class="aa-bar">
        <div class="aa-seg" id="rf-filter">${[['', 'Todas'], ['pendente', 'Pendentes'], ['confirmada', 'Confirmadas'], ['usada', 'Usadas']].map(([k, t]) => `<button type="button" data-rff="${k}" class="${refAdm.filter === k ? 'on' : ''}">${t}</button>`).join('')}</div>
        <label class="us-search aa-search"><i data-icon="search"></i><input type="search" id="rf-q" placeholder="Buscar aluno, indicado ou CPF"></label>
      </section>
      <section class="ag-panel ag-list-panel">
        <div class="ag-list" id="rf-list"><p class="me-loading">Carregando indicações…</p></div>
      </section>
    </div>`;
    paintIcons(view);
    $('#rf-reload').addEventListener('click', () => refReload().then(() => toast('Atualizado')));
    $('#rf-new').addEventListener('click', () => refDialog());
    $('#rf-filter').addEventListener('click', (e) => {
      const b = e.target.closest('[data-rff]'); if (!b) return;
      refAdm.filter = b.dataset.rff;
      view.querySelectorAll('[data-rff]').forEach((x) => x.classList.toggle('on', x === b));
      refDraw();
    });
    $('#rf-q').addEventListener('input', (e) => { refAdm.q = e.target.value; refDraw(); });
    $('#rf-list').addEventListener('click', refAction);
    refReload();
  });
}
async function refReload() {
  const [r, p] = await Promise.all([
    sb.from('referrals').select('*').order('created_at', { ascending: false }),
    sb.from('profiles').select('id, name, email, avatar_url, avatar_focus, status').order('name'),
  ]);
  const err = r.error || p.error;
  if (err) { $('#rf-list') && ($('#rf-list').innerHTML = `<p class="me-loading">${esc(/referrals/.test(err.message) ? 'A tabela de indicações ainda não existe no banco. Rode o script supabase/06-indicacoes.sql no Supabase.' : authError(err))}</p>`); return; }
  refAdm.list = r.data || []; refAdm.people = p.data || [];
  refDraw();
}
const refPerson = (id) => refAdm.people.find((p) => p.id === id) || { id, name: 'Conta excluída', email: '' };
function refDraw() {
  const box = $('#rf-list'); if (!box) return;
  const all = refAdm.list;
  const confBy = {};
  all.forEach((r) => { if (r.status === 'confirmada') confBy[r.referrer_id] = (confBy[r.referrer_id] || 0) + 1; });
  const kpi = (ico, c, n, t, s) => `<div class="aa-kpi" style="--a:${c[0]};--b:${c[1]}"><span class="aa-kpi-ico"><i data-icon="${ico}"></i></span><b>${n}</b><span>${t}</span>${s ? `<small>${s}</small>` : ''}</div>`;
  const refs = new Set(all.map((r) => r.referrer_id)).size;
  const conf = all.filter((r) => r.status === 'confirmada').length, used = all.filter((r) => r.status === 'usada').length;
  $('#rf-kpis').innerHTML =
    kpi('userPlus', ['#60a5fa', '#2563eb'], all.length, 'Indicações', `${refs} ${refs === 1 ? 'aluno indicou' : 'alunos indicaram'}`) +
    kpi('clock', ['#fbbf24', '#f97316'], all.length - conf - used, 'Pendentes', 'a confirmar') +
    kpi('check', ['#34d399', '#059669'], conf, 'Confirmadas', `${used} ${used === 1 ? 'usada' : 'usadas'} no desconto`) +
    kpi('star', ['#a78bfa', '#7c3aed'], Object.values(confBy).filter((n) => n >= REF_GOAL).length, 'Na meta', `${REF_GOAL}+ disponíveis`);

  // agrupa por aluno que indicou, com os filtros
  const q = fold(refAdm.q.trim()), qd = cpfDigits(refAdm.q);
  const groups = new Map();
  all.forEach((r) => {
    if (refAdm.filter && r.status !== refAdm.filter) return;
    const p = refPerson(r.referrer_id);
    if (q && !fold(`${p.name} ${p.email} ${r.name} ${r.course}`).includes(q) && !(qd.length >= 3 && r.cpf.includes(qd))) return;
    if (!groups.has(r.referrer_id)) groups.set(r.referrer_id, []);
    groups.get(r.referrer_id).push(r);
  });
  const ordered = [...groups.entries()].sort((a, b) => (confBy[b[0]] || 0) - (confBy[a[0]] || 0) || fold(refPerson(a[0]).name).localeCompare(fold(refPerson(b[0]).name)));
  box.innerHTML = ordered.length ? ordered.map(([id, items]) => {
    const p = refPerson(id), c = confBy[id] || 0, total = all.filter((r) => r.referrer_id === id).length;
    return `
    <div class="aa-group rf-group" data-ref="${esc(id)}">
      <div class="rf-gh">
        ${userAvatar(p, 'us-avatar rf-gav')}
        <span class="rf-gwho"><strong>${esc(p.name || p.email || 'Sem nome')}</strong><small>${total} ${total === 1 ? 'indicação' : 'indicações'} · ${c} ${c === 1 ? 'confirmada' : 'confirmadas'}</small></span>
        <span class="rf-gprog">${c >= REF_GOAL ? '<span class="rf-st s-meta"><i data-icon="star"></i>Meta atingida</span>' : `<span class="rf-meter sm"><i style="--p:${Math.min(1, c / REF_GOAL)}"></i></span><b>${c}/${REF_GOAL}</b>`}</span>
        <button class="icon-btn neutral" type="button" data-rf="add" title="Nova indicação de ${esc(p.name || '')}"><i data-icon="userPlus"></i></button>
      </div>
      ${items.map((r) => `
      <div class="aa-row rf-arow" data-id="${r.id}">
        <span class="aa-av" style="--a:${(REF_COLOR[r.status] || REF_COLOR.pendente)[0]};--b:${(REF_COLOR[r.status] || REF_COLOR.pendente)[1]}">${esc(initials(r.name))}</span>
        <span class="aa-who"><strong>${esc(r.name)}</strong><small>${esc(r.course)} · CPF ${cpfMask(r.cpf)} · ${new Date(r.created_at).toLocaleDateString('pt-BR')}</small></span>
        ${refStatusPill(r.status)}
        <span class="ag-acts">
          ${r.status === 'pendente'
            ? `<button class="aa-btn ok" data-rf="confirmar" title="Confirmar indicação"><i data-icon="check"></i><span>Confirmar</span></button>`
            : r.status === 'confirmada'
              ? `<button class="btn-soft sm" data-rf="usar" title="O aluno resgatou o desconto desta indicação: ela deixa de contar para a bolsa"><i data-icon="star"></i>Usada no desconto</button>
                 <button class="icon-btn neutral" data-rf="pendente" title="Voltar para pendente"><i data-icon="left"></i></button>`
              : `<button class="btn-soft sm" data-rf="desusar" title="Voltar para confirmada (volta a contar para a bolsa)"><i data-icon="left"></i>Confirmada</button>`}
          <button class="icon-btn neutral" data-rf="editar" title="Editar"><i data-icon="edit"></i></button>
          ${r.history?.length ? `<button class="icon-btn neutral" data-rf="hist" title="Histórico"><i data-icon="clock"></i></button>` : ''}
          <button class="icon-btn" data-rf="apagar" title="Apagar indicação"><i data-icon="trash"></i></button>
        </span>
      </div>`).join('')}
    </div>`;
  }).join('') : `<p class="us-empty">${all.length ? 'Nenhuma indicação com esse filtro.' : 'Nenhuma indicação cadastrada ainda. Toque em “Nova indicação” para começar.'}</p>`;
  paintIcons($('.rf-adm'));
}
async function refUpdate(r, patch, acao) {
  const history = [...(r.history || []), { em: new Date().toISOString(), por: meName(), acao }];
  const { error } = await sb.from('referrals').update({ ...patch, history }).eq('id', r.id);
  if (error) { toast(refError(error)); return false; }
  Object.assign(r, patch, { history }); refDraw(); return true;
}
/* indicação confirmada: avisa no celular de quem indicou e conta no toast se chegou */
async function refAvisar(r, txt) {
  toast(txt);
  const res = await pushNotifyReferral(r.id);
  if (!res) return;
  const who = (refPerson(r.referrer_id).name || 'o aluno').split(' ')[0];
  toast(res.enviados ? `${txt} · ${who} foi avisado no celular` : `${txt} · ${who} não ativou os avisos`);
}
function refError(err) {
  if (/referrals_cpf_unico|duplicate/i.test(err?.message || '')) return 'Essa pessoa (CPF) já foi indicada por outro aluno.';
  if (/status_check|check constraint/i.test(err?.message || '')) return 'Falta preparar o banco: rode o script supabase/25-indicacao-usada.sql no Supabase.';
  return authError(err);
}
async function refAction(e) {
  const b = e.target.closest('[data-rf]'); if (!b) return;
  if (b.dataset.rf === 'add') return refDialog({ referrer_id: b.closest('[data-ref]').dataset.ref });
  const r = refAdm.list.find((x) => x.id === b.closest('[data-id]')?.dataset.id); if (!r) return;
  const first = r.name.split(' ')[0];
  switch (b.dataset.rf) {
    case 'confirmar': if (await refUpdate(r, { status: 'confirmada' }, 'Confirmada')) refAvisar(r, `Indicação de ${first} confirmada`); break;
    case 'usar': {
      if (!(await confirmDialog({ title: `Marcar a indicação de ${first} como usada?`, sub: 'Use quando o aluno resgatar o desconto desta indicação. Ela deixa de contar para a bolsa.', ok: 'Marcar como usada' }))) return;
      if (await refUpdate(r, { status: 'usada' }, 'Usada no desconto')) toast(`Indicação de ${first} marcada como usada`);
      break;
    }
    case 'desusar': if (await refUpdate(r, { status: 'confirmada' }, 'Voltou para confirmada')) toast(`${first} voltou para confirmada`); break;
    case 'pendente': if (await refUpdate(r, { status: 'pendente' }, 'Voltou para pendente')) toast(`${first} voltou para pendente`); break;
    case 'editar': refDialog(r); break;
    case 'hist':
      openAuth('info', { title: 'Histórico', icon: 'clock', tone: 'ok', text: `<span class="ag-hist">${r.history.map((h) => `<span><b>${new Date(h.em).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</b> · ${esc(h.acao || '')}${h.por ? ` · por ${esc(h.por)}` : ''}</span>`).join('')}</span>` });
      break;
    case 'apagar': {
      if (!(await confirmDialog({ title: `Apagar a indicação de ${first}?`, sub: `${r.name} sai da lista de ${refPerson(r.referrer_id).name || 'quem indicou'}. Não dá para desfazer.`, ok: 'Apagar indicação' }))) return;
      const { error } = await sb.from('referrals').delete().eq('id', r.id);
      if (error) return toast(refError(error));
      refAdm.list = refAdm.list.filter((x) => x.id !== r.id); refDraw(); toast('Indicação apagada');
    }
  }
}

/* nova indicação ou edição: escolhe o aluno que indicou e preenche nome, CPF e curso */
function refDialog(r = {}) {
  if (document.querySelector('.lk')) return;
  const editing = !!r.id;
  let chosen = r.referrer_id || '';
  const wrap = document.createElement('div');
  wrap.className = 'lk au';
  wrap.innerHTML = `<div class="lk-backdrop"></div>
    <form class="lk-card au-card rf-dlg" role="dialog" aria-modal="true" aria-labelledby="rf-t" novalidate>
      <span class="lk-icon au-ico"><i data-icon="userPlus"></i></span>
      <h2 id="rf-t">${editing ? 'Editar indicação' : 'Nova indicação'}</h2>
      <p class="lk-sub">${editing ? 'Ajuste os dados de quem foi indicado.' : 'Registre a pessoa indicada e quem fez a indicação.'}</p>
      <label class="au-label" for="rf-who">Aluno que indicou</label>
      <div class="rf-pick" id="rf-pick"></div>
      <label class="au-label" for="rf-n">Nome de quem foi indicado</label><div class="lk-field"><input id="rf-n" maxlength="120" autocomplete="off" placeholder="Nome completo" value="${esc(r.name || '')}"></div>
      <label class="au-label" for="rf-c">CPF</label><div class="lk-field"><input id="rf-c" inputmode="numeric" autocomplete="off" placeholder="000.000.000-00" value="${cpfMask(r.cpf || '')}"></div>
      <label class="au-label" for="rf-k">Curso</label><div class="lk-field"><input id="rf-k" maxlength="80" autocomplete="off" placeholder="Ex.: Pedagogia" value="${esc(r.course || '')}"></div>
      ${editing ? '' : `<label class="rf-check"><input type="checkbox" id="rf-ok"><span>Já confirmar (matrícula feita)</span></label>`}
      <p class="lk-msg" role="alert"></p>
      <div class="lk-actions"><button type="button" class="btn-soft lk-cancel">Cancelar</button><button type="submit" class="btn-dark lk-go">${editing ? 'Salvar' : 'Cadastrar'}</button></div>
    </form>`;
  document.body.appendChild(wrap); paintIcons(wrap);
  const msg = wrap.querySelector('.lk-msg'), pick = wrap.querySelector('#rf-pick');

  // escolha do aluno: mostra o escolhido ou uma busca com resultados
  const drawPick = (q = '') => {
    if (chosen) {
      const p = refPerson(chosen);
      pick.innerHTML = `<div class="rf-chosen">${userAvatar(p, 'us-avatar rf-gav')}<span class="rf-gwho"><strong>${esc(p.name || 'Sem nome')}</strong><small>${esc(p.email || '')}</small></span><button type="button" class="btn-soft sm" data-change>Trocar</button></div>`;
      paintIcons(pick); return;
    }
    const f = fold(q.trim());
    const hits = refAdm.people.filter((p) => !f || fold(`${p.name} ${p.email}`).includes(f)).slice(0, 6);
    pick.innerHTML = `<div class="lk-field"><input id="rf-who" type="search" autocomplete="off" placeholder="Buscar pelo nome ou e-mail" value="${esc(q)}"></div>
      <div class="rf-hits">${hits.map((p) => `<button type="button" class="rf-hit" data-pick="${esc(p.id)}">${userAvatar(p, 'us-avatar rf-gav')}<span class="rf-gwho"><strong>${esc(p.name || 'Sem nome')}</strong><small>${esc(p.email || '')}</small></span></button>`).join('') || '<p class="ag-desc">Ninguém encontrado. O aluno precisa ter conta no site.</p>'}</div>`;
    paintIcons(pick);
    const inp = pick.querySelector('#rf-who');
    inp.addEventListener('input', () => { const pos = inp.selectionStart; drawPick(inp.value); const n = pick.querySelector('#rf-who'); n.focus(); n.setSelectionRange(pos, pos); });
  };
  pick.addEventListener('click', (e) => {
    const h = e.target.closest('[data-pick]');
    if (h) { chosen = h.dataset.pick; drawPick(); msg.textContent = ''; return wrap.querySelector('#rf-n').focus(); }
    if (e.target.closest('[data-change]')) { chosen = ''; drawPick(); pick.querySelector('#rf-who').focus(); }
  });
  drawPick();

  const cpfIn = wrap.querySelector('#rf-c');
  cpfIn.addEventListener('input', () => { cpfIn.value = cpfMask(cpfIn.value); msg.textContent = ''; });
  const close = () => { wrap.classList.remove('in'); document.removeEventListener('keydown', onKey); setTimeout(() => wrap.remove(), 300); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  wrap.querySelector('.lk-backdrop').addEventListener('click', close);
  wrap.querySelector('.lk-cancel').addEventListener('click', close);
  wrap.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = wrap.querySelector('#rf-n').value.trim().replace(/\s+/g, ' ');
    const cpf = cpfDigits(cpfIn.value), course = wrap.querySelector('#rf-k').value.trim();
    if (!chosen) return (msg.textContent = 'Escolha o aluno que fez a indicação.');
    if (name.length < 3) return (msg.textContent = 'Digite o nome de quem foi indicado.'), wrap.querySelector('#rf-n').focus();
    if (!cpfOk(cpf)) return (msg.textContent = 'CPF inválido. Confira os números.'), cpfIn.focus();
    if (course.length < 2) return (msg.textContent = 'Digite o curso.'), wrap.querySelector('#rf-k').focus();
    const dup = refAdm.list.find((x) => x.cpf === cpf && x.id !== r.id);
    if (dup) return (msg.textContent = `Esse CPF já foi indicado por ${refPerson(dup.referrer_id).name || 'outro aluno'}.`);
    const go = wrap.querySelector('.lk-go'); go.disabled = true;
    if (editing) {
      const changes = { referrer_id: chosen, name, cpf, course };
      const ok = await refUpdate(r, changes, chosen !== r.referrer_id ? `Editada (passou de ${refPerson(r.referrer_id).name} para ${refPerson(chosen).name})` : 'Editada');
      go.disabled = false;
      if (ok) { close(); toast('Indicação atualizada'); }
      return;
    }
    const status = wrap.querySelector('#rf-ok').checked ? 'confirmada' : 'pendente';
    const { data, error } = await sb.from('referrals').insert({
      referrer_id: chosen, name, cpf, course, status, created_by: auth.user.id,
      history: [{ em: new Date().toISOString(), por: meName(), acao: status === 'confirmada' ? 'Cadastrada já confirmada' : 'Cadastrada' }],
    }).select().single();
    go.disabled = false;
    if (error) return (msg.textContent = refError(error));
    refAdm.list.unshift(data); refDraw(); close();
    if (status === 'confirmada') refAvisar(data, `Indicação de ${name.split(' ')[0]} cadastrada e confirmada`);
    else toast(`Indicação de ${name.split(' ')[0]} cadastrada`);
  });
  requestAnimationFrame(() => wrap.classList.add('in'));
  setTimeout(() => (chosen ? wrap.querySelector('#rf-n') : pick.querySelector('#rf-who'))?.focus(), 60);
}

window.HC_ROUTES = Object.assign(window.HC_ROUTES || {}, { indicar: renderReferral, 'indicar/painel': renderReferralAdmin });
