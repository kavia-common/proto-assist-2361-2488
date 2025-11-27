import env from '../config/env';

/**
 * HTTP Client Module
 * 
 * Provides a configured fetch-based HTTP client with automatic bearer token
 * injection, request/response interceptors, error normalization, and 401 handling.
 * 
 * PUBLIC_INTERFACE
 */

/**
 * Get authentication token from localStorage
 * This approach allows the HTTP client to work independently of React context
 * 
 * @returns {string|null} Authentication token
 */
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Handle 401 Unauthorized response
 * Clears token and redirects to login page
 * 
 * @param {Response} response - Fetch response object
 */
const handle401Response = (response) => {
  if (response.status === 401) {
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    
    // Redirect to login page if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
};

/**
 * Normalize error responses to a consistent format
 * 
 * @param {Response} response - Fetch response object
 * @param {Object|string} [body] - Parsed response body
 * @returns {Promise<ErrorResponse>} Normalized error object
 */
const normalizeError = async (response, body = null) => {
  // If body is already parsed and contains error info, use it
  if (body && typeof body === 'object' && body.error) {
    return {
      error: body.error,
      message: body.message || 'An error occurred',
      code: response.status
    };
  }

  // Otherwise create a generic error
  const statusText = response.statusText || 'Unknown Error';
  return {
    error: statusText,
    message: body?.message || `Request failed with status ${response.status}`,
    code: response.status
  };
};

/**
 * Core HTTP request function
 * 
 * @param {string} endpoint - API endpoint (relative to baseURL)
 * @param {Object} [options={}] - Fetch options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.headers={}] - Additional headers
 * @param {Object|FormData|string} [options.body] - Request body
 * @param {boolean} [options.skipAuth=false] - Skip authentication header
 * @returns {Promise<Object>} Response data
 * @throws {ErrorResponse} Normalized error on failure
 * 
 * PUBLIC_INTERFACE
 */
const request = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body = null,
    skipAuth = false,
    ...restOptions
  } = options;

  // Build full URL
  const baseURL = env.apiBase;
  const url = `${baseURL}${endpoint}`;

  // Build headers
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  // Add bearer token if not skipped and token exists
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Build fetch options
  const fetchOptions = {
    method,
    headers: requestHeaders,
    ...restOptions
  };

  // Add body for non-GET requests
  if (body && method !== 'GET' && method !== 'HEAD') {
    if (body instanceof FormData) {
      // Remove Content-Type header for FormData (browser sets it with boundary)
      delete requestHeaders['Content-Type'];
      fetchOptions.body = body;
    } else if (typeof body === 'string') {
      fetchOptions.body = body;
    } else {
      fetchOptions.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, fetchOptions);

    // Handle 401 immediately
    if (response.status === 401) {
      handle401Response(response);
    }

    // Parse response body
    let responseBody = null;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        responseBody = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, set body to null
        console.warn('Failed to parse JSON response:', parseError);
        responseBody = null;
      }
    } else {
      // For non-JSON responses, get text
      responseBody = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      const error = await normalizeError(response, responseBody);
      throw error;
    }

    // Return parsed response body
    return responseBody;
  } catch (error) {
    // If error is already normalized, rethrow it
    if (error.code && error.error && error.message) {
      throw error;
    }

    // Handle network errors or other fetch failures
    throw {
      error: 'NetworkError',
      message: error.message || 'Network request failed',
      code: 0
    };
  }
};

/**
 * Convenience method for GET requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} [options={}] - Fetch options
 * @returns {Promise<Object>} Response data
 * 
 * PUBLIC_INTERFACE
 */
const get = (endpoint, options = {}) => {
  return request(endpoint, { ...options, method: 'GET' });
};

/**
 * Convenience method for POST requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} [options={}] - Fetch options
 * @returns {Promise<Object>} Response data
 * 
 * PUBLIC_INTERFACE
 */
const post = (endpoint, data, options = {}) => {
  return request(endpoint, { ...options, method: 'POST', body: data });
};

/**
 * Convenience method for PUT requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} [options={}] - Fetch options
 * @returns {Promise<Object>} Response data
 * 
 * PUBLIC_INTERFACE
 */
const put = (endpoint, data, options = {}) => {
  return request(endpoint, { ...options, method: 'PUT', body: data });
};

/**
 * Convenience method for DELETE requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} [options={}] - Fetch options
 * @returns {Promise<Object>} Response data
 * 
 * PUBLIC_INTERFACE
 */
const del = (endpoint, options = {}) => {
  return request(endpoint, { ...options, method: 'DELETE' });
};

/**
 * Convenience method for PATCH requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} [options={}] - Fetch options
 * @returns {Promise<Object>} Response data
 * 
 * PUBLIC_INTERFACE
 */
const patch = (endpoint, data, options = {}) => {
  return request(endpoint, { ...options, method: 'PATCH', body: data });
};

// PUBLIC_INTERFACE
const httpClient = {
  request,
  get,
  post,
  put,
  delete: del,
  patch
};

export default httpClient;
