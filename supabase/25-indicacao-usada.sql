-- =========================================================
-- HC Instituto Educacional — indicação "usada"
-- Regulamento "Indique um amigo": a indicação confirmada pode virar
-- desconto na hora OU ser acumulada para a bolsa. Depois de usada
-- como desconto, ela não conta mais para a bolsa. O painel marca a
-- indicação como "usada" quando o desconto é resgatado.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

do $$
declare c text;
begin
  for c in select conname from pg_constraint
            where conrelid = 'public.referrals'::regclass and contype = 'c'
              and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.referrals drop constraint %I', c);
  end loop;
end $$;

alter table public.referrals
  add constraint referrals_status_check check (status in ('pendente', 'confirmada', 'usada'));
