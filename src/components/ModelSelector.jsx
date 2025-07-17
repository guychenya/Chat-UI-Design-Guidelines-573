import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';
import './ModelSelector.css';

const {
  FiChevronDown,
  FiSearch,
  FiX,
  FiMessageSquare,
  FiImage,
  FiMic,
  FiVideo,
  FiSettings,
  FiCloud,
  FiZap,
  FiBrain,
  FiCpu,
  FiStar,
  FiTrendingUp
} = FiIcons;

// Comprehensive AI model categories and platforms
const modelCategories = [
  {
    id: 'chat',
    name: 'Chat & Text',
    icon: FiMessageSquare,
    color: '#3b82f6',
    models: [
      { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'Most capable GPT model', popular: true },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', description: 'Faster GPT-4 variant' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and efficient' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Most powerful Claude model', popular: true },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: 'Balanced performance' },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', description: 'Fast and lightweight' },
      { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Google\'s flagship model', popular: true },
      { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'Google', description: 'Most capable Gemini' },
      { id: 'grok-1', name: 'Grok', provider: 'xAI', description: 'Real-time knowledge' },
      { id: 'llama-2-70b', name: 'Llama 2 70B', provider: 'Meta', description: 'Open source powerhouse' },
      { id: 'llama-2-13b', name: 'Llama 2 13B', provider: 'Meta', description: 'Smaller Llama variant' },
      { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral AI', description: 'European AI excellence' },
      { id: 'mistral-medium', name: 'Mistral Medium', provider: 'Mistral AI', description: 'Balanced Mistral model' },
      { id: 'cohere-command', name: 'Command', provider: 'Cohere', description: 'Enterprise-focused model' },
      { id: 'cohere-command-r', name: 'Command R', provider: 'Cohere', description: 'RAG-optimized model' },
      { id: 'ollama-llama2', name: 'Llama 2 (Local)', provider: 'Ollama', description: 'Local deployment' },
      { id: 'ollama-mistral', name: 'Mistral (Local)', provider: 'Ollama', description: 'Local Mistral' },
      { id: 'groq-llama', name: 'Llama 2 70B', provider: 'Groq', description: 'Ultra-fast inference' },
      { id: 'groq-mixtral', name: 'Mixtral 8x7B', provider: 'Groq', description: 'Fast mixture of experts' },
      { id: 'notion-qa', name: 'Notion Q&A', provider: 'Notion', description: 'Workspace AI assistant' },
      { id: 'perplexity-pro', name: 'Perplexity', provider: 'Perplexity AI', description: 'Research-focused AI' },
      { id: 'notebooklm', name: 'NotebookLM', provider: 'Google', description: 'Document-based AI' }
    ]
  },
  {
    id: 'image',
    name: 'Image Generation',
    icon: FiImage,
    color: '#8b5cf6',
    models: [
      { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI', description: 'Latest image generation', popular: true },
      { id: 'dall-e-2', name: 'DALL-E 2', provider: 'OpenAI', description: 'Reliable image creation' },
      { id: 'midjourney-v6', name: 'Midjourney v6', provider: 'Midjourney', description: 'Artistic excellence', popular: true },
      { id: 'midjourney-v5', name: 'Midjourney v5', provider: 'Midjourney', description: 'Previous generation' },
      { id: 'canva-magic', name: 'Magic Design', provider: 'Canva', description: 'Design automation' },
      { id: 'looka-logo', name: 'Logo Maker', provider: 'Looka', description: 'AI logo generation' },
      { id: 'firefly', name: 'Firefly', provider: 'Adobe', description: 'Creative AI suite' },
      { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL', provider: 'Stability AI', description: 'Open source leader', popular: true },
      { id: 'stable-diffusion-2', name: 'Stable Diffusion 2.1', provider: 'Stability AI', description: 'Community favorite' },
      { id: 'dreamstudio', name: 'DreamStudio', provider: 'Stability AI', description: 'Web interface for SD' }
    ]
  },
  {
    id: 'audio',
    name: 'Voice & Audio',
    icon: FiMic,
    color: '#10b981',
    models: [
      { id: 'elevenlabs-v2', name: 'ElevenLabs v2', provider: 'ElevenLabs', description: 'Realistic voice cloning', popular: true },
      { id: 'elevenlabs-turbo', name: 'ElevenLabs Turbo', provider: 'ElevenLabs', description: 'Fast voice synthesis' },
      { id: 'murf-ai', name: 'Murf AI', provider: 'Murf', description: 'Professional voiceovers' },
      { id: 'descript-overdub', name: 'Overdub', provider: 'Descript', description: 'Voice editing magic' },
      { id: 'resemble-ai', name: 'Resemble AI', provider: 'Resemble', description: 'Custom voice creation' },
      { id: 'audiolm', name: 'AudioLM', provider: 'Google', description: 'Audio language modeling' },
      { id: 'azure-speech', name: 'Azure Speech', provider: 'Microsoft', description: 'Enterprise speech AI' }
    ]
  },
  {
    id: 'video',
    name: 'Video Generation',
    icon: FiVideo,
    color: '#f59e0b',
    models: [
      { id: 'synthesia', name: 'Synthesia', provider: 'Synthesia', description: 'AI avatar videos', popular: true },
      { id: 'google-veo', name: 'Veo', provider: 'Google', description: 'Advanced video generation' },
      { id: 'runway-gen2', name: 'Gen-2', provider: 'Runway', description: 'Creative video AI', popular: true },
      { id: 'runway-gen1', name: 'Gen-1', provider: 'Runway', description: 'Video-to-video synthesis' },
      { id: 'opusclip', name: 'OpusClip', provider: 'OpusClip', description: 'Short-form video creation' },
      { id: 'pictory', name: 'Pictory', provider: 'Pictory', description: 'Text-to-video platform' }
    ]
  },
  {
    id: 'automation',
    name: 'Automation & Agents',
    icon: FiSettings,
    color: '#ef4444',
    models: [
      { id: 'elvex', name: 'Elvex', provider: 'Elvex', description: 'Business process automation' },
      { id: 'iguazio', name: 'Iguazio', provider: 'Iguazio', description: 'MLOps platform' },
      { id: 'n8n-ai', name: 'n8n AI', provider: 'n8n', description: 'Workflow automation' },
      { id: 'manus-ai', name: 'Manus', provider: 'Manus', description: 'Document processing' },
      { id: 'aporia', name: 'Aporia', provider: 'Aporia', description: 'ML monitoring' },
      { id: 'zapier-ai', name: 'Zapier AI', provider: 'Zapier', description: 'App integration AI' },
      { id: 'salesforce-einstein', name: 'Einstein AI', provider: 'Salesforce', description: 'CRM intelligence', popular: true }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise & Cloud',
    icon: FiCloud,
    color: '#06b6d4',
    models: [
      { id: 'azure-openai', name: 'Azure OpenAI', provider: 'Microsoft', description: 'Enterprise GPT models', popular: true },
      { id: 'azure-cognitive', name: 'Cognitive Services', provider: 'Microsoft', description: 'AI service suite' },
      { id: 'ibm-watson', name: 'Watson', provider: 'IBM', description: 'Enterprise AI platform' },
      { id: 'aws-bedrock', name: 'Bedrock', provider: 'AWS', description: 'Foundation model service', popular: true },
      { id: 'aws-sagemaker', name: 'SageMaker', provider: 'AWS', description: 'ML platform' },
      { id: 'vertex-ai', name: 'Vertex AI', provider: 'Google Cloud', description: 'Unified ML platform' },
      { id: 'sap-hana', name: 'SAP HANA ML', provider: 'SAP', description: 'In-memory ML' },
      { id: 'databricks-ai', name: 'Databricks AI', provider: 'Databricks', description: 'Lakehouse AI' },
      { id: 'ambersearch', name: 'amberSearch', provider: 'amberSearch', description: 'Enterprise search AI' }
    ]
  }
];

const ModelSelector = () => {
  const { theme } = useTheme();
  const { selectedModel, setSelectedModel } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customModel, setCustomModel] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Find current model details
  const getCurrentModel = () => {
    for (const category of modelCategories) {
      const model = category.models.find(m => m.id === selectedModel);
      if (model) return { ...model, category: category.name, categoryColor: category.color };
    }
    // Return custom model or default
    return {
      id: selectedModel,
      name: selectedModel || 'Custom Model',
      provider: 'Custom',
      description: 'Custom or unknown model',
      category: 'Custom',
      categoryColor: '#6b7280'
    };
  };

  const currentModel = getCurrentModel();

  // Filter models based on search and category
  const getFilteredModels = () => {
    let filteredCategories = modelCategories;
    
    if (selectedCategory !== 'all') {
      filteredCategories = modelCategories.filter(cat => cat.id === selectedCategory);
    }

    if (!searchTerm) return filteredCategories;

    return filteredCategories.map(category => ({
      ...category,
      models: category.models.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.models.length > 0);
  };

  const filteredCategories = getFilteredModels();

  // Get popular models across all categories
  const getPopularModels = () => {
    const popular = [];
    modelCategories.forEach(category => {
      category.models.forEach(model => {
        if (model.popular) {
          popular.push({ ...model, category: category.name, categoryColor: category.color });
        }
      });
    });
    return popular;
  };

  const popularModels = getPopularModels();

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
    setIsOpen(false);
    setSearchTerm('');
    setShowCustomInput(false);
    setCustomModel('');
  };

  const handleCustomModelSubmit = () => {
    if (customModel.trim()) {
      setSelectedModel(customModel.trim());
      setIsOpen(false);
      setSearchTerm('');
      setShowCustomInput(false);
      setCustomModel('');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setShowCustomInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  return (
    <div className={`model-selector ${theme}`} ref={dropdownRef}>
      <div className="model-selector-header">
        <span className="model-selector-label">AI Model</span>
      </div>
      
      <div className="model-dropdown">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="model-trigger"
        >
          <div className="model-info">
            <div 
              className="model-icon" 
              style={{ color: currentModel.categoryColor }}
            >
              <SafeIcon icon={FiBrain} />
            </div>
            <div className="model-details">
              <div className="model-name">{currentModel.name}</div>
              <div className="model-provider">{currentModel.provider}</div>
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
              className="model-dropdown-menu mega-selector"
            >
              {/* Search and Filter Header */}
              <div className="mega-selector-header">
                <div className="search-container">
                  <SafeIcon icon={FiSearch} className="search-icon" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="clear-search"
                    >
                      <SafeIcon icon={FiX} />
                    </button>
                  )}
                </div>
                
                <div className="category-filters">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`category-filter ${selectedCategory === 'all' ? 'active' : ''}`}
                  >
                    All
                  </button>
                  {modelCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                      style={{ 
                        '--category-color': category.color,
                        color: selectedCategory === category.id ? category.color : 'inherit'
                      }}
                    >
                      <SafeIcon icon={category.icon} />
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mega-selector-content">
                {/* Popular Models Section */}
                {!searchTerm && selectedCategory === 'all' && (
                  <div className="popular-section">
                    <div className="section-header">
                      <SafeIcon icon={FiStar} />
                      <span>Popular Models</span>
                    </div>
                    <div className="popular-models">
                      {popularModels.slice(0, 6).map(model => (
                        <motion.button
                          key={model.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleModelSelect(model.id)}
                          className={`popular-model ${selectedModel === model.id ? 'selected' : ''}`}
                        >
                          <div 
                            className="popular-model-icon"
                            style={{ backgroundColor: model.categoryColor }}
                          >
                            <SafeIcon icon={FiTrendingUp} />
                          </div>
                          <div className="popular-model-info">
                            <div className="popular-model-name">{model.name}</div>
                            <div className="popular-model-provider">{model.provider}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model Categories */}
                <div className="model-categories">
                  {filteredCategories.map(category => (
                    <div key={category.id} className="model-category">
                      <div className="category-header">
                        <div 
                          className="category-icon"
                          style={{ color: category.color }}
                        >
                          <SafeIcon icon={category.icon} />
                        </div>
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">({category.models.length})</span>
                      </div>
                      
                      <div className="category-models">
                        {category.models.map(model => (
                          <motion.button
                            key={model.id}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleModelSelect(model.id)}
                            className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
                          >
                            <div className="model-option-main">
                              <div className="model-option-info">
                                <div className="model-option-name">
                                  {model.name}
                                  {model.popular && (
                                    <SafeIcon icon={FiStar} className="popular-star" />
                                  )}
                                </div>
                                <div className="model-option-provider">{model.provider}</div>
                                <div className="model-option-description">{model.description}</div>
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
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {filteredCategories.length === 0 && searchTerm && (
                  <div className="no-results">
                    <div className="no-results-icon">
                      <SafeIcon icon={FiSearch} />
                    </div>
                    <div className="no-results-text">
                      <p>No models found for "{searchTerm}"</p>
                      <button
                        onClick={() => setShowCustomInput(true)}
                        className="custom-model-btn"
                      >
                        Use "{searchTerm}" as custom model
                      </button>
                    </div>
                  </div>
                )}

                {/* Custom Model Input */}
                {showCustomInput && (
                  <div className="custom-model-section">
                    <div className="section-header">
                      <SafeIcon icon={FiSettings} />
                      <span>Custom Model</span>
                    </div>
                    <div className="custom-model-input">
                      <input
                        type="text"
                        placeholder="Enter custom model name..."
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCustomModelSubmit()}
                        className="custom-input"
                        autoFocus
                      />
                      <div className="custom-actions">
                        <button
                          onClick={handleCustomModelSubmit}
                          className="custom-submit"
                          disabled={!customModel.trim()}
                        >
                          Use Model
                        </button>
                        <button
                          onClick={() => setShowCustomInput(false)}
                          className="custom-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mega-selector-footer">
                <button
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="footer-action"
                >
                  <SafeIcon icon={FiSettings} />
                  Custom Model
                </button>
                <div className="model-count">
                  {modelCategories.reduce((acc, cat) => acc + cat.models.length, 0)} models available
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModelSelector;