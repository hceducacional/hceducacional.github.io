-- =========================================================
-- HC Instituto Educacional — edição das capas da Plataforma de Informática
-- Libera a chave "cursoEdit" na tabela site_content, onde ficam a foto de
-- capa e os textos dos módulos e lições alterados pelo administrador
-- (botão de lápis). Todo mundo lê; só administradores alteram.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

alter table public.site_content drop constraint if exists site_content_key_check;
alter table public.site_content add constraint site_content_key_check
  check (key in ('banners', 'exclusive', 'links', 'news', 'brand', 'connect', 'authors', 'radar', 'cursoExtra', 'cursoEdit'));
