-- =========================================================
-- HC Instituto Educacional — avisos no celular (notificações)
-- 1) Agendamento novo passa a nascer "aguardando confirmação" (pendente);
--    quando o polo confirma, o aluno recebe o aviso no celular.
-- 2) Guarda em quais aparelhos cada aluno ativou os avisos.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

-- 1) novo status "pendente" (os agendamentos já existentes continuam como estão)
alter table public.appointments drop constraint if exists appointments_status_check;
alter table public.appointments add constraint appointments_status_check
  check (status in ('pendente', 'confirmado', 'compareceu', 'faltou', 'cancelado'));
alter table public.appointments alter column status set default 'pendente';

-- 2) aparelhos com avisos ativados (um por navegador/celular)
create table if not exists public.push_subscriptions (
  endpoint   text primary key check (endpoint ~ '^https://'),
  user_id    uuid not null references auth.users (id) on delete cascade,
  p256dh     text not null,
  auth       text not null,
  device     text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists push_subscriptions_user on public.push_subscriptions (user_id);
alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon, authenticated;
-- ninguém lê ou grava direto: só pelas funções abaixo (e a função de envio, com a chave secreta)
grant select, delete on public.push_subscriptions to service_role;
grant select on public.appointments, public.profiles, public.referrals to service_role;

-- o aluno logado ativa os avisos neste aparelho (se outra pessoa usava o mesmo
-- navegador antes, o aparelho passa a ser de quem está logado agora)
create or replace function public.save_push_subscription(p_endpoint text, p_p256dh text, p_auth text, p_device text default '')
returns void language plpgsql volatile security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Entre na sua conta para ativar os avisos.'; end if;
  insert into public.push_subscriptions (endpoint, user_id, p256dh, auth, device)
  values (p_endpoint, auth.uid(), p_p256dh, p_auth, left(coalesce(p_device, ''), 120))
  on conflict (endpoint) do update
    set user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth,
        device = excluded.device, created_at = now();
end $$;

-- desativa os avisos deste aparelho (também ao sair da conta)
create or replace function public.remove_push_subscription(p_endpoint text)
returns void language sql volatile security definer set search_path = public as $$
  delete from public.push_subscriptions where endpoint = p_endpoint and user_id = auth.uid();
$$;

revoke execute on function public.save_push_subscription(text, text, text, text), public.remove_push_subscription(text) from public, anon;
grant execute on function public.save_push_subscription(text, text, text, text), public.remove_push_subscription(text) to authenticated;
