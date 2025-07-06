
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/pages/Index';
import { X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export const ShareTaskModal = ({ open, onClose, task, onUpdate }: ShareTaskModalProps) => {
  const [emailInput, setEmailInput] = useState('');
  const [sharedWith, setSharedWith] = useState<string[]>(task.sharedWith || []);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/task/${task.id}`;

  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && emailRegex.test(email) && !sharedWith.includes(email)) {
      const newSharedWith = [...sharedWith, email];
      setSharedWith(newSharedWith);
      onUpdate(task.id, { sharedWith: newSharedWith });
      setEmailInput('');
      toast.success(`Task shared with ${email}`);
    } else if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
    } else if (sharedWith.includes(email)) {
      toast.error('Task is already shared with this user');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    const newSharedWith = sharedWith.filter(email => email !== emailToRemove);
    setSharedWith(newSharedWith);
    onUpdate(task.id, { sharedWith: newSharedWith });
    toast.success(`Removed ${emailToRemove} from shared task`);
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Share link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Task: {task.title}</h4>
            <p className="text-sm text-gray-600 mb-4">
              Share this task with team members to collaborate
            </p>
          </div>

          {/* Share Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="bg-gray-50"
              />
              <Button
                onClick={copyShareUrl}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Add Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite by Email
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
              />
              <Button onClick={addEmail} variant="outline">
                Invite
              </Button>
            </div>
          </div>

          {/* Current Collaborators */}
          {sharedWith.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shared With ({sharedWith.length})
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {sharedWith.map((email) => (
                  <div key={email} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700">{email}</span>
                    </div>
                    <Button
                      onClick={() => removeEmail(email)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permission Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>📋 Collaboration Features:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Shared users can view and edit this task</li>
              <li>• Real-time updates across all collaborators</li>
              <li>• Comments and activity history (coming soon)</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
