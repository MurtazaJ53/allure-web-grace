
import { TrendingUp, CheckCircle, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  createdAt: Date;
}

interface StatsCardsProps {
  tasks: Task[];
  habits: Habit[];
}

export const StatsCards = ({ tasks, habits }: StatsCardsProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const habitsCompletedToday = habits.filter(habit => habit.completedToday).length;
  const avgStreak = habits.length > 0 ? Math.round(totalStreak / habits.length) : 0;

  const stats = [
    {
      title: "Tasks Completed",
      value: `${completedTasks}/${totalTasks}`,
      subtitle: `${completionRate}% completion rate`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Active Habits",
      value: habits.length.toString(),
      subtitle: `${habitsCompletedToday} completed today`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Average Streak",
      value: `${avgStreak} days`,
      subtitle: `${totalStreak} total streak days`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "This Week",
      value: "7 days",
      subtitle: "Keep up the momentum!",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
