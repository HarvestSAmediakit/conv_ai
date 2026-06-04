import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { pdfjs } from 'react-pdf';

// Patch console.error to ignore benign third-party library warnings
const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('`ref` is not a prop.')) {
    return;
  }
  originalError(...args);
};

// Setting the worker from CDN to ensure it loads correctly regardless of local bundle issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Register the PWA Service Worker for magazine caching & offline-first access
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('🚀 PWA ServiceWorker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.error('❌ ServiceWorker registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
