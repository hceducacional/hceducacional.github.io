-- =========================================================
-- HC Instituto Educacional — banner da janela de entrar
-- Libera a chave "loginBanner" na tabela site_content, onde fica a imagem
-- do lado esquerdo da janela de entrar / criar conta (botão "Editar banner",
-- só para administradores). Todo mundo lê; só administradores alteram.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

alter table public.site_content drop constraint if exists site_content_key_check;
alter table public.site_content add constraint site_content_key_check
  check (key in ('banners', 'exclusive', 'links', 'news', 'brand', 'connect', 'authors', 'radar', 'cursoExtra', 'cursoEdit', 'loginBanner'));
