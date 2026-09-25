import styles from './Page.module.css';

export function ActiveWorkoutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Active Workout</h1>
        <p className={styles.pageSubtitle}>Log your sets and reps</p>
      </div>

      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>🏋️</span>
        <span className={styles.emptyTitle}>Workout in Progress</span>
        <span className={styles.emptyDesc}>
          The active workout experience will be built here
        </span>
      </div>
    </div>
  );
}
