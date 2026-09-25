// ============================================================
// FitTrack — Dexie Database (IndexedDB)
// ============================================================

import Dexie, { type Table } from 'dexie';
import type {
  Exercise,
  WorkoutTemplate,
  TemplateExercise,
  WorkoutSession,
  SessionSet,
  PersonalRecord,
} from '../types';

export class FitTrackDB extends Dexie {
  exercises!: Table<Exercise, string>;
  workoutTemplates!: Table<WorkoutTemplate, string>;
  templateExercises!: Table<TemplateExercise, string>;
  workoutSessions!: Table<WorkoutSession, string>;
  sessionSets!: Table<SessionSet, string>;
  personalRecords!: Table<PersonalRecord, string>;

  constructor() {
    super('FitTrackDB');

    this.version(1).stores({
      exercises: 'id, name, muscleGroup, equipment, category, isCustom',
      workoutTemplates: 'id, name, createdAt, updatedAt',
      templateExercises: 'id, templateId, exerciseId, order',
      workoutSessions: 'id, templateId, startedAt, completedAt',
      sessionSets: 'id, sessionId, exerciseId, setNumber, performedAt',
      personalRecords: 'id, exerciseId, type, achievedAt',
    });
  }
}

export const db = new FitTrackDB();
