import React,{useState,useEffect} from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import Dashboard from './components/Dashboard';
import SettingsPanel from './components/SettingsPanel';
import {ThemeProvider} from './contexts/ThemeContext';
import {ChatProvider} from './contexts/ChatContext';
import {SettingsProvider} from './contexts/SettingsContext';
import './App.css';

const {FiMessageSquare,FiBarChart2,FiSettings,FiList,FiSun,FiMoon,FiMenu,FiX,FiChevronLeft,FiChevronRight}=FiIcons;

function App() {
  const [activeView,setActiveView]=useState('chat');
  const [leftPanelCollapsed,setLeftPanelCollapsed]=useState(false);
  const [rightPanelCollapsed,setRightPanelCollapsed]=useState(true);
  const [rightPanelContent,setRightPanelContent]=useState('dashboard');
  const [theme,setTheme]=useState(()=> {
    const savedTheme=localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [fontSize,setFontSize]=useState(()=> {
    try {
      const savedSettings=localStorage.getItem('appSettings');
      if (savedSettings) {
        const settings=JSON.parse(savedSettings);
        return settings.fontSize || 'medium';
      }
      return 'medium';
    } catch (e) {
      return 'medium';
    }
  });

  // Save theme to localStorage when it changes
  useEffect(()=> {
    localStorage.setItem('theme',theme);
  },[theme]);

  const toggleTheme=()=> setTheme(theme==='dark' ? 'light' : 'dark');

  const navigationItems=[
    {id: 'chat',icon: FiMessageSquare,label: 'Chat'},
    {id: 'history',icon: FiList,label: 'History'},
  ];

  const rightPanelItems=[
    {id: 'dashboard',icon: FiBarChart2,label: 'Dashboard'},
    {id: 'settings',icon: FiSettings,label: 'Settings'}
  ];

  const handleRightPanelToggle=(contentType)=> {
    if (contentType === 'settings') {
      // Settings should be mutually exclusive with chat
      setActiveView('settings');
      setRightPanelContent('settings');
      setRightPanelCollapsed(false);
    } else if (contentType === 'dashboard') {
      // Dashboard works with chat view
      if (activeView === 'settings') {
        setActiveView('chat'); // Return to chat when opening dashboard
      }
      if (rightPanelContent === contentType && !rightPanelCollapsed) {
        setRightPanelCollapsed(true);
      } else {
        setRightPanelContent(contentType);
        setRightPanelCollapsed(false);
      }
    }
  };

  const handleViewChange = (viewId) => {
    if (viewId === 'settings') {
      // Settings view - hide chat and show full settings
      setActiveView('settings');
      setRightPanelContent('settings');
      setRightPanelCollapsed(false);
    } else {
      // Any other view - return to normal layout
      setActiveView(viewId);
      if (rightPanelContent === 'settings') {
        setRightPanelCollapsed(true);
      }
    }
  };

  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      <SettingsProvider>
        <ChatProvider>
          <div className={`app ${theme} font-${fontSize}`}>
            <div className="app-layout">
              {/* Main Navigation Bar */}
              <div className="main-nav">
                <div className="nav-brand">
                  <span className="logo-text">AI Assistant</span>
                </div>

                <div className="nav-controls">
                  <button 
                    className="nav-toggle-btn" 
                    onClick={()=> setLeftPanelCollapsed(!leftPanelCollapsed)}
                    title="Toggle chat history"
                  >
                    <SafeIcon icon={leftPanelCollapsed ? FiMenu : FiChevronLeft} />
                  </button>

                  <div className="nav-items">
                    {navigationItems.map(item=> (
                      <button
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={()=> handleViewChange(item.id)}
                        title={item.label}
                      >
                        <SafeIcon icon={item.icon} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="nav-right">
                    {rightPanelItems.map(item=> (
                      <button
                        key={item.id}
                        className={`nav-item ${
                          (item.id === 'settings' && activeView === 'settings') ||
                          (item.id === 'dashboard' && rightPanelContent === item.id && !rightPanelCollapsed) 
                            ? 'active' : ''
                        }`}
                        onClick={()=> {
                          if (item.id === 'settings') {
                            handleViewChange('settings');
                          } else {
                            handleRightPanelToggle(item.id);
                          }
                        }}
                        title={item.label}
                      >
                        <SafeIcon icon={item.icon} />
                        <span>{item.label}</span>
                      </button>
                    ))}

                    <button
                      onClick={toggleTheme}
                      className="theme-toggle-btn"
                      title="Toggle theme"
                    >
                      <SafeIcon icon={theme === 'dark' ? FiSun : FiMoon} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="content-area">
                {/* Left Panel - Chat History (only show when not in settings view) */}
                {activeView !== 'settings' && (
                  <div className={`left-panel ${leftPanelCollapsed ? 'collapsed' : ''}`}>
                    {!leftPanelCollapsed && <Sidebar />}
                    <button
                      className="panel-toggle-btn left"
                      onClick={()=> setLeftPanelCollapsed(!leftPanelCollapsed)}
                      title={leftPanelCollapsed ? "Show chat history" : "Hide chat history"}
                    >
                      <SafeIcon icon={leftPanelCollapsed ? FiChevronRight : FiChevronLeft} />
                    </button>
                  </div>
                )}

                {/* Main Content */}
                <div className="main-content">
                  {activeView === 'settings' && (
                    <SettingsPanel 
                      isMainView={true} 
                      onClose={() => handleViewChange('chat')}
                    />
                  )}

                  {activeView === 'chat' && (
                    <>
                      <ChatArea />
                      <InputArea />
                    </>
                  )}

                  {activeView === 'history' && (
                    <div className="history-view">
                      <h2>Chat History</h2>
                      <p>View and search your past conversations here.</p>
                    </div>
                  )}
                </div>

                {/* Right Panel - Dashboard (only show when not in settings view) */}
                {activeView !== 'settings' && (
                  <div className={`right-panel ${rightPanelCollapsed ? 'collapsed' : ''}`}>
                    <button
                      className="panel-toggle-btn right"
                      onClick={()=> setRightPanelCollapsed(!rightPanelCollapsed)}
                      title={rightPanelCollapsed ? `Show ${rightPanelContent}` : `Hide ${rightPanelContent}`}
                    >
                      <SafeIcon icon={rightPanelCollapsed ? FiChevronLeft : FiChevronRight} />
                    </button>

                    {!rightPanelCollapsed && (
                      <div className="right-panel-content">
                        {rightPanelContent === 'dashboard' && <Dashboard inPanel={true} />}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ChatProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;