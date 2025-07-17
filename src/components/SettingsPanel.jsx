import React,{useState,useEffect} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useTheme} from '../contexts/ThemeContext';
import {useSettings} from '../contexts/SettingsContext';
import Dashboard from './Dashboard';
import {testApiConnection} from '../services/apiService';
import './SettingsPanel.css';

const {FiX,FiUser,FiGlobe,FiEye,FiSliders,FiBell,FiLock,FiSun,FiMoon,FiMonitor,FiBarChart2,FiKey,FiCheck,FiAlertTriangle,FiPlus,FiTrash2,FiEdit2,FiRefreshCw,FiChevronDown,FiChevronUp,FiMoreHorizontal,FiStar}=FiIcons;

// Provider definitions with icons and colors
const providers=[
  {id: 'openai',name: 'OpenAI',color: '#00a67e',description: 'For ChatGPT and GPT-4 models'},
  {id: 'anthropic',name: 'Anthropic',color: '#ff6b35',description: 'For Claude models'},
  {id: 'gemini',name: 'Gemini',color: '#4285f4',description: 'Google\'s AI models'},
  {id: 'ollama',name: 'Ollama',color: '#7c3aed',description: 'Local open-source models'},
  {id: 'groq',name: 'Groq',color: '#e84142',description: 'Fast inference API'},
  {id: 'mistral',name: 'Mistral',color: '#5f9ea0',description: 'Mistral AI models'},
  {id: 'supabase',name: 'Supabase',color: '#3ecf8e',description: 'Format: projectUrl|anonKey'}
];

