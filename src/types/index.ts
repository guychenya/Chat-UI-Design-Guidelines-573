export interface Task {
      id: string;
      name: string;
      description?: string;
      status: 'In progress' | 'Complete' | 'Pending' | 'Blocked';
      priority: 'Low' | 'Medium' | 'High';
      assignee: {
        id: string;
        name: string;
        avatar: string;
        initials: string;
      };
      dueDate: string;
      startDate: string;
      project: string;
      comments: number;
      attachments: number;
      createdAt: string;
      updatedAt: string;
      dependencies?: string[];
      progress: number;
    }

    export interface User {
      id: string;
      name: string;
      email: string;
      avatar: string;
      initials: string;
    }

    export interface Project {
      id: string;
      name: string;
      emoji: string;
      taskCount: number;
      color: string;
    }

    export interface Comment {
      id: string;
      taskId: string;
      userId: string;
      content: string;
      createdAt: string;
    }

    export type FilterStatus = 'all' | 'In progress' | 'Complete' | 'Pending' | 'Blocked';
    export type FilterPriority = 'all' | 'Low' | 'Medium' | 'High';