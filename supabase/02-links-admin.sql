-- =========================================================
-- HC Instituto Educacional — links restritos a administradores
-- (ex.: Sistema Semipresencial). O endereço fica só no banco,
-- nunca no código do site, e só administradores conseguem ler.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

create table if not exists public.admin_links (
  id         text primary key,
  title      text not null default '',
  url        text not null check (url ~ '^https://'),
  updated_at timestamptz not null default now()
);
alter table public.admin_links enable row level security;

drop policy if exists "links: so administradores" on public.admin_links;
create policy "links: so administradores" on public.admin_links
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.admin_links from anon, authenticated;
grant select, insert, update, delete on public.admin_links to authenticated;
