import React from 'react';
    import { Calendar, momentLocalizer } from 'react-big-calendar';
    import moment from 'moment';
    import 'react-big-calendar/lib/css/react-big-calendar.css';
    import { useApp } from '../contexts/AppContext';
    import { useTheme } from '../contexts/ThemeContext';
    
    const localizer = momentLocalizer(moment);

    const CalendarPage = () => {
      const { state } = useApp();
      const { isDark } = useTheme();

      const events = state.tasks.map(task => ({
        id: task.id,
        title: task.name,
        start: new Date(task.startDate),
        end: new Date(task.dueDate),
        allDay: true,
        resource: task,
      }));
      
      const eventStyleGetter = (event: any) => {
          const statusColors = {
              'In progress': '#3b82f6',
              'Complete': '#22c55e',
              'Pending': '#f59e0b',
              'Blocked': '#ef4444',
          };
          const backgroundColor = statusColors[event.resource.status] || '#6b7280';
          return {
              style: {
                  backgroundColor,
                  borderRadius: '5px',
                  opacity: 0.8,
                  color: 'white',
                  border: '0px',
                  display: 'block'
              }
          };
      };

      return (
        <div className="p-6 h-full">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Calendar</h1>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ height: 'calc(100vh - 150px)' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ flex: 1 }}
              eventPropGetter={eventStyleGetter}
              className={isDark ? 'rbc-dark' : ''}
            />
          </div>
        </div>
      );
    };

    export default CalendarPage;