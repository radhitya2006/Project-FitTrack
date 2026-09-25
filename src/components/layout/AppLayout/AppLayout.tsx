import { Outlet } from 'react-router-dom';
import { TabBar } from '../TabBar/TabBar';
import { FAB } from '../FAB/FAB';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.topBar}>
        <ThemeToggle />
      </div>
      <main className={styles.content}>
        <Outlet />
      </main>
      <TabBar />
      <FAB />
    </div>
  );
}
