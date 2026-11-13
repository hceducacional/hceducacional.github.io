-- =========================================================
-- HC Instituto Educacional — cadastro de usuários (Supabase)
-- Cole tudo no SQL Editor do Supabase e clique em "Run".
-- Pode rodar de novo sem problema: nada é duplicado nem apagado.
-- =========================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------
-- 1. Perfis: um por conta (nome, foto, situação e papel)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text not null,
  name         text not null default '' check (char_length(name) <= 60),
  avatar_url   text check (avatar_url is null or avatar_url like 'https://xeqmgwzkwzhmkpvrguln.supabase.co/storage/v1/object/public/avatars/%'),
  avatar_focus text check (avatar_focus is null or avatar_focus ~ '^\d{1,3}% \d{1,3}%$'),
  role         text not null default 'user'    check (role in ('user', 'admin')),
  status       text not null default 'pending' check (status in ('pending', 'approved', 'blocked')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- é administrador aprovado? (usado nas regras abaixo)
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and status = 'approved');
$$;

-- conta nova → perfil novo, aguardando aprovação
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, left(trim(coalesce(new.raw_user_meta_data ->> 'name', '')), 60))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- e-mail trocado na conta → atualiza o perfil
create or replace function public.handle_user_email() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end $$;
drop trigger if exists on_auth_user_email on auth.users;
create trigger on_auth_user_email after update of email on auth.users
  for each row execute function public.handle_user_email();

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Regras: cada pessoa vê e edita só o próprio perfil; o administrador vê todos.
drop policy if exists "perfil: ver o proprio ou admin" on public.profiles;
create policy "perfil: ver o proprio ou admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "perfil: editar o proprio" on public.profiles;
create policy "perfil: editar o proprio" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- O usuário só pode mudar nome e foto. Situação e papel só pelo painel mestre.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (name, avatar_url, avatar_focus) on public.profiles to authenticated;

-- ---------------------------------------------------------
-- 2. Painel mestre (só administradores aprovados)
-- ---------------------------------------------------------
create or replace function public.admin_update_user(target uuid, new_status text default null, new_role text default null)
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.is_admin() then raise exception 'Acesso negado.' using errcode = '42501'; end if;
  if target = auth.uid() and ((new_status is not null and new_status <> 'approved') or new_role = 'user') then
    raise exception 'Você não pode tirar o seu próprio acesso de administrador.';
  end if;
  update public.profiles
     set status = coalesce(new_status, status), role = coalesce(new_role, role)
   where id = target;
  -- bloqueado não consegue nem entrar; aprovado/aguardando voltam a entrar
  if new_status is not null then
    update auth.users set banned_until = case when new_status = 'blocked' then 'infinity'::timestamptz else null end
     where id = target;
  end if;
end $$;

create or replace function public.admin_set_password(target uuid, new_password text)
returns void language plpgsql security definer set search_path = public, auth, extensions as $$
begin
  if not public.is_admin() then raise exception 'Acesso negado.' using errcode = '42501'; end if;
  if char_length(coalesce(new_password, '')) < 8 then raise exception 'A senha precisa ter pelo menos 8 caracteres.'; end if;
  update auth.users set encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')), updated_at = now()
   where id = target;
end $$;

create or replace function public.admin_delete_user(target uuid)
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.is_admin() then raise exception 'Acesso negado.' using errcode = '42501'; end if;
  if target = auth.uid() then raise exception 'Você não pode excluir a sua própria conta por aqui.'; end if;
  delete from auth.users where id = target;
end $$;

revoke execute on function public.is_admin(), public.admin_update_user(uuid, text, text),
  public.admin_set_password(uuid, text), public.admin_delete_user(uuid) from public, anon;
grant execute on function public.is_admin(), public.admin_update_user(uuid, text, text),
  public.admin_set_password(uuid, text), public.admin_delete_user(uuid) to authenticated;
revoke execute on function public.handle_new_user(), public.handle_user_email() from public, anon, authenticated;

-- ---------------------------------------------------------
-- 3. Fotos de perfil (pasta de cada usuário no bucket "avatars")
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "avatars: ver a propria" on storage.objects;
create policy "avatars: ver a propria" on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatars: enviar a propria" on storage.objects;
create policy "avatars: enviar a propria" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatars: trocar a propria" on storage.objects;
create policy "avatars: trocar a propria" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatars: apagar a propria" on storage.objects;
create policy "avatars: apagar a propria" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
