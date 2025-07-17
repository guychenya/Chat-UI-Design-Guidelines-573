import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import './MessageBubble.css';

const { 
  FiUser, 
  FiCpu, 
  FiCopy, 
  FiCheck, 
  FiRefreshCw, 
  FiFile, 
  FiImage, 
  FiFileText, 
  FiDownload,
  FiGrip,
  FiCode,
  FiBookmark
} = FiIcons;

const MessageBubble = ({ message, index }) => {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const messageRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    // Set drag data
    const dragData = {
      type: 'message',
      content: message.content,
      files: message.file ? [message.file] : [],
      timestamp: message.timestamp
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    
    // Create a drag image
    const dragPreview = document.createElement('div');
    dragPreview.className = `drag-preview ${theme}`;
    dragPreview.innerHTML = `<div class="drag-preview-content">
      <span class="drag-icon">📄</span>
      <span class="drag-text">${message.content.substring(0, 30)}${message.content.length > 30 ? '...' : ''}</span>
    </div>`;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 20, 20);
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return FiFile;
    if (fileType.startsWith('image/')) return FiImage;
    if (fileType.startsWith('text/')) {
      if (fileType.includes('markdown')) return FiBookmark;
      if (fileType.includes('code')) return FiCode;
      return FiFileText;
    }
    return FiFile;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`message-bubble ${message.type} ${theme} ${isDragging ? 'dragging' : ''}`}
    >
      <div 
        className="drag-handle"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SafeIcon icon={FiGrip} />
      </div>

      <div className="message-avatar">
        <SafeIcon icon={message.type === 'user' ? FiUser : FiCpu} />
      </div>
      
      <div className="message-content">
        <div className="message-header">
          <span className="message-author">
            {message.type === 'user' ? 'You' : 'AI Assistant'}
          </span>
          {settings.showTimestamps && (
            <span className="message-time">
              {formatTime(message.timestamp)}
            </span>
          )}
        </div>
        
        <div className={`message-text ${message.file ? 'with-file' : ''}`}>
          {message.content}
          
          {message.file && (
            <div className="message-file">
              {message.file.type.startsWith('image/') ? (
                <div className="file-image">
                  <img src={message.file.url} alt={message.file.name} />
                </div>
              ) : (
                <div className="file-attachment">
                  <div className="file-icon">
                    <SafeIcon icon={getFileIcon(message.file.type)} />
                  </div>
                  <div className="file-details">
                    <div className="file-name">{message.file.name}</div>
                    <div className="file-size">{formatFileSize(message.file.size)}</div>
                  </div>
                  <a 
                    href={message.file.url} 
                    download={message.file.name}
                    className="file-download"
                    title="Download file"
                  >
                    <SafeIcon icon={FiDownload} />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="message-actions">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="action-button"
            title="Copy message"
          >
            <SafeIcon icon={copied ? FiCheck : FiCopy} />
          </motion.button>
          
          {message.type === 'ai' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="action-button"
              title="Regenerate response"
            >
              <SafeIcon icon={FiRefreshCw} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;