
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
}

interface FilterStats {
  all: number;
  today: number;
  overdue: number;
  completed: number;
  inProgress: number;
  todo: number;
}

export const Sidebar = ({ open }: SidebarProps) => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Mock stats - in real app, these would come from props
  const stats: FilterStats = {
    all: 12,
    today: 3,
    overdue: 2,
    completed: 5,
    inProgress: 4,
    todo: 3
  };

  const filterItems = [
    { id: 'all', label: 'All Tasks', count: stats.all, icon: '📋', color: 'text-gray-600' },
    { id: 'today', label: 'Due Today', count: stats.today, icon: '📅', color: 'text-blue-600' },
    { id: 'overdue', label: 'Overdue', count: stats.overdue, icon: '⚠️', color: 'text-red-600' },
    { id: 'todo', label: 'To Do', count: stats.todo, icon: '⭕', color: 'text-yellow-600' },
    { id: 'in-progress', label: 'In Progress', count: stats.inProgress, icon: '🔄', color: 'text-orange-600' },
    { id: 'completed', label: 'Completed', count: stats.completed, icon: '✅', color: 'text-green-600' }
  ];

  const priorityItems = [
    { id: 'high', label: 'High Priority', count: 4, color: 'bg-red-100 text-red-800' },
    { id: 'medium', label: 'Medium Priority', count: 6, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'low', label: 'Low Priority', count: 2, color: 'bg-green-100 text-green-800' }
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-full bg-white border-r border-gray-200 transition-all duration-300 z-10",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 space-y-6">
        {/* Filters Section */}
        <div>
          {open && (
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Filters</h3>
          )}
          <nav className="space-y-1">
            {filterItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeFilter === item.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {open && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full bg-gray-100",
                      item.color
                    )}>
                      {item.count}
                    </span>
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>

        {open && (
          <>
            {/* Priority Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Priority</h3>
              <div className="space-y-2">
                {priorityItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className={cn("px-2 py-1 text-xs rounded-full", item.color)}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Today's Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium">{stats.completed}/{stats.all}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.completed / stats.all) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round((stats.completed / stats.all) * 100)}% of tasks completed
                </p>
              </div>
            </div>

            {/* Team Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Shared With</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    A
                  </div>
                  <span className="text-sm text-gray-600">Alice Cooper</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    B
                  </div>
                  <span className="text-sm text-gray-600">Bob Wilson</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  + Invite teammate
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
