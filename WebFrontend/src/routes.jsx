import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

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
 * Chat page component (placeholder)
 * 
 * PUBLIC_INTERFACE
 */
const ChatPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Chat</h1>
      <p>Chat interface will be implemented here</p>
    </div>
  );
};

/**
 * Wireframe page component (placeholder)
 * 
 * PUBLIC_INTERFACE
 */
const WireframePage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Wireframe</h1>
      <p>Wireframe viewer and editor will be implemented here</p>
    </div>
  );
};

/**
 * History page component (placeholder)
 * 
 * PUBLIC_INTERFACE
 */
const HistoryPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>History</h1>
      <p>Chat and wireframe history will be displayed here</p>
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
        <ChatPage />
      </ProtectedRoute>
    ),
    label: 'Chat'
  },
  {
    path: '/wireframe/:id?',
    element: (
      <ProtectedRoute>
        <WireframePage />
      </ProtectedRoute>
    ),
    label: 'Wireframe'
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    ),
    label: 'History'
  },
  {
    path: '/login',
    element: <LoginPage />,
    label: 'Login'
  }
];

export default routes;
