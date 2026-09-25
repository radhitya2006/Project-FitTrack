// ============================================================
// FitTrack — Database Seed
// ============================================================

import { db } from './index';
import { exerciseSeedData } from '../data/exercises';

/**
 * Seeds the exercise database if empty.
 * Called once on app startup.
 */
export async function seedDatabase(): Promise<void> {
  const count = await db.exercises.count();
  if (count === 0) {
    await db.exercises.bulkAdd(exerciseSeedData);
    console.log(`[FitTrack] Seeded ${exerciseSeedData.length} exercises`);
  }
}
