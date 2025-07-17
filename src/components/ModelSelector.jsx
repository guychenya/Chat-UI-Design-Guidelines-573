import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';
import './ModelSelector.css';

const { FiChevronDown, FiCpu, FiZap, FiBrain } = FiIcons;

const models = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', icon: FiBrain, color: '#00a67e' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', icon: FiZap, color: '#00a67e' },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', icon: FiCpu, color: '#ff6b35' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', icon: FiBrain, color: '#4285f4' },
];

const ModelSelector = () => {
  const { theme } = useTheme();
  const { selectedModel, setSelectedModel } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = models.find(m => m.id === selectedModel);

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
    setIsOpen(false);
  };

  return (
    <div className={`model-selector ${theme}`}>
      <div className="model-selector-header">
        <span className="model-selector-label">Model</span>
      </div>
      
      <div className="model-dropdown">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="model-trigger"
        >
          <div className="model-info">
            <div className="model-icon" style={{ color: currentModel?.color }}>
              <SafeIcon icon={currentModel?.icon} />
            </div>
            <div className="model-details">
              <div className="model-name">{currentModel?.name}</div>
              <div className="model-provider">{currentModel?.provider}</div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <SafeIcon icon={FiChevronDown} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="model-dropdown-menu"
            >
              {models.map((model) => (
                <motion.button
                  key={model.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModelSelect(model.id)}
                  className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
                >
                  <div className="model-icon" style={{ color: model.color }}>
                    <SafeIcon icon={model.icon} />
                  </div>
                  <div className="model-details">
                    <div className="model-name">{model.name}</div>
                    <div className="model-provider">{model.provider}</div>
                  </div>
                  {selectedModel === model.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="selected-indicator"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModelSelector;