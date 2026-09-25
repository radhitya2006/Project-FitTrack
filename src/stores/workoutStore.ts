// ============================================================
// FitTrack — Workout Store (Templates & Sessions)
// ============================================================

import { create } from 'zustand';
import { db } from '../db';
import { generateId } from '../utils';
import type {
  WorkoutTemplate,
  TemplateExercise,
  WorkoutSession,
  SessionSet,
  PersonalRecord,
} from '../types';

interface WorkoutStore {
  // --- Templates ---
  templates: WorkoutTemplate[];
  loadTemplates: () => Promise<void>;
  createTemplate: (name: string) => Promise<WorkoutTemplate>;
  updateTemplate: (id: string, name: string) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;

  // --- Template Exercises ---
  getTemplateExercises: (templateId: string) => Promise<TemplateExercise[]>;
  addTemplateExercise: (exercise: Omit<TemplateExercise, 'id'>) => Promise<TemplateExercise>;
  updateTemplateExercise: (id: string, updates: Partial<TemplateExercise>) => Promise<void>;
  removeTemplateExercise: (id: string) => Promise<void>;

  // --- Sessions ---
  sessions: WorkoutSession[];
  loadSessions: () => Promise<void>;
  getSession: (id: string) => Promise<WorkoutSession | undefined>;
  getSessionSets: (sessionId: string) => Promise<SessionSet[]>;

  // --- Personal Records ---
  getExercisePRs: (exerciseId: string) => Promise<PersonalRecord[]>;
  getAllPRs: () => Promise<PersonalRecord[]>;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  // --- Templates ---
  templates: [],

  loadTemplates: async () => {
    const templates = await db.workoutTemplates
      .orderBy('updatedAt')
      .reverse()
      .toArray();
    set({ templates });
  },

  createTemplate: async (name: string) => {
    const now = Date.now();
    const template: WorkoutTemplate = {
      id: generateId('tpl'),
      name,
      createdAt: now,
      updatedAt: now,
    };
    await db.workoutTemplates.add(template);
    set((state) => ({ templates: [template, ...state.templates] }));
    return template;
  },

  updateTemplate: async (id: string, name: string) => {
    const now = Date.now();
    await db.workoutTemplates.update(id, { name, updatedAt: now });
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, name, updatedAt: now } : t
      ),
    }));
  },

  deleteTemplate: async (id: string) => {
    await db.workoutTemplates.delete(id);
    // Also remove associated template exercises
    await db.templateExercises.where('templateId').equals(id).delete();
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
    }));
  },

  // --- Template Exercises ---
  getTemplateExercises: async (templateId: string) => {
    return db.templateExercises
      .where('templateId')
      .equals(templateId)
      .sortBy('order');
  },

  addTemplateExercise: async (exercise) => {
    const templateExercise: TemplateExercise = {
      ...exercise,
      id: generateId('te'),
    };
    await db.templateExercises.add(templateExercise);
    return templateExercise;
  },

  updateTemplateExercise: async (id, updates) => {
    await db.templateExercises.update(id, updates);
  },

  removeTemplateExercise: async (id) => {
    await db.templateExercises.delete(id);
  },

  // --- Sessions ---
  sessions: [],

  loadSessions: async () => {
    const sessions = await db.workoutSessions
      .orderBy('startedAt')
      .reverse()
      .toArray();
    set({ sessions });
  },

  getSession: async (id: string) => {
    return db.workoutSessions.get(id);
  },

  getSessionSets: async (sessionId: string) => {
    return db.sessionSets
      .where('sessionId')
      .equals(sessionId)
      .sortBy('setNumber');
  },

  // --- Personal Records ---
  getExercisePRs: async (exerciseId: string) => {
    return db.personalRecords
      .where('exerciseId')
      .equals(exerciseId)
      .toArray();
  },

  getAllPRs: async () => {
    return db.personalRecords
      .orderBy('achievedAt')
      .reverse()
      .toArray();
  },
}));
