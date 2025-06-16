
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'tasks' | 'habits' | 'streaks' | 'consistency' | 'productivity';
  condition: (data: any) => boolean;
  points: number;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserLevel {
  level: number;
  title: string;
  pointsRequired: number;
  color: string;
  icon: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'tasks' | 'habits' | 'productivity';
  target: number;
  progress: number;
  points: number;
  expiresAt: Date;
  completed: boolean;
}

export class GamificationService {
  static readonly USER_LEVELS: UserLevel[] = [
    { level: 1, title: 'Beginner', pointsRequired: 0, color: 'text-gray-600 bg-gray-100', icon: '🌱' },
    { level: 2, title: 'Motivated', pointsRequired: 100, color: 'text-green-600 bg-green-100', icon: '💪' },
    { level: 3, title: 'Focused', pointsRequired: 300, color: 'text-blue-600 bg-blue-100', icon: '🎯' },
    { level: 4, title: 'Dedicated', pointsRequired: 600, color: 'text-purple-600 bg-purple-100', icon: '⭐' },
    { level: 5, title: 'Champion', pointsRequired: 1000, color: 'text-yellow-600 bg-yellow-100', icon: '🏆' },
    { level: 6, title: 'Master', pointsRequired: 1500, color: 'text-orange-600 bg-orange-100', icon: '💎' },
    { level: 7, title: 'Legend', pointsRequired: 2500, color: 'text-red-600 bg-red-100', icon: '👑' },
  ];

  static readonly ACHIEVEMENTS: Achievement[] = [
    {
      id: 'first-task',
      title: 'Getting Started',
      description: 'Complete your first task',
      icon: '✅',
      category: 'tasks',
      condition: (data) => data.completedTasks >= 1,
      points: 10,
      rarity: 'common'
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 100 tasks',
      icon: '🎯',
      category: 'tasks',
      condition: (data) => data.completedTasks >= 100,
      points: 100,
      rarity: 'epic'
    },
    {
      id: 'habit-starter',
      title: 'Habit Builder',
      description: 'Create your first habit',
      icon: '🌱',
      category: 'habits',
      condition: (data) => data.totalHabits >= 1,
      points: 15,
      rarity: 'common'
    },
    {
      id: 'streak-warrior',
      title: 'Streak Warrior',
      description: 'Maintain a 30-day streak',
      icon: '🔥',
      category: 'streaks',
      condition: (data) => data.maxStreak >= 30,
      points: 150,
      rarity: 'rare'
    },
    {
      id: 'consistency-king',
      title: 'Consistency King',
      description: 'Complete all habits for 7 days straight',
      icon: '👑',
      category: 'consistency',
      condition: (data) => data.perfectDays >= 7,
      points: 200,
      rarity: 'epic'
    },
    {
      id: 'productivity-guru',
      title: 'Productivity Guru',
      description: 'Achieve 90% task completion rate',
      icon: '⚡',
      category: 'productivity',
      condition: (data) => data.completionRate >= 90,
      points: 75,
      rarity: 'rare'
    },
    {
      id: 'legendary-achiever',
      title: 'Legendary Achiever',
      description: 'Reach 1000 total points',
      icon: '🌟',
      category: 'productivity',
      condition: (data) => data.totalPoints >= 1000,
      points: 300,
      rarity: 'legendary'
    }
  ];

  static calculateUserLevel(totalPoints: number): UserLevel {
    for (let i = this.USER_LEVELS.length - 1; i >= 0; i--) {
      if (totalPoints >= this.USER_LEVELS[i].pointsRequired) {
        return this.USER_LEVELS[i];
      }
    }
    return this.USER_LEVELS[0];
  }

  static getProgressToNextLevel(totalPoints: number): { current: UserLevel; next: UserLevel | null; progress: number } {
    const currentLevel = this.calculateUserLevel(totalPoints);
    const currentIndex = this.USER_LEVELS.findIndex(l => l.level === currentLevel.level);
    const nextLevel = currentIndex < this.USER_LEVELS.length - 1 ? this.USER_LEVELS[currentIndex + 1] : null;
    
    if (!nextLevel) {
      return { current: currentLevel, next: null, progress: 100 };
    }

    const progress = ((totalPoints - currentLevel.pointsRequired) / (nextLevel.pointsRequired - currentLevel.pointsRequired)) * 100;
    return { current: currentLevel, next: nextLevel, progress: Math.min(progress, 100) };
  }

  static checkAchievements(data: any, unlockedAchievements: string[]): Achievement[] {
    return this.ACHIEVEMENTS.filter(achievement => 
      !unlockedAchievements.includes(achievement.id) && achievement.condition(data)
    );
  }

  static generateDailyChallenges(): DailyChallenge[] {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const challenges = [
      {
        id: 'daily-tasks',
        title: 'Daily Achiever',
        description: 'Complete 5 tasks today',
        type: 'tasks' as const,
        target: 5,
        progress: 0,
        points: 25,
        expiresAt: tomorrow,
        completed: false
      },
      {
        id: 'habit-streak',
        title: 'Habit Hero',
        description: 'Complete all your habits today',
        type: 'habits' as const,
        target: 1,
        progress: 0,
        points: 30,
        expiresAt: tomorrow,
        completed: false
      },
      {
        id: 'productivity-boost',
        title: 'Productivity Boost',
        description: 'Maintain 80% completion rate',
        type: 'productivity' as const,
        target: 80,
        progress: 0,
        points: 35,
        expiresAt: tomorrow,
        completed: false
      }
    ];

    return challenges;
  }

  static calculatePoints(action: string, data?: any): number {
    const pointValues = {
      'task_completed': 5,
      'habit_completed': 10,
      'streak_milestone_7': 25,
      'streak_milestone_14': 50,
      'streak_milestone_30': 100,
      'perfect_day': 40,
      'challenge_completed': 25
    };

    return pointValues[action as keyof typeof pointValues] || 0;
  }
}
