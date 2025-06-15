
interface AnalyticsData {
  dailyStats: DailyStats[];
  weeklyTrends: WeeklyTrend[];
  productivityScore: number;
  insights: Insight[];
  timeDistribution: TimeDistribution[];
  completionTrends: CompletionTrend[];
}

interface DailyStats {
  date: string;
  tasksCompleted: number;
  habitsCompleted: number;
  productivityScore: number;
}

interface WeeklyTrend {
  week: string;
  avgTasksPerDay: number;
  avgHabitsPerDay: number;
  completionRate: number;
}

interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'suggestion';
  title: string;
  description: string;
  icon: string;
  value?: number;
}

interface TimeDistribution {
  category: string;
  value: number;
  color: string;
}

interface CompletionTrend {
  date: string;
  tasks: number;
  habits: number;
}

export class AnalyticsService {
  static generateAnalytics(tasks: any[], habits: any[]): AnalyticsData {
    const dailyStats = this.generateDailyStats(tasks, habits);
    const weeklyTrends = this.generateWeeklyTrends(dailyStats);
    const productivityScore = this.calculateProductivityScore(tasks, habits);
    const insights = this.generateInsights(tasks, habits, dailyStats);
    const timeDistribution = this.generateTimeDistribution(tasks);
    const completionTrends = this.generateCompletionTrends(tasks, habits);

    return {
      dailyStats,
      weeklyTrends,
      productivityScore,
      insights,
      timeDistribution,
      completionTrends
    };
  }

  private static generateDailyStats(tasks: any[], habits: any[]): DailyStats[] {
    const stats: DailyStats[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTasks = tasks.filter(task => 
        task.completed && 
        new Date(task.createdAt).toISOString().split('T')[0] === dateStr
      ).length;
      
      const dayHabits = habits.filter(habit => 
        habit.completedToday && 
        habit.lastCompleted && 
        new Date(habit.lastCompleted).toISOString().split('T')[0] === dateStr
      ).length;
      
      const score = this.calculateDayScore(dayTasks, dayHabits);
      
      stats.push({
        date: dateStr,
        tasksCompleted: dayTasks,
        habitsCompleted: dayHabits,
        productivityScore: score
      });
    }
    
    return stats;
  }

  private static generateWeeklyTrends(dailyStats: DailyStats[]): WeeklyTrend[] {
    const trends: WeeklyTrend[] = [];
    
    // Current week
    const currentWeekStats = dailyStats.slice(-7);
    const avgTasks = currentWeekStats.reduce((sum, day) => sum + day.tasksCompleted, 0) / 7;
    const avgHabits = currentWeekStats.reduce((sum, day) => sum + day.habitsCompleted, 0) / 7;
    const avgCompletion = currentWeekStats.reduce((sum, day) => sum + day.productivityScore, 0) / 7;
    
    trends.push({
      week: 'This Week',
      avgTasksPerDay: Math.round(avgTasks * 10) / 10,
      avgHabitsPerDay: Math.round(avgHabits * 10) / 10,
      completionRate: Math.round(avgCompletion)
    });
    
    return trends;
  }

  private static calculateProductivityScore(tasks: any[], habits: any[]): number {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = Math.max(tasks.length, 1);
    const completedHabits = habits.filter(h => h.completedToday).length;
    const totalHabits = Math.max(habits.length, 1);
    
    const taskScore = (completedTasks / totalTasks) * 50;
    const habitScore = (completedHabits / totalHabits) * 30;
    const streakBonus = Math.min(habits.reduce((sum, h) => sum + h.streak, 0) / 10, 20);
    
    return Math.round(taskScore + habitScore + streakBonus);
  }

  private static generateInsights(tasks: any[], habits: any[], dailyStats: DailyStats[]): Insight[] {
    const insights: Insight[] = [];
    
    // Productivity insights
    const avgScore = dailyStats.reduce((sum, day) => sum + day.productivityScore, 0) / dailyStats.length;
    if (avgScore > 80) {
      insights.push({
        id: 'high-productivity',
        type: 'positive',
        title: 'Exceptional Performance! 🚀',
        description: `Your average productivity score is ${Math.round(avgScore)}%. You're crushing your goals!`,
        icon: '🏆',
        value: avgScore
      });
    }
    
    // Streak insights
    const longestStreak = Math.max(...habits.map(h => h.streak), 0);
    if (longestStreak >= 7) {
      insights.push({
        id: 'streak-master',
        type: 'positive',
        title: 'Streak Master! 🔥',
        description: `Your longest habit streak is ${longestStreak} days. Consistency is key to success!`,
        icon: '🔥',
        value: longestStreak
      });
    }
    
    // Task completion insights
    const completionRate = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;
    if (completionRate < 50) {
      insights.push({
        id: 'low-completion',
        type: 'warning',
        title: 'Focus Opportunity 💡',
        description: `Your task completion rate is ${Math.round(completionRate)}%. Try breaking down larger tasks into smaller ones.`,
        icon: '💡'
      });
    }
    
    // Habit suggestions
    if (habits.length < 3) {
      insights.push({
        id: 'add-habits',
        type: 'suggestion',
        title: 'Build More Habits 🌱',
        description: 'Consider adding 2-3 key habits that align with your goals for compound growth.',
        icon: '🌱'
      });
    }
    
    return insights;
  }

  private static generateTimeDistribution(tasks: any[]): TimeDistribution[] {
    const priorityCount = { high: 0, medium: 0, low: 0 };
    
    tasks.forEach(task => {
      priorityCount[task.priority as keyof typeof priorityCount]++;
    });
    
    const total = Math.max(tasks.length, 1);
    
    return [
      { category: 'High Priority', value: (priorityCount.high / total) * 100, color: '#ef4444' },
      { category: 'Medium Priority', value: (priorityCount.medium / total) * 100, color: '#f59e0b' },
      { category: 'Low Priority', value: (priorityCount.low / total) * 100, color: '#10b981' }
    ];
  }

  private static generateCompletionTrends(tasks: any[], habits: any[]): CompletionTrend[] {
    const trends: CompletionTrend[] = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTasks = tasks.filter(task => 
        task.completed && 
        new Date(task.createdAt).toISOString().split('T')[0] === dateStr
      ).length;
      
      const dayHabits = habits.filter(habit => 
        habit.completedToday && 
        habit.lastCompleted && 
        new Date(habit.lastCompleted).toISOString().split('T')[0] === dateStr
      ).length;
      
      trends.push({
        date: dateStr,
        tasks: dayTasks,
        habits: dayHabits
      });
    }
    
    return trends;
  }

  private static calculateDayScore(tasks: number, habits: number): number {
    return Math.min(Math.round((tasks * 15) + (habits * 20)), 100);
  }
}
