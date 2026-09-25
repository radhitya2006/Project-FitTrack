// ============================================================
// FitTrack — Active Workout Store
// ============================================================

import { create } from 'zustand';
import { db } from '../db';
import { generateId } from '../utils';
import type {
  Exercise,
  WorkoutSession,
  SessionSet,
  ActiveWorkoutExercise,
  TemplateExercise,
} from '../types';

interface ActiveWorkoutStore {
  // --- State ---
  session: WorkoutSession | null;
  exercises: ActiveWorkoutExercise[];
  isActive: boolean;
  elapsedSeconds: number;
  restTimerSeconds: number;
  restTimerRunning: boolean;
  showSummary: boolean;

  // --- Actions ---
  startFromTemplate: (
    templateId: string,
    templateName: string,
    templateExercises: TemplateExercise[],
    exerciseMap: Map<string, Exercise>
  ) => Promise<void>;
  startEmpty: () => Promise<void>;

  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;

  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setNumber: number) => void;
  updateSet: (exerciseId: string, setNumber: number, updates: { weight?: number; reps?: number }) => void;
  completeSet: (exerciseId: string, setNumber: number) => void;

  tickTimer: () => void;
  startRestTimer: (seconds: number) => void;
  skipRestTimer: () => void;
  extendRestTimer: (seconds: number) => void;
  tickRestTimer: () => void;

  finishWorkout: () => Promise<WorkoutSession | null>;
  discardWorkout: () => void;
  reset: () => void;
}

const initialState = {
  session: null as WorkoutSession | null,
  exercises: [] as ActiveWorkoutExercise[],
  isActive: false,
  elapsedSeconds: 0,
  restTimerSeconds: 0,
  restTimerRunning: false,
  showSummary: false,
};

export const useActiveWorkoutStore = create<ActiveWorkoutStore>((set, get) => ({
  ...initialState,

  // --- Start Workout ---
  startFromTemplate: async (templateId, templateName, templateExercises, exerciseMap) => {
    const session: WorkoutSession = {
      id: generateId('ses'),
      templateId,
      name: templateName,
      startedAt: Date.now(),
      completedAt: null,
      duration: null,
    };

    const exercises: ActiveWorkoutExercise[] = templateExercises
      .sort((a, b) => a.order - b.order)
      .map((te) => {
        const exercise = exerciseMap.get(te.exerciseId);
        if (!exercise) return null;

        const sets: SessionSet[] = Array.from({ length: te.targetSets }, (_, i) => ({
          id: generateId('set'),
          sessionId: session.id,
          exerciseId: te.exerciseId,
          setNumber: i + 1,
          weight: te.targetWeight ?? 0,
          reps: 0,
          completed: false,
          performedAt: null,
        }));

        return {
          exerciseId: te.exerciseId,
          exercise,
          sets,
          targetSets: te.targetSets,
          targetReps: te.targetReps,
          targetWeight: te.targetWeight,
        };
      })
      .filter(Boolean) as ActiveWorkoutExercise[];

    set({
      session,
      exercises,
      isActive: true,
      elapsedSeconds: 0,
      showSummary: false,
    });
  },

  startEmpty: async () => {
    const session: WorkoutSession = {
      id: generateId('ses'),
      templateId: null,
      name: 'Quick Workout',
      startedAt: Date.now(),
      completedAt: null,
      duration: null,
    };

    set({
      session,
      exercises: [],
      isActive: true,
      elapsedSeconds: 0,
      showSummary: false,
    });
  },

  // --- Exercise Management ---
  addExercise: (exercise) => {
    const { session, exercises } = get();
    if (!session) return;

    const newExercise: ActiveWorkoutExercise = {
      exerciseId: exercise.id,
      exercise,
      sets: [
        {
          id: generateId('set'),
          sessionId: session.id,
          exerciseId: exercise.id,
          setNumber: 1,
          weight: 0,
          reps: 0,
          completed: false,
          performedAt: null,
        },
      ],
      targetSets: 3,
      targetReps: 10,
      targetWeight: null,
    };

    set({ exercises: [...exercises, newExercise] });
  },

  removeExercise: (exerciseId) => {
    set((state) => ({
      exercises: state.exercises.filter((e) => e.exerciseId !== exerciseId),
    }));
  },

  // --- Set Management ---
  addSet: (exerciseId) => {
    set((state) => ({
      exercises: state.exercises.map((e) => {
        if (e.exerciseId !== exerciseId) return e;
        const nextSetNumber = e.sets.length + 1;
        const lastSet = e.sets[e.sets.length - 1];
        return {
          ...e,
          sets: [
            ...e.sets,
            {
              id: generateId('set'),
              sessionId: state.session!.id,
              exerciseId,
              setNumber: nextSetNumber,
              weight: lastSet?.weight ?? 0,
              reps: 0,
              completed: false,
              performedAt: null,
            },
          ],
        };
      }),
    }));
  },

  removeSet: (exerciseId, setNumber) => {
    set((state) => ({
      exercises: state.exercises.map((e) => {
        if (e.exerciseId !== exerciseId) return e;
        const filtered = e.sets
          .filter((s) => s.setNumber !== setNumber)
          .map((s, i) => ({ ...s, setNumber: i + 1 }));
        return { ...e, sets: filtered };
      }),
    }));
  },

  updateSet: (exerciseId, setNumber, updates) => {
    set((state) => ({
      exercises: state.exercises.map((e) => {
        if (e.exerciseId !== exerciseId) return e;
        return {
          ...e,
          sets: e.sets.map((s) =>
            s.setNumber === setNumber ? { ...s, ...updates } : s
          ),
        };
      }),
    }));
  },

  completeSet: (exerciseId, setNumber) => {
    set((state) => ({
      exercises: state.exercises.map((e) => {
        if (e.exerciseId !== exerciseId) return e;
        return {
          ...e,
          sets: e.sets.map((s) =>
            s.setNumber === setNumber
              ? { ...s, completed: true, performedAt: Date.now() }
              : s
          ),
        };
      }),
    }));
  },

  // --- Timers ---
  tickTimer: () => {
    set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
  },

  startRestTimer: (seconds) => {
    set({ restTimerSeconds: seconds, restTimerRunning: true });
  },

  skipRestTimer: () => {
    set({ restTimerSeconds: 0, restTimerRunning: false });
  },

  extendRestTimer: (seconds) => {
    set((state) => ({
      restTimerSeconds: state.restTimerSeconds + seconds,
    }));
  },

  tickRestTimer: () => {
    set((state) => {
      const next = state.restTimerSeconds - 1;
      if (next <= 0) {
        return { restTimerSeconds: 0, restTimerRunning: false };
      }
      return { restTimerSeconds: next };
    });
  },

  // --- Finish / Discard ---
  finishWorkout: async () => {
    const { session, exercises } = get();
    if (!session) return null;

    const now = Date.now();
    const duration = Math.floor((now - session.startedAt) / 1000);

    const completedSession: WorkoutSession = {
      ...session,
      completedAt: now,
      duration,
    };

    // Save session to DB
    await db.workoutSessions.add(completedSession);

    // Save all sets to DB
    const allSets = exercises.flatMap((e) => e.sets);
    if (allSets.length > 0) {
      await db.sessionSets.bulkAdd(allSets);
    }

    set({
      session: completedSession,
      isActive: false,
      restTimerRunning: false,
      restTimerSeconds: 0,
      showSummary: true,
    });

    return completedSession;
  },

  discardWorkout: () => {
    set({ ...initialState });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
