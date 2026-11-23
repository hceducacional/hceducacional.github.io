-- =========================================================
-- HC Instituto Educacional — progresso da Informática protegido no banco
-- Nenhum aparelho consegue gravar por cima do que o aluno já conquistou:
--   • XP geral ("xp-geral"): só sobe.
--   • Saldo HC ("saldo-hc"): o total ganho e o total gasto só sobem.
--   • Loja ("loja-itens"): os itens comprados se somam; o equipado mais recente vale.
--   • Lições ("licao-…"): lição concluída não volta a "não concluída", o recorde só é
--     trocado por um maior e o nível em andamento não volta para trás.
--   • Conteúdos ("cont-…"): tentativas, notas e respostas não voltam para trás.
-- Se uma gravação tentar diminuir algo, o banco guarda o que já tinha (e o site
-- recebe de volta o valor certo). Precisa do script 08 antes.
-- Cole no SQL Editor do Supabase e clique em "Run".
-- =========================================================

create or replace function public.progresso_num(v jsonb) returns numeric
language sql immutable as $$
  select case when jsonb_typeof(v) = 'number' then (v #>> '{}')::numeric
              when jsonb_typeof(v) = 'string' and (v #>> '{}') ~ '^-?[0-9]+(\.[0-9]+)?$' then (v #>> '{}')::numeric
              else 0 end;
$$;

-- pontos de uma lição (soma dos níveis); progresso antigo com pontos acima do limite conta como 0, igual ao site
create or replace function public.progresso_pts(d jsonb) returns numeric
language sql immutable as $$
  with niv as (
    select public.progresso_num(x) as p from jsonb_array_elements(case when jsonb_typeof(d -> 'levelPts') = 'array' then d -> 'levelPts' else '[]'::jsonb end) x
  ), lim as (
    select 13000 / greatest(coalesce(nullif(public.progresso_num(d -> 'total'), 0), 30), 1) + 1 as m
  )
  select case when exists (select 1 from niv, lim where p > m) then 0 else least(13000, coalesce((select sum(p) from niv), 0)) end;
$$;

create or replace function public.progresso_protege() returns trigger
language plpgsql set search_path = public as $$
declare
  o jsonb := old.dados; n jsonb := new.dados;
  itens jsonb;
  od boolean; nd boolean;
  oh int; nh int; ot numeric; nt numeric; oa int; na int; ofe int; nfe int;
begin
  if o is null or o = '{}'::jsonb or n is null then return new; end if;

  if new.licao = 'xp-geral' then
    if public.progresso_num(n -> 'xp') < public.progresso_num(o -> 'xp') then new.dados := o; end if;

  elsif new.licao = 'saldo-hc' then
    new.dados := n || jsonb_build_object(
      'ganho', greatest(public.progresso_num(n -> 'ganho'), public.progresso_num(o -> 'ganho')),
      'gasto', greatest(public.progresso_num(n -> 'gasto'), public.progresso_num(o -> 'gasto')),
      'hist', case when public.progresso_num(n -> 'ganho') + public.progresso_num(n -> 'gasto') >= public.progresso_num(o -> 'ganho') + public.progresso_num(o -> 'gasto')
                   then coalesce(n -> 'hist', '[]'::jsonb) else coalesce(o -> 'hist', '[]'::jsonb) end,
      'savedAt', greatest(public.progresso_num(n -> 'savedAt'), public.progresso_num(o -> 'savedAt')));

  elsif new.licao = 'loja-itens' then
    select coalesce(jsonb_agg(distinct x), '[]'::jsonb) into itens from (
      select jsonb_array_elements(case when jsonb_typeof(o -> 'itens') = 'array' then o -> 'itens' else '[]'::jsonb end) x
      union select jsonb_array_elements(case when jsonb_typeof(n -> 'itens') = 'array' then n -> 'itens' else '[]'::jsonb end)
    ) s;
    new.dados := n || jsonb_build_object('itens', itens, 'savedAt', greatest(public.progresso_num(n -> 'savedAt'), public.progresso_num(o -> 'savedAt')))
      || case when public.progresso_num(o -> 'eqAt') > public.progresso_num(n -> 'eqAt')
              then jsonb_build_object('eq', o -> 'eq', 'eqAt', o -> 'eqAt') else '{}'::jsonb end;

  elsif new.licao like 'licao-%' then
    od := coalesce((o ->> 'done')::boolean, false); nd := coalesce((n ->> 'done')::boolean, false);
    if (od and not nd)
       or (od and nd and public.progresso_pts(n) < public.progresso_pts(o))
       or (not od and not nd and public.progresso_num(n -> 'lvl') < public.progresso_num(o -> 'lvl')) then
      new.dados := o;
    end if;

  elsif new.licao like 'cont-%' then
    oh := case when jsonb_typeof(o -> 'hist') = 'array' then jsonb_array_length(o -> 'hist') else 0 end;
    nh := case when jsonb_typeof(n -> 'hist') = 'array' then jsonb_array_length(n -> 'hist') else 0 end;
    ot := greatest(public.progresso_num(o -> 'tent'), 1); nt := greatest(public.progresso_num(n -> 'tent'), 1);
    ofe := case when coalesce((o ->> 'fechada')::boolean, false) then 1 else 0 end;
    nfe := case when coalesce((n ->> 'fechada')::boolean, false) then 1 else 0 end;
    oa := case when jsonb_typeof(o -> 'ans') = 'object' then (select count(*) from jsonb_object_keys(o -> 'ans')) else 0 end;
    na := case when jsonb_typeof(n -> 'ans') = 'object' then (select count(*) from jsonb_object_keys(n -> 'ans')) else 0 end;
    if (nh, nt, nfe, na) < (oh, ot, ofe, oa) then new.dados := o; end if;
  end if;

  return new;
end $$;

drop trigger if exists progresso_protege on public.informatica_progresso;
create trigger progresso_protege before update on public.informatica_progresso
  for each row execute function public.progresso_protege();
