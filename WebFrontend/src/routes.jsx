import React from 'react';

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
 * Login page component (placeholder)
 * 
 * PUBLIC_INTERFACE
 */
const LoginPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login</h1>
      <p>Authentication form will be implemented here</p>
    </div>
  );
};

/**
 * Routes configuration
 * Defines all application routes with their components
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
    element: <ChatPage />,
    label: 'Chat'
  },
  {
    path: '/wireframe/:id?',
    element: <WireframePage />,
    label: 'Wireframe'
  },
  {
    path: '/history',
    element: <HistoryPage />,
    label: 'History'
  },
  {
    path: '/login',
    element: <LoginPage />,
    label: 'Login'
  }
];

export default routes;
