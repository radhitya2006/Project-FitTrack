import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import styles from './Page.module.css';

export function WorkoutListPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Workout Plans</h1>
        <p className={styles.pageSubtitle}>Create and manage your workout templates</p>
      </div>

      <Button fullWidth onClick={() => navigate('/workouts/new')}>
        + New Workout
      </Button>

      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>📋</span>
        <span className={styles.emptyTitle}>No workouts yet</span>
        <span className={styles.emptyDesc}>
          Create your first workout template to get started
        </span>
      </div>
    </div>
  );
}
