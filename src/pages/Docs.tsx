import React from 'react';
    import { FileText, Plus, Search } from 'lucide-react';

    const Docs = () => {
      const documents = [
        { title: 'Project Phoenix Onboarding', lastUpdated: '2 days ago', sharedWith: 5 },
        { title: 'Q4 Marketing Strategy', lastUpdated: '5 days ago', sharedWith: 12 },
        { title: 'API Documentation v2.1', lastUpdated: '1 week ago', sharedWith: 23 },
        { title: 'User Research Findings', lastUpdated: '2 weeks ago', sharedWith: 8 },
      ];

      return (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Docs</h1>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search docs..." className="pl-10 pr-4 py-2 text-sm border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                <span>New Doc</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents.map((doc, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:shadow-lg transition-shadow">
                <FileText className="h-8 w-8 text-blue-500 mb-4"/>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{doc.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last updated {doc.lastUpdated}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shared with {doc.sharedWith} people</p>
              </div>
            ))}
          </div>
        </div>
      );
    };

    export default Docs;