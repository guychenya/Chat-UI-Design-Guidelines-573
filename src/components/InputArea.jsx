import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import './InputArea.css';

const { 
  FiSend, 
  FiPaperclip, 
  FiMic, 
  FiSquare, 
  FiArrowUp, 
  FiX,
  FiFile,
  FiImage,
  FiFileText,
  FiCode,
  FiBookmark
} = FiIcons;

const InputArea = () => {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const { activeConversation, addMessage, setIsTyping, scrollToBottom } = useChat();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [droppedItems, setDroppedItems] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputWrapperRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!message.trim() && selectedFiles.length === 0 && droppedItems.length === 0) || !activeConversation) return;

    // Handle file uploads first
    const allFiles = [...selectedFiles, ...droppedItems];
    if (allFiles.length > 0) {
      allFiles.forEach(file => {
        const fileMessage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          type: 'user',
          content: message.trim() || `Uploaded file: ${file.name}`,
          timestamp: new Date().toISOString(),
          file: {
            name: file.name,
            type: file.type,
            size: file.size,
            url: file.url || URL.createObjectURL(file)
          }
        };
        
        addMessage(fileMessage);
      });
      
      setSelectedFiles([]);
      setDroppedItems([]);
    } else {
      // Regular text message
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: message.trim(),
        timestamp: new Date().toISOString(),
      };

      addMessage(userMessage);
    }

    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you said: "${message.trim() || 'You sent a file'}". This is a simulated response. In a real implementation, this would be connected to an actual AI model API.`,
        timestamp: new Date().toISOString(),
      };
      addMessage(aiMessage);
      setIsTyping(false);
      scrollToBottom();
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (settings.sendOnEnter && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    e.target.value = null; // Reset input to allow selecting the same file again
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputWrapperRef.current?.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputWrapperRef.current?.classList.remove('drag-over');
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputWrapperRef.current?.classList.remove('drag-over');

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'message') {
        // Add dropped message content and files to the input
        if (data.content && !message.includes(data.content)) {
          setMessage(prev => prev + (prev ? '\n\n' : '') + data.content);
        }
        if (data.files && data.files.length > 0) {
          setDroppedItems(prev => [...prev, ...data.files]);
        }
      }
    } catch (err) {
      // Handle regular file drops
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        setSelectedFiles(prevFiles => [...prevFiles, ...files]);
      }
    }
  };

  const removeDroppedItem = (index) => {
    setDroppedItems(prev => prev.filter((_, i) => i !== index));
  };

  if (!activeConversation) return null;

  return (
    <div className={`input-area ${theme}`}>
      <div className="input-container">
        {/* Selected files preview */}
        {selectedFiles.length > 0 && (
          <div className="selected-files">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-preview">
                <div className="file-info">
                  {file.type.startsWith('image/') ? (
                    <div className="file-thumbnail">
                      <img src={URL.createObjectURL(file)} alt={file.name} />
                    </div>
                  ) : (
                    <div className="file-icon">
                      <SafeIcon icon={getFileIcon(file.type)} />
                    </div>
                  )}
                  <div className="file-name">{file.name}</div>
                </div>
                <button 
                  className="file-remove"
                  onClick={() => removeFile(index)}
                >
                  <SafeIcon icon={FiX} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dropped items preview */}
        {droppedItems.length > 0 && (
          <div className="dropped-items">
            {droppedItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="dropped-item"
              >
                <div className="dropped-item-icon">
                  <SafeIcon icon={getFileIcon(item.type)} />
                </div>
                <span className="dropped-item-name">{item.name}</span>
                <button
                  className="dropped-item-remove"
                  onClick={() => removeDroppedItem(index)}
                >
                  <SafeIcon icon={FiX} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="input-form">
          <div 
            ref={inputWrapperRef}
            className="input-wrapper"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="attachment-btn"
              onClick={handleFileButtonClick}
            >
              <SafeIcon icon={FiPaperclip} />
            </motion.button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="file-input"
              multiple
            />

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="message-input"
              rows="1"
              disabled={!activeConversation}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={toggleVoiceInput}
              className={`voice-btn ${isListening ? 'listening' : ''}`}
            >
              <SafeIcon icon={isListening ? FiSquare : FiMic} />
            </motion.button>

            <AnimatePresence>
              {(message.trim() || selectedFiles.length > 0 || droppedItems.length > 0) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="send-btn"
                >
                  <SafeIcon icon={FiArrowUp} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </form>

        <div className="input-footer">
          <p className="input-disclaimer">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;