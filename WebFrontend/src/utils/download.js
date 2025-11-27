/**
 * Download Utility Module
 * 
 * Provides helper functions for downloading files in the browser.
 * Supports various content types and handles data URI generation.
 * 
 * PUBLIC_INTERFACE
 */

/**
 * Download a file from content
 * Creates a temporary link element and triggers download
 * 
 * @param {string} content - File content (text, base64, or data URI)
 * @param {string} filename - Desired filename for download
 * @param {string} [mimeType='text/plain'] - MIME type of the content
 * 
 * PUBLIC_INTERFACE
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  let dataUri;

  // Check if content is already a data URI
  if (content.startsWith('data:')) {
    dataUri = content;
  } else if (mimeType.startsWith('image/') && !content.startsWith('http')) {
    // For images, assume base64 if not a URL
    dataUri = `data:${mimeType};base64,${content}`;
  } else if (content.startsWith('http://') || content.startsWith('https://')) {
    // If it's already a URL, use it directly
    dataUri = content;
  } else {
    // For text content, encode as data URI
    dataUri = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
  }

  // Create temporary link element
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', filename);
  linkElement.style.display = 'none';

  // Append to body, click, and remove
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
};

/**
 * Download JSON data as a file
 * 
 * @param {Object} data - JSON data to download
 * @param {string} filename - Desired filename (without extension)
 * 
 * PUBLIC_INTERFACE
 */
export const downloadJSON = (data, filename) => {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, `${filename}.json`, 'application/json');
};

/**
 * Download text content as a file
 * 
 * @param {string} text - Text content to download
 * @param {string} filename - Desired filename
 * @param {string} [mimeType='text/plain'] - MIME type
 * 
 * PUBLIC_INTERFACE
 */
export const downloadText = (text, filename, mimeType = 'text/plain') => {
  downloadFile(text, filename, mimeType);
};

/**
 * Download HTML content as a file
 * 
 * @param {string} html - HTML content to download
 * @param {string} filename - Desired filename (without extension)
 * 
 * PUBLIC_INTERFACE
 */
export const downloadHTML = (html, filename) => {
  downloadFile(html, `${filename}.html`, 'text/html');
};

/**
 * Download image from base64 or URL
 * 
 * @param {string} imageData - Base64 string or image URL
 * @param {string} filename - Desired filename (without extension)
 * @param {string} [format='png'] - Image format (png, jpg, etc.)
 * 
 * PUBLIC_INTERFACE
 */
export const downloadImage = (imageData, filename, format = 'png') => {
  const mimeType = `image/${format}`;
  downloadFile(imageData, `${filename}.${format}`, mimeType);
};

/**
 * Open URL in new tab
 * 
 * @param {string} url - URL to open
 * 
 * PUBLIC_INTERFACE
 */
export const openInNewTab = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

// Default export with all functions
const downloadUtils = {
  downloadFile,
  downloadJSON,
  downloadText,
  downloadHTML,
  downloadImage,
  openInNewTab
};

export default downloadUtils;
