import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveWorkoutStore } from '../../../stores/activeWorkoutStore';
import { BottomSheet } from '../../ui/BottomSheet/BottomSheet';
import { Button } from '../../ui/Button/Button';
import styles from './FAB.module.css';
import sheetStyles from './FABSheet.module.css';

export function FAB() {
  const navigate = useNavigate();
  const { isActive } = useActiveWorkoutStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleClick = () => {
    if (isActive) {
      // Resume active workout
      navigate('/workout/active');
    } else {
      setSheetOpen(true);
    }
  };

  const handleStartEmpty = () => {
    setSheetOpen(false);
    navigate('/workout/active', { state: { mode: 'empty' } });
  };

  const handleChooseTemplate = () => {
    setSheetOpen(false);
    navigate('/workout/active', { state: { mode: 'template' } });
  };

  return (
    <>
      <button
        className={`${styles.fab} ${isActive ? styles.active : ''}`}
        onClick={handleClick}
        aria-label={isActive ? 'Resume workout' : 'Start workout'}
      >
        {isActive ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
      </button>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Start Workout"
      >
        <div className={sheetStyles.options}>
          <button className={sheetStyles.option} onClick={handleStartEmpty}>
            <span className={sheetStyles.optionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </span>
            <div className={sheetStyles.optionText}>
              <span className={sheetStyles.optionTitle}>Empty Workout</span>
              <span className={sheetStyles.optionDesc}>Start logging right away</span>
            </div>
          </button>
          <button className={sheetStyles.option} onClick={handleChooseTemplate}>
            <span className={sheetStyles.optionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 2H20a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6.5" />
                <path d="M2 12h6" />
                <path d="M2 6h4" />
                <path d="M2 18h4" />
                <rect x="10" y="7" width="8" height="4" rx="1" />
                <rect x="10" y="13" width="8" height="4" rx="1" />
              </svg>
            </span>
            <div className={sheetStyles.optionText}>
              <span className={sheetStyles.optionTitle}>From Template</span>
              <span className={sheetStyles.optionDesc}>Use a saved workout plan</span>
            </div>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
