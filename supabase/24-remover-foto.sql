-- =========================================================
-- HC Instituto Educacional — administrador remove a foto de perfil de alguém
-- Serve para fotos que chegaram com problema (ex.: toda branca) ou impróprias.
-- No lugar da foto voltam a aparecer as iniciais do nome.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

create or replace function public.admin_clear_avatar(target uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Acesso negado.' using errcode = '42501'; end if;
  update public.profiles set avatar_url = null, avatar_focus = null where id = target;
end $$;
revoke all on function public.admin_clear_avatar(uuid) from public, anon;
grant execute on function public.admin_clear_avatar(uuid) to authenticated;

-- foto toda branca do Ewerton Renan Santos Lima (enviada em 25/11/2026)
update public.profiles set avatar_url = null, avatar_focus = null
where id = 'a2dc47ec-1be7-4f9a-b5e6-0d9e61271fed';
