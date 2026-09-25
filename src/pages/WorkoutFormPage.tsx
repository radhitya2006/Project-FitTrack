import styles from './Page.module.css';

export function WorkoutFormPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Create Workout</h1>
        <p className={styles.pageSubtitle}>Add exercises and set your targets</p>
      </div>

      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>🏗️</span>
        <span className={styles.emptyTitle}>Workout Builder</span>
        <span className={styles.emptyDesc}>
          This page will let you create and edit workout templates
        </span>
      </div>
    </div>
  );
}
