-- Cath Lab Academy database schema
-- Target: PostgreSQL / Supabase
-- Purpose: training catalog, user roles, competencies, simulation results, and certificates.

create extension if not exists pgcrypto;

do $$ begin
  create type app_role as enum ('trainee', 'trainer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enrollment_status as enum ('not_started', 'in_progress', 'completed', 'validated', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type competency_status as enum ('pending', 'observed', 'validated', 'needs_remediation');
exception when duplicate_object then null; end $$;

do $$ begin
  create type course_level as enum ('foundation', 'intermediate', 'advanced', 'trainer');
exception when duplicate_object then null; end $$;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  staff_id text unique,
  full_name text not null,
  email text unique,
  role app_role not null default 'trainee',
  job_title text,
  department text default 'Cardiac Catheterization Laboratory',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists training_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_ar text,
  description_en text,
  description_ar text,
  level course_level not null default 'foundation',
  duration_weeks integer,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references training_tracks(id) on delete set null,
  slug text unique not null,
  title_en text not null,
  title_ar text,
  summary_en text,
  summary_ar text,
  target_audience text,
  estimated_hours numeric(5,2),
  level course_level not null default 'foundation',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists course_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title_en text not null,
  title_ar text,
  session_date date,
  start_time time,
  end_time time,
  location text,
  instructor_name text,
  learning_outcomes text[] not null default '{}',
  agenda_items text[] not null default '{}',
  created_at timestamptz not null default now()
);


create table if not exists learning_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete set null,
  uploaded_by uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  resource_type text not null default 'document' check (resource_type in ('document', 'presentation', 'video', 'image', 'arvr_model', 'checklist', 'other')),
  visibility text not null default 'trainee' check (visibility in ('trainee', 'trainer', 'admin')),
  storage_bucket text not null default 'training-files',
  storage_path text not null,
  file_name text not null,
  file_mime_type text,
  file_size_bytes bigint,
  external_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  status enrollment_status not null default 'not_started',
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  validated_at timestamptz,
  validated_by uuid references profiles(id) on delete set null,
  unique(profile_id, course_id)
);

create table if not exists competencies (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  track_id uuid references training_tracks(id) on delete cascade,
  code text unique not null,
  title_en text not null,
  title_ar text,
  description_en text,
  description_ar text,
  required_evidence text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint competency_scope_check check (course_id is not null or track_id is not null)
);

create table if not exists competency_assessments (
  id uuid primary key default gen_random_uuid(),
  competency_id uuid not null references competencies(id) on delete cascade,
  trainee_id uuid not null references profiles(id) on delete cascade,
  trainer_id uuid references profiles(id) on delete set null,
  status competency_status not null default 'pending',
  evidence_note text,
  remediation_plan text,
  assessed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(competency_id, trainee_id)
);

create table if not exists simulation_scenarios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_ar text,
  clinical_priority text,
  prompt_en text not null,
  prompt_ar text,
  correct_answer_index integer not null default 0,
  choices_en jsonb not null default '[]'::jsonb,
  choices_ar jsonb not null default '[]'::jsonb,
  rationale_en text,
  rationale_ar text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists simulation_attempts (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references simulation_scenarios(id) on delete cascade,
  trainee_id uuid not null references profiles(id) on delete cascade,
  selected_answer_index integer,
  is_correct boolean,
  score integer not null default 0,
  attempted_at timestamptz not null default now()
);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_number text unique not null default ('CLA-' || upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 12))),
  trainee_id uuid not null references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete set null,
  issued_by uuid references profiles(id) on delete set null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'issued',
  verification_code text unique not null default upper(substr(encode(gen_random_bytes(10), 'hex'), 1, 16)),
  notes text
);

