
import { useState, useEffect } from 'react';
import { TaskManager } from '@/components/TaskManager';
import { HabitTracker } from '@/components/HabitTracker';
import { StatsCards } from '@/components/StatsCards';
import { WelcomeHeader } from '@/components/WelcomeHeader';
import { QuickActions } from '@/components/QuickActions';

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('productivity-tasks');
    const savedHabits = localStorage.getItem('productivity-habits');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('productivity-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem('productivity-habits', JSON.stringify(habits));
  }, [habits]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <WelcomeHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <TaskManager tasks={tasks} setTasks={setTasks} />
            <HabitTracker habits={habits} setHabits={setHabits} />
          </div>
          
          <div className="space-y-8">
            <StatsCards tasks={tasks} habits={habits} />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
