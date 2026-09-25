import styles from './Page.module.css';

export function ProgressPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Progress</h1>
        <p className={styles.pageSubtitle}>Track your strength and volume</p>
      </div>

      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>📈</span>
        <span className={styles.emptyTitle}>No data yet</span>
        <span className={styles.emptyDesc}>
          Complete workouts to see your progress charts and personal records
        </span>
      </div>
    </div>
  );
}
