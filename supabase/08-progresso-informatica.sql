-- =========================================================
-- HC Instituto Educacional — progresso dos alunos na Plataforma de Informática
-- Guarda, por aluno e por lição, o nível em que parou, XP, tempo, acertos e erros.
-- Cada aluno só lê e grava o próprio progresso; administradores leem o de todos
-- (para acompanhar a turma). Sem este script o progresso fica salvo só no aparelho.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

create table if not exists public.informatica_progresso (
  user_id    uuid not null references auth.users (id) on delete cascade,
  licao      text not null,
  dados      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, licao)
);

alter table public.informatica_progresso enable row level security;

drop policy if exists "progresso: o aluno lê o seu" on public.informatica_progresso;
create policy "progresso: o aluno lê o seu" on public.informatica_progresso
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "progresso: o aluno grava o seu" on public.informatica_progresso;
create policy "progresso: o aluno grava o seu" on public.informatica_progresso
  for insert with check (auth.uid() = user_id);

drop policy if exists "progresso: o aluno atualiza o seu" on public.informatica_progresso;
create policy "progresso: o aluno atualiza o seu" on public.informatica_progresso
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update on public.informatica_progresso to authenticated;
