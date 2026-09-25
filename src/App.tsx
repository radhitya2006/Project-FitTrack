import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui';
import { AppLayout } from './components/layout/AppLayout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { WorkoutListPage } from './pages/WorkoutListPage';
import { WorkoutFormPage } from './pages/WorkoutFormPage';
import { ActiveWorkoutPage } from './pages/ActiveWorkoutPage';
import { HistoryListPage } from './pages/HistoryListPage';
import { HistoryDetailPage } from './pages/HistoryDetailPage';
import { ProgressPage } from './pages/ProgressPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Routes with tab bar + FAB */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/workouts" element={<WorkoutListPage />} />
            <Route path="/workouts/new" element={<WorkoutFormPage />} />
            <Route path="/workouts/:id/edit" element={<WorkoutFormPage />} />
            <Route path="/history" element={<HistoryListPage />} />
            <Route path="/history/:id" element={<HistoryDetailPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Route>

          {/* Full-screen route (no tab bar) */}
          <Route path="/workout/active" element={<ActiveWorkoutPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
