import React from 'react';
    import { Zap, Plus, ToggleRight } from 'lucide-react';

    const Automations = () => {
      const automations = [
        { name: 'Notify team in Slack when a task is completed', active: true },
        { name: 'Create a new issue in GitHub when a task is created', active: false },
        { name: 'When a task is marked as "Blocked", assign it to the project lead', active: true },
      ];

      return (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Automations</h1>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>New Automation</span>
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {automations.map((automation, i) => (
                <li key={i} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{automation.name}</p>
                  </div>
                  <button>
                    <ToggleRight className={`h-6 w-6 transition-colors ${automation.active ? 'text-green-500' : 'text-gray-400'}`} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    };

    export default Automations;