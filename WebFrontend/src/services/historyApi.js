import httpClient from './httpClient';

/**
 * History API Service
 * 
 * Handles retrieval of chat and wireframe history for the current session.
 * 
 * PUBLIC_INTERFACE
 */

/**
 * Retrieve chat and wireframe history for the session
 * 
 * @returns {Promise<HistoryData>} History data with messages and wireframes
 * @throws {ErrorResponse} Error if request fails
 * 
 * PUBLIC_INTERFACE
 */
export const getHistory = async () => {
  return await httpClient.get('/history');
};

/**
 * Get only chat messages from history
 * 
 * @returns {Promise<Message[]>} Array of chat messages
 * @throws {ErrorResponse} Error if request fails
 * 
 * PUBLIC_INTERFACE
 */
export const getChatHistory = async () => {
  const history = await getHistory();
  return history.messages || [];
};

/**
 * Get only wireframes from history
 * 
 * @returns {Promise<WireframeSpec[]>} Array of wireframe specifications
 * @throws {ErrorResponse} Error if request fails
 * 
 * PUBLIC_INTERFACE
 */
export const getWireframeHistory = async () => {
  const history = await getHistory();
  return history.wireframes || [];
};

/**
 * Clear history (if supported by backend)
 * Note: This endpoint is not in the OpenAPI spec but may be needed
 * 
 * @returns {Promise<Object>} Clear confirmation
 * @throws {ErrorResponse} Error if request fails
 * 
 * PUBLIC_INTERFACE
 */
export const clearHistory = async () => {
  return await httpClient.delete('/history');
};

const historyApi = {
  getHistory,
  getChatHistory,
  getWireframeHistory,
  clearHistory
};

export default historyApi;
