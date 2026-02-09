-- Supabase Database Schema for UMich Q&A Platform
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- 1. Submissions Table (Pending approval)
create table if not exists submissions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  post_type text not null check (post_type in ('Question', 'Resource')),
  topic text not null,
  school text not null,
  university text not null,
  campus text not null,
  grade_level text not null,
  details text not null,
  author_name text,
  author_school text,
  tags text[],
  attachment_type text check (attachment_type in ('link', 'file')),
  attachment_url text,
  attachment_filename text,
  status text default 'pending' check (status in ('pending', 'reviewing')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Approved Content Table (Published questions/resources)
create table if not exists approved_content (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid references submissions(id),
  title text not null,
  post_type text not null check (post_type in ('Question', 'Resource')),
  topic text not null,
  school text not null,
  campus text not null,
  grade_level text not null,
  details text not null,
  author_name text,
  author_school text,
  university text not null check (university in ('Harvard', 'Stanford', 'UMich')),
  tags text[],
  attachment_type text check (attachment_type in ('link', 'file')),
  attachment_url text,
  attachment_filename text,
  approved_by uuid references auth.users(id),
  approved_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- 3. Admins Table
create table if not exists admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamp with time zone default now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

create index if not exists submissions_status_idx on submissions(status);
create index if not exists submissions_created_at_idx on submissions(created_at desc);
create index if not exists approved_content_university_idx on approved_content(university);
create index if not exists approved_content_post_type_idx on approved_content(post_type);
create index if not exists approved_content_topic_idx on approved_content(topic);
create index if not exists approved_content_approved_at_idx on approved_content(approved_at desc);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
alter table submissions enable row level security;
alter table approved_content enable row level security;
alter table admins enable row level security;

-- Submissions Table Policies
-- Anyone can submit (insert)
create policy "Anyone can submit questions/resources"
  on submissions for insert
  with check (true);

-- Only admins can view pending submissions
create policy "Admins can view all submissions"
  on submissions for select
  using (auth.uid() in (select id from admins));

-- Only admins can update submission status
create policy "Admins can update submissions"
  on submissions for update
  using (auth.uid() in (select id from admins));

-- Only admins can delete submissions
create policy "Admins can delete submissions"
  on submissions for delete
  using (auth.uid() in (select id from admins));

-- Approved Content Table Policies
-- Anyone can view approved content
create policy "Anyone can view approved content"
  on approved_content for select
  using (true);

-- Only admins can insert approved content
create policy "Admins can approve content"
  on approved_content for insert
  with check (auth.uid() in (select id from admins));

-- Only admins can update approved content
create policy "Admins can update approved content"
  on approved_content for update
  using (auth.uid() in (select id from admins));

-- Only admins can delete approved content
create policy "Admins can delete approved content"
  on approved_content for delete
  using (auth.uid() in (select id from admins));

-- Admins Table Policies
-- Admins can view all admins
create policy "Admins can view admins"
  on admins for select
  using (auth.uid() in (select id from admins));

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for submissions table
create trigger update_submissions_updated_at
  before update on submissions
  for each row
  execute function update_updated_at_column();

-- =====================================================
-- SAMPLE ADMIN USER (OPTIONAL)
-- =====================================================
-- After creating a user via Supabase Auth, insert their ID here:
-- insert into admins (id, email) values ('user-uuid-here', 'admin@example.com');

-- =====================================================
-- NOTES
-- =====================================================
-- 1. After running this schema, create a user via Supabase Auth Dashboard
-- 2. Add the user's UUID to the admins table using the commented insert above
-- 3. Configure your .env.local with Supabase credentials
-- 4. Test the RLS policies to ensure proper access control
