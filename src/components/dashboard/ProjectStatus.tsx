import React from 'react';
    import { useApp } from '../../contexts/AppContext';

    const ProjectStatus = () => {
      const { state } = useApp();
      const { projects } = state;
      
      const projectProgress = projects.map(p => ({
        ...p,
        progress: Math.floor(Math.random() * 100) + 1, // Mock progress
      }));

      const getProgressBarColor = (progress: number) => {
        if (progress < 30) return 'bg-red-500';
        if (progress < 70) return 'bg-yellow-500';
        return 'bg-green-500';
      };

      return (
        <div className="space-y-4">
          {projectProgress.map(project => (
            <div key={project.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{project.name}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressBarColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      );
    };

    export default ProjectStatus;