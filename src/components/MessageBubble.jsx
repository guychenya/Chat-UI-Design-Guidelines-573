import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useChat } from '../contexts/ChatContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
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
  FiBookmark,
  FiMessageSquare,
  FiThumbsUp,
  FiThumbsDown
} = FiIcons;

const MessageBubble = ({ message, index, isLastMessage }) => {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const { regenerateResponse, addMessage } = useChat();
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const messageRef = useRef(null);
  const isAi = message.type === 'ai';
  const isReference = message.referencedMessageId;
  
  // Apply animation for last message
  useEffect(() => {
    if (isLastMessage && isAi && settings.useAnimations) {
      const element = messageRef.current;
      if (element) {
        element.classList.add('highlight-pulse');
        setTimeout(() => {
          element.classList.remove('highlight-pulse');
        }, 1000);
      }
    }
  }, [isLastMessage, isAi, settings.useAnimations]);

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
      messageId: message.id,
      content: message.content,
      files: message.file ? [message.file] : [],
      timestamp: message.timestamp
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    
    // Create a drag image
    const dragPreview = document.createElement('div');
    dragPreview.className = `drag-preview ${theme}`;
    dragPreview.innerHTML = `
      <div class="drag-preview-content">
        <span class="drag-icon">💬</span>
        <span class="drag-text">${message.content.substring(0, 30)}${message.content.length > 30 ? '...' : ''}</span>
      </div>
    `;
    
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 20, 20);
    
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleFollowUp = () => {
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: `Can you elaborate more on "${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}"`,
      timestamp: new Date().toISOString(),
      referencedMessageId: message.id
    });
  };

  const handleRegenerate = () => {
    regenerateResponse(message.id);
  };

  const handleFeedback = (value) => {
    setFeedback(value);
    // Here you would typically send this feedback to your backend
    console.log(`Feedback for message ${message.id}: ${value}`);
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
      className={`message-bubble ${message.type} ${theme} ${isDragging ? 'dragging' : ''} ${isReference ? 'referenced' : ''}`}
    >
      {isReference && (
        <div className="reference-indicator">
          <SafeIcon icon={FiMessageSquare} />
          <span>Referenced message</span>
        </div>
      )}
      
      <div 
        className="drag-handle" 
        draggable 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        title="Drag to reference this message"
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
          {isAi ? (
            <ReactMarkdown
              className="markdown-content"
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  
                  return !inline && match ? (
                    <div className="code-block-container">
                      <div className="code-header">
                        <span className="code-language">{language}</span>
                        <button 
                          className="code-copy-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                        >
                          <SafeIcon icon={copied ? FiCheck : FiCopy} />
                          <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language={language}
                        style={theme === 'dark' ? atomDark : solarizedlight}
                        wrapLines={true}
                        showLineNumbers={language !== 'text'}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            message.content
          )}
          
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
          {isAi && (
            <div className="feedback-buttons">
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                onClick={() => handleFeedback('positive')}
                className={`feedback-button ${feedback === 'positive' ? 'active' : ''}`}
                title="Helpful response"
              >
                <SafeIcon icon={FiThumbsUp} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                onClick={() => handleFeedback('negative')}
                className={`feedback-button ${feedback === 'negative' ? 'active' : ''}`}
                title="Unhelpful response"
              >
                <SafeIcon icon={FiThumbsDown} />
              </motion.button>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="action-button"
            title="Copy message"
          >
            <SafeIcon icon={copied ? FiCheck : FiCopy} />
          </motion.button>
          
          {isAi && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRegenerate}
              className="action-button"
              title="Regenerate response"
            >
              <SafeIcon icon={FiRefreshCw} />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFollowUp}
            className="action-button follow-up"
            title="Follow up on this message"
          >
            <SafeIcon icon={FiMessageSquare} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;