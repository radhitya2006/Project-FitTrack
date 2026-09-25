-- ============================================================
-- FitTrack — Supabase / PostgreSQL Schema
-- ============================================================
--
-- This schema mirrors the TypeScript entities in src/types/index.ts.
-- Run this file against your Supabase project's SQL editor
-- or include it in a Supabase migration.
--
-- Entities:
--   exercises             (master exercise catalog)
--   workout_templates     (saved workout routines)
--   template_exercises    (exercises within a template)
--   workout_sessions      (completed/in-progress sessions)
--   session_sets          (individual sets within a session)
--   personal_records      (PR achievements)
--
-- Naming convention: snake_case for SQL, mapped to camelCase
-- in the TypeScript layer.
-- ============================================================


-- ── Custom ENUM types ───────────────────────────────────────

CREATE TYPE muscle_group AS ENUM (
  'chest', 'back', 'shoulders', 'legs', 'arms', 'core'
);

CREATE TYPE equipment AS ENUM (
  'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'other'
);

CREATE TYPE exercise_category AS ENUM (
  'compound', 'isolation', 'cardio'
);

CREATE TYPE pr_type AS ENUM (
  'max_weight', 'max_reps', 'max_volume', 'max_estimated_1rm'
);


-- ── Exercises (Master Data) ─────────────────────────────────

CREATE TABLE exercises (
  id                TEXT PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  muscle_group      muscle_group NOT NULL,
  secondary_muscles muscle_group[] NOT NULL DEFAULT '{}',
  equipment         equipment NOT NULL,
  category          exercise_category NOT NULL,
  is_custom         BOOLEAN NOT NULL DEFAULT false
);

COMMENT ON TABLE exercises IS 'Master exercise catalog. Rows with user_id = NULL are global seed data; rows with a user_id are user-created custom exercises.';

CREATE INDEX idx_exercises_user_id       ON exercises (user_id);
CREATE INDEX idx_exercises_muscle_group  ON exercises (muscle_group);
CREATE INDEX idx_exercises_equipment     ON exercises (equipment);
CREATE INDEX idx_exercises_category      ON exercises (category);


-- ── Workout Templates (Plans) ───────────────────────────────

CREATE TABLE workout_templates (
  id          TEXT PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  created_at  BIGINT NOT NULL,
  updated_at  BIGINT NOT NULL
);

COMMENT ON TABLE workout_templates IS 'User-created workout routines / plans.';

CREATE INDEX idx_workout_templates_user_id     ON workout_templates (user_id);
CREATE INDEX idx_workout_templates_updated_at  ON workout_templates (updated_at DESC);


-- ── Template Exercises (Join: Template ↔ Exercise) ──────────

CREATE TABLE template_exercises (
  id            TEXT PRIMARY KEY,
  template_id   TEXT NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id   TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  "order"       INTEGER NOT NULL DEFAULT 0,
  target_sets   INTEGER NOT NULL DEFAULT 3,
  target_reps   INTEGER NOT NULL DEFAULT 10,
  target_weight NUMERIC(7,2) DEFAULT NULL
);

COMMENT ON TABLE template_exercises IS 'Exercises assigned to a workout template, with prescribed volume.';

CREATE INDEX idx_template_exercises_template_id ON template_exercises (template_id);
CREATE INDEX idx_template_exercises_exercise_id ON template_exercises (exercise_id);


-- ── Workout Sessions (Execution) ────────────────────────────

