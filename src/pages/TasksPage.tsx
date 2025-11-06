import React from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import FilterBar from '../components/FilterBar';
    import TaskTable from '../components/TaskTable';
    import GanttChart from '../components/GanttChart';
    import { Package } from 'lucide-react';

    const TaskListLayout = () => (
      <div className="flex flex-col h-full">
        <FilterBar />
        <div className="flex-1 overflow-y-auto">
          <TaskTable />
        </div>
      </div>
    );
    
    const ComingSoon = ({ viewName }: { viewName: string }) => (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{viewName} View</h3>
            <p className="text-gray-500 dark:text-gray-400">This view is coming soon...</p>
        </div>
      </div>
    );

    const TasksPage = () => {
      return (
        <Routes>
          <Route index element={<Navigate to="list" replace />} />
          <Route path="list" element={<TaskListLayout />} />
          <Route path="gantt" element={<GanttChart />} />
          <Route path="grid" element={<ComingSoon viewName="Grid" />} />
          <Route path="calendar" element={<ComingSoon viewName="Calendar" />} />
        </Routes>
      );
    };

    export default TasksPage;