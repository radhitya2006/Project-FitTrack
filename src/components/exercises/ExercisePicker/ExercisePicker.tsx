import { useState, useEffect, useMemo, useCallback } from 'react';
import { BottomSheet } from '../../ui/BottomSheet/BottomSheet';
import { Button } from '../../ui/Button/Button';
import { getExercisesFromSupabase } from '../../../services/exerciseService';
import type { Exercise, MuscleGroup } from '../../../types';
import styles from './ExercisePicker.module.css';

interface ExercisePickerProps {
  open: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

const MUSCLE_GROUPS: { label: string; value: MuscleGroup | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Chest', value: 'chest' },
  { label: 'Back', value: 'back' },
  { label: 'Shoulders', value: 'shoulders' },
  { label: 'Legs', value: 'legs' },
  { label: 'Arms', value: 'arms' },
  { label: 'Core', value: 'core' },
];

export function ExercisePicker({
  open,
  onClose,
  onSelectExercise,
}: ExercisePickerProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');

  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const fetchExercises = useCallback(() => {
    queueMicrotask(() => {
      setLoading(true);
      setError(null);
    });
    getExercisesFromSupabase()
      .then((data) => {
        setExercises(data);
        setHasAttemptedFetch(true);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to connect to Supabase';
        setError(message);
        setHasAttemptedFetch(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (open && !hasAttemptedFetch) {
      fetchExercises();
    }
  }, [open, hasAttemptedFetch, fetchExercises]);

  // Reset search when modal closes
  const handleClose = () => {
    setSearchQuery('');
    setSelectedMuscle('all');
    onClose();
  };

  const handleSelect = (exercise: Exercise) => {
    onSelectExercise(exercise);
    handleClose();
  };

  const filteredExercises = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return exercises.filter((ex) => {
      const matchesSearch = q === '' || ex.name.toLowerCase().includes(q);
      const matchesMuscle = selectedMuscle === 'all' || ex.muscleGroup === selectedMuscle;
      return matchesSearch && matchesMuscle;
    });
  }, [exercises, searchQuery, selectedMuscle]);

  return (
    <BottomSheet
      open={open}
      onClose={handleClose}
      title="Select Exercise"
      fullHeight
    >
      <div className={styles.container}>
        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search exercises by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus={open}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Muscle Group Filter Pills */}
        <div className={styles.filterScroll} role="tablist" aria-label="Filter by muscle group">
          {MUSCLE_GROUPS.map((group) => {
            const isActive = selectedMuscle === group.value;
            return (
              <button
                key={group.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ''}`}
                onClick={() => setSelectedMuscle(group.value)}
              >
                {group.label}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <span className={styles.loadingText}>Loading exercises from Supabase...</span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className={styles.errorTitle}>Failed to Load Exercises</div>
            <div className={styles.errorMessage}>{error}</div>
            <Button size="sm" variant="secondary" onClick={fetchExercises}>
              Try Again
            </Button>
          </div>
        )}

        {/* Success States */}
        {!loading && !error && (
          <>
            <div className={styles.statusBar}>
              <span>
                Showing <span className={styles.countBadge}>{filteredExercises.length}</span> of {exercises.length} exercises
              </span>
              {selectedMuscle !== 'all' && (
                <span className={styles.badgeMuscle}>{selectedMuscle}</span>
              )}
            </div>

            {filteredExercises.length === 0 ? (
              <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon} aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <div className={styles.emptyTitle}>No exercises found</div>
                <div className={styles.emptyDesc}>
                  {searchQuery
                    ? `No exercises matching "${searchQuery}" in ${selectedMuscle === 'all' ? 'any category' : selectedMuscle}`
                    : `No exercises found in ${selectedMuscle}`}
                </div>
                {(searchQuery || selectedMuscle !== 'all') && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className={styles.resetButton}
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedMuscle('all');
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className={styles.exerciseList} role="listbox">
                {filteredExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    type="button"
                    role="option"
                    aria-selected={false}
                    className={styles.exerciseItem}
                    onClick={() => handleSelect(exercise)}
                  >
                    <div className={styles.exerciseMain}>
                      <span className={styles.exerciseName}>{exercise.name}</span>
                      <div className={styles.exerciseMeta}>
                        <span className={`${styles.badge} ${styles.badgeMuscle}`}>
                          {exercise.muscleGroup}
                        </span>
                        <span className={`${styles.badge} ${styles.badgeEquipment}`}>
                          {exercise.equipment}
                        </span>
                        <span className={styles.badgeCategory}>
                          {exercise.category}
                        </span>
                      </div>
                    </div>
                    <span className={styles.selectIcon} aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </BottomSheet>
  );
}
