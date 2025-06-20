
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { UserProfile } from '@/components/UserProfile';
import { TaskManagerDB } from '@/components/TaskManagerDB';
import { HabitTrackerDB } from '@/components/HabitTrackerDB';
import { StatsCards } from '@/components/StatsCards';
import { WelcomeHeader } from '@/components/WelcomeHeader';
import { QuickActions } from '@/components/QuickActions';
import { ActivityFeedDB } from '@/components/ActivityFeedDB';
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
import { useTasks, Task } from '@/hooks/useTasks';
import { useHabits, Habit } from '@/hooks/useHabits';
import { useActivities } from '@/hooks/useActivities';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LoadingDemo } from '@/components/LoadingDemo';

type TabType = 'dashboard' | 'analytics' | 'ai-suggestions' | 'enhanced-ai' | 'gamification' | 'advanced-gamification' | 'social' | 'settings' | 'profile' | 'loading-demo';

const Index = () => {
  const { tasks, loading: tasksLoading } = useTasks();
  const { habits, loading: habitsLoading } = useHabits();
  const { activities, addActivity } = useActivities();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [lastProcessedTasks, setLastProcessedTasks] = useState<Set<string>>(new Set());
  const [lastProcessedHabits, setLastProcessedHabits] = useState<Set<string>>(new Set());
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

  // Track completed tasks for activity feed
  useEffect(() => {
    if (tasks.length === 0) return;

    const completedTasks = tasks.filter(task => task.completed);
    const newlyCompletedTasks = completedTasks.filter(task => !lastProcessedTasks.has(task.id));

    if (newlyCompletedTasks.length > 0) {
      newlyCompletedTasks.forEach(async (task) => {
        console.log('Adding task completion activity for:', task.text);
        
        await addActivity({
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

      // Update the set of processed tasks
      setLastProcessedTasks(new Set([...lastProcessedTasks, ...newlyCompletedTasks.map(t => t.id)]));
    }
  }, [tasks, lastProcessedTasks, addActivity, toast]);

  // Track completed habits for activity feed
  useEffect(() => {
    if (habits.length === 0) return;

    const completedHabits = habits.filter(habit => habit.completedToday);
    const newlyCompletedHabits = completedHabits.filter(habit => !lastProcessedHabits.has(habit.id));

    if (newlyCompletedHabits.length > 0) {
      newlyCompletedHabits.forEach(async (habit) => {
        console.log('Adding habit completion activity for:', habit.name);
        
        await addActivity({
          type: 'habit_completed',
          message: `Completed habit: "${habit.name}"`,
          icon: '🎯'
        });
        
        toast({
          title: "Habit Completed! 💪",
          description: `Keep it up! Streak: ${habit.streak} days`,
          duration: 3000,
        });

        // Check for streak milestones
        if (habit.streak > 0 && habit.streak % 7 === 0) {
          await addActivity({
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

      // Update the set of processed habits
      setLastProcessedHabits(new Set([...lastProcessedHabits, ...newlyCompletedHabits.map(h => h.id)]));
    }
  }, [habits, lastProcessedHabits, addActivity, toast]);

  // AI suggestions handlers (these would need to be updated to work with the new data structure)
  const handleAddTaskFromAI = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'user_id'>) => {
    // This would need to be implemented with the actual task creation logic
    console.log('Add task from AI:', task);
  }, []);

  const handleAddHabitFromAI = useCallback((habit: Omit<Habit, 'id' | 'createdAt' | 'user_id'>) => {
    // This would need to be implemented with the actual habit creation logic
    console.log('Add habit from AI:', habit);
  }, []);

  const isDataLoading = tasksLoading || habitsLoading || isLoading;

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <LoadingSpinner 
          size="xl" 
          variant="orbit" 
          message="Loading your dashboard..."
        />
      </div>
    );
  }

  return (
    <AuthGuard>
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
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                    activeTab === 'profile' 
                      ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  Profile
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
                <button
                  onClick={() => setActiveTab('loading-demo')}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                    activeTab === 'loading-demo' 
                      ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  Loading Demo
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
              {/* Main Content Area */}
              <div className="xl:col-span-3 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <TaskManagerDB />
                  <HabitTrackerDB />
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                <StatsCards tasks={tasks} habits={habits} />
                <QuickActions />
                <ActivityFeedDB />
              </div>
            </div>
          ) : activeTab === 'profile' ? (
            <div className="max-w-2xl mx-auto">
              <UserProfile />
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
          ) : activeTab === 'loading-demo' ? (
            <LoadingDemo />
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
    </AuthGuard>
  );
};

export default Index;
