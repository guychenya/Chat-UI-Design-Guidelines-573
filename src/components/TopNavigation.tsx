import React from 'react';
    import { NavLink, useLocation } from 'react-router-dom';
    import { 
      Search, 
      Plus, 
      Bell, 
      ChevronDown,
      Grid3X3,
      List,
      Calendar,
      BarChart3,
      Sun,
      Moon,
      Monitor
    } from 'lucide-react';
    import { useApp } from '../contexts/AppContext';
    import { useTheme } from '../contexts/ThemeContext';

    const TopNavigation = () => {
      const { state, dispatch } = useApp();
      const { theme, setTheme } = useTheme();
      const { searchQuery } = state;
      const location = useLocation();

      const showTaskViews = location.pathname.startsWith('/tasks');

      const handleNewTask = () => {
        dispatch({ type: 'OPEN_TASK_MODAL' });
      };

      const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
      };

      const getThemeIcon = () => {
        switch (theme) {
          case 'light':
            return <Sun className="h-4 w-4" />;
          case 'dark':
            return <Moon className="h-4 w-4" />;
          default:
            return <Monitor className="h-4 w-4" />;
        }
      };
      
      const viewModes = [
          { to: '/tasks/list', icon: List, title: 'List view' },
          { to: '/tasks/grid', icon: Grid3X3, title: 'Grid view' },
          { to: '/tasks/calendar', icon: Calendar, title: 'Calendar view' },
          { to: '/tasks/gantt', icon: BarChart3, title: 'Gantt view' },
      ];

      return (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tasks, projects, or people..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 w-80 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* New Task Button */}
              <button 
                onClick={handleNewTask}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>New Task</span>
              </button>

              {/* View Toggle */}
              {showTaskViews && (
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  {viewModes.map(mode => (
                      <NavLink 
                        key={mode.to}
                        to={mode.to}
                        className={({isActive}) => `p-2 rounded transition-colors ${
                            isActive 
                            ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700 shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700'
                        }`}
                        title={mode.title}
                      >
                        <mode.icon className="h-4 w-4" />
                      </NavLink>
                  ))}
                </div>
              )}

              {/* Theme Toggle */}
              <div className="relative">
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  {getThemeIcon()}
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-sm font-medium leading-none">JD</span>
                </div>
                <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default TopNavigation;