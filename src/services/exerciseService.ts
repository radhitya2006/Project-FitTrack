import { supabase } from '../lib/supabase';
import type { Exercise, MuscleGroup, Equipment, ExerciseCategory } from '../types';

export interface ExerciseRow {
  id: string;
  name: string;
  muscle_group: MuscleGroup;
  secondary_muscles: MuscleGroup[];
  equipment: Equipment;
  category: ExerciseCategory;
  is_custom: boolean;
  user_id: string | null;
}

export function mapExerciseFromRow(row: ExerciseRow): Exercise {
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

/**
 * Fetches all global exercises (and any custom exercises once auth is enabled)
 * directly from Supabase `exercises` table.
 *
 * Explicitly requests:
 * - id
 * - name
 * - muscle_group
 * - secondary_muscles
 * - equipment
 * - category
 * - is_custom
 * - user_id
 */
export async function getExercisesFromSupabase(): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('id, name, muscle_group, secondary_muscles, equipment, category, is_custom, user_id')
    .order('name', { ascending: true });

  if (error) {
    console.error('[exerciseService] Failed to load exercises from Supabase:', error);
    throw new Error(error.message || 'Failed to fetch exercises from database');
  }

  if (!data) {
    return [];
  }

  return (data as ExerciseRow[]).map(mapExerciseFromRow);
}
