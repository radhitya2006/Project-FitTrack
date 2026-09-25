import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../stores/workoutStore';
import { useActiveWorkoutStore } from '../stores/activeWorkoutStore';
import type { PersonalRecord } from '../types';
import styles from './Page.module.css';
import dashStyles from './Dashboard.module.css';

export function DashboardPage() {
  const navigate = useNavigate();
  const { templates, loadTemplates, sessions, loadSessions, getAllPRs } = useWorkoutStore();
  const { isActive, session: activeSession } = useActiveWorkoutStore();
  const [prs, setPrs] = useState<PersonalRecord[]>([]);

  useEffect(() => {
    loadTemplates();
    loadSessions();
    getAllPRs().then(setPrs).catch(() => {});
  }, [loadTemplates, loadSessions, getAllPRs]);

  // Context: Today + date
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Calculate this week's workout count from completed sessions
  const thisWeekCount = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    return sessions.filter(
      (s) => s.completedAt && s.completedAt >= monday.getTime()
    ).length;
  }, [sessions]);

  return (
    <div className={styles.page}>
      {/* 1. Context / Header Hari Ini */}
      <header className={dashStyles.header}>
        <p className={dashStyles.date}>{dateFormatted}</p>
        <h1 className={dashStyles.title}>Today</h1>
      </header>

      {/* 2. Primary Workout Section */}
      <section className={dashStyles.section}>
        <div className={dashStyles.sectionHeader}>
          <h2 className={dashStyles.sectionTitle}>
            {isActive ? 'Active Session' : 'Next Workout'}
          </h2>
          {!isActive && templates.length > 0 && (
            <button
              type="button"
              className={dashStyles.headerLink}
              onClick={() => navigate('/workouts')}
            >
              All Routines →
            </button>
          )}
        </div>

        {isActive ? (
          <div className={`${dashStyles.workoutCard} ${dashStyles.workoutCardActive}`}>
            <div className={dashStyles.workoutMetaRow}>
              <span className={`${dashStyles.statusBadge} ${dashStyles.statusBadgeActive}`}>
                In Progress
              </span>
            </div>
            <div className={dashStyles.workoutBody}>
              <h3 className={dashStyles.workoutTitle}>
                {activeSession?.name || 'Workout in Progress'}
              </h3>
              <p className={dashStyles.workoutDescription}>
                You have an active workout session running.
              </p>
            </div>
            <div className={dashStyles.workoutActions}>
              <button
                type="button"
                className={dashStyles.primaryBtn}
                onClick={() => navigate('/workout/active')}
              >
                Resume Workout
              </button>
            </div>
          </div>
        ) : templates.length > 0 ? (
          <div className={dashStyles.workoutCard}>
            <div className={dashStyles.workoutMetaRow}>
              <span className={dashStyles.statusBadge}>Routine</span>
            </div>
            <div className={dashStyles.workoutBody}>
              <h3 className={dashStyles.workoutTitle}>{templates[0].name}</h3>
              <p className={dashStyles.workoutDescription}>Saved workout plan</p>
            </div>
            <div className={dashStyles.workoutActions}>
              <button
                type="button"
                className={dashStyles.primaryBtn}
                onClick={() =>
                  navigate('/workout/active', {
                    state: { mode: 'template', templateId: templates[0].id },
                  })
                }
              >
                Start Workout
              </button>
            </div>
          </div>
        ) : (
          <div className={dashStyles.workoutCard}>
            <div className={dashStyles.workoutMetaRow}>
              <span className={dashStyles.statusBadge}>Ready to train</span>
            </div>
            <div className={dashStyles.workoutBody}>
              <h3 className={dashStyles.workoutTitle}>No workout scheduled</h3>
              <p className={dashStyles.workoutDescription}>
                Create a routine template or start an empty workout to begin tracking.
              </p>
            </div>
            <div className={dashStyles.workoutActions}>
              <button
                type="button"
                className={dashStyles.primaryBtn}
                onClick={() => navigate('/workouts/new')}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Routine
              </button>
              <button
                type="button"
                className={dashStyles.secondaryBtn}
                onClick={() => navigate('/workout/active', { state: { mode: 'empty' } })}
              >
                Quick Start
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 3. Weekly Stats (Compact & Integrated) */}
      <section className={dashStyles.section}>
        <div className={dashStyles.sectionHeader}>
          <h2 className={dashStyles.sectionTitle}>This Week</h2>
        </div>

        <div className={dashStyles.statsBar}>
          <div className={dashStyles.statItem}>
            <span className={dashStyles.statValue}>{thisWeekCount}</span>
            <span className={dashStyles.statLabel}>Workouts</span>
          </div>
          <div className={dashStyles.statDivider} />
          <div className={dashStyles.statItem}>
            <span className={dashStyles.statValue}>0</span>
            <span className={dashStyles.statLabel}>kg Volume</span>
          </div>
          <div className={dashStyles.statDivider} />
          <div className={dashStyles.statItem}>
            <span className={dashStyles.statValue}>0</span>
            <span className={dashStyles.statLabel}>Day Streak</span>
          </div>
        </div>
      </section>

      {/* 4. Recent PRs (Compact) */}
      <section className={dashStyles.section}>
        <div className={dashStyles.sectionHeader}>
          <h2 className={dashStyles.sectionTitle}>Recent PRs</h2>
        </div>

        {prs.length === 0 ? (
          <div className={dashStyles.prEmptyRow}>
            <span className={dashStyles.prEmptyText}>
              No personal records yet. Records update automatically during workouts.
            </span>
          </div>
        ) : (
          <div className={dashStyles.prList}>
            {prs.slice(0, 3).map((pr) => (
              <div key={pr.id} className={dashStyles.prItem}>
                <span className={dashStyles.prValue}>{pr.value} kg</span>
                <span className={dashStyles.prDate}>
                  {new Date(pr.achievedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
