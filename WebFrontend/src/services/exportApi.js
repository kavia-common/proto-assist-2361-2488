import httpClient from './httpClient';

/**
 * Export API Service
 * 
 * Handles exporting wireframes as images or code.
 * 
 * PUBLIC_INTERFACE
 */

/**
 * Export wireframe as image or code
 * 
 * @param {string} wireframeId - Wireframe identifier
 * @param {'image'|'code'} format - Export format
 * @returns {Promise<ExportResponse>} Exported file URL and content
 * @throws {ErrorResponse} Error if export fails
 * 
 * PUBLIC_INTERFACE
 */
export const exportWireframe = async (wireframeId, format) => {
  return await httpClient.post('/export', {
    wireframe_id: wireframeId,
    format
  });
};

/**
 * Export wireframe as image
 * 
 * @param {string} wireframeId - Wireframe identifier
 * @returns {Promise<ExportResponse>} Exported image URL and content
 * @throws {ErrorResponse} Error if export fails
 * 
 * PUBLIC_INTERFACE
 */
export const exportAsImage = async (wireframeId) => {
  return await exportWireframe(wireframeId, 'image');
};

/**
 * Export wireframe as code
 * 
 * @param {string} wireframeId - Wireframe identifier
 * @returns {Promise<ExportResponse>} Exported code content
 * @throws {ErrorResponse} Error if export fails
 * 
 * PUBLIC_INTERFACE
 */
export const exportAsCode = async (wireframeId) => {
  return await exportWireframe(wireframeId, 'code');
};

/**
 * Download exported file
 * Triggers browser download of the exported content
 * 
 * @param {string} url - Export URL
 * @param {string} filename - Suggested filename
 * 
 * PUBLIC_INTERFACE
 */
export const downloadExport = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportApi = {
  exportWireframe,
  exportAsImage,
  exportAsCode,
  downloadExport
};

export default exportApi;
