
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { habitsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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

  const fetchHabits = async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      const data = await habitsApi.list();
      const formattedHabits = data.map(habit => ({
        id: habit.id,
        name: habit.name,
        streak: habit.streak,
        completedToday: habit.completedToday,
        createdAt: new Date(habit.createdAt),
        lastCompleted: habit.lastCompleted ? new Date(habit.lastCompleted) : undefined,
        category: habit.category,
        targetFrequency: habit.targetFrequency as 'daily' | 'weekly',
        user_id: habit.userId
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
      const newHabitData = {
        name: habitData.name,
        streak: habitData.streak,
        completedToday: habitData.completedToday,
        category: habitData.category,
        targetFrequency: habitData.targetFrequency,
        lastCompleted: habitData.lastCompleted?.toISOString(),
        userId: user.id
      };

      const data = await habitsApi.create(newHabitData);

      const newHabit: Habit = {
        id: data.id,
        name: data.name,
        streak: data.streak,
        completedToday: data.completedToday,
        createdAt: new Date(data.createdAt),
        lastCompleted: data.lastCompleted ? new Date(data.lastCompleted) : undefined,
        category: data.category,
        targetFrequency: data.targetFrequency as 'daily' | 'weekly',
        user_id: data.userId
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

      await habitsApi.update(id, dbUpdates);

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
      await habitsApi.delete(id);

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
