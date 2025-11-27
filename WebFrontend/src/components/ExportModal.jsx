import React, { useState } from 'react';
import './ExportModal.css';

/**
 * ExportModal Component
 * 
 * Modal dialog for exporting wireframes in different formats.
 * Supports both image and code exports, handles API calls to /export endpoint,
 * and manages download/copy functionality for exported content.
 * 
 * @param {Object} props - Component props
 * @param {string} props.wireframeId - ID of the wireframe to export
 * @param {Function} props.onClose - Callback when modal is closed
 * 
 * PUBLIC_INTERFACE
 */
const ExportModal = ({ wireframeId, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState('image');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [exportResult, setExportResult] = useState(null);

  /**
   * Handle format selection change
   * 
   * @param {string} format - Selected format ('image' or 'code')
   */
  const handleFormatChange = (format) => {
    setSelectedFormat(format);
    setError(null);
    setExportResult(null);
  };

  /**
   * Handle export submission
   * Calls exportApi.exportWireframe and handles the response
   */
  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportResult(null);

    try {
      // Dynamically import exportApi to avoid circular dependencies
      const { default: exportApi } = await import('../services/exportApi');
      
      const result = await exportApi.exportWireframe(wireframeId, selectedFormat);
      setExportResult(result);

      // If URL is provided, open in new tab
      if (result.url) {
        window.open(result.url, '_blank');
      }
    } catch (err) {
      console.error('Export failed:', err);
      setError(err.message || 'Failed to export wireframe');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Handle copying code content to clipboard
   */
  const handleCopyCode = async () => {
    if (exportResult?.content) {
      try {
        await navigator.clipboard.writeText(exportResult.content);
        alert('Code copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy code. Please try again.');
      }
    }
  };

  /**
   * Handle downloading content
   */
  const handleDownload = () => {
    if (!exportResult?.content) return;

    // Dynamically import download utility
    import('../utils/download').then(({ downloadFile }) => {
      const filename = selectedFormat === 'image' 
        ? `wireframe-${wireframeId}.png`
        : `wireframe-${wireframeId}.html`;
      
      downloadFile(exportResult.content, filename, selectedFormat === 'image' ? 'image/png' : 'text/html');
    });
  };

  /**
   * Handle escape key to close modal
   */
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="export-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Export Wireframe</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="export-modal-body">
          {/* Format Selection */}
          <div className="format-selection">
            <h3 className="section-title">Choose Export Format</h3>
            <div className="format-options">
              <button
                className={`format-option ${selectedFormat === 'image' ? 'selected' : ''}`}
                onClick={() => handleFormatChange('image')}
                disabled={isExporting}
              >
                <span className="format-icon">🖼️</span>
                <span className="format-label">Image</span>
                <span className="format-description">Export as PNG image</span>
              </button>

              <button
                className={`format-option ${selectedFormat === 'code' ? 'selected' : ''}`}
                onClick={() => handleFormatChange('code')}
                disabled={isExporting}
              >
                <span className="format-icon">💻</span>
                <span className="format-label">Code</span>
                <span className="format-description">Export as HTML/CSS code</span>
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="export-error" role="alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Export Result */}
          {exportResult && (
            <div className="export-result">
              <div className="result-header">
                <span className="success-icon">✅</span>
                <span className="success-message">Export successful!</span>
              </div>

              {selectedFormat === 'code' && exportResult.content && (
                <div className="code-actions">
                  <button
                    className="action-btn"
                    onClick={handleCopyCode}
                  >
                    📋 Copy Code
                  </button>
                  <button
                    className="action-btn"
                    onClick={handleDownload}
                  >
                    💾 Download File
                  </button>
                </div>
              )}

              {exportResult.url && (
                <div className="url-info">
                  <p className="url-label">Download URL:</p>
                  <a
                    href={exportResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-link"
                  >
                    {exportResult.url}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn modal-btn-cancel"
            onClick={onClose}
            disabled={isExporting}
          >
            {exportResult ? 'Close' : 'Cancel'}
          </button>
          
          {!exportResult && (
            <button
              type="button"
              className="modal-btn modal-btn-submit"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Exporting...
                </>
              ) : (
                <>Export as {selectedFormat === 'image' ? 'Image' : 'Code'}</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
