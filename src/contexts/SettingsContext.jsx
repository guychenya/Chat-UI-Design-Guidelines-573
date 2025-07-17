import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  // Load settings from localStorage if available
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      return savedSettings ? JSON.parse(savedSettings) : null;
    } catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
  };

  const defaultSettings = {
    // General settings
    autoScrollToBottom: true,
    sendOnEnter: true,
    showTimestamps: true,
    
    // Appearance
    fontSize: 'medium', // small, medium, large
    messageDensity: 'comfortable', // compact, comfortable, spacious
    useAnimations: true,
    
    // Privacy
    saveHistory: true,
    shareAnonymousData: false,
    
    // Notifications
    enableNotifications: true,
    notificationSound: true,
    desktopNotifications: false,
    
    // Advanced
    apiEndpoint: 'https://api.example.com/v1',
    streamResponses: true,
    modelParameters: {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048
    },
    
    // API Keys
    apiKeys: {},
    defaultProviderId: null
  };

  const [settings, setSettings] = useState(() => {
    const savedSettings = loadSettings();
    return savedSettings || defaultSettings;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  // Apply message density class to the body
  useEffect(() => {
    document.body.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
    document.body.classList.add(`density-${settings.messageDensity}`);
  }, [settings.messageDensity]);

  // Apply font size to the document root and add a class for component-specific styling
  useEffect(() => {
    const fontSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px'
    };
    
    // Apply to root element for inheritance
    document.documentElement.style.fontSize = fontSizeMap[settings.fontSize] || '16px';
    
    // Add class to body for component-specific overrides
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${settings.fontSize}`);
  }, [settings.fontSize]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateModelParameter = (param, value) => {
    setSettings(prev => ({
      ...prev,
      modelParameters: {
        ...prev.modelParameters,
        [param]: value
      }
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // API Keys Management
  const updateApiKey = (id, keyData) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [id]: keyData
      },
      defaultProviderId: prev.defaultProviderId || id // Set as default if none is set
    }));
  };

  const removeApiKey = (id) => {
    setSettings(prev => {
      const newApiKeys = { ...prev.apiKeys };
      delete newApiKeys[id];
      
      // If we're removing the default provider, set a new default if possible
      let newDefaultProvider = prev.defaultProviderId;
      if (newDefaultProvider === id) {
        const remainingKeys = Object.keys(newApiKeys);
        newDefaultProvider = remainingKeys.length > 0 ? remainingKeys[0] : null;
      }
      
      return {
        ...prev,
        apiKeys: newApiKeys,
        defaultProviderId: newDefaultProvider
      };
    });
  };

  const setDefaultProvider = (id) => {
    setSettings(prev => ({
      ...prev,
      defaultProviderId: id
    }));
  };

  return (
    <SettingsContext.Provider 
      value={{
        settings,
        updateSettings,
        updateModelParameter,
        resetSettings,
        updateApiKey,
        removeApiKey,
        setDefaultProvider
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};