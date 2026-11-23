-- =========================================================
-- HC Instituto Educacional — alunos que concluíram o curso de Informática
-- Guarda a data em que o aluno terminou o curso. Na tela de Usuários,
-- quem tem essa data sai das turmas ativas e vai para "Concluídos".
-- Só a conta mestre marca ou desmarca. Precisa do script 19 antes.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

-- o próprio aluno NÃO pode se marcar: a coluna fica de fora do "grant update"
alter table public.profiles add column if not exists informatica_concluido_em timestamptz;

create or replace function public.owner_set_concluido(target uuid, value boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'Só a conta mestre pode marcar o curso como concluído.' using errcode = '42501'; end if;
  update public.profiles set informatica_concluido_em = case when value then coalesce(informatica_concluido_em, now()) else null end where id = target;
end $$;

revoke all on function public.owner_set_concluido(uuid, boolean) from public, anon;
grant execute on function public.owner_set_concluido(uuid, boolean) to authenticated;
