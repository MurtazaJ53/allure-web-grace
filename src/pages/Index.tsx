import { useState, useEffect, useCallback, useMemo } from 'react';
import { TaskManager } from '@/components/TaskManager';
import { HabitTracker } from '@/components/HabitTracker';
import { StatsCards } from '@/components/StatsCards';
import { WelcomeHeader } from '@/components/WelcomeHeader';
import { QuickActions } from '@/components/QuickActions';
import { ActivityFeed } from '@/components/ActivityFeed';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { AISuggestions } from '@/components/AISuggestions';
import { GamificationDashboard } from '@/components/GamificationDashboard';
import { SocialSharing } from '@/components/SocialSharing';
import { CommunityFeed } from '@/components/CommunityFeed';
import { EnhancedAIDashboard } from '@/components/EnhancedAIDashboard';
import { AdvancedGamification } from '@/components/AdvancedGamification';
import { AISettings } from '@/components/AISettings';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationCenter } from '@/components/NotificationCenter';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
}

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  createdAt: Date;
  lastCompleted?: Date;
  category?: string;
  targetFrequency: 'daily' | 'weekly';
}

interface Activity {
  id: string;
  type: 'task_completed' | 'habit_completed' | 'streak_milestone';
  message: string;
  timestamp: Date;
  icon: string;
}

type TabType = 'dashboard' | 'analytics' | 'ai-suggestions' | 'enhanced-ai' | 'gamification' | 'advanced-gamification' | 'social' | 'settings';

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('productivity-tasks', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('productivity-habits', []);
  const [activities, setActivities] = useLocalStorage<Activity[]>('productivity-activities', []);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { toast } = useToast();

  // Simulate initial loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Memoized statistics for performance
  const stats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const habitsCompletedToday = habits.filter(habit => habit.completedToday).length;
    const avgStreak = habits.length > 0 ? Math.round(totalStreak / habits.length) : 0;

    return {
      completedTasks,
      totalTasks,
      completionRate,
      totalStreak,
      habitsCompletedToday,
      avgStreak,
      activeHabits: habits.length
    };
  }, [tasks, habits]);

  // Enhanced activity tracking
  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    setActivities(prev => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
  }, [setActivities]);

  // Enhanced task management with activity tracking
  const handleTaskUpdate = useCallback((updatedTasks: Task[]) => {
    const newlyCompleted = updatedTasks.filter(task => 
      task.completed && !tasks.find(t => t.id === task.id && t.completed)
    );
    
    newlyCompleted.forEach(task => {
      addActivity({
        type: 'task_completed',
        message: `Completed task: "${task.text}"`,
        icon: '✅'
      });
      
      toast({
        title: "Task Completed! 🎉",
        description: `Great job completing "${task.text}"`,
        duration: 3000,
      });
    });
    
    setTasks(updatedTasks);
  }, [tasks, setTasks, addActivity, toast]);

  // Enhanced habit management with streak tracking
  const handleHabitUpdate = useCallback((updatedHabits: Habit[]) => {
    updatedHabits.forEach(habit => {
      const oldHabit = habits.find(h => h.id === habit.id);
      
      // Check for newly completed habits
      if (habit.completedToday && (!oldHabit || !oldHabit.completedToday)) {
        addActivity({
          type: 'habit_completed',
          message: `Completed habit: "${habit.name}"`,
          icon: '🎯'
        });
        
        toast({
          title: "Habit Completed! 💪",
          description: `Keep it up! Streak: ${habit.streak} days`,
          duration: 3000,
        });
      }
      
      // Check for streak milestones
      if (oldHabit && habit.streak > oldHabit.streak && habit.streak % 7 === 0) {
        addActivity({
          type: 'streak_milestone',
          message: `${habit.streak}-day streak achieved for "${habit.name}"!`,
          icon: '🔥'
        });
        
        toast({
          title: `${habit.streak}-Day Streak! 🔥`,
          description: `Amazing consistency with "${habit.name}"!`,
          duration: 4000,
        });
      }
    });
    
    setHabits(updatedHabits);
  }, [habits, setHabits, addActivity, toast]);

  // AI suggestions handlers
  const handleAddTaskFromAI = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  }, [setTasks]);

  const handleAddHabitFromAI = useCallback((habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    setHabits(prev => [...prev, newHabit]);
  }, [setHabits]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Theme Toggle and Notifications */}
        <div className="flex justify-between items-center mb-6">
          <WelcomeHeader stats={stats} />
          <div className="flex items-center gap-4">
            <NotificationCenter activities={activities} />
            <ThemeToggle />
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full p-1 shadow-lg border border-white/20 dark:border-gray-700/20">
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                  activeTab === 'dashboard' 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                  activeTab === 'analytics' 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('ai-suggestions')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                  activeTab === 'ai-suggestions' 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                AI Assistant
              </button>
              <button
                onClick={() => setActiveTab('enhanced-ai')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                  activeTab === 'enhanced-ai' 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Enhanced AI
              </button>
              <button
                onClick={() => setActiveTab('gamification')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                  activeTab === 'gamification' 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Achievements
              </button>
              <button
                onClick={() => setActiveTab('advanced-gamification')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                  activeTab === 'advanced-gamification' 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Advanced
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                  activeTab === 'social' 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Community
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                  activeTab === 'settings' 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
            {/* Main Content Area */}
            <div className="xl:col-span-3 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TaskManager tasks={tasks} setTasks={handleTaskUpdate} />
                <HabitTracker habits={habits} setHabits={handleHabitUpdate} />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              <StatsCards tasks={tasks} habits={habits} />
              <QuickActions />
              <ActivityFeed activities={activities} />
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <AnalyticsDashboard tasks={tasks} habits={habits} />
        ) : activeTab === 'ai-suggestions' ? (
          <AISuggestions 
            tasks={tasks} 
            habits={habits} 
            onAddTask={handleAddTaskFromAI}
            onAddHabit={handleAddHabitFromAI}
          />
        ) : activeTab === 'enhanced-ai' ? (
          <EnhancedAIDashboard tasks={tasks} habits={habits} />
        ) : activeTab === 'gamification' ? (
          <GamificationDashboard tasks={tasks} habits={habits} />
        ) : activeTab === 'advanced-gamification' ? (
          <AdvancedGamification tasks={tasks} habits={habits} />
        ) : activeTab === 'settings' ? (
          <div className="max-w-2xl mx-auto">
            <AISettings />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SocialSharing 
              tasks={tasks} 
              habits={habits}
            />
            <CommunityFeed />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
