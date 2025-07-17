import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import SettingsPanel from './components/SettingsPanel';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { SettingsProvider } from './contexts/SettingsContext';
import './App.css';

const { FiMenu, FiX, FiSettings, FiSun, FiMoon } = FiIcons;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  const [settingsOpen, setSettingsOpen] = useState(false);
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      <SettingsProvider>
        <ChatProvider>
          <div className={`app ${theme} font-${fontSize}`}>
            <div className="app-container">
              {/* Header */}
              <header className="app-header">
                <div className="header-left">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSidebar}
                    className="sidebar-toggle"
                  >
                    <SafeIcon icon={sidebarOpen ? FiX : FiMenu} />
                  </motion.button>
                  <h1 className="app-title">AI Assistant</h1>
                </div>
                <div className="header-right">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="theme-toggle"
                  >
                    <SafeIcon icon={theme === 'dark' ? FiSun : FiMoon} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="settings-btn"
                    onClick={toggleSettings}
                    title="Settings & Dashboard"
                  >
                    <SafeIcon icon={FiSettings} />
                  </motion.button>
                </div>
              </header>

              <div className="app-body">
                <AnimatePresence>
                  {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
                </AnimatePresence>

                <main className={`main-content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
                  <ChatArea />
                  <InputArea />
                </main>

                <AnimatePresence>
                  {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </ChatProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;