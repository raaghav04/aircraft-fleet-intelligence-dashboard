import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite WebSocket / HMR connection errors in the sandbox environment
if (typeof window !== 'undefined') {
  const isWebsocketError = (err: any): boolean => {
    if (!err) return false;
    const message = typeof err === 'string' ? err : (err.message || String(err));
    return (
      message.includes('WebSocket') ||
      message.includes('websocket') ||
      message.includes('closed without opened') ||
      message.includes('[vite]') ||
      message.includes('ws://') ||
      message.includes('wss://')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isWebsocketError(event.reason)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    if (isWebsocketError(event.error) || isWebsocketError(event.message)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
