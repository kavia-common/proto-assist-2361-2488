import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Chat from './pages/Chat';
import Wireframe from './pages/Wireframe';
import History from './pages/History';
import Healthcheck from './pages/Healthcheck';

/**
 * Placeholder Components
 * These will be replaced with actual implementations in future steps
 */

/**
 * Home page component (placeholder)
 * 
 * PUBLIC_INTERFACE
 */
const HomePage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Proto Assistant</h1>
      <p>Your AI-powered wireframe generation assistant</p>
      <p style={{ marginTop: '1rem' }}>
        Please <a href="/login" style={{ color: 'var(--text-secondary)' }}>login</a> to access the chat, wireframe, and history features.
      </p>
    </div>
  );
};

/**
 * Routes configuration
 * Defines all application routes with their components.
 * Protected routes (/chat, /wireframe, /history) are wrapped with ProtectedRoute.
 * 
 * PUBLIC_INTERFACE
 */
const routes = [
  {
    path: '/',
    element: <HomePage />,
    label: 'Home'
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
    label: 'Chat'
  },
  {
    path: '/wireframe/:id?',
    element: (
      <ProtectedRoute>
        <Wireframe />
      </ProtectedRoute>
    ),
    label: 'Wireframe'
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <History />
      </ProtectedRoute>
    ),
    label: 'History'
  },
  {
    path: '/login',
    element: <LoginPage />,
    label: 'Login'
  },
  {
    path: '/health',
    element: <Healthcheck />,
    label: 'Health'
  }
];

export default routes;
