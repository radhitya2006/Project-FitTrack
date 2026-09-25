// ============================================================
// FitTrack — Core Data Types
// ============================================================

// --- Exercise (Master Data) ---

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'core';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'other';

export type ExerciseCategory = 'compound' | 'isolation' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  category: ExerciseCategory;
  isCustom: boolean;
  userId?: string | null;
}

// --- Workout Template (Plan) ---

export interface WorkoutTemplate {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface TemplateExercise {
  id: string;
  templateId: string;
  exerciseId: string;
  order: number;
  targetSets: number;
  targetReps: number;
  targetWeight: number | null; // null = no target weight
}

// --- Workout Session (Execution) ---

export interface WorkoutSession {
  id: string;
  templateId: string | null; // null = started from empty
  name: string;
  startedAt: number;
  completedAt: number | null; // null = still in progress
  duration: number | null; // seconds, computed on completion
}

export interface SessionSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  performedAt: number | null; // timestamp when completed
}

// --- Personal Record ---

export type PRType = 'max_weight' | 'max_reps' | 'max_volume' | 'max_estimated_1rm';

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  type: PRType;
  value: number;
  achievedAt: number;
  sessionId: string;
}

// --- UI / App State Types ---

export interface ActiveWorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: SessionSet[];
  targetSets: number;
  targetReps: number;
  targetWeight: number | null;
}

export interface PreviousPerformance {
  exerciseId: string;
  sets: {
    setNumber: number;
    weight: number;
    reps: number;
  }[];
}
