-- =========================================================
-- HC Instituto Educacional — conteúdo do site compartilhado
-- Banners, notícias, botões, logo, blocos e radar ficam no banco:
-- todo mundo lê; só administradores alteram. As imagens vão para
-- o bucket público "site".
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

create table if not exists public.site_content (
  key        text primary key check (key in ('banners', 'exclusive', 'links', 'news', 'brand', 'connect', 'authors', 'radar')),
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null default auth.uid()
);
alter table public.site_content enable row level security;

drop policy if exists "conteudo: todos leem" on public.site_content;
create policy "conteudo: todos leem" on public.site_content
  for select to anon, authenticated using (true);
drop policy if exists "conteudo: administradores criam" on public.site_content;
create policy "conteudo: administradores criam" on public.site_content
  for insert to authenticated with check (public.is_admin());
drop policy if exists "conteudo: administradores alteram" on public.site_content;
create policy "conteudo: administradores alteram" on public.site_content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();

-- Imagens do site (banners, notícias, botões, logo...): bucket público, só administradores enviam
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site', 'site', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
on conflict (id) do update set public = true, file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

drop policy if exists "site: administradores enviam" on storage.objects;
create policy "site: administradores enviam" on storage.objects for insert to authenticated
  with check (bucket_id = 'site' and public.is_admin());
drop policy if exists "site: administradores veem" on storage.objects;
create policy "site: administradores veem" on storage.objects for select to authenticated
  using (bucket_id = 'site' and public.is_admin());
drop policy if exists "site: administradores apagam" on storage.objects;
create policy "site: administradores apagam" on storage.objects for delete to authenticated
  using (bucket_id = 'site' and public.is_admin());
