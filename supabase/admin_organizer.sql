-- Oskelo admin organizer: Outreach, Projects and To-dos.
-- Run ONCE in the Oskelo Supabase project (ropdifjuyekfnltpfdyy):
-- Dashboard → SQL Editor → New query → paste this whole file → Run.
-- Safe to run again (everything is "if not exists").
--
-- Row Level Security is ON with no policies, so these tables are private:
-- only the server (service-role key, used by /api/admin/*) can read or write
-- them. The public site and the anon key can't see anything here.

create table if not exists public.outreach (
  id            uuid primary key default gen_random_uuid(),
  company       text not null,
  contact_name  text,
  email         text,
  phone         text,
  website       text,
  service       text,
  status        text not null default 'emailed',
  contacted_on  date not null default current_date,
  follow_up_on  date,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  client      text not null,
  title       text,
  email       text,
  service     text,
  price       numeric(10,2),
  status      text not null default 'booked',
  paid        boolean not null default false,
  shoot_on    date,
  due_on      date,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  due_on      date,
  done        boolean not null default false,
  done_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.outreach enable row level security;
alter table public.projects enable row level security;
alter table public.tasks    enable row level security;

create index if not exists outreach_contacted_on_idx on public.outreach (contacted_on desc);
create index if not exists projects_created_at_idx  on public.projects (created_at desc);
create index if not exists tasks_created_at_idx     on public.tasks (created_at desc);
