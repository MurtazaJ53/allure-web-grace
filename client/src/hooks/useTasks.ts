
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { useToast } from '@/hooks/use-toast';
import { tasksApi } from '@/lib/api';

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
      const data = await tasksApi.list();
      const formattedTasks = data.map(task => ({
        id: task.id,
        text: task.text,
        completed: task.completed,
        createdAt: new Date(task.createdAt),
        priority: task.priority as 'low' | 'medium' | 'high',
        category: task.category,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        user_id: task.userId
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
      const newTaskData = {
        text: taskData.text,
        completed: taskData.completed,
        priority: taskData.priority,
        category: taskData.category,
        dueDate: taskData.dueDate?.toISOString(),
        userId: user.id
      };

      const data = await tasksApi.create(newTaskData);

      const newTask: Task = {
        id: data.id,
        text: data.text,
        completed: data.completed,
        createdAt: new Date(data.createdAt),
        priority: data.priority as 'low' | 'medium' | 'high',
        category: data.category,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        user_id: data.userId
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
      if (updates.dueDate !== undefined) dbUpdates.dueDate = updates.dueDate?.toISOString();

      await tasksApi.update(id, dbUpdates);

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
      await tasksApi.delete(id);
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
