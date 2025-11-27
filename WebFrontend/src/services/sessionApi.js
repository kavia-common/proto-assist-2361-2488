import httpClient from './httpClient';

/**
 * Session API Service
 * 
 * Handles session management operations including login, session retrieval,
 * and authentication.
 * 
 * PUBLIC_INTERFACE
 */

/**
 * Get current session status
 * 
 * @returns {Promise<Session>} Current session details
 * @throws {ErrorResponse} Error if request fails
 * 
 * PUBLIC_INTERFACE
 */
export const getSession = async () => {
  return await httpClient.get('/session');
};

/**
 * Login or create a new session
 * 
 * @param {Object} credentials - User credentials
 * @param {string} credentials.user_id - User identifier
 * @param {string} credentials.password - User password
 * @returns {Promise<Session>} New session details with token
 * @throws {ErrorResponse} Error if authentication fails
 * 
 * PUBLIC_INTERFACE
 */
export const createSession = async (credentials) => {
  return await httpClient.post('/session', credentials, { skipAuth: true });
};

/**
 * Logout and end current session
 * Note: This endpoint is not defined in the OpenAPI spec but is commonly needed
 * 
 * @returns {Promise<Object>} Logout confirmation
 * @throws {ErrorResponse} Error if request fails
 * 
 * PUBLIC_INTERFACE
 */
export const endSession = async () => {
  return await httpClient.delete('/session');
};

/**
 * Validate current session token
 * This is a convenience wrapper around getSession
 * 
 * @returns {Promise<boolean>} True if session is valid
 * 
 * PUBLIC_INTERFACE
 */
export const validateSession = async () => {
  try {
    const session = await getSession();
    return session && session.status === 'active';
  } catch (error) {
    return false;
  }
};

const sessionApi = {
  getSession,
  createSession,
  endSession,
  validateSession
};

export default sessionApi;
