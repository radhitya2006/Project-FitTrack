import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exerciseSeedData } from '../src/data/exercises.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

const rows = exerciseSeedData.map((e) => {
  const secondary =
    e.secondaryMuscles.length > 0
      ? `ARRAY[${e.secondaryMuscles.map((m) => `'${escapeSql(m)}'::muscle_group`).join(', ')}]`
      : `'{}'::muscle_group[]`;

  return `  ('${escapeSql(e.id)}', NULL, '${escapeSql(e.name)}', '${escapeSql(e.muscleGroup)}', ${secondary}, '${escapeSql(e.equipment)}', '${escapeSql(e.category)}', false)`;
});

const sqlContent = `-- ============================================================
-- FitTrack — Supabase Exercise Seed Data (50 Global Exercises)
-- ============================================================
--
-- This script seeds master/global exercises into the \`exercises\` table.
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
${rows.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  muscle_group = EXCLUDED.muscle_group,
  secondary_muscles = EXCLUDED.secondary_muscles,
  equipment = EXCLUDED.equipment,
  category = EXCLUDED.category,
  is_custom = EXCLUDED.is_custom,
  user_id = NULL;
`;

const outputPath = path.resolve(rootDir, 'supabase', 'seed.sql');
fs.writeFileSync(outputPath, sqlContent, 'utf8');
console.log(`Successfully generated ${outputPath} with ${rows.length} exercises.`);
