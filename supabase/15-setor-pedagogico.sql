-- =========================================================
-- HC Instituto Educacional — tag "Setor pedagógico"
-- Marca quem trabalha no setor pedagógico. No computador, essas pessoas
-- veem no cabeçalho um aviso ao vivo quando chega um agendamento novo.
-- Só administradores marcam ou desmarcam, pelo painel de Usuários.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

alter table public.profiles add column if not exists pedagogico boolean not null default false;

-- a própria pessoa NÃO pode se marcar: a coluna fica de fora do "grant update"
create or replace function public.admin_set_pedagogico(target uuid, value boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Acesso negado.' using errcode = '42501'; end if;
  update public.profiles set pedagogico = coalesce(value, false) where id = target;
end $$;
revoke all on function public.admin_set_pedagogico(uuid, boolean) from public, anon;
grant execute on function public.admin_set_pedagogico(uuid, boolean) to authenticated;

-- Resumo dos agendamentos aguardando confirmação, para o aviso do cabeçalho.
-- Só nome, tipo e horário de chegada (sem CPF). Só setor pedagógico e administradores.
create or replace function public.pedagogico_feed()
returns table (pending int, last_at timestamptz, last_name text, last_kind text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not (public.is_admin() or exists (select 1 from public.profiles
           where id = auth.uid() and pedagogico and status = 'approved')) then
    raise exception 'Acesso negado.' using errcode = '42501';
  end if;
  return query
    select (select count(*)::int from public.appointments where status = 'pendente'),
           l.created_at, l.name, l.kind
      from (select 1) x
      left join lateral (select a.created_at, a.name, a.kind from public.appointments a
                          where a.status = 'pendente' order by a.created_at desc limit 1) l on true;
end $$;
revoke all on function public.pedagogico_feed() from public, anon;
grant execute on function public.pedagogico_feed() to authenticated;
