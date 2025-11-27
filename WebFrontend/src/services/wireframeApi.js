import httpClient from './httpClient';

/**
 * Wireframe API Service
 * 
 * Handles wireframe generation and retrieval operations.
 * 
 * PUBLIC_INTERFACE
 */

/**
 * Submit prompt for wireframe generation
 * 
 * @param {string} prompt - User prompt for wireframe generation
 * @returns {Promise<WireframeSpec>} Generated wireframe specification
 * @throws {ErrorResponse} Error if generation fails
 * 
 * PUBLIC_INTERFACE
 */
export const generateWireframe = async (prompt) => {
  return await httpClient.post('/wireframe', { prompt });
};

/**
 * Retrieve a specific wireframe by ID
 * 
 * @param {string} id - Wireframe identifier
 * @returns {Promise<WireframeSpec>} Wireframe specification
 * @throws {ErrorResponse} Error if wireframe not found
 * 
 * PUBLIC_INTERFACE
 */
export const getWireframe = async (id) => {
  return await httpClient.get(`/wireframe/${id}`);
};

/**
 * Update an existing wireframe (if supported by backend)
 * Note: This endpoint is not in the OpenAPI spec but may be needed
 * 
 * @param {string} id - Wireframe identifier
 * @param {WireframeSpec} wireframeData - Updated wireframe data
 * @returns {Promise<WireframeSpec>} Updated wireframe specification
 * @throws {ErrorResponse} Error if update fails
 * 
 * PUBLIC_INTERFACE
 */
export const updateWireframe = async (id, wireframeData) => {
  return await httpClient.put(`/wireframe/${id}`, wireframeData);
};

/**
 * Delete a wireframe (if supported by backend)
 * Note: This endpoint is not in the OpenAPI spec but may be needed
 * 
 * @param {string} id - Wireframe identifier
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {ErrorResponse} Error if deletion fails
 * 
 * PUBLIC_INTERFACE
 */
export const deleteWireframe = async (id) => {
  return await httpClient.delete(`/wireframe/${id}`);
};

const wireframeApi = {
  generateWireframe,
  getWireframe,
  updateWireframe,
  deleteWireframe
};

export default wireframeApi;
