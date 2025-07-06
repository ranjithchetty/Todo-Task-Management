
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { User } from '@/pages/Index';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal = ({ open, onClose, onLogin }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user data based on provider
    const mockUsers = {
      google: {
        id: 'google-123',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        provider: 'google' as const
      },
      github: {
        id: 'github-456',
        name: 'Jane Smith',
        email: 'jane.smith@users.noreply.github.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        provider: 'github' as const
      },
      facebook: {
        id: 'facebook-789',
        name: 'Alex Johnson',
        email: 'alex.johnson@facebook.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        provider: 'facebook' as const
      }
    };

    setIsLoading(false);
    onLogin(mockUsers[provider]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to TodoFlow
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-gray-600 mb-6">
            Sign in with your preferred social account
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              variant="outline"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </div>
            </Button>

            <Button
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800"
            >
              <div className="flex items-center justify-center space-x-3">
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </div>
            </Button>

            <Button
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continue with Facebook</span>
              </div>
            </Button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Signing you in...</span>
            </div>
          )}
        </div>

        <div className="text-xs text-center text-gray-500 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};
