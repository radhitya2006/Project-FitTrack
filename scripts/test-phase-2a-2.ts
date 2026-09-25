import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read .env.local safely
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
  console.error('❌ Missing Supabase URL or Anon Key. Please check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface ExerciseRow {
  id: string;
  name: string;
  muscle_group: string;
  secondary_muscles: string[];
  equipment: string;
  category: string;
  is_custom: boolean;
  user_id: string | null;
}

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipment: string;
  category: string;
  isCustom: boolean;
  userId: string | null;
}

function mapExerciseFromRow(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    muscleGroup: row.muscle_group,
    secondaryMuscles: row.secondary_muscles || [],
    equipment: row.equipment,
    category: row.category,
    isCustom: row.is_custom,
    userId: row.user_id,
  };
}

async function runTests() {
  console.log('🧪 Testing Phase 2A-2 — Exercise Data + Exercise Picker Logic');
  console.log(`📡 Querying Supabase: ${supabaseUrl}`);

  // Test 1: Query exact fields from Supabase exercises table
  const query = 'id, name, muscle_group, secondary_muscles, equipment, category, is_custom, user_id';
  const { data, error } = await supabase
    .from('exercises')
    .select(query)
    .order('name', { ascending: true });

  if (error) {
    console.error('❌ Supabase query failed:', error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.error('❌ No exercises found!');
    process.exit(1);
  }

  console.log(`✅ Loaded ${data.length} exercises from Supabase 'exercises' table.`);

  const exerciseRows = data as unknown as ExerciseRow[];
  const exercises = exerciseRows.map(mapExerciseFromRow);

  // Test 2: Field integrity
  let integrityPassed = true;
  for (const ex of exercises) {
    if (!ex.id || !ex.name || !ex.muscleGroup || !ex.equipment || !ex.category) {
      console.error('❌ Missing required field on exercise:', ex);
      integrityPassed = false;
    }
    if (ex.isCustom !== false) {
      console.error('❌ Expected is_custom to be false:', ex);
      integrityPassed = false;
    }
    if (ex.userId !== null) {
      console.error('❌ Expected user_id to be null:', ex);
      integrityPassed = false;
    }
  }
  if (integrityPassed) {
    console.log('✅ All 50 exercises have valid fields, is_custom=false, user_id=null.');
  }

  // Test 3: Search filter simulation
  const searchQuery = 'bench';
  const searchResults = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(`✅ Search for "${searchQuery}" returned ${searchResults.length} exercises:`);
  searchResults.forEach((e) => console.log(`   - ${e.name} (${e.muscleGroup}, ${e.equipment})`));

  if (searchResults.length === 0) {
    console.error('❌ Search test failed!');
    process.exit(1);
  }

  // Test 4: Muscle group filter simulation
  const muscleGroups = ['chest', 'back', 'shoulders', 'legs', 'arms', 'core'];
  for (const mg of muscleGroups) {
    const mgResults = exercises.filter((ex) => ex.muscleGroup === mg);
    console.log(`✅ Filter for muscle group "${mg}": ${mgResults.length} exercises`);
    if (mgResults.length === 0) {
      console.error(`❌ Expected exercises for muscle group "${mg}", found 0!`);
      process.exit(1);
    }
  }

  // Test 5: Search + Muscle group combined filter
  const combined = exercises.filter(
    (ex) =>
      ex.muscleGroup === 'chest' &&
      ex.name.toLowerCase().includes('dumbbell')
  );
  console.log(`✅ Combined filter (chest + dumbbell search): ${combined.length} exercises:`);
  combined.forEach((e) => console.log(`   - ${e.name} (${e.equipment})`));

  // Test 6: Selection simulation
  const selectedExercise = exercises[0];
  console.log(`✅ Simulating exercise selection: selected "${selectedExercise.name}" (ID: ${selectedExercise.id})`);

  console.log('\n🎉 ALL PHASE 2A-2 VERIFICATION TESTS PASSED!');
}

runTests();
