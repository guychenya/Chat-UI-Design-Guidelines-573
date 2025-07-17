import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import WelcomeScreen from './WelcomeScreen';
import FileDropzone from './FileDropzone';
import './ChatArea.css';

const { FiUploadCloud } = FiIcons;

const ChatArea = () => {
  const { theme } = useTheme();
  const { activeConversation, isTyping, messagesEndRef, scrollToBottom, addMessage } = useChat();
  const [isDragging, setIsDragging] = useState(false);
  const dropzoneRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isTyping]);

  const handleFileDrop = (files) => {
    // Process files
    Array.from(files).forEach(file => {
      // Create a message for the file
      const fileMessage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: 'user',
        content: `Uploaded file: ${file.name}`,
        timestamp: new Date().toISOString(),
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file)
        }
      };
      
      addMessage(fileMessage);
    });
    
    setIsDragging(false);
  };

  if (!activeConversation) {
    return <WelcomeScreen />;
  }

  return (
    <div 
      className={`chat-area ${theme}`}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
      }}
    >
      <div className="messages-container">
        <AnimatePresence>
          {activeConversation.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              index={index}
            />
          ))}
        </AnimatePresence>
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        {isDragging && (
          <FileDropzone 
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            ref={dropzoneRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatArea;