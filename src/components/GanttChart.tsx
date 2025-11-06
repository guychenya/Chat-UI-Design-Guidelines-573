import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, Flag, Flame, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Task } from '../types';

const GanttChart = () => {
  const { state, dispatch, filteredTasks } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate date range based on view type
  const generateDateRange = () => {
    const dates = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - (start.getDay() || 7) + 1); // Start from Monday

    const daysToShow = viewType === 'days' ? 14 : viewType === 'weeks' ? 84 : 365;
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dateRange = generateDateRange();

  const getTaskPosition = (task: Task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.dueDate);
    const rangeStart = dateRange[0];
    
    const startDiff = Math.floor((startDate.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const cellWidth = viewType === 'days' ? 120 : viewType === 'weeks' ? 40 : 30;
    const left = Math.max(0, startDiff * cellWidth);
    const width = Math.max(cellWidth * 0.8, duration * cellWidth);
    
    return { left, width, duration };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In progress':
        return 'bg-blue-500';
      case 'Complete':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Blocked':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Flag className="h-3 w-3 text-red-500" />;
      case 'Medium':
        return <Flame className="h-3 w-3 text-orange-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const formatDateHeader = (date: Date) => {
    if (viewType === 'days') {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } else if (viewType === 'weeks') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1);
      return `Week ${Math.ceil(date.getDate() / 7)}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const increment = viewType === 'days' ? 7 : viewType === 'weeks' ? 28 : 90;
    
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - increment);
    } else {
      newDate.setDate(newDate.getDate() + increment);
    }
    setCurrentDate(newDate);
  };

  const handleTaskClick = (task: Task) => {
    dispatch({ type: 'OPEN_TASK_MODAL', payload: task });
  };

  const handleTaskDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset(e.clientX - rect.left);
  };

  const handleTaskDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTask) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset;
    const cellWidth = viewType === 'days' ? 120 : viewType === 'weeks' ? 40 : 30;
    const dayOffset = Math.round(x / cellWidth);
    
    const task = filteredTasks.find(t => t.id === draggedTask);
    if (!task) return;

    const newStartDate = new Date(dateRange[0]);
    newStartDate.setDate(newStartDate.getDate() + dayOffset);
    
    const taskDuration = Math.floor((new Date(task.dueDate).getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + taskDuration);

    const updatedTask = {
      ...task,
      startDate: newStartDate.toISOString().split('T')[0],
      dueDate: newEndDate.toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    setDraggedTask(null);
  };

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    if (!acc[task.project]) {
      acc[task.project] = [];
    }
    acc[task.project].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Gantt Chart</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Timeline view of {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Type Selector */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {(['days', 'weeks', 'months'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={`px-3 py-1 text-sm rounded transition-colors capitalize ${
                    viewType === type
                      ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Date Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg min-w-[120px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              
              <button
                onClick={() => navigateDate('next')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Task List Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
            <div className="sticky top-0 bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tasks</h3>
            </div>
            
            <div className="p-2">
              {Object.entries(groupedTasks).map(([projectName, tasks]) => (
                <div key={projectName} className="mb-4">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {projectName}
                  </div>
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors group"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(task.priority)}
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {task.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {task.assignee.initials}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-auto" ref={scrollRef}>
            <div className="min-w-max">
              {/* Date Headers */}
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
                <div className="flex">
                  {dateRange.map((date, index) => {
                    if (viewType === 'weeks' && index % 7 !== 0) return null;
                    if (viewType === 'months' && date.getDate() !== 1) return null;
                    
                    const cellWidth = viewType === 'days' ? 120 : viewType === 'weeks' ? 40 : 30;
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`px-2 py-3 text-xs font-medium text-center border-r border-gray-200 dark:border-gray-700 ${
                          isToday 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                        style={{ minWidth: cellWidth }}
                      >
                        {formatDateHeader(date)}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Task Bars */}
              <div 
                className="relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleTaskDrop}
              >
                {/* Grid Lines */}
                <div className="absolute inset-0 flex">
                  {dateRange.map((_, index) => {
                    if (viewType === 'weeks' && index % 7 !== 0) return null;
                    if (viewType === 'months' && dateRange[index].getDate() !== 1) return null;
                    
                    const cellWidth = viewType === 'days' ? 120 : viewType === 'weeks' ? 40 : 30;
                    return (
                      <div
                        key={index}
                        className="border-r border-gray-100 dark:border-gray-800"
                        style={{ minWidth: cellWidth }}
                      />
                    );
                  })}
                </div>

                {/* Task Rows */}
                {Object.entries(groupedTasks).map(([projectName, tasks], groupIndex) => (
                  <div key={projectName}>
                    {/* Project Header */}
                    <div className="h-8 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {projectName}
                      </span>
                    </div>
                    
                    {/* Task Bars */}
                    {tasks.map((task, taskIndex) => {
                      const { left, width } = getTaskPosition(task);
                      const rowHeight = 48;
                      
                      return (
                        <div
                          key={task.id}
                          className="relative border-b border-gray-100 dark:border-gray-800"
                          style={{ height: rowHeight }}
                        >
                          <div
                            className={`absolute top-2 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md group ${getStatusColor(task.status)} ${
                              draggedTask === task.id ? 'opacity-50' : ''
                            }`}
                            style={{
                              left: `${left}px`,
                              width: `${width}px`,
                              height: rowHeight - 16,
                            }}
                            draggable
                            onDragStart={(e) => handleTaskDragStart(e, task.id)}
                            onClick={() => handleTaskClick(task)}
                          >
                            <div className="flex items-center justify-between h-full px-3 text-white">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate">
                                  {task.name}
                                </div>
                                <div className="text-xs opacity-75">
                                  {task.progress}% complete
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium">{task.assignee.initials}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 rounded-b-lg overflow-hidden">
                              <div
                                className="h-full bg-white bg-opacity-60 transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;