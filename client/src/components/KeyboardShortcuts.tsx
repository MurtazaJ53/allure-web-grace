
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface KeyboardShortcutsProps {
  onQuickAddTask?: () => void;
  onQuickAddHabit?: () => void;
  onToggleTheme?: () => void;
}

export function KeyboardShortcuts({ 
  onQuickAddTask, 
  onQuickAddHabit, 
  onToggleTheme 
}: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent shortcuts when user is typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setIsOpen(true);
            break;
          case 't':
            e.preventDefault();
            onQuickAddTask?.();
            break;
          case 'h':
            e.preventDefault();
            onQuickAddHabit?.();
            break;
          case 'd':
            e.preventDefault();
            onToggleTheme?.();
            break;
        }
      }

      // Open shortcuts with '?'
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onQuickAddTask, onQuickAddHabit, onToggleTheme]);

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Open keyboard shortcuts', mac: ['⌘', 'K'] },
    { keys: ['Ctrl', 'T'], description: 'Quick add task', mac: ['⌘', 'T'] },
    { keys: ['Ctrl', 'H'], description: 'Quick add habit', mac: ['⌘', 'H'] },
    { keys: ['Ctrl', 'D'], description: 'Toggle dark mode', mac: ['⌘', 'D'] },
    { keys: ['?'], description: 'Show keyboard shortcuts', mac: ['?'] },
  ];

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Keyboard shortcuts (Ctrl+K)"
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/20 hover:bg-white dark:hover:bg-gray-700"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {shortcut.description}
              </span>
              <div className="flex gap-1">
                {(isMac ? shortcut.mac : shortcut.keys).map((key, keyIndex) => (
                  <Badge key={keyIndex} variant="secondary" className="px-2 py-1 text-xs font-mono">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          💡 Tip: Shortcuts work when you're not typing in input fields
        </div>
      </DialogContent>
    </Dialog>
  );
}
