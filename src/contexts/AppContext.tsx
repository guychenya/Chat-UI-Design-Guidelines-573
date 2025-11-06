import React, { createContext, useContext, useReducer, ReactNode } from 'react';
    import { Task, User, Project, FilterStatus, FilterPriority } from '../types';

    interface AppState {
      tasks: Task[];
      users: User[];
      projects: Project[];
      selectedTasks: string[];
      searchQuery: string;
      filterStatus: FilterStatus;
      filterPriority: FilterPriority;
      filterAssignee: string;
      isTaskModalOpen: boolean;
      editingTask: Task | null;
    }

    type AppAction =
      | { type: 'ADD_TASK'; payload: Task }
      | { type: 'UPDATE_TASK'; payload: Task }
      | { type: 'DELETE_TASK'; payload: string }
      | { type: 'DELETE_SELECTED_TASKS' }
      | { type: 'TOGGLE_TASK_SELECTION'; payload: string }
      | { type: 'SELECT_ALL_TASKS' }
      | { type: 'CLEAR_TASK_SELECTION' }
      | { type: 'SET_SEARCH_QUERY'; payload: string }
      | { type: 'SET_FILTER_STATUS'; payload: FilterStatus }
      | { type: 'SET_FILTER_PRIORITY'; payload: FilterPriority }
      | { type: 'SET_FILTER_ASSIGNEE'; payload: string }
      | { type: 'OPEN_TASK_MODAL'; payload?: Task }
      | { type: 'CLOSE_TASK_MODAL' }
      | { type: 'CLEAR_FILTERS' };

    const initialUsers: User[] = [
      { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', avatar: '', initials: 'SC' },
      { id: '2', name: 'Mike Johnson', email: 'mike@example.com', avatar: '', initials: 'MJ' },
      { id: '3', name: 'Alex Rodriguez', email: 'alex@example.com', avatar: '', initials: 'AR' },
      { id: '4', name: 'Emily Davis', email: 'emily@example.com', avatar: '', initials: 'ED' },
      { id: '5', name: 'John Smith', email: 'john@example.com', avatar: '', initials: 'JS' },
      { id: '6', name: 'Lisa Wang', email: 'lisa@example.com', avatar: '', initials: 'LW' },
    ];

    const initialProjects: Project[] = [
      { id: '1', name: 'Website Redesign', emoji: '🎨', taskCount: 12, color: 'blue' },
      { id: '2', name: 'Auth System', emoji: '🔐', taskCount: 8, color: 'green' },
      { id: '3', name: 'Documentation', emoji: '📚', taskCount: 5, color: 'purple' },
      { id: '4', name: 'DevOps', emoji: '⚙️', taskCount: 15, color: 'orange' },
      { id: '5', name: 'User Research', emoji: '🔍', taskCount: 7, color: 'pink' },
      { id: '6', name: 'Performance', emoji: '⚡', taskCount: 10, color: 'yellow' },
    ];

    const initialTasks: Task[] = [
      {
        id: '1',
        name: 'Design new landing page hero section',
        description: 'Create a compelling hero section that showcases our product value proposition',
        status: 'In progress',
        priority: 'High',
        assignee: initialUsers[0],
        startDate: '2024-12-01',
        dueDate: '2024-12-15',
        project: 'Website Redesign',
        progress: 65,
        comments: 3,
        attachments: 2,
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-10T14:30:00Z',
        dependencies: []
      },
      {
        id: '2',
        name: 'Implement user authentication flow',
        description: 'Build secure login, registration, and password reset functionality',
        status: 'Pending',
        priority: 'Medium',
        assignee: initialUsers[1],
        startDate: '2024-12-10',
        dueDate: '2024-12-18',
        project: 'Auth System',
        progress: 0,
        comments: 1,
        attachments: 0,
        createdAt: '2024-12-02T09:15:00Z',
        updatedAt: '2024-12-08T16:45:00Z',
        dependencies: []
      },
      {
        id: '3',
        name: 'Write API documentation',
        description: 'Document all REST endpoints with examples and response schemas',
        status: 'Complete',
        priority: 'Low',
        assignee: initialUsers[2],
        startDate: '2024-11-20',
        dueDate: '2024-12-12',
        project: 'Documentation',
        progress: 100,
        comments: 5,
        attachments: 1,
        createdAt: '2024-11-28T11:20:00Z',
        updatedAt: '2024-12-12T13:00:00Z',
        dependencies: []
      },
      {
        id: '4',
        name: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment workflows',
        status: 'Blocked',
        priority: 'High',
        assignee: initialUsers[3],
        startDate: '2024-12-05',
        dueDate: '2024-12-20',
        project: 'DevOps',
        progress: 25,
        comments: 2,
        attachments: 3,
        createdAt: '2024-12-03T08:30:00Z',
        updatedAt: '2024-12-09T10:15:00Z',
        dependencies: []
      },
      {
        id: '5',
        name: 'Conduct user research interviews',
        description: 'Interview 10 users to understand their pain points and needs',
        status: 'In progress',
        priority: 'Medium',
        assignee: initialUsers[4],
        startDate: '2024-12-08',
        dueDate: '2024-12-16',
        project: 'User Research',
        progress: 40,
        comments: 0,
        attachments: 0,
        createdAt: '2024-12-04T15:45:00Z',
        updatedAt: '2024-12-11T09:20:00Z',
        dependencies: []
      },
      {
        id: '6',
        name: 'Optimize database queries',
        description: 'Improve query performance and reduce response times',
        status: 'Pending',
        priority: 'High',
        assignee: initialUsers[5],
        startDate: '2024-12-15',
        dueDate: '2024-12-22',
        project: 'Performance',
        progress: 0,
        comments: 1,
        attachments: 0,
        createdAt: '2024-12-05T12:10:00Z',
        updatedAt: '2024-12-10T17:30:00Z',
        dependencies: []
      },
      {
        id: '7',
        name: 'Mobile app wireframes',
        description: 'Create wireframes for the mobile application interface',
        status: 'In progress',
        priority: 'Medium',
        assignee: initialUsers[0],
        startDate: '2024-12-12',
        dueDate: '2024-12-25',
        project: 'Website Redesign',
        progress: 30,
        comments: 2,
        attachments: 1,
        createdAt: '2024-12-06T14:20:00Z',
        updatedAt: '2024-12-11T11:15:00Z',
        dependencies: []
      },
      {
        id: '8',
        name: 'Security audit',
        description: 'Perform comprehensive security audit of the authentication system',
        status: 'Pending',
        priority: 'High',
        assignee: initialUsers[2],
        startDate: '2024-12-18',
        dueDate: '2024-12-30',
        project: 'Auth System',
        progress: 0,
        comments: 0,
        attachments: 0,
        createdAt: '2024-12-07T09:30:00Z',
        updatedAt: '2024-12-07T09:30:00Z',
        dependencies: ['2']
      }
    ];

    const initialState: AppState = {
      tasks: initialTasks,
      users: initialUsers,
      projects: initialProjects,
      selectedTasks: [],
      searchQuery: '',
      filterStatus: 'all',
      filterPriority: 'all',
      filterAssignee: 'all',
      isTaskModalOpen: false,
      editingTask: null,
    };

    function appReducer(state: AppState, action: AppAction): AppState {
      switch (action.type) {
        case 'ADD_TASK':
          return {
            ...state,
            tasks: [...state.tasks, action.payload],
            isTaskModalOpen: false,
            editingTask: null,
          };

        case 'UPDATE_TASK':
          return {
            ...state,
            tasks: state.tasks.map(task =>
              task.id === action.payload.id ? action.payload : task
            ),
            isTaskModalOpen: false,
            editingTask: null,
          };

        case 'DELETE_TASK':
          return {
            ...state,
            tasks: state.tasks.filter(task => task.id !== action.payload),
            selectedTasks: state.selectedTasks.filter(id => id !== action.payload),
          };

        case 'DELETE_SELECTED_TASKS':
          return {
            ...state,
            tasks: state.tasks.filter(task => !state.selectedTasks.includes(task.id)),
            selectedTasks: [],
          };

        case 'TOGGLE_TASK_SELECTION':
          return {
            ...state,
            selectedTasks: state.selectedTasks.includes(action.payload)
              ? state.selectedTasks.filter(id => id !== action.payload)
              : [...state.selectedTasks, action.payload],
          };

        case 'SELECT_ALL_TASKS':
            const filteredTaskIds = state.tasks
              .filter(task => {
                const matchesSearch = task.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                                      task.project.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                                      task.assignee.name.toLowerCase().includes(state.searchQuery.toLowerCase());
                const matchesStatus = state.filterStatus === 'all' || task.status === state.filterStatus;
                const matchesPriority = state.filterPriority === 'all' || task.priority === state.filterPriority;
                const matchesAssignee = state.filterAssignee === 'all' || task.assignee.id === state.filterAssignee;
                return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
              })
              .map(task => task.id);
            return {
              ...state,
              selectedTasks: filteredTaskIds,
            };

        case 'CLEAR_TASK_SELECTION':
          return {
            ...state,
            selectedTasks: [],
          };

        case 'SET_SEARCH_QUERY':
          return {
            ...state,
            searchQuery: action.payload,
          };

        case 'SET_FILTER_STATUS':
          return {
            ...state,
            filterStatus: action.payload,
          };

        case 'SET_FILTER_PRIORITY':
          return {
            ...state,
            filterPriority: action.payload,
          };

        case 'SET_FILTER_ASSIGNEE':
          return {
            ...state,
            filterAssignee: action.payload,
          };

        case 'OPEN_TASK_MODAL':
          return {
            ...state,
            isTaskModalOpen: true,
            editingTask: action.payload || null,
          };

        case 'CLOSE_TASK_MODAL':
          return {
            ...state,
            isTaskModalOpen: false,
            editingTask: null,
          };

        case 'CLEAR_FILTERS':
          return {
            ...state,
            searchQuery: '',
            filterStatus: 'all',
            filterPriority: 'all',
            filterAssignee: 'all',
          };

        default:
          return state;
      }
    }

    interface AppContextType {
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
      filteredTasks: Task[];
    }

    const AppContext = createContext<AppContextType | undefined>(undefined);

    export const useApp = () => {
      const context = useContext(AppContext);
      if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
      }
      return context;
    };

    export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
      const [state, dispatch] = useReducer(appReducer, initialState);

      const filteredTasks = state.tasks.filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                             task.project.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                             task.assignee.name.toLowerCase().includes(state.searchQuery.toLowerCase());
        
        const matchesStatus = state.filterStatus === 'all' || task.status === state.filterStatus;
        const matchesPriority = state.filterPriority === 'all' || task.priority === state.filterPriority;
        const matchesAssignee = state.filterAssignee === 'all' || task.assignee.id === state.filterAssignee;

        return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
      });

      return (
        <AppContext.Provider value={{ state, dispatch, filteredTasks }}>
          {children}
        </AppContext.Provider>
      );
    };