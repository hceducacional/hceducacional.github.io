-- =========================================================
-- HC Instituto Educacional — nome de usuário
-- Cada conta pode ter um nome de usuário (ex.: maria.silva) e entrar com ele
-- no lugar do e-mail. O e-mail continua existindo (confirmação e senha nova).
--
-- Segurança: o site nunca descobre o e-mail de alguém só pelo nome de usuário.
-- A função login_email() só devolve o e-mail quando a senha está certa, e trava
-- o nome de usuário por 15 minutos depois de 10 tentativas erradas.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

alter table public.profiles add column if not exists username text;
alter table public.profiles drop constraint if exists profiles_username_check;
alter table public.profiles add constraint profiles_username_check
  check (username is null or username ~ '^[a-z0-9][a-z0-9._]{2,19}$');
create unique index if not exists profiles_username_key on public.profiles (username);

-- o próprio usuário pode escolher/trocar o nome de usuário
grant update (name, avatar_url, avatar_focus, cpf, course, college, username) on public.profiles to authenticated;

-- conta nova: guarda o nome de usuário escolhido no cadastro (se for válido e estiver livre)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare u text := lower(trim(coalesce(new.raw_user_meta_data ->> 'username', '')));
begin
  if u !~ '^[a-z0-9][a-z0-9._]{2,19}$' or exists (select 1 from public.profiles where username = u) then u := null; end if;
  insert into public.profiles (id, email, name, username)
  values (new.id, new.email, left(trim(coalesce(new.raw_user_meta_data ->> 'name', '')), 60), u)
  on conflict (id) do nothing;
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- nome de usuário livre? (usado no cadastro, antes de criar a conta)
create or replace function public.username_available(u text)
returns boolean language sql stable security definer set search_path = public as $$
  select not exists (select 1 from public.profiles where username = lower(trim(u)));
$$;

-- tentativas erradas de entrar com nome de usuário (para travar quem fica chutando senhas)
create table if not exists public.login_attempts (
  username text not null,
  at       timestamptz not null default now()
);
create index if not exists login_attempts_idx on public.login_attempts (username, at);
alter table public.login_attempts enable row level security;
revoke all on public.login_attempts from anon, authenticated;

-- entrar com nome de usuário: confere a senha e só então devolve o e-mail da conta
create or replace function public.login_email(u text, pass text)
returns text language plpgsql security definer set search_path = public, auth, extensions as $$
declare
  name_in text := lower(trim(coalesce(u, '')));
  mail text; hash text;
begin
  delete from public.login_attempts where at < now() - interval '1 day';
  if (select count(*) from public.login_attempts where username = name_in and at > now() - interval '15 minutes') >= 10 then
    raise exception 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.';
  end if;
  select a.email, a.encrypted_password into mail, hash
    from public.profiles p join auth.users a on a.id = p.id
   where p.username = name_in;
  if mail is not null and hash is not null and extensions.crypt(coalesce(pass, ''), hash) = hash then
    delete from public.login_attempts where username = name_in;
    return mail;
  end if;
  insert into public.login_attempts (username) values (name_in);
  return null;
end $$;

-- administrador define o nome de usuário de um aluno (painel de Usuários)
create or replace function public.admin_set_username(target uuid, value text)
returns void language plpgsql security definer set search_path = public as $$
declare v text := nullif(lower(trim(coalesce(value, ''))), '');
begin
  if not public.is_admin() then raise exception 'Acesso negado.' using errcode = '42501'; end if;
  update public.profiles set username = v where id = target;
end $$;

revoke all on function public.username_available(text), public.login_email(text, text), public.admin_set_username(uuid, text) from public;
grant execute on function public.username_available(text), public.login_email(text, text) to anon, authenticated;
grant execute on function public.admin_set_username(uuid, text) to authenticated;
