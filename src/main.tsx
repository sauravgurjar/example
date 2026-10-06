import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'asknow-react/style.css';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
