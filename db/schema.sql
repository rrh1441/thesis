-- Enable pgcrypto for UUID generation if the extension exists
create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text,
  name text,
  avatar_url text,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists theses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  text text not null,
  summary text,
  tickers_long jsonb,
  tickers_short jsonb,
  rationale text,
  confidence_level text,
  created_at timestamptz default timezone('utc', now())
);

create type trade_direction as enum ('long', 'short');

create table if not exists paper_trades (
  id uuid primary key default gen_random_uuid(),
  thesis_id uuid references theses(id) on delete cascade,
  ticker text not null,
  direction trade_direction not null,
  quantity integer not null,
  entry_price double precision not null,
  current_price double precision,
  pnl double precision,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  thesis_id uuid references theses(id) on delete cascade,
  total_value double precision not null,
  total_pnl double precision not null,
  created_at timestamptz default timezone('utc', now())
);
