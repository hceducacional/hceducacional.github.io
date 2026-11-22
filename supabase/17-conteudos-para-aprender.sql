-- =========================================================
-- HC Instituto Educacional — "Conteúdos para aprender" da Plataforma de Informática
-- Libera a chave "cursoConteudo" na tabela site_content, onde ficam os cards de
-- conteúdo (textos, PDFs, questionários e provas) criados pelo administrador na tela
-- dos módulos. Todo mundo lê; só administradores alteram.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

alter table public.site_content drop constraint if exists site_content_key_check;
alter table public.site_content add constraint site_content_key_check
  check (key in ('banners', 'exclusive', 'links', 'news', 'brand', 'connect', 'authors', 'radar', 'cursoExtra', 'cursoEdit', 'loginBanner', 'hubs', 'cursoConteudo'));
