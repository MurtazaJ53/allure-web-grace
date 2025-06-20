export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (stats: any) => boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'tasks' | 'habits' | 'productivity';
  target: number;
  points: number;
  progress: number;
  completed: boolean;
  expiresAt: string;
}

export interface LevelInfo {
  currentLevel: number;
  currentLevelName: string;
  pointsInCurrentLevel: number;
  pointsToNextLevel: number;
  progressPercentage: number;
  totalPoints: number;
}

export class GamificationService {
  static ACHIEVEMENTS: Achievement[] = [
    {
      id: 'first-task',
      title: 'Getting Started',
      description: 'Complete your first task',
      icon: '🎯',
      points: 10,
      rarity: 'common',
      condition: (stats) => stats.completedTasks >= 1
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      icon: '✅',
      points: 50,
      rarity: 'rare',
      condition: (stats) => stats.completedTasks >= 10
    },
    {
      id: 'habit-starter',
      title: 'Habit Starter',
      description: 'Create your first habit',
      icon: '🌱',
      points: 15,
      rarity: 'common',
      condition: (stats) => stats.totalHabits >= 1
    },
    {
      id: 'streak-week',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      points: 100,
      rarity: 'epic',
      condition: (stats) => stats.maxStreak >= 7
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete all habits in a day',
      icon: '💎',
      points: 75,
      rarity: 'rare',
      condition: (stats) => stats.allHabitsCompleted && stats.totalHabits > 0
    }
  ];

  static LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 17000];
  static LEVEL_NAMES = [
    'Beginner', 'Novice', 'Apprentice', 'Practitioner', 'Expert',
    'Master', 'Grandmaster', 'Legend', 'Mythic', 'Transcendent', 'Infinite'
  ];

  static getProgressToNextLevel(totalPoints: number): LevelInfo {
    let currentLevel = 0;
    for (let i = 0; i < this.LEVEL_THRESHOLDS.length; i++) {
      if (totalPoints >= this.LEVEL_THRESHOLDS[i]) {
        currentLevel = i;
      } else {
        break;
      }
    }

    const currentLevelPoints = this.LEVEL_THRESHOLDS[currentLevel] || 0;
    const nextLevelPoints = this.LEVEL_THRESHOLDS[currentLevel + 1] || this.LEVEL_THRESHOLDS[this.LEVEL_THRESHOLDS.length - 1];
    const pointsInCurrentLevel = totalPoints - currentLevelPoints;
    const pointsToNextLevel = nextLevelPoints - totalPoints;
    const progressPercentage = ((pointsInCurrentLevel) / (nextLevelPoints - currentLevelPoints)) * 100;

    return {
      currentLevel: currentLevel + 1,
      currentLevelName: this.LEVEL_NAMES[currentLevel] || 'Max Level',
      pointsInCurrentLevel,
      pointsToNextLevel: Math.max(0, pointsToNextLevel),
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      totalPoints
    };
  }

  static checkAchievements(stats: any, unlockedAchievements: string[]): Achievement[] {
    return this.ACHIEVEMENTS.filter(achievement => 
      !unlockedAchievements.includes(achievement.id) && 
      achievement.condition(stats)
    );
  }

  static generateDailyChallenges(): DailyChallenge[] {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const challenges: DailyChallenge[] = [
      {
        id: 'daily-tasks',
        title: 'Task Champion',
        description: 'Complete 3 tasks today',
        type: 'tasks',
        target: 3,
        points: 30,
        progress: 0,
        completed: false,
        expiresAt: tomorrow.toISOString()
      },
      {
        id: 'daily-habits',
        title: 'Habit Hero',
        description: 'Complete all your habits today',
        type: 'habits',
        target: 1,
        points: 50,
        progress: 0,
        completed: false,
        expiresAt: tomorrow.toISOString()
      },
      {
        id: 'daily-productivity',
        title: 'Productivity Pro',
        description: 'Achieve 80% task completion rate',
        type: 'productivity',
        target: 80,
        points: 40,
        progress: 0,
        completed: false,
        expiresAt: tomorrow.toISOString()
      }
    ];

    return challenges;
  }
}