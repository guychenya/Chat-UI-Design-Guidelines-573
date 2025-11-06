import React from 'react';
    import { MessageSquare, PlusCircle, CheckCircle } from 'lucide-react';
    import { useApp } from '../../contexts/AppContext';

    const ActivityFeed = () => {
      const { state } = useApp();
      const { users } = state;

      const activities = [
        {
          id: 1,
          user: users[0],
          action: 'commented on task "Design new landing page"',
          time: '2 hours ago',
          icon: MessageSquare,
          color: 'blue'
        },
        {
          id: 2,
          user: users[1],
          action: 'created a new task "Implement user authentication"',
          time: '5 hours ago',
          icon: PlusCircle,
          color: 'green'
        },
        {
          id: 3,
          user: users[2],
          action: 'completed task "Write API documentation"',
          time: '1 day ago',
          icon: CheckCircle,
          color: 'purple'
        },
      ];
      
      const iconColors = {
        blue: 'text-blue-500',
        green: 'text-green-500',
        purple: 'text-purple-500',
      };

      return (
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                        <activity.icon className={`h-5 w-5 ${iconColors[activity.color]}`} aria-hidden="true" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-white">{activity.user.name}</span>{' '}
                          {activity.action}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                        <time>{activity.time}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    };

    export default ActivityFeed;