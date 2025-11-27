import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import routes from './routes';
import './App.css';

/**
 * Layout Component
 * 
 * Provides the main layout structure with Navbar and content area
 * 
 * PUBLIC_INTERFACE
 */
const Layout = () => {
  return (
    <div className="App">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
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
