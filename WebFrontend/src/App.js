import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import routes from './routes';
import './App.css';

/**
 * Layout Component
 * 
 * Provides the main layout structure with Navbar and content area
 * Includes skip-to-content link for keyboard navigation accessibility
 * 
 * PUBLIC_INTERFACE
 */
const Layout = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="app-content">
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  );
};

/**
 * App Component
 * 
 * Root component that sets up routing and renders the application
 * 
 * PUBLIC_INTERFACE
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {routes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element} 
          />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
