-- =========================================================
-- HC Instituto Educacional — alunos do curso de Informática
-- Marca quais cadastros são alunos matriculados no curso de Informática.
-- Só eles (e os administradores) entram direto na Plataforma de Informática
-- pelo banner; os demais veem a página de apresentação do curso.
-- Só administradores marcam ou desmarcam, pelo painel de Usuários.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

alter table public.profiles add column if not exists informatica boolean not null default false;

-- o próprio usuário NÃO pode se marcar como aluno: a coluna fica de fora do "grant update"
create or replace function public.admin_set_informatica(target uuid, value boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Acesso negado.' using errcode = '42501'; end if;
  update public.profiles set informatica = coalesce(value, false) where id = target;
end $$;

revoke all on function public.admin_set_informatica(uuid, boolean) from public, anon;
grant execute on function public.admin_set_informatica(uuid, boolean) to authenticated;
