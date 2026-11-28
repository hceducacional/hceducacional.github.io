-- =========================================================
-- HC Instituto Educacional — dados do aluno no perfil
-- CPF, curso e faculdade ficam no perfil para preencher o agendamento
-- sozinho. Como o resto do perfil, só a própria pessoa e os
-- administradores conseguem ver.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

alter table public.profiles add column if not exists cpf text check (cpf is null or cpf ~ '^\d{11}$');
alter table public.profiles add column if not exists course text check (course is null or char_length(course) <= 80);
alter table public.profiles add column if not exists college text check (college is null or college in ('Unifaveni', 'Uniabeu', 'Futura', 'Dom Alberto', 'UNISBA', 'NEXUS'));

-- o próprio usuário pode editar esses campos (situação e papel continuam só no painel mestre)
grant update (name, avatar_url, avatar_focus, cpf, course, college) on public.profiles to authenticated;
