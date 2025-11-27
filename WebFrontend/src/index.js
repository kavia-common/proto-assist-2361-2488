import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { SessionProvider } from './context/SessionContext';
import { AppProvider } from './context/AppContext';

/**
 * Application Entry Point
 * 
 * Wraps the App component with necessary providers:
 * - BrowserRouter for routing
 * - AppProvider for global app state (theme, feature flags)
 * - SessionProvider for authentication state
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
