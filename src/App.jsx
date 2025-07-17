import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import SettingsPanel from './components/SettingsPanel';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { SettingsProvider } from './contexts/SettingsContext';
import './App.css';

const { FiMenu, FiX, FiSettings, FiSun, FiMoon, FiBarChart2 } = FiIcons;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [view, setView] = useState('chat'); // 'chat' or 'dashboard'

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
    if (!settingsOpen) setDashboardOpen(false);
  };
  const toggleDashboard = () => {
    setDashboardOpen(!dashboardOpen);
    if (!dashboardOpen) setSettingsOpen(false);
  };
  const toggleView = () => setView(view === 'chat' ? 'dashboard' : 'chat');

  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      <SettingsProvider>
        <ChatProvider>
          <div className={`app ${theme}`}>
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
                    onClick={toggleView}
                    className="view-toggle-btn"
                    title={view === 'chat' ? 'Switch to Dashboard' : 'Switch to Chat'}
                  >
                    <SafeIcon icon={view === 'chat' ? FiBarChart2 : FiMenu} />
                  </motion.button>
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
                  {view === 'chat' ? (
                    <>
                      <ChatArea />
                      <InputArea />
                    </>
                  ) : (
                    <Dashboard />
                  )}
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