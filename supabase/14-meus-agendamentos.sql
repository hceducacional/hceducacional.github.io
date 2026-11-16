-- =========================================================
-- HC Instituto Educacional — "Meus agendamentos" na página Agendar
-- O aluno logado vê os próprios agendamentos e a situação de cada um
-- (aguardando, confirmado, compareceu...). Sem CPF, só o que é dele.
-- Some da lista 10 dias depois da data do agendamento (os dados
-- continuam guardados no banco para o painel e os relatórios).
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

create or replace function public.my_appointments()
returns table (id uuid, kind text, college text, course text, date date, shift text, status text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select a.id, a.kind, a.college, a.course, a.date, a.shift, a.status, a.created_at
    from public.appointments a
   where a.user_id = auth.uid()
     and a.date >= (now() at time zone 'America/Fortaleza')::date - 10
   order by a.date desc, a.shift desc, a.created_at desc
   limit 30;
$$;
revoke execute on function public.my_appointments() from public, anon;
grant execute on function public.my_appointments() to authenticated;
