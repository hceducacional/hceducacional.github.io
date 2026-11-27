-- =========================================================
-- HC Instituto Educacional — Secretaria (base de alunos)
-- Tudo aqui é SÓ de administradores (regra no próprio banco).
--   sec_listas      listas de base: faculdades, tipos de curso (com os meses
--                   da expiração), áreas, períodos, turmas, instrução,
--                   formação, como conheceu, etnia
--   sec_cursos      cursos (cada um ligado a uma faculdade, tipo e área)
--   sec_alunos      ficha do aluno (dados pessoais e contato)
--   sec_matriculas  matrículas do aluno (um aluno pode ter várias); a senha
--                   do portal fica criptografada e só sai pelas funções
--                   sec_ver_senha / sec_definir_senha, que registram quem viu
--   sec_pendencias  protocolos que precisam de retorno ao aluno
--   sec_tarefas     anotações do setor
-- Cole no SQL Editor do Supabase e clique em "Run". Pode rodar de novo.
-- =========================================================
create extension if not exists pgcrypto with schema extensions;

-- ---------- listas de base ----------
create table if not exists public.sec_listas (
  id     uuid primary key default gen_random_uuid(),
  tipo   text not null check (tipo in ('faculdade','tipo_curso','area','periodo','turma','instrucao','formacao','conhecimento','etnia')),
  nome   text not null check (char_length(nome) between 1 and 120),
  meses  int check (meses between 1 and 120),          -- só tipo_curso: meses até a expiração
  ativo  boolean not null default true,
  ordem  int not null default 0,
  created_at timestamptz not null default now()
);
create unique index if not exists sec_listas_unico on public.sec_listas (tipo, lower(nome));

insert into public.sec_listas (tipo, nome, meses, ordem) values
  ('tipo_curso', 'Graduação', 6, 1), ('tipo_curso', 'Segunda Graduação', 18, 2),
  ('tipo_curso', 'Segunda Licenciatura', 18, 3), ('tipo_curso', 'Pós-graduação', 18, 4)
on conflict do nothing;
insert into public.sec_listas (tipo, nome, ordem) values
  ('faculdade', 'FAVENI', 1),
  ('area', 'Educação', 1), ('area', 'Negócios e Direito', 2), ('area', 'Saúde', 3), ('area', 'Tecnologia', 4),
  ('area', 'Engenharias', 5), ('area', 'Ciências Humanas e Sociais', 6),
  ('periodo', '2026.1', 1), ('periodo', '2026.2', 2), ('periodo', '2027.1', 3), ('periodo', '2027.2', 4),
  ('instrucao', 'Ensino Fundamental', 1), ('instrucao', 'Ensino Médio', 2), ('instrucao', 'Técnico', 3),
  ('instrucao', 'Superior incompleto', 4), ('instrucao', 'Superior completo', 5), ('instrucao', 'Pós-graduação', 6),
  ('formacao', 'Ensino Médio', 1), ('formacao', 'Licenciatura', 2), ('formacao', 'Bacharelado', 3), ('formacao', 'Tecnólogo', 4),
  ('conhecimento', 'Instagram', 1), ('conhecimento', 'Facebook', 2), ('conhecimento', 'WhatsApp', 3),
  ('conhecimento', 'Indicação de amigo', 4), ('conhecimento', 'Google / site', 5), ('conhecimento', 'Faixa / panfleto', 6),
  ('conhecimento', 'Passou em frente ao polo', 7), ('conhecimento', 'Outro', 8),
  ('etnia', 'Branca', 1), ('etnia', 'Preta', 2), ('etnia', 'Parda', 3), ('etnia', 'Amarela', 4),
  ('etnia', 'Indígena', 5), ('etnia', 'Não declarada', 6)
on conflict do nothing;

