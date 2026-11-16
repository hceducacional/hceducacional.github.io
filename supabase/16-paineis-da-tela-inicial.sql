-- =========================================================
-- HC Instituto Educacional — painéis da tela inicial
-- Libera a chave "hubs" na tabela site_content, onde ficam o Financeiro e os
-- outros painéis ao lado do Acesso rápido (nomes, ícones e botões), editados
-- em Configurações › Painéis da tela inicial. Todo mundo lê; só administradores alteram.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

alter table public.site_content drop constraint if exists site_content_key_check;
alter table public.site_content add constraint site_content_key_check
  check (key in ('banners', 'exclusive', 'links', 'news', 'brand', 'connect', 'authors', 'radar', 'cursoExtra', 'cursoEdit', 'loginBanner', 'hubs'));
