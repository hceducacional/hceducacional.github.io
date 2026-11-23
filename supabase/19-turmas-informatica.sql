-- =========================================================
-- HC Instituto Educacional — turmas do curso de Informática
-- Organiza os alunos de Informática em turmas (nome + dias/horário).
-- Cada aluno fica em no máximo uma turma.
-- Administradores veem as turmas; só a conta mestre cria, edita, apaga
-- e escolhe quem fica em cada turma. O aluno vê só a própria turma.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

create or replace function public.is_owner() returns boolean
language sql stable as $$
  select auth.uid() is not distinct from '885e66d2-3920-4a3c-b7a9-3ffdeaccc7cf'::uuid;
$$;

create table if not exists public.turmas (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null check (char_length(nome) between 1 and 60),
  horario    text not null default '' check (char_length(horario) <= 80),
  created_at timestamptz not null default now()
);
alter table public.turmas enable row level security;
grant select on public.turmas to authenticated;

-- o próprio aluno NÃO pode trocar de turma: a coluna fica de fora do "grant update"
alter table public.profiles add column if not exists turma_id uuid references public.turmas(id) on delete set null;

drop policy if exists "turmas: ler" on public.turmas;
create policy "turmas: ler" on public.turmas for select to authenticated
  using (public.is_admin() or id = (select turma_id from public.profiles where id = auth.uid()));

-- cria (tid nulo) ou edita uma turma e define a lista completa de alunos dela
create or replace function public.owner_save_turma(tid uuid, p_nome text, p_horario text, alunos uuid[])
returns uuid language plpgsql security definer set search_path = public as $$
declare t uuid := tid;
begin
  if not public.is_owner() then raise exception 'Só a conta mestre pode organizar as turmas.' using errcode = '42501'; end if;
  if t is null then
    insert into public.turmas (nome, horario) values (trim(p_nome), trim(coalesce(p_horario, ''))) returning id into t;
  else
    update public.turmas set nome = trim(p_nome), horario = trim(coalesce(p_horario, '')) where id = t;
  end if;
  update public.profiles set turma_id = null where turma_id = t and not (id = any(coalesce(alunos, '{}')));
  update public.profiles set turma_id = t where id = any(coalesce(alunos, '{}'));
  return t;
end $$;

create or replace function public.owner_delete_turma(tid uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'Só a conta mestre pode organizar as turmas.' using errcode = '42501'; end if;
  delete from public.turmas where id = tid; -- os alunos ficam "sem turma"
end $$;

revoke all on function public.owner_save_turma(uuid, text, text, uuid[]) from public, anon;
revoke all on function public.owner_delete_turma(uuid) from public, anon;
grant execute on function public.owner_save_turma(uuid, text, text, uuid[]) to authenticated;
grant execute on function public.owner_delete_turma(uuid) to authenticated;
