
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />; // system default
  };

  const getTooltip = () => {
    if (theme === 'light') return 'Switch to dark mode';
    if (theme === 'dark') return 'Switch to system mode';
    return 'Switch to light mode';
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={getTooltip()}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/20 hover:bg-white dark:hover:bg-gray-700"
    >
      {getIcon()}
    </Button>
  );
}