CREATE TABLE workout_sessions (
  id            TEXT PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id   TEXT REFERENCES workout_templates(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  started_at    BIGINT NOT NULL,
  completed_at  BIGINT DEFAULT NULL,
  duration      INTEGER DEFAULT NULL
);

COMMENT ON TABLE workout_sessions IS 'Individual workout executions. completed_at = NULL means in-progress.';

CREATE INDEX idx_workout_sessions_user_id      ON workout_sessions (user_id);
CREATE INDEX idx_workout_sessions_template_id  ON workout_sessions (template_id);
CREATE INDEX idx_workout_sessions_started_at   ON workout_sessions (started_at DESC);
CREATE INDEX idx_workout_sessions_completed_at ON workout_sessions (completed_at DESC);


-- ── Session Sets (Individual sets within a session) ─────────

CREATE TABLE session_sets (
  id            TEXT PRIMARY KEY,
  session_id    TEXT NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id   TEXT NOT NULL REFERENCES exercises(id),
  set_number    INTEGER NOT NULL,
  weight        NUMERIC(7,2) NOT NULL DEFAULT 0,
  reps          INTEGER NOT NULL DEFAULT 0,
  completed     BOOLEAN NOT NULL DEFAULT false,
  performed_at  BIGINT DEFAULT NULL
);

COMMENT ON TABLE session_sets IS 'Individual sets performed during a workout session.';

CREATE INDEX idx_session_sets_session_id   ON session_sets (session_id);
CREATE INDEX idx_session_sets_exercise_id  ON session_sets (exercise_id);
CREATE INDEX idx_session_sets_performed_at ON session_sets (performed_at DESC);


-- ── Personal Records ────────────────────────────────────────

CREATE TABLE personal_records (
  id            TEXT PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id   TEXT NOT NULL REFERENCES exercises(id),
  type          pr_type NOT NULL,
  value         NUMERIC(10,2) NOT NULL,
  achieved_at   BIGINT NOT NULL,
  session_id    TEXT NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE
);

COMMENT ON TABLE personal_records IS 'Best-ever performance markers per exercise.';

CREATE INDEX idx_personal_records_user_id     ON personal_records (user_id);
CREATE INDEX idx_personal_records_exercise_id ON personal_records (exercise_id);
CREATE INDEX idx_personal_records_achieved_at ON personal_records (achieved_at DESC);

-- Prevent duplicate PR types per exercise per user
CREATE UNIQUE INDEX idx_personal_records_unique_type
  ON personal_records (user_id, exercise_id, type);


-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
--
-- RLS is ENABLED on all user-scoped tables so that each user
-- can only access their own data once authentication is wired up.
--
-- IMPORTANT: These policies require auth.uid() which is only
-- available when the request is made by an authenticated user
-- via the Supabase client. Until authentication is implemented
-- in the frontend:
--
--   • The app still uses Dexie (local IndexedDB) for all data.
--   • These policies will block anonymous access intentionally.
--   • DO NOT disable RLS or add permissive anon policies as a
--     workaround — that would be insecure.
--
-- Once auth is added, the Supabase client will automatically
-- include the JWT and auth.uid() will resolve correctly.
-- ============================================================

-- ── Exercises ───────────────────────────────────────────────
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Users can read all exercises (global seed + their own custom)
CREATE POLICY "Users can read all exercises"
  ON exercises FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());

-- Users can insert/update/delete only their own custom exercises
CREATE POLICY "Users can manage own exercises"
  ON exercises FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Workout Templates ───────────────────────────────────────
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own templates"
  ON workout_templates FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Template Exercises ──────────────────────────────────────
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;

-- Access template_exercises only if the parent template belongs to the user
CREATE POLICY "Users can manage own template exercises"
  ON template_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_templates
      WHERE workout_templates.id = template_exercises.template_id
        AND workout_templates.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_templates
      WHERE workout_templates.id = template_exercises.template_id
        AND workout_templates.user_id = auth.uid()
    )
  );

-- ── Workout Sessions ────────────────────────────────────────
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions"
  ON workout_sessions FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Session Sets ────────────────────────────────────────────
ALTER TABLE session_sets ENABLE ROW LEVEL SECURITY;

-- Access session_sets only if the parent session belongs to the user
CREATE POLICY "Users can manage own session sets"
  ON session_sets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_sets.session_id
        AND workout_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_sets.session_id
        AND workout_sessions.user_id = auth.uid()
    )
  );

-- ── Personal Records ────────────────────────────────────────
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own personal records"
  ON personal_records FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
