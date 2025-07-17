import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // General settings
    autoScrollToBottom: true,
    sendOnEnter: true,
    showTimestamps: true,
    
    // Appearance
    fontSize: 'medium', // small, medium, large
    messageDensity: 'comfortable', // compact, comfortable, spacious
    
    // Privacy
    saveHistory: true,
    shareAnonymousData: false,
    
    // Notifications
    enableNotifications: true,
    notificationSound: true,
    
    // Advanced
    apiEndpoint: 'https://api.example.com/v1',
    modelParameters: {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048
    }
  });

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

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings,
      updateModelParameter
    }}>
      {children}
    </SettingsContext.Provider>
  );
};