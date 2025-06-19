
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useActivities } from '@/hooks/useActivities';

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  createdAt: Date;
  lastCompleted?: Date;
  category?: string;
  targetFrequency: 'daily' | 'weekly';
  user_id: string;
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { addActivity } = useActivities();

  const fetchHabits = async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHabits = data.map(habit => ({
        id: habit.id,
        name: habit.name,
        streak: habit.streak,
        completedToday: habit.completed_today,
        createdAt: new Date(habit.created_at),
        lastCompleted: habit.last_completed ? new Date(habit.last_completed) : undefined,
        category: habit.category,
        targetFrequency: habit.target_frequency as 'daily' | 'weekly',
        user_id: habit.user_id
      }));

      setHabits(formattedHabits);
    } catch (error: any) {
      console.error('Error fetching habits:', error);
      toast({
        title: "Error",
        description: "Failed to load habits",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          name: habitData.name,
          streak: habitData.streak,
          completed_today: habitData.completedToday,
          category: habitData.category,
          target_frequency: habitData.targetFrequency,
          last_completed: habitData.lastCompleted?.toISOString(),
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newHabit: Habit = {
        id: data.id,
        name: data.name,
        streak: data.streak,
        completedToday: data.completed_today,
        createdAt: new Date(data.created_at),
        lastCompleted: data.last_completed ? new Date(data.last_completed) : undefined,
        category: data.category,
        targetFrequency: data.target_frequency as 'daily' | 'weekly',
        user_id: data.user_id
      };

      setHabits(prev => [newHabit, ...prev]);
      return newHabit;
    } catch (error: any) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to add habit",
        variant: "destructive"
      });
    }
  };

  const updateHabit = async (id: string, updates: Partial<Omit<Habit, 'id' | 'user_id'>>) => {
    if (!user) return;

    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
      if (updates.completedToday !== undefined) dbUpdates.completed_today = updates.completedToday;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.targetFrequency !== undefined) dbUpdates.target_frequency = updates.targetFrequency;
      if (updates.lastCompleted !== undefined) dbUpdates.last_completed = updates.lastCompleted?.toISOString();

      const { error } = await supabase
        .from('habits')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Log activity when habit is marked as completed today
      if (updates.completedToday === true) {
        const habit = habits.find(h => h.id === id);
        if (habit && !habit.completedToday) {
          await addActivity({
            type: 'habit_completed',
            message: `Completed habit: "${habit.name}"`,
            icon: '🎯'
          });

          // Log streak milestone if it's a significant milestone
          const newStreak = updates.streak || habit.streak;
          if (newStreak > 0 && (newStreak % 7 === 0 || newStreak % 30 === 0)) {
            await addActivity({
              type: 'streak_milestone',
              message: `Reached ${newStreak}-day streak for "${habit.name}"! 🔥`,
              icon: '🔥'
            });
          }
        }
      }

      setHabits(prev => prev.map(habit => 
        habit.id === id ? { ...habit, ...updates } : habit
      ));
    } catch (error: any) {
      console.error('Error updating habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive"
      });
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits(prev => prev.filter(habit => habit.id !== id));
    } catch (error: any) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    refetch: fetchHabits
  };
}
