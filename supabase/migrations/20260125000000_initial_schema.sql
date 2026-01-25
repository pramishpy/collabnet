-- Enable pgvector extension
create extension if not exists vector;

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  bio text,
  skills text[] default '{}',
  research_interests text,
  role text check (role in ('developer', 'researcher', 'hobbyist')),
  github_username text,
  avatar_url text,
  embedding vector(1536),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles not null,
  title text not null,
  description text not null,
  required_skills text[] default '{}',
  status text check (status in ('recruiting', 'ongoing', 'completed')) default 'recruiting',
  max_collaborators int default 5,
  embedding vector(1536),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Applications/Matches table
create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles not null,
  project_id uuid references projects on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  match_score float,
  message text,
  created_at timestamptz default now(),
  unique(user_id, project_id)
);

-- Row Level Security (RLS) Policies
alter table profiles enable row level security;
alter table projects enable row level security;
alter table applications enable row level security;

-- Profiles: Users can read all profiles, but only update their own
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Projects: Everyone can view, only creators can update/delete
create policy "Projects are viewable by everyone"
  on projects for select
  using (true);

create policy "Users can create projects"
  on projects for insert
  with check (auth.uid() = creator_id);

create policy "Creators can update own projects"
  on projects for update
  using (auth.uid() = creator_id);

create policy "Creators can delete own projects"
  on projects for delete
  using (auth.uid() = creator_id);

-- Applications: Users can view their own applications and creators can view applications to their projects
create policy "Users can view own applications"
  on applications for select
  using (auth.uid() = user_id);

create policy "Creators can view applications to their projects"
  on applications for select
  using (
    exists (
      select 1 from projects
      where projects.id = applications.project_id
      and projects.creator_id = auth.uid()
    )
  );

create policy "Users can create applications"
  on applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on applications for update
  using (auth.uid() = user_id);

-- Indexes for performance
create index profiles_embedding_idx on profiles 
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index projects_embedding_idx on projects 
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index projects_status_idx on projects(status);
create index applications_status_idx on applications(status);
create index applications_project_idx on applications(project_id);

-- Function to automatically update updated_at timestamp
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row
  execute function handle_updated_at();

create trigger projects_updated_at
  before update on projects
  for each row
  execute function handle_updated_at();
