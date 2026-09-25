import styles from './Page.module.css';

export function HistoryListPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>History</h1>
        <p className={styles.pageSubtitle}>Your past workouts</p>
      </div>

      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>📅</span>
        <span className={styles.emptyTitle}>No history yet</span>
        <span className={styles.emptyDesc}>
          Complete your first workout to see it here
        </span>
      </div>
    </div>
  );
}
