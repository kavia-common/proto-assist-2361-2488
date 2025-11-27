import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WireframeRenderer from '../components/WireframeRenderer';
import Toolbar from '../components/Toolbar';
import PromptModal from '../components/PromptModal';
import wireframeApi from '../services/wireframeApi';
import './Wireframe.css';

/**
 * Wireframe Page Component
 * 
 * Main page for viewing and generating wireframes. Supports:
 * - Loading wireframes by ID via route param /wireframe/:id
 * - Generating new wireframes from prompts
 * - Exporting wireframes
 * - Managing wireframe state with loading/error handling
 * 
 * PUBLIC_INTERFACE
 */
const Wireframe = () => {
  const { id } = useParams();
  const [currentWireframe, setCurrentWireframe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPromptModal, setShowPromptModal] = useState(false);

  /**
   * Load wireframe by ID when route param changes
   */
  useEffect(() => {
    if (id) {
      loadWireframe(id);
    } else {
      // No ID in route, clear current wireframe
      setCurrentWireframe(null);
    }
  }, [id]);

  /**
   * Load wireframe from backend by ID
   * 
   * @param {string} wireframeId - Wireframe identifier
   */
  const loadWireframe = async (wireframeId) => {
    setIsLoading(true);
    setError(null);

    try {
      const wireframe = await wireframeApi.getWireframe(wireframeId);
      setCurrentWireframe(wireframe);
    } catch (err) {
      console.error('Failed to load wireframe:', err);
      setError(err.message || 'Failed to load wireframe');
      setCurrentWireframe(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle generate wireframe action from toolbar
   * Opens the prompt modal
   */
  const handleGenerate = () => {
    setShowPromptModal(true);
  };

  /**
   * Handle prompt submission from modal
   * Calls POST /wireframe with the prompt
   * 
   * @param {string} prompt - User prompt for wireframe generation
   */
  const handlePromptSubmit = async (prompt) => {
    setIsLoading(true);
    setError(null);
    setShowPromptModal(false);

    try {
      const wireframe = await wireframeApi.generateWireframe(prompt);
      setCurrentWireframe(wireframe);
    } catch (err) {
      console.error('Failed to generate wireframe:', err);
      setError(err.message || 'Failed to generate wireframe');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle export action from toolbar
   */
  const handleExport = () => {
    if (!currentWireframe) {
      setError('No wireframe to export');
      return;
    }
    
    // For now, export as JSON
    const dataStr = JSON.stringify(currentWireframe, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `wireframe-${currentWireframe.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  /**
   * Handle load by ID action from toolbar
   * 
   * @param {string} wireframeId - Wireframe ID to load
   */
  const handleLoadById = (wireframeId) => {
    if (wireframeId && wireframeId.trim()) {
      // Update URL to reflect the loaded wireframe
      window.history.pushState({}, '', `/wireframe/${wireframeId.trim()}`);
      loadWireframe(wireframeId.trim());
    }
  };

  /**
   * Clear error state
   */
  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className="wireframe-page">
      <div className="wireframe-container">
        <Toolbar
          onGenerate={handleGenerate}
          onExport={handleExport}
          onLoadById={handleLoadById}
          hasWireframe={!!currentWireframe}
          isLoading={isLoading}
        />

        {error && (
          <div className="wireframe-error" role="alert">
            <span>{error}</span>
            <button 
              className="error-dismiss" 
              onClick={handleClearError}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div className="wireframe-content">
          {isLoading && (
            <div className="wireframe-loading">
              <div className="loading-spinner"></div>
              <p>Loading wireframe...</p>
            </div>
          )}

          {!isLoading && !currentWireframe && !error && (
            <div className="wireframe-empty">
              <div className="empty-icon">📐</div>
              <h2>No Wireframe Loaded</h2>
              <p>Generate a new wireframe from a prompt or load an existing one by ID</p>
              <button className="generate-btn" onClick={handleGenerate}>
                Generate Wireframe
              </button>
            </div>
          )}

          {!isLoading && currentWireframe && (
            <WireframeRenderer wireframe={currentWireframe} />
          )}
        </div>
      </div>

      {showPromptModal && (
        <PromptModal
          onSubmit={handlePromptSubmit}
          onClose={() => setShowPromptModal(false)}
        />
      )}
    </div>
  );
};

export default Wireframe;
