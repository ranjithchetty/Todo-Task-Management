
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskFiltersProps {
  filters: {
    status: string;
    priority: string;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  onFiltersChange: (filters: any) => void;
}

export const TaskFilters = ({ filters, onFiltersChange }: TaskFiltersProps) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="today">Due Today</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={(value) => {
          const [sortBy, sortOrder] = value.split('-');
          onFiltersChange({ ...filters, sortBy, sortOrder });
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
            <SelectItem value="priority-desc">High Priority First</SelectItem>
            <SelectItem value="priority-asc">Low Priority First</SelectItem>
            <SelectItem value="dueDate-asc">Due Date (Earliest)</SelectItem>
            <SelectItem value="dueDate-desc">Due Date (Latest)</SelectItem>
            <SelectItem value="status-asc">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
