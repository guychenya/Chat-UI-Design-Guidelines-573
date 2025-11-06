import React from 'react';
import { Filter, X, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const FilterBar = () => {
  const { state, dispatch } = useApp();
  const { filterStatus, filterPriority, filterAssignee, users, selectedTasks } = state;

  const hasActiveFilters = filterStatus !== 'all' || filterPriority !== 'all' || filterAssignee !== 'all';

  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const handleDeleteSelected = () => {
    if (selectedTasks.length > 0 && confirm(`Delete ${selectedTasks.length} selected task(s)?`)) {
      dispatch({ type: 'DELETE_SELECTED_TASKS' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => dispatch({ type: 'SET_FILTER_STATUS', payload: e.target.value as any })}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In progress">In Progress</option>
            <option value="Complete">Complete</option>
            <option value="Blocked">Blocked</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => dispatch({ type: 'SET_FILTER_PRIORITY', payload: e.target.value as any })}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            value={filterAssignee}
            onChange={(e) => dispatch({ type: 'SET_FILTER_ASSIGNEE', payload: e.target.value })}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Assignees</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {selectedTasks.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedTasks.length} selected
            </span>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;