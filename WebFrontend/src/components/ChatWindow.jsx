import React from 'react';
import MessageList from './MessageList';
import InputBar from './InputBar';
import './ChatWindow.css';

/**
 * ChatWindow Component
 * 
 * Container component that combines MessageList and InputBar.
 * Manages the overall chat interface layout and passes props to child components.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} props.isLoading - Whether a message is being sent
 * @param {Function} props.onSendMessage - Callback when user sends a message
 * @param {boolean} props.initialLoadComplete - Whether initial history load is complete
 * 
 * PUBLIC_INTERFACE
 */
const ChatWindow = ({ messages, isLoading, onSendMessage, initialLoadComplete }) => {
  return (
    <div className="chat-window">
      <MessageList 
        messages={messages} 
        isLoading={isLoading}
        initialLoadComplete={initialLoadComplete}
      />
      <InputBar 
        onSendMessage={onSendMessage} 
        isDisabled={isLoading}
      />
    </div>
  );
};

export default ChatWindow;
