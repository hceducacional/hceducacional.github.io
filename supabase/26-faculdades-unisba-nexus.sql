-- =========================================================
-- HC Instituto Educacional — novas faculdades: UNISBA e NEXUS
-- Libera as duas no agendamento e no perfil do aluno.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

alter table public.appointments drop constraint if exists appointments_college_check;
alter table public.appointments add constraint appointments_college_check
  check (college in ('Unifaveni', 'Uniabeu', 'Futura', 'Dom Alberto', 'UNISBA', 'NEXUS'));

alter table public.profiles drop constraint if exists profiles_college_check;
alter table public.profiles add constraint profiles_college_check
  check (college is null or college in ('Unifaveni', 'Uniabeu', 'Futura', 'Dom Alberto', 'UNISBA', 'NEXUS'));
