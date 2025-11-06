import React from 'react';
    import { LucideProps } from 'lucide-react';

    interface StatCardProps {
      icon: React.ElementType<LucideProps>;
      title: string;
      value: string;
      color: 'blue' | 'green' | 'yellow' | 'purple';
    }

    const colorClasses = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    };

    const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color }) => {
      return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-all hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            </div>
          </div>
        </div>
      );
    };

    export default StatCard;