create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Candidate',
  created_at timestamptz default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  task_id text not null,
  answer text not null,
  accuracy int, completeness int, clarity int, total int,
  feedback text, confidence text,
  passed boolean, mock boolean default false,
  status text not null default 'pending_review',
  reviewer_name text, token text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (candidate_id, task_id)
);

alter table candidates enable row level security;
alter table submissions enable row level security;
