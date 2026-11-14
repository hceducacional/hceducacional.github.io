-- =========================================================
-- HC Instituto Educacional — indicações
-- Os administradores cadastram quem cada aluno indicou (nome, CPF e
-- curso) e confirmam a indicação. O aluno vê só as próprias
-- indicações, e só o nome, o curso e a situação (o CPF nunca chega
-- para ele: a leitura passa pela função my_referrals).
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

create table if not exists public.referrals (
  id          uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles (id) on delete cascade,
  name        text not null check (char_length(name) between 3 and 120),
  cpf         text not null check (cpf ~ '^\d{11}$'),
  course      text not null check (char_length(course) between 2 and 80),
  status      text not null default 'pendente' check (status in ('pendente', 'confirmada')),
  history     jsonb not null default '[]'::jsonb,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);
-- cada pessoa só pode ser indicada uma vez (por um único aluno)
create unique index if not exists referrals_cpf_unico on public.referrals (cpf);
create index if not exists referrals_referrer on public.referrals (referrer_id);
alter table public.referrals enable row level security;

-- a tabela inteira (com CPF) é só dos administradores
drop policy if exists "indicacoes: administradores" on public.referrals;
create policy "indicacoes: administradores" on public.referrals
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
revoke all on public.referrals from anon, authenticated;
grant select, insert, update, delete on public.referrals to authenticated;

-- o aluno lê as próprias indicações, sem o CPF
create or replace function public.my_referrals()
returns table (id uuid, name text, course text, status text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select r.id, r.name, r.course, r.status, r.created_at
    from public.referrals r
   where r.referrer_id = auth.uid()
   order by r.created_at desc;
$$;
revoke execute on function public.my_referrals() from public, anon;
grant execute on function public.my_referrals() to authenticated;
