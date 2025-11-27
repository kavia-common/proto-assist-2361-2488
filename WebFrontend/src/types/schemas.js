/**
 * Type Definitions (JSDoc)
 * 
 * Lightweight type definitions for API data structures using JSDoc.
 * These provide type hints and documentation without adding runtime overhead.
 * 
 * PUBLIC_INTERFACE
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Unique message identifier
 * @property {string} sender - Message sender identifier
 * @property {string} content - Message text content
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {'sent'|'received'|'error'} status - Message delivery status
 */

/**
 * @typedef {Object} WireframeComponent
 * @property {string} type - Component type (e.g., 'button', 'input', 'container')
 * @property {Object} props - Component properties
 * @property {Object} [style] - Component styling
 * @property {string} [id] - Component identifier
 */

/**
 * @typedef {Object} WireframeLayout
 * @property {string} type - Layout type (e.g., 'flex', 'grid')
 * @property {Object} properties - Layout configuration
 */

/**
 * @typedef {Object} WireframeMetadata
 * @property {string} [name] - Wireframe name
 * @property {string} [description] - Wireframe description
 * @property {string} [created_at] - Creation timestamp
 * @property {string} [updated_at] - Last update timestamp
 * @property {string} [author] - Creator identifier
 */

/**
 * @typedef {Object} WireframeSpec
 * @property {string} id - Unique wireframe identifier
 * @property {WireframeComponent[]} components - Array of wireframe components
 * @property {WireframeLayout} layout - Layout configuration
 * @property {WireframeMetadata} metadata - Wireframe metadata
 */

/**
 * @typedef {Object} Session
 * @property {string} session_id - Unique session identifier
 * @property {string} user_id - User identifier
 * @property {string} expires_at - ISO 8601 expiration timestamp
 * @property {'active'|'expired'|'logged_out'} status - Session status
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string} error - Error type/category
 * @property {string} message - Human-readable error message
 * @property {number} code - HTTP status code
 */

/**
 * @typedef {Object} HistoryData
 * @property {Message[]} messages - Array of chat messages
 * @property {WireframeSpec[]} wireframes - Array of wireframe specifications
 */

/**
 * @typedef {Object} ExportRequest
 * @property {string} wireframe_id - Wireframe identifier to export
 * @property {'image'|'code'} format - Export format
 */

/**
 * @typedef {Object} ExportResponse
 * @property {string} url - Download URL for exported file
 * @property {string} content - Exported content (code or base64 image)
 */

// Export empty object to make this a module
export {};
