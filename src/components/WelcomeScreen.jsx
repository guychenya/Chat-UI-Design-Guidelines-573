import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import { useChat } from '../contexts/ChatContext';
import './WelcomeScreen.css';

const { FiMessageSquare, FiZap, FiCode, FiHelpCircle, FiEdit, FiSearch } = FiIcons;

const WelcomeScreen = () => {
  const { theme } = useTheme();
  const { createNewConversation } = useChat();

  const suggestions = [
    {
      icon: FiCode,
      title: 'Code Review',
      description: 'Help me review and improve my code',
      color: '#3b82f6'
    },
    {
      icon: FiEdit,
      title: 'Creative Writing',
      description: 'Assist with creative writing projects',
      color: '#8b5cf6'
    },
    {
      icon: FiSearch,
      title: 'Research Help',
      description: 'Research and summarize information',
      color: '#10b981'
    },
    {
      icon: FiHelpCircle,
      title: 'Problem Solving',
      description: 'Help solve complex problems',
      color: '#f59e0b'
    }
  ];

  return (
    <div className={`welcome-screen ${theme}`}>
      <div className="welcome-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="welcome-header"
        >
          <div className="welcome-icon">
            <SafeIcon icon={FiMessageSquare} />
          </div>
          <h1 className="welcome-title">Welcome to AI Assistant</h1>
          <p className="welcome-subtitle">
            Your intelligent companion for coding, creativity, and problem-solving
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="suggestions-grid"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              onClick={createNewConversation}
              className="suggestion-card"
            >
              <div className="suggestion-icon" style={{ color: suggestion.color }}>
                <SafeIcon icon={suggestion.icon} />
              </div>
              <h3 className="suggestion-title">{suggestion.title}</h3>
              <p className="suggestion-description">{suggestion.description}</p>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="welcome-footer"
        >
          <div className="feature-highlights">
            <div className="feature">
              <SafeIcon icon={FiZap} />
              <span>Fast & Responsive</span>
            </div>
            <div className="feature">
              <SafeIcon icon={FiMessageSquare} />
              <span>Natural Conversations</span>
            </div>
            <div className="feature">
              <SafeIcon icon={FiCode} />
              <span>Code-Aware</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;