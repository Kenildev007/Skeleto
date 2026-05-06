import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@kenildev007/skeleto/styles.css';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
