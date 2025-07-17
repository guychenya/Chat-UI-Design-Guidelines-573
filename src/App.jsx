import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import Dashboard from './components/Dashboard';
import SettingsPanel from './components/SettingsPanel';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { SettingsProvider } from './contexts/SettingsContext';
import './App.css';

const { FiMessageSquare, FiBarChart2, FiSettings, FiList, FiSun, FiMoon } = FiIcons;

function App() {
  const [activeView, setActiveView] = useState('chat');
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  
  const [fontSize, setFontSize] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return settings.fontSize || 'medium';
      }
      return 'medium';
    } catch (e) {
      return 'medium';
    }
  });

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const navigationItems = [
    { id: 'chat', icon: FiMessageSquare, label: 'Chat' },
    { id: 'history', icon: FiList, label: 'History' },
    { id: 'dashboard', icon: FiBarChart2, label: 'Dashboard' },
    { id: 'settings', icon: FiSettings, label: 'Settings' }
  ];

  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      <SettingsProvider>
        <ChatProvider>
          <div className={`app ${theme} font-${fontSize}`}>
            <div className="app-layout">
              {/* Navigation Sidebar */}
              <div className="nav-sidebar">
                <div className="app-logo">
                  <span className="logo-text">AI Assistant</span>
                </div>
                
                <div className="nav-items">
                  {navigationItems.map(item => (
                    <button
                      key={item.id}
                      className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                      onClick={() => setActiveView(item.id)}
                    >
                      <SafeIcon icon={item.icon} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="sidebar-footer">
                  <button onClick={toggleTheme} className="theme-toggle-btn">
                    <SafeIcon icon={theme === 'dark' ? FiSun : FiMoon} />
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
              </div>
              
              {/* Content Area with Left and Main Panes */}
              <div className="content-area">
                {/* Left Pane - Chat History or Context */}
                <div className="left-pane">
                  <Sidebar />
                </div>
                
                {/* Main Pane - Active Content */}
                <div className="main-pane">
                  {activeView === 'chat' && (
                    <>
                      <ChatArea />
                      <InputArea />
                    </>
                  )}
                  
                  {activeView === 'dashboard' && <Dashboard />}
                  
                  {activeView === 'settings' && <SettingsPanel isMainView={true} />}
                  
                  {activeView === 'history' && (
                    <div className="history-view">
                      <h2>Chat History</h2>
                      <p>View and search your past conversations here.</p>
                      {/* This would be replaced with a proper history component */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ChatProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;