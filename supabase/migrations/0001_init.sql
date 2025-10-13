-- Enable pgcrypto for UUID generation if not already enabled
create extension if not exists "pgcrypto";

-- Users profile table (optional metadata alongside auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  email text,
  name text,
  avatar_url text,
  created_at timestamptz default timezone('utc', now())
);

alter table public.users enable row level security;

create policy "Users can view profiles"
  on public.users for select
  using (true);

create policy "Users can update profiles"
  on public.users for update
  using (true)
  with check (true);

-- Core thesis table
create table if not exists public.theses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  text text not null,
  summary text,
  tickers_long jsonb,
  tickers_short jsonb,
  rationale text,
  confidence_level text,
  created_at timestamptz default timezone('utc', now())
);

alter table public.theses enable row level security;

create policy "Public can read theses"
  on public.theses for select
  using (true);

create policy "Users can insert theses"
  on public.theses for insert
  with check (true);

create policy "Users can update theses"
  on public.theses for update
  using (true)
  with check (true);

-- Paper trades
create type public.trade_direction as enum ('long', 'short');

create table if not exists public.paper_trades (
  id uuid primary key default gen_random_uuid(),
  thesis_id uuid references public.theses(id) on delete cascade,
  ticker text not null,
  direction public.trade_direction not null,
  quantity numeric not null,
  entry_price numeric not null,
  current_price numeric,
  pnl numeric,
  created_at timestamptz default timezone('utc', now())
);

alter table public.paper_trades enable row level security;

create policy "Users can read paper trades"
  on public.paper_trades for select
  using (true);

create policy "Users can create paper trades"
  on public.paper_trades for insert
  with check (true);

-- Portfolio snapshots for future analytics
create table if not exists public.portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  thesis_id uuid references public.theses(id) on delete cascade,
  total_value numeric not null,
  total_pnl numeric not null,
  created_at timestamptz default timezone('utc', now())
);

alter table public.portfolio_snapshots enable row level security;

create policy "Users can view portfolio snapshots"
  on public.portfolio_snapshots for select
  using (true);
