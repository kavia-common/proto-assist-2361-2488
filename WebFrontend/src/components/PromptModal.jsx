import React, { useState, useEffect, useRef } from 'react';
import './PromptModal.css';

/**
 * PromptModal Component
 * 
 * Modal dialog for submitting wireframe generation prompts.
 * Calls onSubmit callback with the prompt text when user submits.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Callback when prompt is submitted
 * @param {Function} props.onClose - Callback when modal is closed
 * 
 * PUBLIC_INTERFACE
 */
const PromptModal = ({ onSubmit, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  /**
   * Focus textarea on mount and trap focus within modal
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Store the element that had focus before modal opened
    const previousActiveElement = document.activeElement;

    return () => {
      // Restore focus when modal closes
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, []);

  /**
   * Handle click outside modal to close
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  /**
   * Handle escape key to close modal
   */
  useEffect(() => {
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

  /**
   * Trap focus within modal
   */
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modalElement.addEventListener('keydown', handleTabKey);
    return () => {
      modalElement.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" ref={modalRef} role="document">
        <header className="modal-header">
          <h2 id="modal-title" className="modal-title">Generate Wireframe</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="prompt" className="form-label">
              Describe the wireframe you want to generate:
            </label>
            <textarea
              ref={textareaRef}
              id="prompt"
              className="prompt-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Create a login page with email, password fields, and a submit button"
              rows={6}
              aria-required="true"
              aria-describedby="prompt-hint"
            />
            <p id="prompt-hint" className="form-hint">
              Be specific about the layout, components, and functionality you need.
            </p>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-submit"
              disabled={!prompt.trim()}
              aria-disabled={!prompt.trim()}
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptModal;
