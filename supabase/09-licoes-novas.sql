-- =========================================================
-- HC Instituto Educacional — botão "Nova lição" da Plataforma de Informática
-- Libera a chave "cursoExtra" na tabela site_content, onde ficam os cards
-- de lição criados pelo administrador (todo mundo lê; só administradores
-- alteram, pelas mesmas regras do resto do conteúdo do site).
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

alter table public.site_content drop constraint if exists site_content_key_check;
alter table public.site_content add constraint site_content_key_check
  check (key in ('banners', 'exclusive', 'links', 'news', 'brand', 'connect', 'authors', 'radar', 'cursoExtra'));
