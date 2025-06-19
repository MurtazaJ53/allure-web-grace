
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
  user_id: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks = data.map(task => ({
        id: task.id,
        text: task.text,
        completed: task.completed,
        createdAt: new Date(task.created_at),
        priority: task.priority as 'low' | 'medium' | 'high',
        category: task.category,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        user_id: task.user_id
      }));

      setTasks(formattedTasks);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          text: taskData.text,
          completed: taskData.completed,
          priority: taskData.priority,
          category: taskData.category,
          due_date: taskData.dueDate?.toISOString(),
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        text: data.text,
        completed: data.completed,
        createdAt: new Date(data.created_at),
        priority: data.priority as 'low' | 'medium' | 'high',
        category: data.category,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        user_id: data.user_id
      };

      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      });
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'user_id'>>) => {
    if (!user) return;

    try {
      const dbUpdates: any = {};
      if (updates.text !== undefined) dbUpdates.text = updates.text;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate?.toISOString();

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
}