-- ---------- cursos ----------
create table if not exists public.sec_cursos (
  id           uuid primary key default gen_random_uuid(),
  codigo       bigint generated always as identity,
  nome         text not null check (char_length(nome) between 2 and 160),
  faculdade_id uuid references public.sec_listas (id) on delete set null,
  tipo_id      uuid references public.sec_listas (id) on delete set null,
  area_id      uuid references public.sec_listas (id) on delete set null,
  ch           int check (ch between 0 and 20000),     -- carga horária (horas)
  periodos     int check (periodos between 0 and 40),
  tempo_min    int check (tempo_min between 0 and 240), -- meses
  tempo_max    int check (tempo_max between 0 and 240), -- meses
  ativo        boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists sec_cursos_touch on public.sec_cursos;
create trigger sec_cursos_touch before update on public.sec_cursos for each row execute function public.touch_updated_at();

-- ---------- alunos ----------
create table if not exists public.sec_alunos (
  id            uuid primary key default gen_random_uuid(),
  codigo        bigint generated always as identity,
  nome          text not null check (char_length(nome) between 3 and 160),
  cpf           text not null check (cpf ~ '^\d{11}$'),
  nascimento    date,
  rg            text, sexo text, etnia text, naturalidade text,
  mae           text, pai text,
  instrucao     text, formacao text, instituicao text, ano_formacao int check (ano_formacao between 1900 and 2100),
  indicacao     text, conhecimento text,
  cep           text, endereco text, numero text, complemento text, bairro text, estado text, cidade text,
  email         text, celular text, telefone text,
  obs           text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create unique index if not exists sec_alunos_cpf on public.sec_alunos (cpf);
create index if not exists sec_alunos_nome on public.sec_alunos (lower(nome));
drop trigger if exists sec_alunos_touch on public.sec_alunos;
create trigger sec_alunos_touch before update on public.sec_alunos for each row execute function public.touch_updated_at();

-- ---------- matrículas ----------
create table if not exists public.sec_matriculas (
  id          uuid primary key default gen_random_uuid(),
  aluno_id    uuid not null references public.sec_alunos (id) on delete cascade,
  curso_id    uuid references public.sec_cursos (id) on delete set null,
  numero      text,                                    -- nº da matrícula na faculdade
  turma       text, periodo text,
  status      text not null default 'ativo' check (status in ('ativo','concluido','cancelado','trancado','pendente')),
  inicio      date,
  expiracao   date,
  avaliacao   date,                                    -- próxima avaliação
  login       text,                                    -- login do portal da faculdade
  senha_enc   bytea,                                   -- senha do portal, criptografada
  tem_senha   boolean generated always as (senha_enc is not null) stored,
  obs         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists sec_matriculas_aluno on public.sec_matriculas (aluno_id);
create index if not exists sec_matriculas_exp on public.sec_matriculas (status, expiracao);
drop trigger if exists sec_matriculas_touch on public.sec_matriculas;
create trigger sec_matriculas_touch before update on public.sec_matriculas for each row execute function public.touch_updated_at();

-- ---------- pendências e tarefas ----------
create table if not exists public.sec_pendencias (
  id            uuid primary key default gen_random_uuid(),
  aluno_id      uuid references public.sec_alunos (id) on delete cascade,
  titulo        text not null check (char_length(titulo) between 2 and 200),
  protocolo     text,
  obs           text,
  status        text not null default 'aberta' check (status in ('aberta','resolvida')),
  criado_por    uuid references auth.users (id) on delete set null default auth.uid(),
  created_at    timestamptz not null default now(),
  resolvida_em  timestamptz,
  resolvida_por uuid references auth.users (id) on delete set null
);
create index if not exists sec_pendencias_status on public.sec_pendencias (status, created_at desc);

create table if not exists public.sec_tarefas (
  id          uuid primary key default gen_random_uuid(),
  texto       text not null check (char_length(texto) between 1 and 300),
  feita       boolean not null default false,
  criado_por  uuid references auth.users (id) on delete set null default auth.uid(),
  created_at  timestamptz not null default now(),
  feita_em    timestamptz
);

-- ---------- regras: só administradores ----------
do $$ declare t text; begin
  foreach t in array array['sec_listas','sec_cursos','sec_alunos','sec_matriculas','sec_pendencias','sec_tarefas'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "secretaria: administradores" on public.%I', t);
    execute format('create policy "secretaria: administradores" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
-- a senha criptografada nunca é lida nem gravada direto: só pelas funções abaixo
revoke select, insert, update on public.sec_matriculas from authenticated;
grant select (id, aluno_id, curso_id, numero, turma, periodo, status, inicio, expiracao, avaliacao, login, tem_senha, obs, created_at, updated_at),
      insert (aluno_id, curso_id, numero, turma, periodo, status, inicio, expiracao, avaliacao, login, obs),
      update (curso_id, numero, turma, periodo, status, inicio, expiracao, avaliacao, login, obs)
   on public.sec_matriculas to authenticated;

-- ---------- senha do portal: chave guardada numa tabela fechada ----------
create table if not exists public.sec_chave (id int primary key default 1 check (id = 1), chave text not null);
alter table public.sec_chave enable row level security;           -- sem regras: ninguém lê pela API
revoke all on public.sec_chave from anon, authenticated;
insert into public.sec_chave (chave) values (encode(extensions.gen_random_bytes(32), 'hex')) on conflict do nothing;

create table if not exists public.sec_senha_log (
  id           bigint generated always as identity primary key,
  matricula_id uuid references public.sec_matriculas (id) on delete cascade,
  usuario      uuid references auth.users (id) on delete set null default auth.uid(),
  acao         text not null check (acao in ('ver','alterar','apagar')),
  em           timestamptz not null default now()
);
alter table public.sec_senha_log enable row level security;
drop policy if exists "senha log: administradores leem" on public.sec_senha_log;
create policy "senha log: administradores leem" on public.sec_senha_log for select to authenticated using (public.is_admin());
revoke all on public.sec_senha_log from anon, authenticated;
grant select on public.sec_senha_log to authenticated;

create or replace function public.sec_definir_senha(p_matricula uuid, p_senha text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin() then raise exception 'só administradores'; end if;
  if coalesce(p_senha, '') = '' then
    update public.sec_matriculas set senha_enc = null where id = p_matricula;
    insert into public.sec_senha_log (matricula_id, acao) values (p_matricula, 'apagar');
  else
    update public.sec_matriculas
       set senha_enc = extensions.pgp_sym_encrypt(p_senha, (select chave from public.sec_chave where id = 1))
     where id = p_matricula;
    insert into public.sec_senha_log (matricula_id, acao) values (p_matricula, 'alterar');
  end if;
end $$;

create or replace function public.sec_ver_senha(p_matricula uuid)
returns text language plpgsql security definer set search_path = public, extensions as $$
declare s bytea;
begin
  if not public.is_admin() then raise exception 'só administradores'; end if;
  select senha_enc into s from public.sec_matriculas where id = p_matricula;
  if s is null then return null; end if;
  insert into public.sec_senha_log (matricula_id, acao) values (p_matricula, 'ver');
  return extensions.pgp_sym_decrypt(s, (select chave from public.sec_chave where id = 1));
end $$;

revoke all on function public.sec_definir_senha(uuid, text), public.sec_ver_senha(uuid) from public, anon;
grant execute on function public.sec_definir_senha(uuid, text), public.sec_ver_senha(uuid) to authenticated;
