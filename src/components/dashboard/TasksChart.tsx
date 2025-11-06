import React from 'react';
    import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
    import { useTheme } from '../../contexts/ThemeContext';

    const data = [
      { name: 'Website Redesign', tasks: 40 },
      { name: 'Auth System', tasks: 30 },
      { name: 'Documentation', tasks: 20 },
      { name: 'DevOps', tasks: 27 },
      { name: 'User Research', tasks: 18 },
      { name: 'Performance', tasks: 23 },
    ];

    const TasksChart = () => {
        const { isDark } = useTheme();
        const tickColor = isDark ? '#9CA3AF' : '#6B7280';

      return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                    <XAxis dataKey="name" fontSize={12} tick={{ fill: tickColor }} tickLine={false} />
                    <YAxis fontSize={12} tick={{ fill: tickColor }} tickLine={false} />
                    <Tooltip 
                        cursor={{ fill: isDark ? 'rgba(156, 163, 175, 0.1)' : 'rgba(209, 213, 219, 0.3)' }}
                        contentStyle={{
                            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                            borderColor: isDark ? '#4B5563' : '#D1D5DB'
                        }}
                    />
                    <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      );
    };

    export default TasksChart;