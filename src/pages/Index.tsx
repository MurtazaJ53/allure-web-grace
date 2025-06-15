
import { useState, useEffect, useCallback, useMemo } from 'react';
import { TaskManager } from '@/components/TaskManager';
import { HabitTracker } from '@/components/HabitTracker';
import { StatsCards } from '@/components/StatsCards';
import { WelcomeHeader } from '@/components/WelcomeHeader';
import { QuickActions } from '@/components/QuickActions';
import { ActivityFeed } from '@/components/ActivityFeed';
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

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('productivity-tasks', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('productivity-habits', []);
  const [activities, setActivities] = useLocalStorage<Activity[]>('productivity-activities', []);
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <WelcomeHeader stats={stats} />
        
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
      </div>
    </div>
  );
};

export default Index;
