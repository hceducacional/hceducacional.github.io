-- =========================================================
-- HC Instituto Educacional — Secretaria: documentos por matrícula
-- Nova lista "documento" (os documentos que o portal da faculdade pede)
-- e, em cada matrícula, quais já foram enviados e quando:
--   documentos = { "<id do documento>": "2026-11-27", ... }  (ausente = pendente)
-- Cole no SQL Editor do Supabase e clique em "Run". Pode rodar de novo.
-- =========================================================

-- a lista de base passa a aceitar o tipo "documento"
alter table public.sec_listas drop constraint if exists sec_listas_tipo_check;
alter table public.sec_listas add constraint sec_listas_tipo_check
  check (tipo in ('faculdade','tipo_curso','area','periodo','turma','instrucao','formacao','conhecimento','etnia','documento'));

insert into public.sec_listas (tipo, nome, ordem) values
  ('documento', 'CPF', 1), ('documento', 'RG', 2), ('documento', 'Certidão de Nascimento/Casamento', 3),
  ('documento', 'Título de Eleitor', 4), ('documento', 'Histórico do Ensino Médio (autenticado)', 5),
  ('documento', 'Certificado do Ensino Médio (autenticado)', 6), ('documento', 'Contrato de Prestação de Serviço', 7),
  ('documento', 'Termo de Comparecimento ao Polo', 8)
on conflict do nothing;

alter table public.sec_matriculas add column if not exists documentos jsonb not null default '{}'::jsonb;
grant select (documentos), insert (documentos), update (documentos) on public.sec_matriculas to authenticated;
