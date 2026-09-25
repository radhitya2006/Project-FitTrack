import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
// Initialize theme before first render
import './stores/themeStore';
import { seedDatabase } from './db/seed';

// Seed exercise data on first load
seedDatabase().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
