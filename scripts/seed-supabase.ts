import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { exerciseSeedData } from '../src/data/exercises.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read .env.local
const envPath = path.resolve(rootDir, '.env.local');
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const anonKeyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const serviceKeyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabaseUrl = process.env.VITE_SUPABASE_URL || (urlMatch ? urlMatch[1].trim() : '');
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  (serviceKeyMatch ? serviceKeyMatch[1].trim() : '');
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || (anonKeyMatch ? anonKeyMatch[1].trim() : '');

const keyToUse = serviceRoleKey || anonKey;

if (!supabaseUrl || !keyToUse) {
  console.error('❌ Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, keyToUse);

async function seed() {
  console.log('🌱 FitTrack — Seeding Global Exercises to Supabase');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Using ${serviceRoleKey ? 'Service Role Key (bypasses RLS)' : 'Anon Key'}`);

  // Format seed records to match exercises table schema
  const records = exerciseSeedData.map((e) => ({
    id: e.id,
    user_id: null,
    name: e.name,
    muscle_group: e.muscleGroup,
    secondary_muscles: e.secondaryMuscles,
    equipment: e.equipment,
    category: e.category,
    is_custom: false,
  }));

  console.log(`Preparing to seed ${records.length} exercises...`);

  const { data, error } = await supabase
    .from('exercises')
    .upsert(records, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('❌ Supabase seed error:', error.message);
    if (error.code === '42501') {
      console.error(
        '\nℹ️ Row Level Security (RLS) prevented anonymous insert.\n' +
        'To seed the database, you can either:\n' +
        '1. Run `supabase/seed.sql` in the Supabase Dashboard SQL Editor (recommended),\n' +
        '   OR\n' +
        '2. Add SUPABASE_SERVICE_ROLE_KEY to .env.local and re-run this script.\n'
      );
    }
    process.exit(1);
  }

  console.log(`✅ Successfully seeded/upserted ${data ? data.length : records.length} exercises.`);
}

seed();
