import React from 'react';
    import { User, Bell, Lock } from 'lucide-react';

    const Settings = () => {
      const tabs = [
        { name: 'Profile', icon: User, current: true },
        { name: 'Notifications', icon: Bell, current: false },
        { name: 'Security', icon: Lock, current: false },
      ];

      return (
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h1>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    href="#"
                    className={`${
                      tab.current
                        ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                    } group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
                  >
                    <tab.icon className="flex-shrink-0 -ml-1 mr-3 h-6 w-6" />
                    <span className="truncate">{tab.name}</span>
                  </a>
                ))}
              </nav>
            </aside>

            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              {/* Profile Settings */}
              <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Profile</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    This information will be displayed publicly so be careful what you share.
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                  {/* Form fields */}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default Settings;