import React, { useState } from 'react';
import './Toolbar.css';

/**
 * Toolbar Component
 * 
 * Provides action buttons for wireframe operations:
 * - Generate from prompt
 * - Export wireframe
 * - Load wireframe by ID
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onGenerate - Callback for generate action
 * @param {Function} props.onExport - Callback for export action
 * @param {Function} props.onLoadById - Callback for load by ID action
 * @param {boolean} props.hasWireframe - Whether a wireframe is currently loaded
 * @param {boolean} props.isLoading - Whether an operation is in progress
 * 
 * PUBLIC_INTERFACE
 */
const Toolbar = ({ onGenerate, onExport, onLoadById, hasWireframe, isLoading }) => {
  const [showLoadInput, setShowLoadInput] = useState(false);
  const [loadId, setLoadId] = useState('');

  /**
   * Handle load by ID submission
   */
  const handleLoadSubmit = (e) => {
    e.preventDefault();
    if (loadId.trim()) {
      onLoadById(loadId.trim());
      setLoadId('');
      setShowLoadInput(false);
    }
  };

  /**
   * Toggle load input visibility
   */
  const toggleLoadInput = () => {
    setShowLoadInput(!showLoadInput);
    if (showLoadInput) {
      setLoadId('');
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-container">
        <div className="toolbar-section">
          <h1 className="toolbar-title">Wireframe Viewer</h1>
        </div>

        <div className="toolbar-actions">
          <button
            className="toolbar-btn toolbar-btn-primary"
            onClick={onGenerate}
            disabled={isLoading}
            title="Generate wireframe from prompt"
          >
            <span className="btn-icon">✨</span>
            Generate
          </button>

          <button
            className="toolbar-btn"
            onClick={onExport}
            disabled={!hasWireframe || isLoading}
            title="Export wireframe"
          >
            <span className="btn-icon">💾</span>
            Export
          </button>

          <button
            className="toolbar-btn"
            onClick={toggleLoadInput}
            disabled={isLoading}
            title="Load wireframe by ID"
          >
            <span className="btn-icon">📂</span>
            Load by ID
          </button>
        </div>
      </div>

      {showLoadInput && (
        <div className="toolbar-load-section">
          <form onSubmit={handleLoadSubmit} className="load-form">
            <input
              type="text"
              className="load-input"
              placeholder="Enter wireframe ID..."
              value={loadId}
              onChange={(e) => setLoadId(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="load-submit-btn"
              disabled={!loadId.trim()}
            >
              Load
            </button>
            <button
              type="button"
              className="load-cancel-btn"
              onClick={toggleLoadInput}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
