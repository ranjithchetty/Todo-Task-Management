
import { useState, useMemo } from 'react';
import { Task, User } from '@/pages/Index';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateTaskModal } from './CreateTaskModal';
import { toast } from 'sonner';

interface TaskDashboardProps {
  user: User;
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

export const TaskDashboard = ({ user, tasks, onUpdateTasks }: TaskDashboardProps) => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (filters.status !== 'all') {
      if (filters.status === 'overdue') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(task => 
          task.dueDate && task.dueDate < today && task.status !== 'completed'
        );
      } else if (filters.status === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(task => task.dueDate === today);
      } else {
        filtered = filtered.filter(task => task.status === filters.status);
      }
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          aValue = a.dueDate || '9999-12-31';
          bValue = b.dueDate || '9999-12-31';
          break;
        case 'status':
          const statusOrder = { todo: 1, 'in-progress': 2, completed: 3 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, filters]);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id
    };

    const updatedTasks = [newTask, ...tasks];
    onUpdateTasks(updatedTasks);
    toast.success('Task created successfully!');
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    onUpdateTasks(updatedTasks);
    toast.success('Task updated successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    onUpdateTasks(updatedTasks);
    toast.success('Task deleted successfully!');
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = tasks.filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.dueDate && t.dueDate < today && t.status !== 'completed';
    }).length;

    return { total, completed, inProgress, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
            <p className="text-gray-600">Manage your tasks and collaborate with your team</p>
          </div>
          <Button
            onClick={() => setShowCreateTask(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">🔄</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      {/* Tasks Grid */}
      <div className="mt-6">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                ? 'Try adjusting your filters to see more tasks.'
                : 'Create your first task to get started.'}
            </p>
            <Button
              onClick={() => setShowCreateTask(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <CreateTaskModal
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onTaskCreated={handleCreateTask}
      />
    </div>
  );
};
