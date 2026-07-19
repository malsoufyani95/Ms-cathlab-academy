# Database Setup — Cath Lab Academy

This project is currently a Vite/React static site. The database layer is prepared for **Supabase/PostgreSQL**, which is the easiest option for Vercel deployment because it provides:

- PostgreSQL database
- Authentication
- Row Level Security
- API access from the frontend
- Easy future admin dashboard integration

## Files

- `database/schema.sql` — creates all tables, indexes, triggers, and starter RLS policies.
- `database/seed.sql` — inserts starter training tracks, courses, competencies, and simulation scenarios.
- `.env.example` — documents the frontend environment variables needed when Supabase is connected.

## Main tables

- `profiles` — trainees, trainers, admins.
- `training_tracks` — Recovery, Circulating, Scrub, Quality/CPD pathways.
- `courses` — training catalog courses.
- `course_sessions` — agenda/session schedule. When Mohammed sends the agenda, add it here.
- `enrollments` — trainee course progress.
- `competencies` — competency checklist items.
- `competency_assessments` — trainer validation records.
- `simulation_scenarios` — clinical simulation questions.
- `simulation_attempts` — trainee simulation attempts and scores.
- `certificates` — certificate records and verification codes.
- `audit_events` — governance/audit log.

## Setup in Supabase

1. Create a new Supabase project.
2. Open **SQL Editor**.
3. Run the full content of:
   - `database/schema.sql`
4. Then run:
   - `database/seed.sql`
5. Copy your project URL and anon key into Vercel environment variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

## Important security note

Only the `anon` public key should be used in the frontend. Never put the Supabase `service_role` key in Vite/Vercel frontend variables.

## Next implementation phase

After the Supabase project is created, the frontend can be connected to live data:

1. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```
2. Add `src/lib/supabase.js`.
3. Replace hardcoded catalog/simulation/certificate data with database queries.
4. Add login using Supabase Auth.
5. Add trainer/admin dashboard write permissions via authenticated RLS policies.

## Agenda mapping

When the agenda is ready, add every agenda row into `course_sessions`:

- `course_id`
- `title_en` / `title_ar`
- `session_date`
- `start_time`
- `end_time`
- `location`
- `instructor_name`
- `learning_outcomes`
- `agenda_items`
