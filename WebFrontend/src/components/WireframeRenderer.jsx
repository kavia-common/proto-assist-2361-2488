import React from 'react';
import './WireframeRenderer.css';

/**
 * WireframeRenderer Component
 * 
 * Renders a WireframeSpec with basic layout and component rendering.
 * Supports various component types and layout configurations.
 * 
 * @param {Object} props - Component props
 * @param {WireframeSpec} props.wireframe - Wireframe specification to render
 * 
 * PUBLIC_INTERFACE
 */
const WireframeRenderer = ({ wireframe }) => {
  if (!wireframe) {
    return null;
  }

  /**
   * Render a single wireframe component
   * 
   * @param {WireframeComponent} component - Component to render
   * @param {number} index - Component index
   * @returns {JSX.Element} Rendered component
   */
  const renderComponent = (component, index) => {
    const { type, props = {}, style = {}, id } = component;

    // Build inline styles from component style object
    const componentStyle = {
      ...style,
      padding: style.padding || '0.5rem',
      margin: style.margin || '0.25rem',
      border: style.border || '1px solid var(--border-color)',
      borderRadius: style.borderRadius || '4px',
      backgroundColor: style.backgroundColor || 'transparent'
    };

    // Render different component types
    switch (type?.toLowerCase()) {
      case 'button':
        return (
          <button
            key={id || `comp-${index}`}
            className="wf-button"
            style={componentStyle}
          >
            {props.label || props.text || 'Button'}
          </button>
        );

      case 'input':
      case 'textfield':
        return (
          <input
            key={id || `comp-${index}`}
            type="text"
            className="wf-input"
            placeholder={props.placeholder || 'Input'}
            style={componentStyle}
          />
        );

      case 'text':
      case 'label':
        return (
          <div
            key={id || `comp-${index}`}
            className="wf-text"
            style={componentStyle}
          >
            {props.content || props.text || 'Text'}
          </div>
        );

      case 'heading':
      case 'title':
        return (
          <h2
            key={id || `comp-${index}`}
            className="wf-heading"
            style={componentStyle}
          >
            {props.content || props.text || 'Heading'}
          </h2>
        );

      case 'container':
      case 'div':
      case 'box':
        return (
          <div
            key={id || `comp-${index}`}
            className="wf-container"
            style={componentStyle}
          >
            {props.children && Array.isArray(props.children)
              ? props.children.map((child, idx) => renderComponent(child, idx))
              : props.content || props.text || 'Container'}
          </div>
        );

      case 'image':
      case 'img':
        return (
          <div
            key={id || `comp-${index}`}
            className="wf-image"
            style={componentStyle}
          >
            <span className="image-placeholder">
              🖼️ {props.alt || props.label || 'Image'}
            </span>
          </div>
        );

      default:
        // Generic component rendering
        return (
          <div
            key={id || `comp-${index}`}
            className="wf-generic"
            style={componentStyle}
          >
            <span className="component-type">{type}</span>
            {props.content || props.text || props.label || ''}
          </div>
        );
    }
  };

  /**
   * Get layout styles from layout configuration
   * 
   * @param {WireframeLayout} layout - Layout configuration
   * @returns {Object} CSS style object
   */
  const getLayoutStyle = (layout) => {
    if (!layout) {
      return { display: 'flex', flexDirection: 'column' };
    }

    const { type, properties = {} } = layout;
    const style = {};

    switch (type?.toLowerCase()) {
      case 'flex':
        style.display = 'flex';
        style.flexDirection = properties.direction || 'column';
        style.justifyContent = properties.justifyContent || 'flex-start';
        style.alignItems = properties.alignItems || 'stretch';
        style.gap = properties.gap || '1rem';
        break;

      case 'grid':
        style.display = 'grid';
        style.gridTemplateColumns = properties.columns || 'repeat(auto-fit, minmax(200px, 1fr))';
        style.gap = properties.gap || '1rem';
        break;

      default:
        style.display = 'flex';
        style.flexDirection = 'column';
        style.gap = '1rem';
    }

    return style;
  };

  const { components = [], layout, metadata = {} } = wireframe;
  const layoutStyle = getLayoutStyle(layout);

  return (
    <div className="wireframe-renderer">
      {metadata.name && (
        <div className="wireframe-header">
          <h2 className="wireframe-title">{metadata.name}</h2>
          {metadata.description && (
            <p className="wireframe-description">{metadata.description}</p>
          )}
        </div>
      )}

      <div className="wireframe-canvas" style={layoutStyle}>
        {components.length > 0 ? (
          components.map((component, index) => renderComponent(component, index))
        ) : (
          <div className="no-components">
            <p>No components in this wireframe</p>
          </div>
        )}
      </div>

      {metadata.created_at && (
        <div className="wireframe-footer">
          <span className="metadata-label">Created:</span>
          <span className="metadata-value">
            {new Date(metadata.created_at).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default WireframeRenderer;