const SettingsPanel=({onClose,isMainView=false})=> {
  const {theme}=useTheme();
  const {settings,updateSettings,updateModelParameter,resetSettings,updateApiKey,removeApiKey,setDefaultProvider}=useSettings();
  const [activeTab,setActiveTab]=useState('general');
  const [newApiKeyName,setNewApiKeyName]=useState('');
  const [newApiKeyValue,setNewApiKeyValue]=useState('');
  const [editingKeyId,setEditingKeyId]=useState(null);
  const [connectionStatus,setConnectionStatus]=useState({});
  const [expandedProvider,setExpandedProvider]=useState(null);
  const [showAddForm,setShowAddForm]=useState(false);
  const [notification,setNotification]=useState(null);

  // Map of provider IDs to their keys
  const [providerKeys,setProviderKeys]=useState({});

  // Organize keys by provider
  useEffect(()=> {
    if (settings.apiKeys) {
      const keysByProvider={};
      // Initialize all providers with empty arrays
      providers.forEach(provider=> {
        keysByProvider[provider.id]=[];
      });

      // Group keys by provider
      Object.entries(settings.apiKeys).forEach(([id,keyData])=> {
        const providerId=(keyData.provider || keyData.name || '').toLowerCase();
        if (keysByProvider[providerId]) {
          keysByProvider[providerId].push({
            id,
            ...keyData,
            isDefault: settings.defaultProviderId===id
          });
        } else {
          // For unknown providers
          if (!keysByProvider.other) keysByProvider.other=[];
          keysByProvider.other.push({
            id,
            ...keyData,
            isDefault: settings.defaultProviderId===id
          });
        }
      });

      setProviderKeys(keysByProvider);
    }
  },[settings.apiKeys,settings.defaultProviderId]);

  // Show notification
  const showNotification=(message,type='success')=> {
    setNotification({message,type});
    setTimeout(()=> setNotification(null),3000);
  };

  // Sync font size with body class when settings change
  useEffect(()=> {
    document.body.classList.remove('font-small','font-medium','font-large');
    document.body.classList.add(`font-${settings.fontSize}`);
  },[settings.fontSize]);

  const tabs=[
    {id: 'general',icon: FiSliders,label: 'General'},
    {id: 'appearance',icon: FiEye,label: 'Appearance'},
    {id: 'privacy',icon: FiLock,label: 'Privacy'},
    {id: 'notifications',icon: FiBell,label: 'Notifications'},
    {id: 'advanced',icon: FiGlobe,label: 'Advanced'},
    {id: 'apikeys',icon: FiKey,label: 'API Keys'},
  ];

  const handleThemeChange=(newTheme)=> {
    // Since we're using ThemeContext, we need to call setTheme from context
    // This is a simplified version - in practice you'd get setTheme from context
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleResetSettings=()=> {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings();
    }
  };

  const handleApiKeySubmit=(e)=> {
    e.preventDefault();
    if (!newApiKeyName || !newApiKeyValue) return;

    if (editingKeyId) {
      updateApiKey(editingKeyId,{
        name: newApiKeyName,
        value: newApiKeyValue,
        provider: newApiKeyName.toLowerCase()
      });
      setEditingKeyId(null);
      showNotification(`API key for ${newApiKeyName} updated successfully`);
    } else {
      const newKeyId=Date.now().toString();
      updateApiKey(newKeyId,{
        name: newApiKeyName,
        value: newApiKeyValue,
        provider: newApiKeyName.toLowerCase()
      });
      showNotification(`API key for ${newApiKeyName} added successfully`);
    }

    setNewApiKeyName('');
    setNewApiKeyValue('');
    setShowAddForm(false);
  };

  const handleEditApiKey=(id,name,value)=> {
    setEditingKeyId(id);
    setNewApiKeyName(name);
    setNewApiKeyValue(value);
    setShowAddForm(true);
  };

  const handleDeleteApiKey=(id,name)=> {
    if (window.confirm(`Are you sure you want to delete this ${name} API key?`)) {
      removeApiKey(id);
      showNotification(`API key for ${name} deleted`,'error');
    }
  };

  const handleCancelEdit=()=> {
    setEditingKeyId(null);
    setNewApiKeyName('');
    setNewApiKeyValue('');
    setShowAddForm(false);
  };

  const testConnection=async (keyId,provider,name)=> {
    setConnectionStatus(prev=> ({...prev,[keyId]: 'testing'}));
    
    try {
      // Get the API key from settings
      const apiKey=settings.apiKeys[keyId].value;
      
      // Call the test connection function
      const result=await testApiConnection(provider,apiKey);
      
      setConnectionStatus(prev=> ({...prev,[keyId]: result.success ? 'connected' : 'error'}));
      
      showNotification(
        result.success 
          ? `Successfully connected to ${name}` 
          : `Failed to connect to ${name}: ${result.message || 'Unknown error'}`,
        result.success ? 'success' : 'error'
      );

      // Clear status after 5 seconds
      setTimeout(()=> {
        setConnectionStatus(prev=> {
          const newStatus={...prev};
          delete newStatus[keyId];
          return newStatus;
        });
      },5000);

    } catch (error) {
      setConnectionStatus(prev=> ({...prev,[keyId]: 'error'}));
      showNotification(`Connection error with ${name}: ${error.message || 'Unknown error'}`,'error');
      
      // Clear error status after 5 seconds
      setTimeout(()=> {
        setConnectionStatus(prev=> {
          const newStatus={...prev};
          delete newStatus[keyId];
          return newStatus;
        });
      },5000);
    }
  };

  const handleSetDefault=(id,name)=> {
    setDefaultProvider(id);
    showNotification(`${name} set as default provider`);
  };

  const toggleProviderExpand=(providerId)=> {
    setExpandedProvider(expandedProvider===providerId ? null : providerId);
  };

  const containerClassName=isMainView ? `settings-panel-main ${theme}` : `settings-panel ${theme}`;

  const getProviderLogo=(providerId)=> {
    // You could replace this with actual provider logos
    return (
      <div 
        className="provider-logo" 
        style={{
          backgroundColor: providers.find(p=> p.id===providerId)?.color || '#6b7280',
          color: 'white'
        }}
      >
        {providerId.substring(0,1).toUpperCase()}
      </div>
    );
  };

  return (
    <div className={containerClassName}>
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        {onClose && (
          <motion.button
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.9}}
            onClick={onClose}
            className="close-btn"
          >
            <SafeIcon icon={FiX} />
          </motion.button>
        )}
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          {tabs.map(tab=> (
            <button
              key={tab.id}
              onClick={()=> setActiveTab(tab.id)}
              className={`settings-tab ${activeTab===tab.id ? 'active' : ''}`}
            >
              <SafeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-body">
          {/* Notification system */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{opacity: 0,y: -20}}
                animate={{opacity: 1,y: 0}}
                exit={{opacity: 0,y: -20}}
                className={`notification ${notification.type}`}
              >
                <SafeIcon 
                  icon={notification.type==='success' ? FiCheck : FiAlertTriangle} 
                  className="notification-icon" 
                />
                <span>{notification.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab==='general' && (
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
                    onChange={(e)=> updateSettings({autoScrollToBottom: e.target.checked})}
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
                    onChange={(e)=> updateSettings({sendOnEnter: e.target.checked})}
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
                    onChange={(e)=> updateSettings({showTimestamps: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item action" style={{marginTop: '1.5rem'}}>
                <button className="danger-button" onClick={handleResetSettings}>
                  Reset All Settings
                </button>
              </div>
            </div>
          )}

          {activeTab==='appearance' && (
            <div className="settings-section">
              <h3>Appearance</h3>

              <div className="setting-item vertical">
                <div className="setting-label">Font Size</div>
                <div className="select-wrapper">
                  <select
                    value={settings.fontSize}
                    onChange={(e)=> updateSettings({fontSize: e.target.value})}
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
                    onChange={(e)=> updateSettings({messageDensity: e.target.value})}
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
                    onChange={(e)=> updateSettings({useAnimations: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab==='privacy' && (
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
                    onChange={(e)=> updateSettings({saveHistory: e.target.checked})}
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
                    onChange={(e)=> updateSettings({shareAnonymousData: e.target.checked})}
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

          {activeTab==='notifications' && (
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
                    onChange={(e)=> updateSettings({enableNotifications: e.target.checked})}
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
                    onChange={(e)=> updateSettings({notificationSound: e.target.checked})}
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
                    onChange={(e)=> updateSettings({desktopNotifications: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab==='advanced' && (
            <div className="settings-section">
              <h3>Advanced Settings</h3>

              <div className="setting-item vertical">
                <div className="setting-label">API Endpoint</div>
                <input
                  type="text"
                  value={settings.apiEndpoint}
                  onChange={(e)=> updateSettings({apiEndpoint: e.target.value})}
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
                  onChange={(e)=> updateModelParameter('temperature',parseFloat(e.target.value))}
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
                  onChange={(e)=> updateModelParameter('topP',parseFloat(e.target.value))}
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
                  onChange={(e)=> updateModelParameter('maxTokens',parseInt(e.target.value))}
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
                    onChange={(e)=> updateSettings({streamResponses: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab==='apikeys' && (
            <div className="settings-section">
              <h3>API Keys Management</h3>
              
              <div className="api-keys-description">
                <p>Manage your API keys for different AI providers. Set a default provider for your chats.</p>
              </div>

              {/* Add new key button */}
              <div className="api-key-actions-top">
                <button
                  className="api-key-button primary"
                  onClick={()=> {
                    setShowAddForm(!showAddForm);
                    if (editingKeyId) {
                      setEditingKeyId(null);
                      setNewApiKeyName('');
                      setNewApiKeyValue('');
                    }
                  }}
                >
                  <SafeIcon icon={showAddForm ? FiX : FiPlus} />
                  {showAddForm ? 'Cancel' : 'Add New API Key'}
                </button>
              </div>

              {/* Add/Edit form */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{opacity: 0,height: 0}}
                    animate={{opacity: 1,height: 'auto'}}
                    exit={{opacity: 0,height: 0}}
                    transition={{duration: 0.3}}
                  >
                    <form onSubmit={handleApiKeySubmit} className="api-key-form">
                      <div className="setting-item vertical">
                        <div className="setting-label">{editingKeyId ? 'Edit' : 'Add'} API Key</div>
                        <div className="select-wrapper">
                          <select
                            value={newApiKeyName}
                            onChange={(e)=> setNewApiKeyName(e.target.value)}
                            className="settings-select"
                            required
                          >
                            <option value="">Select Provider</option>
                            {providers.map(provider=> (
                              <option key={provider.id} value={provider.name}>
                                {provider.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="api-key-input-wrapper">
                          <input
                            type="password"
                            value={newApiKeyValue}
                            onChange={(e)=> setNewApiKeyValue(e.target.value)}
                            className="settings-input"
                            placeholder={`Enter ${newApiKeyName || 'provider'} API Key`}
                            required
                          />
                          {newApiKeyName.toLowerCase()==='supabase' && (
                            <div className="api-key-format-help">
                              Format: projectUrl|anonKey
                            </div>
                          )}
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
                  </motion.div>
                )}
              </AnimatePresence>

              <h4>Provider API Keys</h4>

              <div className="providers-list">
                {providers.map(provider=> {
                  const providerKeysList=providerKeys[provider.id] || [];
                  const hasKeys=providerKeysList.length > 0;
                  const isExpanded=expandedProvider===provider.id;

                  return (
                    <div
                      key={provider.id}
                      className={`provider-item ${hasKeys ? 'has-keys' : ''} ${isExpanded ? 'expanded' : ''}`}
                    >
                      <div
                        className="provider-header"
                        onClick={()=> hasKeys && toggleProviderExpand(provider.id)}
                      >
                        <div className="provider-info">
                          <div className="provider-logo" style={{backgroundColor: provider.color}}>
                            {provider.id.substring(0,1).toUpperCase()}
                          </div>
                          <div className="provider-details">
                            <div className="provider-name">{provider.name}</div>
                            <div className="provider-description">{provider.description}</div>
                          </div>
                        </div>
                        
                        <div className="provider-summary">
                          {hasKeys ? (
                            <>
                              <span className="key-count">
                                {providerKeysList.length} key{providerKeysList.length !== 1 ? 's' : ''}
                              </span>
                              {providerKeysList.some(key=> key.isDefault) && (
                                <span className="default-provider-badge">
                                  <SafeIcon icon={FiStar} />
                                  Default
                                </span>
                              )}
                              <SafeIcon 
                                icon={isExpanded ? FiChevronUp : FiChevronDown} 
                                className="expand-icon" 
                              />
                            </>
                          ) : (
                            <button
                              className="add-key-button"
                              onClick={(e)=> {
                                e.stopPropagation();
                                setNewApiKeyName(provider.name);
                                setShowAddForm(true);
                              }}
                            >
                              <SafeIcon icon={FiPlus} />
                              Add Key
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{opacity: 0,height: 0}}
                            animate={{opacity: 1,height: 'auto'}}
                            exit={{opacity: 0,height: 0}}
                            transition={{duration: 0.3}}
                            className="provider-keys"
                          >
                            {providerKeysList.map((keyData)=> (
                              <div key={keyData.id} className="api-key-item">
                                <div className="api-key-info">
                                  <div className="key-label">API Key</div>
                                  <div className="api-key-value">
                                    ••••••••••••{keyData.value.slice(-4)}
                                  </div>
                                </div>
                                
                                <div className="api-key-actions-container">
                                  <div className="connection-status">
                                    {connectionStatus[keyData.id]==='testing' && (
                                      <span className="status testing">Testing...</span>
                                    )}
                                    {connectionStatus[keyData.id]==='connected' && (
                                      <span className="status connected">
                                        <SafeIcon icon={FiCheck} />
                                        Connected
                                      </span>
                                    )}
                                    {connectionStatus[keyData.id]==='error' && (
                                      <span className="status error">
                                        <SafeIcon icon={FiAlertTriangle} />
                                        Error
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="api-key-buttons">
                                    {/* Primary actions */}
                                    {!keyData.isDefault && (
                                      <button
                                        className="api-key-action-btn set-default"
                                        onClick={()=> handleSetDefault(keyData.id,keyData.name)}
                                        title="Set as default provider"
                                      >
                                        <SafeIcon icon={FiStar} />
                                        Set Default
                                      </button>
                                    )}
                                    
                                    <button
                                      className="api-key-action-btn"
                                      onClick={()=> testConnection(keyData.id,keyData.provider || provider.id,keyData.name)}
                                      title="Test connection"
                                    >
                                      <SafeIcon icon={FiRefreshCw} />
                                      Test
                                    </button>
                                    
                                    {/* Dropdown for more actions */}
                                    <div className="more-actions-dropdown">
                                      <button className="more-actions-btn">
                                        <SafeIcon icon={FiMoreHorizontal} />
                                      </button>
                                      <div className="more-actions-menu">
                                        <button
                                          onClick={()=> handleEditApiKey(keyData.id,keyData.name,keyData.value)}
                                          className="more-action-item"
                                        >
                                          <SafeIcon icon={FiEdit2} />
                                          Edit
                                        </button>
                                        <button
                                          onClick={()=> handleDeleteApiKey(keyData.id,keyData.name)}
                                          className="more-action-item delete"
                                        >
                                          <SafeIcon icon={FiTrash2} />
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Show message if no keys */}
                {Object.values(providerKeys).flat().length===0 && (
                  <div className="no-keys-message">
                    <SafeIcon icon={FiKey} className="no-keys-icon" />
                    <p>No API keys added yet</p>
                    <p className="no-keys-help">Add your first API key using the button above</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;