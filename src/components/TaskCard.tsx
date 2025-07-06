
import { useState } from 'react';
import { Task } from '@/pages/Index';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EditTaskModal } from './EditTaskModal';
import { ShareTaskModal } from './ShareTaskModal';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard = ({ task, onUpdate, onDelete }: TaskCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today && task.status !== 'completed';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    if (dateStr === todayStr) return 'Today';
    if (dateStr === tomorrowStr) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    onUpdate(task.id, { status: newStatus });
  };

  return (
    <>
      <Card className={cn(
        "group hover:shadow-lg transition-all duration-200 cursor-pointer relative",
        task.status === 'completed' && "opacity-80",
        isOverdue() && "border-red-200 bg-red-50"
      )}>
        {isOverdue() && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={cn(
                "font-semibold text-gray-900 mb-1 line-clamp-2",
                task.status === 'completed' && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {task.description}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowShareModal(true)}>
                  Share Task
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusChange('completed')}
                  disabled={task.status === 'completed'}
                >
                  Mark Complete
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600"
                >
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            {isOverdue() && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                Overdue
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {task.dueDate && (
            <div className={cn(
              "flex items-center text-sm mb-3",
              isOverdue() ? "text-red-600" : "text-gray-600"
            )}>
              <span className="mr-1">📅</span>
              Due {formatDate(task.dueDate)}
            </div>
          )}

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {task.sharedWith.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <span className="mr-2">👥</span>
              <div className="flex -space-x-1">
                {task.sharedWith.slice(0, 3).map((email, index) => (
                  <Avatar key={index} className="w-6 h-6 border-2 border-white">
                    <AvatarFallback className="text-xs">
                      {email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.sharedWith.length > 3 && (
                  <div className="w-6 h-6 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center text-xs text-gray-600">
                    +{task.sharedWith.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <Button
                variant={task.status === 'todo' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('todo')}
                className="text-xs"
              >
                To Do
              </Button>
              <Button
                variant={task.status === 'in-progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('in-progress')}
                className="text-xs"
              >
                Progress
              </Button>
              <Button
                variant={task.status === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('completed')}
                className="text-xs"
              >
                Done
              </Button>
            </div>

            <span className="text-xs text-gray-500">
              {new Date(task.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <EditTaskModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={task}
        onUpdate={onUpdate}
      />

      <ShareTaskModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        task={task}
        onUpdate={onUpdate}
      />
    </>
  );
};
