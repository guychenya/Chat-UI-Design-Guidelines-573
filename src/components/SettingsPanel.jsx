import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import Dashboard from './Dashboard';
import { testApiConnection } from '../services/apiService';
import './SettingsPanel.css';

const {
  FiX, FiUser, FiGlobe, FiEye, FiSliders, FiBell, FiLock,
  FiSun, FiMoon, FiMonitor, FiBarChart2, FiKey, FiCheck,
  FiAlertTriangle, FiPlus, FiTrash2, FiEdit2, FiRefreshCw
} = FiIcons;

const SettingsPanel = ({ onClose, isMainView = false }) => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, updateModelParameter, resetSettings, updateApiKey, removeApiKey, setDefaultProvider } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newApiKeyValue, setNewApiKeyValue] = useState('');
  const [editingKeyId, setEditingKeyId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({});

  // Sync font size with body class when settings change
  useEffect(() => {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${settings.fontSize}`);
  }, [settings.fontSize]);

  const tabs = [
    { id: 'general', icon: FiSliders, label: 'General' },
    { id: 'appearance', icon: FiEye, label: 'Appearance' },
    { id: 'privacy', icon: FiLock, label: 'Privacy' },
    { id: 'notifications', icon: FiBell, label: 'Notifications' },
    { id: 'advanced', icon: FiGlobe, label: 'Advanced' },
    { id: 'apikeys', icon: FiKey, label: 'API Keys' },
  ];

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings();
    }
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    
    if (!newApiKeyName || !newApiKeyValue) return;
    
    if (editingKeyId) {
      updateApiKey(editingKeyId, {
        name: newApiKeyName,
        value: newApiKeyValue,
        provider: newApiKeyName.toLowerCase()
      });
      setEditingKeyId(null);
    } else {
      updateApiKey(Date.now().toString(), {
        name: newApiKeyName,
        value: newApiKeyValue,
        provider: newApiKeyName.toLowerCase()
      });
    }
    
    setNewApiKeyName('');
    setNewApiKeyValue('');
  };

  const handleEditApiKey = (id, name, value) => {
    setEditingKeyId(id);
    setNewApiKeyName(name);
    setNewApiKeyValue(value);
  };

  const handleDeleteApiKey = (id) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      removeApiKey(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingKeyId(null);
    setNewApiKeyName('');
    setNewApiKeyValue('');
  };

  const testConnection = async (keyId, provider) => {
    setConnectionStatus(prev => ({
      ...prev,
      [keyId]: 'testing'
    }));
    
    try {
      // Get the API key from settings
      const apiKey = settings.apiKeys[keyId].value;
      
      // Call the test connection function
      const result = await testApiConnection(provider, apiKey);
      
      setConnectionStatus(prev => ({
        ...prev,
        [keyId]: result.success ? 'connected' : 'error'
      }));
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setConnectionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[keyId];
          return newStatus;
        });
      }, 3000);
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        [keyId]: 'error'
      }));
      
      // Clear error status after 3 seconds
      setTimeout(() => {
        setConnectionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[keyId];
          return newStatus;
        });
      }, 3000);
    }
  };

  const handleSetDefault = (id) => {
    setDefaultProvider(id);
  };

  const containerClassName = isMainView ? `settings-panel-main ${theme}` : `settings-panel ${theme}`;

  return (
    <div className={containerClassName}>
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        {!isMainView && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="close-btn"
          >
            <SafeIcon icon={FiX} />
          </motion.button>
        )}
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <SafeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-body">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Auto-scroll to bottom</div>
                  <div className="setting-description">Automatically scroll to the latest message</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoScrollToBottom}
                    onChange={(e) => updateSettings({ autoScrollToBottom: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Send on Enter</div>
                  <div className="setting-description">Press Enter to send message (Shift+Enter for new line)</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.sendOnEnter}
                    onChange={(e) => updateSettings({ sendOnEnter: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Show timestamps</div>
                  <div className="setting-description">Display time for each message</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.showTimestamps}
                    onChange={(e) => updateSettings({ showTimestamps: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item action" style={{ marginTop: '1.5rem' }}>
                <button className="danger-button" onClick={handleResetSettings}>
                  Reset All Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance</h3>
              <div className="setting-item vertical">
                <div className="setting-label">Theme</div>
                <div className="theme-options">
                  <button
                    className={`theme-option ${theme === 'light' ? 'selected' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <SafeIcon icon={FiSun} />
                    <span>Light</span>
                  </button>
                  <button
                    className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <SafeIcon icon={FiMoon} />
                    <span>Dark</span>
                  </button>
                  <button
                    className={`theme-option ${theme === 'system' ? 'selected' : ''}`}
                    onClick={() => handleThemeChange('system')}
                  >
                    <SafeIcon icon={FiMonitor} />
                    <span>System</span>
                  </button>
                </div>
              </div>

              <div className="setting-item vertical">
                <div className="setting-label">Font Size</div>
                <div className="select-wrapper">
                  <select
                    value={settings.fontSize}
                    onChange={(e) => updateSettings({ fontSize: e.target.value })}
                    className="settings-select"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              <div className="setting-item vertical">
                <div className="setting-label">Message Density</div>
                <div className="select-wrapper">
                  <select
                    value={settings.messageDensity}
                    onChange={(e) => updateSettings({ messageDensity: e.target.value })}
                    className="settings-select"
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Use animations</div>
                  <div className="setting-description">Enable animations throughout the interface</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.useAnimations}
                    onChange={(e) => updateSettings({ useAnimations: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h3>Privacy Settings</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Save chat history</div>
                  <div className="setting-description">Store conversations locally</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.saveHistory}
                    onChange={(e) => updateSettings({ saveHistory: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Share anonymous data</div>
                  <div className="setting-description">Help improve the service with anonymous usage data</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.shareAnonymousData}
                    onChange={(e) => updateSettings({ shareAnonymousData: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item action">
                <button className="danger-button">
                  Delete All Conversations
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notifications</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Enable notifications</div>
                  <div className="setting-description">Get notified about new messages</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) => updateSettings({ enableNotifications: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Notification sounds</div>
                  <div className="setting-description">Play sound when receiving new messages</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notificationSound}
                    onChange={(e) => updateSettings({ notificationSound: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Desktop notifications</div>
                  <div className="setting-description">Show desktop notifications when app is in background</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.desktopNotifications}
                    onChange={(e) => updateSettings({ desktopNotifications: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="settings-section">
              <h3>Advanced Settings</h3>
              <div className="setting-item vertical">
                <div className="setting-label">API Endpoint</div>
                <input
                  type="text"
                  value={settings.apiEndpoint}
                  onChange={(e) => updateSettings({ apiEndpoint: e.target.value })}
                  className="settings-input"
                  placeholder="https://api.example.com/v1"
                />
              </div>

              <h4>Model Parameters</h4>
              <div className="setting-item vertical">
                <div className="setting-info">
                  <div className="setting-label">Temperature: {settings.modelParameters.temperature}</div>
                  <div className="setting-description">Controls randomness (0=deterministic, 1=creative)</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.modelParameters.temperature}
                  onChange={(e) => updateModelParameter('temperature', parseFloat(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="setting-item vertical">
                <div className="setting-info">
                  <div className="setting-label">Top P: {settings.modelParameters.topP}</div>
                  <div className="setting-description">Controls diversity of responses</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.modelParameters.topP}
                  onChange={(e) => updateModelParameter('topP', parseFloat(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="setting-item vertical">
                <div className="setting-info">
                  <div className="setting-label">Max Tokens: {settings.modelParameters.maxTokens}</div>
                  <div className="setting-description">Maximum length of generated responses</div>
                </div>
                <input
                  type="range"
                  min="256"
                  max="4096"
                  step="256"
                  value={settings.modelParameters.maxTokens}
                  onChange={(e) => updateModelParameter('maxTokens', parseInt(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Stream responses</div>
                  <div className="setting-description">Show responses as they are being generated</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.streamResponses}
                    onChange={(e) => updateSettings({ streamResponses: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'apikeys' && (
            <div className="settings-section">
              <h3>API Keys Management</h3>
              
              <div className="api-keys-description">
                <p>Manage your API keys for different AI providers. Set a default provider for your chats.</p>
                <div className="provider-info-box">
                  <h4>Supported Providers</h4>
                  <ul className="provider-list">
                    <li><strong>OpenAI</strong> - For ChatGPT and GPT-4</li>
                    <li><strong>Anthropic</strong> - For Claude models</li>
                    <li><strong>Gemini</strong> - Google's AI models</li>
                    <li><strong>Ollama</strong> - Local open-source models</li>
                    <li><strong>Groq</strong> - Fast inference API</li>
                    <li><strong>Mistral</strong> - Mistral AI models</li>
                    <li><strong>Supabase</strong> - For Supabase AI integration (format: projectUrl|anonKey)</li>
                  </ul>
                </div>
              </div>

              <form onSubmit={handleApiKeySubmit} className="api-key-form">
                <div className="setting-item vertical">
                  <div className="setting-label">{editingKeyId ? 'Edit' : 'Add'} API Key</div>
                  <input
                    type="text"
                    value={newApiKeyName}
                    onChange={(e) => setNewApiKeyName(e.target.value)}
                    className="settings-input"
                    placeholder="Provider Name (OpenAI, Claude, Gemini, etc.)"
                    required
                  />
                  <div className="api-key-input-wrapper">
                    <input
                      type="password"
                      value={newApiKeyValue}
                      onChange={(e) => setNewApiKeyValue(e.target.value)}
                      className="settings-input"
                      placeholder="API Key Value"
                      required
                    />
                  </div>
                  <div className="api-key-actions">
                    <button type="submit" className="api-key-button primary">
                      {editingKeyId ? 'Update Key' : 'Add Key'}
                    </button>
                    {editingKeyId && (
                      <button 
                        type="button" 
                        className="api-key-button secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>

              <h4>Saved API Keys</h4>
              {settings.apiKeys && Object.keys(settings.apiKeys).length > 0 ? (
                <div className="api-keys-list">
                  {Object.entries(settings.apiKeys).map(([id, keyData]) => (
                    <div key={id} className="api-key-item">
                      <div className="api-key-info">
                        <div className="api-key-provider">
                          {keyData.name}
                          {settings.defaultProviderId === id && (
                            <span className="default-badge">Default</span>
                          )}
                        </div>
                        <div className="api-key-value">••••••••••••{keyData.value.slice(-4)}</div>
                      </div>
                      <div className="api-key-item-actions">
                        <div className="connection-status">
                          {connectionStatus[id] === 'testing' && (
                            <span className="status testing">Testing...</span>
                          )}
                          {connectionStatus[id] === 'connected' && (
                            <span className="status connected">
                              <SafeIcon icon={FiCheck} /> Connected
                            </span>
                          )}
                          {connectionStatus[id] === 'error' && (
                            <span className="status error">
                              <SafeIcon icon={FiAlertTriangle} /> Error
                            </span>
                          )}
                        </div>
                        <button 
                          className="api-key-action-btn"
                          onClick={() => testConnection(id, keyData.provider || keyData.name.toLowerCase())}
                          title="Test connection"
                        >
                          <SafeIcon icon={FiRefreshCw} />
                        </button>
                        <button 
                          className="api-key-action-btn"
                          onClick={() => handleEditApiKey(id, keyData.name, keyData.value)}
                          title="Edit"
                        >
                          <SafeIcon icon={FiEdit2} />
                        </button>
                        <button 
                          className="api-key-action-btn delete"
                          onClick={() => handleDeleteApiKey(id)}
                          title="Delete"
                        >
                          <SafeIcon icon={FiTrash2} />
                        </button>
                        {settings.defaultProviderId !== id && (
                          <button 
                            className="api-key-action-btn set-default"
                            onClick={() => handleSetDefault(id)}
                            title="Set as default"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-keys-message">
                  No API keys added yet. Add your first key above.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;