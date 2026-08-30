-- Pivot: decisions table + row-level security
-- Run this in the Supabase SQL editor for your project.

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  option_a text not null,
  option_b text not null,
  context text not null default '',
  criteria jsonb not null default '[]'::jsonb,
  weights jsonb not null default '{}'::jsonb,
  scores_a jsonb not null default '{}'::jsonb,
  scores_b jsonb not null default '{}'::jsonb,
  score_a numeric not null,
  score_b numeric not null,
  winner text not null,
  created_at timestamptz not null default now()
);

create index if not exists decisions_user_id_created_at_idx
  on public.decisions (user_id, created_at desc);

alter table public.decisions enable row level security;

drop policy if exists "Users can view their own decisions" on public.decisions;
create policy "Users can view their own decisions"
  on public.decisions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own decisions" on public.decisions;
create policy "Users can insert their own decisions"
  on public.decisions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own decisions" on public.decisions;
create policy "Users can delete their own decisions"
  on public.decisions for delete
  using (auth.uid() = user_id);

-- Lets a signed-in user permanently delete their own account and every
-- decision tied to it, in one call, without needing the service_role key
-- anywhere in the app. SECURITY DEFINER is required only to reach
-- auth.users; every statement inside is still scoped to auth.uid(), so a
-- user can only ever delete their own account this way. Deleting the
-- decisions row explicitly is redundant with the ON DELETE CASCADE above
-- but kept for clarity and as defense in depth.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.decisions where user_id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;
