import React from 'react';
    import { Book, CheckCircle, Clock, Users } from 'lucide-react';
    import StatCard from '../components/dashboard/StatCard';
    import TasksChart from '../components/dashboard/TasksChart';
    import ProjectStatus from '../components/dashboard/ProjectStatus';
    import ActivityFeed from '../components/dashboard/ActivityFeed';

    const Dashboard = () => {
      return (
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Book} title="Total Projects" value="12" color="blue" />
            <StatCard icon={CheckCircle} title="Tasks Completed" value="238" color="green" />
            <StatCard icon={Clock} title="Pending Tasks" value="76" color="yellow" />
            <StatCard icon={Users} title="Active Users" value="8" color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasks per Project</h2>
              <TasksChart />
            </div>

            {/* Project Status */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Status</h2>
              <ProjectStatus />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <ActivityFeed />
          </div>

        </div>
      );
    };

    export default Dashboard;