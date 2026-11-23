-- =========================================================
-- HC Instituto Educacional — só a conta mestre marca alunos de Informática
-- Antes qualquer administrador podia marcar/desmarcar "Aluno de Informática".
-- Agora só a conta mestre (a do dono do site) pode.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

create or replace function public.admin_set_informatica(target uuid, value boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is distinct from '885e66d2-3920-4a3c-b7a9-3ffdeaccc7cf'::uuid then
    raise exception 'Só a conta mestre pode marcar alunos de Informática.' using errcode = '42501';
  end if;
  update public.profiles set informatica = coalesce(value, false) where id = target;
end $$;

revoke all on function public.admin_set_informatica(uuid, boolean) from public, anon;
grant execute on function public.admin_set_informatica(uuid, boolean) to authenticated;
