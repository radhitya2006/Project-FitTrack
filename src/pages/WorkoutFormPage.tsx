import { useState } from 'react';
import { Button, useToast } from '../components/ui';
import { ExercisePicker } from '../components/exercises';
import type { Exercise } from '../types';
import sharedStyles from './Page.module.css';
import formStyles from './WorkoutFormPage.module.css';

export function WorkoutFormPage() {
  const [templateName, setTemplateName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { showToast } = useToast();

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => [...prev, exercise]);
    showToast(`Added ${exercise.name}`, 'success');
  };

  const handleRemoveExercise = (indexToRemove: number) => {
    setSelectedExercises((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className={sharedStyles.page}>
      <div className={sharedStyles.pageHeader}>
        <h1 className={sharedStyles.pageTitle}>Create Workout</h1>
        <p className={sharedStyles.pageSubtitle}>Add exercises and build your routine</p>
      </div>

      <div className={formStyles.container}>
        {/* Workout Name Input */}
        <div className={formStyles.inputGroup}>
          <label htmlFor="workout-name" className={formStyles.label}>
            Workout Name
          </label>
          <input
            id="workout-name"
            type="text"
            className={formStyles.input}
            placeholder="e.g. Upper Body A, Push Day"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>

        {/* Exercises Section */}
        <div className={formStyles.sectionHeader}>
          <h2 className={formStyles.sectionTitle}>Exercises</h2>
          <span className={formStyles.exerciseCount}>
            {selectedExercises.length} {selectedExercises.length === 1 ? 'exercise' : 'exercises'}
          </span>
        </div>

        {selectedExercises.length === 0 ? (
          <div className={formStyles.emptyBox}>
            <span className={formStyles.emptyBoxTitle}>No exercises added yet</span>
            <span className={formStyles.emptyBoxDesc}>
              Tap the button below to pick exercises from the catalog
            </span>
          </div>
        ) : (
          <div className={formStyles.exerciseList}>
            {selectedExercises.map((exercise, index) => (
              <div key={`${exercise.id}-${index}`} className={formStyles.exerciseCard}>
                <div className={formStyles.exerciseInfo}>
                  <span className={formStyles.exerciseName}>{exercise.name}</span>
                  <div className={formStyles.exerciseTags}>
                    <span className={`${formStyles.tag} ${formStyles.tagMuscle}`}>
                      {exercise.muscleGroup}
                    </span>
                    <span className={`${formStyles.tag} ${formStyles.tagEquipment}`}>
                      {exercise.equipment}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={formStyles.removeButton}
                  onClick={() => handleRemoveExercise(index)}
                  aria-label={`Remove ${exercise.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Exercise Button */}
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => setPickerOpen(true)}
        >
          + Add Exercise
        </Button>
      </div>

      {/* Exercise Picker Modal Sheet */}
      <ExercisePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectExercise={handleSelectExercise}
      />
    </div>
  );
}
