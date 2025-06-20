
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target, Zap, TrendingUp } from 'lucide-react';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';

interface Stats {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  totalStreak: number;
  habitsCompletedToday: number;
  avgStreak: number;
  activeHabits: number;
}

interface WelcomeHeaderProps {
  stats: Stats;
}

export function WelcomeHeader({ stats }: WelcomeHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMotivationalMessage = () => {
    if (stats.completionRate >= 80) return "You're crushing it today! 🔥";
    if (stats.completionRate >= 60) return "Great progress! Keep it up! 💪";
    if (stats.completionRate >= 40) return "You're building momentum! 🚀";
    return "Every step counts! Let's get started! ✨";
  };

  return (
    <div className="mb-8 animate-fade-in">
      {/* Main Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {getGreeting()}! 👋
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {getMotivationalMessage()}
        </p>
        
        {/* Action Bar */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <KeyboardShortcuts />
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.completedTasks}/{stats.totalTasks}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stats.completionRate}% complete
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Habits</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.habitsCompletedToday}/{stats.activeHabits}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              completed today
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.avgStreak}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              days average
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalStreak}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              total streaks
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
