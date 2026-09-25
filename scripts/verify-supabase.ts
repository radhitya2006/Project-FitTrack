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
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = process.env.VITE_SUPABASE_URL || (urlMatch ? urlMatch[1].trim() : '');
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || (keyMatch ? keyMatch[1].trim() : '');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Anon Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('🔍 Connecting to Supabase...');
  console.log(`URL: ${supabaseUrl}`);

  const { data, count, error } = await supabase
    .from('exercises')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('❌ Error fetching exercises:', error);
    process.exit(1);
  }

  console.log(`\n📊 Exercises count in Supabase: ${count ?? (data ? data.length : 0)}`);

  if (!data || data.length === 0) {
    console.log('⚠️ No exercises found in Supabase exercises table.');
    return {
      success: false,
      count: 0,
      globalCount: 0,
      duplicates: 0,
    };
  }

  // 1. Check duplicate IDs
  const idCounts = new Map<string, number>();
  for (const row of data) {
    idCounts.set(row.id, (idCounts.get(row.id) || 0) + 1);
  }
  const duplicates = Array.from(idCounts.entries()).filter(([, count]) => count > 1);
  if (duplicates.length > 0) {
    console.error('❌ Found duplicate IDs in exercises table:', duplicates);
  } else {
    console.log('✅ No duplicate IDs found.');
  }

  // 2. Check global exercises (user_id === null)
  const globalExercises = data.filter((row) => row.user_id === null);
  console.log(`✅ Global exercises with user_id = NULL: ${globalExercises.length}`);

  // 3. Check is_custom = false for global exercises
  const nonCustomGlobal = globalExercises.filter((row) => row.is_custom === false);
  console.log(`✅ Global exercises with is_custom = false: ${nonCustomGlobal.length}`);

  // 4. Check coverage against exerciseSeedData
  const seedIds = new Set(exerciseSeedData.map((e) => e.id));
  const seededFound = globalExercises.filter((row) => seedIds.has(row.id));
  console.log(`✅ Matched seed exercises: ${seededFound.length}/${exerciseSeedData.length}`);

  const allPassed =
    duplicates.length === 0 &&
    globalExercises.length === exerciseSeedData.length &&
    nonCustomGlobal.length === exerciseSeedData.length &&
    seededFound.length === exerciseSeedData.length;

  if (allPassed) {
    console.log('\n🎉 ALL VERIFICATIONS PASSED SUCCESSFULLY!');
  } else {
    console.log('\n⚠️ Some verifications did not meet criteria.');
  }

  return {
    success: allPassed,
    count: data.length,
    globalCount: globalExercises.length,
    duplicates: duplicates.length,
  };
}

verify();
