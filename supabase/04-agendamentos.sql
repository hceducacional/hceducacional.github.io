-- =========================================================
-- HC Instituto Educacional — agendamento de provas e tutoria presencial
-- Qualquer pessoa agenda (sem precisar de conta); as regras de dias,
-- turnos, vagas e datas bloqueadas são conferidas aqui no banco.
-- Só administradores veem a lista com nomes e CPFs.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

create table if not exists public.appointments (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('prova', 'tutoria')),
  name       text not null check (char_length(name) between 3 and 120),
  cpf        text not null check (cpf ~ '^\d{11}$'),
  course     text not null check (char_length(course) between 2 and 80),
  college    text not null check (college in ('Unifaveni', 'Uniabeu', 'Futura', 'Dom Alberto')),
  date       date not null,
  shift      text not null check (shift in ('manha', 'tarde')),
  status     text not null default 'confirmado' check (status in ('confirmado', 'compareceu', 'faltou', 'cancelado')),
  history    jsonb not null default '[]'::jsonb,
  user_id    uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists appointments_slot on public.appointments (date, kind, shift);
alter table public.appointments enable row level security;

drop policy if exists "agendamentos: administradores" on public.appointments;
create policy "agendamentos: administradores" on public.appointments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
revoke all on public.appointments from anon, authenticated;
grant select, update, delete on public.appointments to authenticated;

create table if not exists public.blocked_dates (
  date       date not null,
  scope      text not null check (scope in ('todos', 'prova', 'tutoria')),
  reason     text not null default '' check (char_length(reason) <= 80),
  created_at timestamptz not null default now(),
  primary key (date, scope)
);
alter table public.blocked_dates enable row level security;
drop policy if exists "bloqueios: todos leem" on public.blocked_dates;
create policy "bloqueios: todos leem" on public.blocked_dates for select to anon, authenticated using (true);
drop policy if exists "bloqueios: administradores criam" on public.blocked_dates;
create policy "bloqueios: administradores criam" on public.blocked_dates for insert to authenticated with check (public.is_admin());
drop policy if exists "bloqueios: administradores apagam" on public.blocked_dates;
create policy "bloqueios: administradores apagam" on public.blocked_dates for delete to authenticated using (public.is_admin());
revoke all on public.blocked_dates from anon, authenticated;
grant select on public.blocked_dates to anon, authenticated;
grant insert, delete on public.blocked_dates to authenticated;

-- Vagas de cada tipo por dia da semana e turno (0 = não tem atendimento)
-- Prova: seg, ter, qui e sex (manhã e tarde) e sáb (manhã) — 6 vagas por turno
-- Tutoria: ter, qui e sex (manhã e tarde) e sáb (manhã) — 2 vagas por turno
create or replace function public.slot_capacity(k text, d date, s text) returns int
language sql immutable as $$
  select case
    when k = 'prova'   and extract(isodow from d) in (1, 2, 4, 5) then 6
    when k = 'prova'   and extract(isodow from d) = 6 and s = 'manha' then 6
    when k = 'tutoria' and extract(isodow from d) in (2, 4, 5) then 2
    when k = 'tutoria' and extract(isodow from d) = 6 and s = 'manha' then 2
    else 0 end;
$$;

-- Vagas já ocupadas (só números, sem dados pessoais) para o calendário do site
create or replace function public.slot_counts(d1 date, d2 date)
returns table (date date, kind text, shift text, used int)
language sql stable security definer set search_path = public as $$
  select a.date, a.kind, a.shift, count(*)::int
    from public.appointments a
   where a.date between d1 and d2 and d2 - d1 <= 400 and a.status <> 'cancelado'
   group by 1, 2, 3;
$$;

create or replace function public.cpf_valido(c text) returns boolean
language plpgsql immutable as $$
declare s int; r int; i int;
begin
  if c !~ '^\d{11}$' or c ~ '^(\d)\1{10}$' then return false; end if;
  s := 0; for i in 1..9 loop s := s + substr(c, i, 1)::int * (11 - i); end loop;
  r := (s * 10) % 11; if r = 10 then r := 0; end if;
  if r <> substr(c, 10, 1)::int then return false; end if;
  s := 0; for i in 1..10 loop s := s + substr(c, i, 1)::int * (12 - i); end loop;
  r := (s * 10) % 11; if r = 10 then r := 0; end if;
  return r = substr(c, 11, 1)::int;
end $$;

-- Agendar: confere todas as regras e grava (as vagas nunca passam do limite)
create or replace function public.book_appointment(p_kind text, p_name text, p_cpf text, p_course text, p_college text, p_date date, p_shift text)
returns table (id uuid, kind text, name text, course text, college text, date date, shift text)
language plpgsql volatile security definer set search_path = public as $$
#variable_conflict use_column
declare
  c text := regexp_replace(coalesce(p_cpf, ''), '\D', '', 'g');
  today date := (now() at time zone 'America/Fortaleza')::date;
  nowt time := (now() at time zone 'America/Fortaleza')::time;
  cap int; used int; rec public.appointments;
begin
  if not public.cpf_valido(c) then raise exception 'CPF inválido. Confira os números.'; end if;
  cap := public.slot_capacity(p_kind, p_date, p_shift);
  if cap = 0 then raise exception 'Não há atendimento desse tipo nesse dia e turno.'; end if;
  if p_date < today then raise exception 'Escolha uma data a partir de hoje.'; end if;
  if p_date > today + 120 then raise exception 'Os agendamentos abrem com até 4 meses de antecedência.'; end if;
  if p_date = today and nowt >= (case when p_shift = 'manha' then time '08:30' else time '14:30' end) then
    raise exception 'Esse turno de hoje já começou. Escolha outro turno ou data.';
  end if;
  if exists (select 1 from public.blocked_dates b where b.date = p_date and b.scope in ('todos', p_kind)) then
    raise exception 'Essa data está bloqueada para agendamentos. Escolha outra.';
  end if;
  perform pg_advisory_xact_lock(hashtext(p_kind || p_date::text || p_shift));
  if exists (select 1 from public.appointments a where a.cpf = c and a.date = p_date and a.kind = p_kind and a.status <> 'cancelado') then
    raise exception 'Já existe um agendamento com esse CPF nesse dia.';
  end if;
  select count(*) into used from public.appointments a
   where a.date = p_date and a.kind = p_kind and a.shift = p_shift and a.status <> 'cancelado';
  if used >= cap then raise exception 'Esse turno acabou de lotar. Escolha outro turno ou data.'; end if;
  insert into public.appointments (kind, name, cpf, course, college, date, shift, user_id)
  values (p_kind, left(trim(p_name), 120), c, left(trim(p_course), 80), p_college, p_date, p_shift, auth.uid())
  returning * into rec;
  return query select rec.id, rec.kind, rec.name, rec.course, rec.college, rec.date, rec.shift;
end $$;

revoke execute on function public.slot_counts(date, date), public.book_appointment(text, text, text, text, text, date, text) from public;
grant execute on function public.slot_counts(date, date), public.book_appointment(text, text, text, text, text, date, text) to anon, authenticated;
grant execute on function public.slot_capacity(text, date, text), public.cpf_valido(text) to anon, authenticated;