create table if not exists audit_events (
  id bigserial primary key,
  actor_id uuid references profiles(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_courses_track on courses(track_id);
create index if not exists idx_sessions_course on course_sessions(course_id);
create index if not exists idx_learning_resources_course on learning_resources(course_id);
create index if not exists idx_learning_resources_uploaded_by on learning_resources(uploaded_by);
create index if not exists idx_learning_resources_visibility on learning_resources(visibility);
create index if not exists idx_enrollments_profile on enrollments(profile_id);
create index if not exists idx_enrollments_course on enrollments(course_id);
create index if not exists idx_competency_assessments_trainee on competency_assessments(trainee_id);
create index if not exists idx_simulation_attempts_trainee on simulation_attempts(trainee_id);
create index if not exists idx_certificates_trainee on certificates(trainee_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at before update on profiles
for each row execute function set_updated_at();

drop trigger if exists trg_courses_updated_at on courses;
create trigger trg_courses_updated_at before update on courses
for each row execute function set_updated_at();

drop trigger if exists trg_competency_assessments_updated_at on competency_assessments;
create trigger trg_competency_assessments_updated_at before update on competency_assessments
for each row execute function set_updated_at();

drop trigger if exists trg_learning_resources_updated_at on learning_resources;
create trigger trg_learning_resources_updated_at before update on learning_resources
for each row execute function set_updated_at();

-- Row Level Security preparation for Supabase.
alter table profiles enable row level security;
alter table training_tracks enable row level security;
alter table courses enable row level security;
alter table course_sessions enable row level security;
alter table enrollments enable row level security;
alter table competencies enable row level security;
alter table competency_assessments enable row level security;
alter table simulation_scenarios enable row level security;
alter table simulation_attempts enable row level security;
alter table certificates enable row level security;
alter table audit_events enable row level security;
alter table learning_resources enable row level security;

-- Public read access for published catalog/demo content.
-- Supabase projects created with newer API defaults require explicit GRANTs
-- before anon/authenticated roles can use PostgREST, even when RLS policies exist.
grant usage on schema public to anon, authenticated;
grant select on training_tracks, courses, course_sessions, competencies, simulation_scenarios to anon, authenticated;
grant select, insert on profiles to authenticated;
grant select, insert, update on learning_resources to authenticated;

create or replace function public.current_user_role()
returns app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from profiles where auth_user_id = auth.uid() limit 1;
$$;

grant execute on function public.current_user_role() to authenticated;

drop policy if exists "authenticated read own profile" on profiles;
create policy "authenticated read own profile" on profiles for select to authenticated using (auth.uid() = auth_user_id);

drop policy if exists "trainer admin read profiles" on profiles;
create policy "trainer admin read profiles" on profiles for select to authenticated using (public.current_user_role() in ('trainer', 'admin'));

drop policy if exists "authenticated create own trainee profile" on profiles;
create policy "authenticated create own trainee profile" on profiles for insert to authenticated with check (auth.uid() = auth_user_id and role = 'trainee');

grant select on enrollments, competency_assessments, simulation_attempts, certificates to authenticated;
grant insert, update on enrollments to authenticated;

drop policy if exists "authenticated read own enrollments" on enrollments;
create policy "authenticated read own enrollments" on enrollments for select to authenticated using (
  public.current_user_role() in ('trainer', 'admin')
  or exists (select 1 from profiles p where p.id = enrollments.profile_id and p.auth_user_id = auth.uid())
);

drop policy if exists "authenticated enroll own courses" on enrollments;
create policy "authenticated enroll own courses" on enrollments for insert to authenticated with check (
  exists (select 1 from profiles p where p.id = enrollments.profile_id and p.auth_user_id = auth.uid())
);

drop policy if exists "authenticated update own enrollments" on enrollments;
create policy "authenticated update own enrollments" on enrollments for update to authenticated using (
  exists (select 1 from profiles p where p.id = enrollments.profile_id and p.auth_user_id = auth.uid())
) with check (
  exists (select 1 from profiles p where p.id = enrollments.profile_id and p.auth_user_id = auth.uid())
);

drop policy if exists "authenticated read own competency assessments" on competency_assessments;
create policy "authenticated read own competency assessments" on competency_assessments for select to authenticated using (
  public.current_user_role() in ('trainer', 'admin')
  or exists (select 1 from profiles p where p.id = competency_assessments.trainee_id and p.auth_user_id = auth.uid())
);

drop policy if exists "authenticated read own simulation attempts" on simulation_attempts;
create policy "authenticated read own simulation attempts" on simulation_attempts for select to authenticated using (
  public.current_user_role() in ('trainer', 'admin')
  or exists (select 1 from profiles p where p.id = simulation_attempts.trainee_id and p.auth_user_id = auth.uid())
);

drop policy if exists "authenticated read own certificates" on certificates;
create policy "authenticated read own certificates" on certificates for select to authenticated using (
  public.current_user_role() in ('trainer', 'admin')
  or exists (select 1 from profiles p where p.id = certificates.trainee_id and p.auth_user_id = auth.uid())
);

drop policy if exists "public read active tracks" on training_tracks;
create policy "public read active tracks" on training_tracks for select using (active = true);

drop policy if exists "public read active courses" on courses;
create policy "public read active courses" on courses for select using (active = true);

drop policy if exists "public read course sessions" on course_sessions;
create policy "public read course sessions" on course_sessions for select using (true);

drop policy if exists "public read active competencies" on competencies;
create policy "public read active competencies" on competencies for select using (active = true);

drop policy if exists "public read active scenarios" on simulation_scenarios;
create policy "public read active scenarios" on simulation_scenarios for select using (active = true);


-- Training resource library and upload center.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'training-files',
  'training-files',
  false,
  52428800,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-powerpoint',
    'video/mp4',
    'image/png',
    'image/jpeg',
    'model/gltf-binary',
    'model/gltf+json',
    'application/octet-stream'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "authenticated read training files" on storage.objects;
create policy "authenticated read training files" on storage.objects for select to authenticated using (bucket_id = 'training-files');

drop policy if exists "trainer admin upload training files" on storage.objects;
create policy "trainer admin upload training files" on storage.objects for insert to authenticated with check (
  bucket_id = 'training-files'
  and public.current_user_role() in ('trainer', 'admin')
);

drop policy if exists "trainer admin update training files" on storage.objects;
create policy "trainer admin update training files" on storage.objects for update to authenticated using (
  bucket_id = 'training-files'
  and public.current_user_role() in ('trainer', 'admin')
) with check (
  bucket_id = 'training-files'
  and public.current_user_role() in ('trainer', 'admin')
);

drop policy if exists "authenticated read active resources" on learning_resources;
create policy "authenticated read active resources" on learning_resources for select to authenticated using (
  active = true
  and (
    visibility = 'trainee'
    or public.current_user_role() in ('trainer', 'admin')
  )
);

drop policy if exists "trainer admin create resources" on learning_resources;
create policy "trainer admin create resources" on learning_resources for insert to authenticated with check (
  public.current_user_role() in ('trainer', 'admin')
  and exists (select 1 from profiles p where p.id = learning_resources.uploaded_by and p.auth_user_id = auth.uid())
);

drop policy if exists "trainer admin update resources" on learning_resources;
create policy "trainer admin update resources" on learning_resources for update to authenticated using (
  public.current_user_role() in ('trainer', 'admin')
) with check (
  public.current_user_role() in ('trainer', 'admin')
);

-- Service role/admin backend should manage private trainee records.
-- Add authenticated user policies after Supabase Auth is connected.
