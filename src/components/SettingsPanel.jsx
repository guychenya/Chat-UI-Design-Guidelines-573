import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import Dashboard from './Dashboard';
import './SettingsPanel.css';

const {
  FiX,
  FiUser,
  FiGlobe,
  FiEye,
  FiSliders,
  FiBell,
  FiLock,
  FiSun,
  FiMoon,
  FiMonitor,
  FiBarChart2
} = FiIcons;

const SettingsPanel = ({ onClose }) => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, updateModelParameter, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('dashboard'); // Default to dashboard
  
  // Sync font size with body class when settings change
  useEffect(() => {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${settings.fontSize}`);
  }, [settings.fontSize]);

  const tabs = [
    { id: 'dashboard', icon: FiBarChart2, label: 'Dashboard' },
    { id: 'general', icon: FiSliders, label: 'General' },
    { id: 'appearance', icon: FiEye, label: 'Appearance' },
    { id: 'privacy', icon: FiLock, label: 'Privacy' },
    { id: 'notifications', icon: FiBell, label: 'Notifications' },
    { id: 'advanced', icon: FiGlobe, label: 'Advanced' },
  ];

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };
  
  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings();
    }
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`settings-panel ${theme}`}
    >
      <div className="settings-header">
        <h2 className="settings-title">{activeTab === 'dashboard' ? 'Dashboard' : 'Settings'}</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="close-btn"
        >
          <SafeIcon icon={FiX} />
        </motion.button>
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
          {activeTab === 'dashboard' && (
            <Dashboard inPanel={true} />
          )}

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
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPanel;