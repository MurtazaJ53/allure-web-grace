
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Activity {
  id: string;
  type: 'task_completed' | 'habit_completed' | 'streak_milestone';
  message: string;
  timestamp: Date;
  icon: string;
  user_id: string;
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchActivities = async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_activity_feed')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedActivities = data.map(activity => ({
        id: activity.id,
        type: activity.type as 'task_completed' | 'habit_completed' | 'streak_milestone',
        message: activity.message,
        timestamp: new Date(activity.created_at),
        icon: activity.icon,
        user_id: activity.user_id
      }));

      setActivities(formattedActivities);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activityData: Omit<Activity, 'id' | 'timestamp' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_activity_feed')
        .insert({
          type: activityData.type,
          message: activityData.message,
          icon: activityData.icon,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newActivity: Activity = {
        id: data.id,
        type: data.type as 'task_completed' | 'habit_completed' | 'streak_milestone',
        message: data.message,
        timestamp: new Date(data.created_at),
        icon: data.icon,
        user_id: data.user_id
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 49)]);
      return newActivity;
    } catch (error: any) {
      console.error('Error adding activity:', error);
      toast({
        title: "Error",
        description: "Failed to add activity",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  return {
    activities,
    loading,
    addActivity,
    refetch: fetchActivities
  };
}
