/**
 * API Services Index
 * 
 * Central export point for all API services.
 * Allows convenient imports like: import { chatApi, wireframeApi } from './services'
 * 
 * PUBLIC_INTERFACE
 */

export { default as httpClient } from './httpClient';
export { default as sessionApi } from './sessionApi';
export { default as chatApi } from './chatApi';
export { default as wireframeApi } from './wireframeApi';
export { default as historyApi } from './historyApi';
export { default as exportApi } from './exportApi';

// Export individual methods for convenience
export {
  getSession,
  createSession,
  endSession,
  validateSession
} from './sessionApi';

export {
  sendMessage,
  sendTextMessage
} from './chatApi';

export {
  generateWireframe,
  getWireframe,
  updateWireframe,
  deleteWireframe
} from './wireframeApi';

export {
  getHistory,
  getChatHistory,
  getWireframeHistory,
  clearHistory
} from './historyApi';

export {
  exportWireframe,
  exportAsImage,
  exportAsCode,
  downloadExport
} from './exportApi';
