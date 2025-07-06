
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TaskDashboard } from '@/components/TaskDashboard';
import { AuthModal } from '@/components/AuthModal';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github' | 'facebook';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  sharedWith: string[];
  assignedTo?: string;
  tags: string[];
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Simulate loading user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('todo-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Simulate loading tasks
  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`todo-tasks-${user.id}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        // Initialize with sample tasks
        const sampleTasks: Task[] = [
          {
            id: '1',
            title: 'Complete hackathon project',
            description: 'Build a full-stack todo management application',
            status: 'in-progress',
            priority: 'high',
            dueDate: '2025-01-08',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: user.id,
            sharedWith: [],
            tags: ['hackathon', 'coding']
          },
          {
            id: '2',
            title: 'Review project requirements',
            description: 'Go through all the technical requirements and ensure everything is covered',
            status: 'completed',
            priority: 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: user.id,
            sharedWith: [],
            tags: ['planning']
          },
          {
            id: '3',
            title: 'Deploy application',
            description: 'Deploy the frontend and backend to production',
            status: 'todo',
            priority: 'high',
            dueDate: '2025-01-07',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: user.id,
            sharedWith: [],
            tags: ['deployment']
          }
        ];
        setTasks(sampleTasks);
        localStorage.setItem(`todo-tasks-${user.id}`, JSON.stringify(sampleTasks));
      }
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('todo-user', JSON.stringify(userData));
    setShowAuthModal(false);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('todo-user');
    localStorage.removeItem(`todo-tasks-${user?.id}`);
    toast.success('Logged out successfully');
  };

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    if (user) {
      localStorage.setItem(`todo-tasks-${user.id}`, JSON.stringify(newTasks));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">TodoFlow</h1>
              <p className="text-lg text-gray-600">
                Collaborative Task Management Made Simple
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✨ Real-time collaboration</p>
                <p>📱 Responsive design</p>
                <p>🔐 Social authentication</p>
                <p>📊 Advanced filtering & sorting</p>
              </div>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <TaskDashboard
            user={user}
            tasks={tasks}
            onUpdateTasks={updateTasks}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
