create extension if not exists pgcrypto;

create table public.project_weeks (
  id uuid primary key default gen_random_uuid(),
  week_number integer not null unique check (week_number > 0),
  title_zh text not null,
  title_en text not null,
  question_zh text not null,
  question_en text not null,
  assigned_instructor text not null,
  materials jsonb not null default '[]'::jsonb check (jsonb_typeof(materials) = 'array'),
  status text not null default 'draft' check (status in ('draft', 'active', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_submissions (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.project_weeks(id) on delete restrict,
  nickname text not null check (char_length(trim(nickname)) between 1 and 40),
  response text not null check (char_length(trim(response)) between 1 and 4000),
  submission_code_hash text not null,
  status text not null default 'pending' check (status in ('pending', 'revision_requested', 'approved', 'withdrawn')),
  consented_at timestamptz not null,
  review_note text,
  feedback text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (week_id, nickname)
);

create table public.submission_attachments (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.project_submissions(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  content_type text not null,
  file_size bigint not null check (file_size > 0 and file_size <= 157286400),
  created_at timestamptz not null default now()
);

create table public.submission_events (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.project_submissions(id) on delete cascade,
  actor text not null,
  event_type text not null check (event_type in ('submitted', 'updated', 'withdrawn', 'revision_requested', 'approved', 'feedback_updated', 'hidden', 'deleted')),
  note text,
  created_at timestamptz not null default now()
);

create index project_submissions_week_status_idx on public.project_submissions (week_id, status, created_at desc);
create index submission_attachments_submission_idx on public.submission_attachments (submission_id);
create index submission_events_submission_idx on public.submission_events (submission_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger project_weeks_updated_at
before update on public.project_weeks
for each row execute procedure public.set_updated_at();

create trigger project_submissions_updated_at
before update on public.project_submissions
for each row execute procedure public.set_updated_at();

alter table public.project_weeks enable row level security;
alter table public.project_submissions enable row level security;
alter table public.submission_attachments enable row level security;
alter table public.submission_events enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'borderless-submissions',
  'borderless-submissions',
  false,
  157286400,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'application/pdf']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
