-- VidTalk Supabase schema
-- Run this in the NEW project's dashboard: SQL Editor -> New query -> Run
-- (Tables match backend models: models/video.py, models/comment.py, models/user.py)

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  youtube_video_id text not null,
  title text not null,
  added_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  author_id uuid references public.users(id) on delete cascade,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  text_content text,
  video_url text,
  timestamp_seconds int,
  likes_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists comments_video_id_idx on public.comments (video_id, created_at desc);
create index if not exists comments_parent_idx on public.comments (parent_comment_id);

-- Dev-friendly RLS: allow anon + authenticated read/write.
-- Required because the FastAPI backend talks to Supabase as the ANON role (no user session).
alter table public.users enable row level security;
alter table public.videos enable row level security;
alter table public.comments enable row level security;

create policy "users_all" on public.users for all using (true) with check (true);
create policy "videos_all" on public.videos for all using (true) with check (true);
create policy "comments_all" on public.comments for all using (true) with check (true);
