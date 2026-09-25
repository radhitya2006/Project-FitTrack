-- ============================================================
-- FitTrack — Supabase Exercise Seed Data (50 Global Exercises)
-- ============================================================
--
-- This script seeds master/global exercises into the `exercises` table.
--
-- Rules:
-- 1. All rows have user_id = NULL (global exercise).
-- 2. All rows have is_custom = false.
-- 3. Exact IDs, names, muscle groups, secondary muscles, equipment,
--    and categories from src/data/exercises.ts are preserved.
-- 4. ON CONFLICT (id) DO UPDATE prevents duplicates when re-run.
-- 5. Existing rows with other IDs are not deleted.
--
-- Instructions:
-- Execute this SQL script in the Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================

INSERT INTO exercises (
  id,
  user_id,
  name,
  muscle_group,
  secondary_muscles,
  equipment,
  category,
  is_custom
)
VALUES
  ('ex-bench-press', NULL, 'Bench Press', 'chest', ARRAY['shoulders'::muscle_group, 'arms'::muscle_group], 'barbell', 'compound', false),
  ('ex-incline-bench-press', NULL, 'Incline Bench Press', 'chest', ARRAY['shoulders'::muscle_group, 'arms'::muscle_group], 'barbell', 'compound', false),
  ('ex-decline-bench-press', NULL, 'Decline Bench Press', 'chest', ARRAY['arms'::muscle_group], 'barbell', 'compound', false),
  ('ex-dumbbell-bench-press', NULL, 'Dumbbell Bench Press', 'chest', ARRAY['shoulders'::muscle_group, 'arms'::muscle_group], 'dumbbell', 'compound', false),
  ('ex-incline-dumbbell-press', NULL, 'Incline Dumbbell Press', 'chest', ARRAY['shoulders'::muscle_group, 'arms'::muscle_group], 'dumbbell', 'compound', false),
  ('ex-dumbbell-fly', NULL, 'Dumbbell Fly', 'chest', '{}'::muscle_group[], 'dumbbell', 'isolation', false),
  ('ex-cable-fly', NULL, 'Cable Fly', 'chest', '{}'::muscle_group[], 'cable', 'isolation', false),
  ('ex-chest-dip', NULL, 'Chest Dip', 'chest', ARRAY['arms'::muscle_group, 'shoulders'::muscle_group], 'bodyweight', 'compound', false),
  ('ex-push-up', NULL, 'Push Up', 'chest', ARRAY['shoulders'::muscle_group, 'arms'::muscle_group, 'core'::muscle_group], 'bodyweight', 'compound', false),
  ('ex-deadlift', NULL, 'Deadlift', 'back', ARRAY['legs'::muscle_group, 'core'::muscle_group], 'barbell', 'compound', false),
  ('ex-barbell-row', NULL, 'Barbell Row', 'back', ARRAY['arms'::muscle_group], 'barbell', 'compound', false),
  ('ex-dumbbell-row', NULL, 'Dumbbell Row', 'back', ARRAY['arms'::muscle_group], 'dumbbell', 'compound', false),
  ('ex-pull-up', NULL, 'Pull Up', 'back', ARRAY['arms'::muscle_group], 'bodyweight', 'compound', false),
  ('ex-chin-up', NULL, 'Chin Up', 'back', ARRAY['arms'::muscle_group], 'bodyweight', 'compound', false),
  ('ex-lat-pulldown', NULL, 'Lat Pulldown', 'back', ARRAY['arms'::muscle_group], 'cable', 'compound', false),
  ('ex-seated-cable-row', NULL, 'Seated Cable Row', 'back', ARRAY['arms'::muscle_group], 'cable', 'compound', false),
  ('ex-t-bar-row', NULL, 'T-Bar Row', 'back', ARRAY['arms'::muscle_group], 'barbell', 'compound', false),
  ('ex-face-pull', NULL, 'Face Pull', 'back', ARRAY['shoulders'::muscle_group], 'cable', 'isolation', false),
  ('ex-overhead-press', NULL, 'Overhead Press', 'shoulders', ARRAY['arms'::muscle_group, 'core'::muscle_group], 'barbell', 'compound', false),
  ('ex-dumbbell-shoulder-press', NULL, 'Dumbbell Shoulder Press', 'shoulders', ARRAY['arms'::muscle_group], 'dumbbell', 'compound', false),
  ('ex-lateral-raise', NULL, 'Lateral Raise', 'shoulders', '{}'::muscle_group[], 'dumbbell', 'isolation', false),
  ('ex-front-raise', NULL, 'Front Raise', 'shoulders', '{}'::muscle_group[], 'dumbbell', 'isolation', false),
  ('ex-reverse-fly', NULL, 'Reverse Fly', 'shoulders', ARRAY['back'::muscle_group], 'dumbbell', 'isolation', false),
  ('ex-arnold-press', NULL, 'Arnold Press', 'shoulders', ARRAY['arms'::muscle_group], 'dumbbell', 'compound', false),
  ('ex-cable-lateral-raise', NULL, 'Cable Lateral Raise', 'shoulders', '{}'::muscle_group[], 'cable', 'isolation', false),
  ('ex-squat', NULL, 'Squat', 'legs', ARRAY['core'::muscle_group], 'barbell', 'compound', false),
  ('ex-front-squat', NULL, 'Front Squat', 'legs', ARRAY['core'::muscle_group], 'barbell', 'compound', false),
  ('ex-leg-press', NULL, 'Leg Press', 'legs', '{}'::muscle_group[], 'machine', 'compound', false),
  ('ex-romanian-deadlift', NULL, 'Romanian Deadlift', 'legs', ARRAY['back'::muscle_group], 'barbell', 'compound', false),
  ('ex-bulgarian-split-squat', NULL, 'Bulgarian Split Squat', 'legs', ARRAY['core'::muscle_group], 'dumbbell', 'compound', false),
  ('ex-leg-curl', NULL, 'Leg Curl', 'legs', '{}'::muscle_group[], 'machine', 'isolation', false),
  ('ex-leg-extension', NULL, 'Leg Extension', 'legs', '{}'::muscle_group[], 'machine', 'isolation', false),
  ('ex-calf-raise', NULL, 'Calf Raise', 'legs', '{}'::muscle_group[], 'machine', 'isolation', false),
  ('ex-goblet-squat', NULL, 'Goblet Squat', 'legs', ARRAY['core'::muscle_group], 'dumbbell', 'compound', false),
  ('ex-hip-thrust', NULL, 'Hip Thrust', 'legs', '{}'::muscle_group[], 'barbell', 'compound', false),
  ('ex-lunges', NULL, 'Lunges', 'legs', ARRAY['core'::muscle_group], 'dumbbell', 'compound', false),
  ('ex-barbell-curl', NULL, 'Barbell Curl', 'arms', '{}'::muscle_group[], 'barbell', 'isolation', false),
  ('ex-dumbbell-curl', NULL, 'Dumbbell Curl', 'arms', '{}'::muscle_group[], 'dumbbell', 'isolation', false),
  ('ex-hammer-curl', NULL, 'Hammer Curl', 'arms', '{}'::muscle_group[], 'dumbbell', 'isolation', false),
  ('ex-tricep-pushdown', NULL, 'Tricep Pushdown', 'arms', '{}'::muscle_group[], 'cable', 'isolation', false),
  ('ex-overhead-tricep-extension', NULL, 'Overhead Tricep Extension', 'arms', '{}'::muscle_group[], 'dumbbell', 'isolation', false),
  ('ex-skull-crusher', NULL, 'Skull Crusher', 'arms', '{}'::muscle_group[], 'barbell', 'isolation', false),
  ('ex-close-grip-bench-press', NULL, 'Close Grip Bench Press', 'arms', ARRAY['chest'::muscle_group], 'barbell', 'compound', false),
  ('ex-concentration-curl', NULL, 'Concentration Curl', 'arms', '{}'::muscle_group[], 'dumbbell', 'isolation', false),
  ('ex-cable-curl', NULL, 'Cable Curl', 'arms', '{}'::muscle_group[], 'cable', 'isolation', false),
  ('ex-plank', NULL, 'Plank', 'core', '{}'::muscle_group[], 'bodyweight', 'isolation', false),
  ('ex-hanging-leg-raise', NULL, 'Hanging Leg Raise', 'core', '{}'::muscle_group[], 'bodyweight', 'isolation', false),
  ('ex-cable-crunch', NULL, 'Cable Crunch', 'core', '{}'::muscle_group[], 'cable', 'isolation', false),
  ('ex-ab-wheel-rollout', NULL, 'Ab Wheel Rollout', 'core', ARRAY['shoulders'::muscle_group], 'other', 'isolation', false),
  ('ex-russian-twist', NULL, 'Russian Twist', 'core', '{}'::muscle_group[], 'bodyweight', 'isolation', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  muscle_group = EXCLUDED.muscle_group,
  secondary_muscles = EXCLUDED.secondary_muscles,
  equipment = EXCLUDED.equipment,
  category = EXCLUDED.category,
  is_custom = EXCLUDED.is_custom,
  user_id = NULL;
