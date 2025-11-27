import httpClient from './httpClient';

/**
 * Registration API Service
 * 
 * Handles user registration operations.
 * 
 * PUBLIC_INTERFACE
 */

/**
 * Register a new user account
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.user_id - User identifier (username)
 * @param {string} userData.password - User password
 * @param {string} [userData.email] - Optional user email
 * @returns {Promise<Object>} Registration response with user details
 * @throws {ErrorResponse} Error if registration fails
 * 
 * PUBLIC_INTERFACE
 */
export const register = async (userData) => {
  return await httpClient.post('/register', userData, { skipAuth: true });
};

/**
 * Check if a user_id is available
 * Note: This endpoint may not be in the spec, but is commonly needed
 * 
 * @param {string} user_id - User identifier to check
 * @returns {Promise<Object>} Availability status
 * @throws {ErrorResponse} Error if request fails
 * 
 * PUBLIC_INTERFACE
 */
export const checkUserIdAvailability = async (user_id) => {
  try {
    return await httpClient.get(`/register/check/${encodeURIComponent(user_id)}`, { skipAuth: true });
  } catch (error) {
    // If endpoint doesn't exist, return unavailable
    return { available: false };
  }
};

const registrationApi = {
  register,
  checkUserIdAvailability
};

export default registrationApi;
