import React from 'react';
    import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { ThemeProvider } from './contexts/ThemeContext';
    import { AppProvider } from './contexts/AppContext';

    import Sidebar from './components/Sidebar';
    import TopNavigation from './components/TopNavigation';
    import TaskModal from './components/TaskModal';

    import Dashboard from './pages/Dashboard';
    import TasksPage from './pages/TasksPage';
    import Docs from './pages/Docs';
    import CalendarPage from './pages/CalendarPage';
    import Automations from './pages/Automations';
    import Settings from './pages/Settings';

    const AppContent = () => {
      return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNavigation />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks/*" element={<TasksPage />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/automations" element={<Automations />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
          <TaskModal />
        </div>
      );
    };

    function App() {
      return (
        <ThemeProvider>
          <AppProvider>
            <Router>
              <AppContent />
            </Router>
          </AppProvider>
        </ThemeProvider>
      );
    }

    export default App;