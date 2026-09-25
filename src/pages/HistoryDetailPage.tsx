import { useParams } from 'react-router-dom';
import styles from './Page.module.css';

export function HistoryDetailPage() {
  const { id } = useParams();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Workout Detail</h1>
        <p className={styles.pageSubtitle}>Session: {id}</p>
      </div>

      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>📊</span>
        <span className={styles.emptyTitle}>Workout Breakdown</span>
        <span className={styles.emptyDesc}>
          Detailed view of exercises, sets, and performance
        </span>
      </div>
    </div>
  );
}
