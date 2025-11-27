import httpClient from './httpClient';

/**
 * Chat API Service
 * 
 * Handles chat message operations including sending messages and receiving
 * AI Agent responses.
 * 
 * PUBLIC_INTERFACE
 */

/**
 * Send a chat message and receive AI Agent response
 * 
 * @param {Message} message - Message object to send
 * @returns {Promise<Message>} AI Agent response message
 * @throws {ErrorResponse} Error if request fails
 * 
 * PUBLIC_INTERFACE
 */
export const sendMessage = async (message) => {
  return await httpClient.post('/chat', message);
};

/**
 * Send a text message (convenience method)
 * Automatically constructs a Message object with required fields
 * 
 * @param {string} content - Message text content
 * @param {string} [sender='user'] - Sender identifier
 * @returns {Promise<Message>} AI Agent response message
 * @throws {ErrorResponse} Error if request fails
 * 
 * PUBLIC_INTERFACE
 */
export const sendTextMessage = async (content, sender = 'user') => {
  const message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sender,
    content,
    timestamp: new Date().toISOString(),
    status: 'sent'
  };
  
  return await sendMessage(message);
};

const chatApi = {
  sendMessage,
  sendTextMessage
};

export default chatApi;
