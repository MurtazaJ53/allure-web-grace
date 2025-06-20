
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { activitiesApi } from '@/lib/api';
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
      const data = await activitiesApi.list(user.id);
      const formattedActivities = data.map(activity => ({
        id: activity.id,
        type: activity.type as 'task_completed' | 'habit_completed' | 'streak_milestone',
        message: activity.message,
        timestamp: new Date(activity.createdAt),
        icon: activity.icon,
        user_id: activity.userId
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
      const newActivityData = {
        type: activityData.type,
        message: activityData.message,
        icon: activityData.icon,
        userId: user.id
      };

      const data = await activitiesApi.create(newActivityData);

      const newActivity: Activity = {
        id: data.id,
        type: data.type as 'task_completed' | 'habit_completed' | 'streak_milestone',
        message: data.message,
        timestamp: new Date(data.createdAt),
        icon: data.icon,
        user_id: data.userId
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
