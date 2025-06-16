
export interface SharedProgress {
  id: string;
  userId: string;
  userName: string;
  type: 'achievement' | 'streak' | 'challenge' | 'level';
  title: string;
  description: string;
  data: any;
  timestamp: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

export interface ShareableContent {
  type: 'achievement' | 'streak' | 'level' | 'challenge' | 'summary';
  title: string;
  description: string;
  data: any;
  shareText: string;
  shareUrl?: string;
}

export class SocialService {
  static generateShareableContent(type: string, data: any): ShareableContent {
    switch (type) {
      case 'achievement':
        return {
          type: 'achievement',
          title: `🏆 Achievement Unlocked: ${data.title}`,
          description: data.description,
          data: data,
          shareText: `🎉 Just unlocked the "${data.title}" achievement! ${data.description} #ProductivityGoals #Achievement`,
        };

      case 'streak':
        return {
          type: 'streak',
          title: `🔥 ${data.streak}-Day Streak!`,
          description: `Maintained a ${data.streak}-day streak with "${data.habitName}"`,
          data: data,
          shareText: `🔥 Just hit a ${data.streak}-day streak with "${data.habitName}"! Consistency is key! #HabitBuilding #Productivity`,
        };

      case 'level':
        return {
          type: 'level',
          title: `⭐ Level Up: ${data.title}`,
          description: `Reached ${data.title} (Level ${data.level}) with ${data.points} points!`,
          data: data,
          shareText: `⭐ Level up! Just reached ${data.title} (Level ${data.level}) in my productivity journey! #LevelUp #Productivity`,
        };

      case 'challenge':
        return {
          type: 'challenge',
          title: `✅ Challenge Complete: ${data.title}`,
          description: data.description,
          data: data,
          shareText: `✅ Completed today's challenge: "${data.title}"! Feeling productive! #DailyChallenge #Productivity`,
        };

      case 'summary':
        return {
          type: 'summary',
          title: `📊 Weekly Progress Summary`,
          description: `Completed ${data.tasks} tasks, maintained ${data.habits} habits, and earned ${data.points} points!`,
          data: data,
          shareText: `📊 This week: ${data.tasks} tasks completed, ${data.habits} habits maintained, ${data.points} points earned! #WeeklyWins #Productivity`,
        };

      default:
        return {
          type: 'summary',
          title: 'Productivity Update',
          description: 'Making progress on my goals!',
          data: {},
          shareText: 'Making great progress on my productivity goals! #Productivity',
        };
    }
  }

  static shareToSocialMedia(content: ShareableContent, platform: 'twitter' | 'linkedin' | 'facebook' | 'copy') {
    const encodedText = encodeURIComponent(content.shareText);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedText}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(content.shareText);
      return Promise.resolve();
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  }

  static generateProgressReport(tasks: any[], habits: any[], timeframe: 'daily' | 'weekly' | 'monthly') {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const habitsCompleted = habits.filter(h => h.completedToday).length;
    const totalHabits = habits.length;
    const habitRate = totalHabits > 0 ? Math.round((habitsCompleted / totalHabits) * 100) : 0;
    
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const avgStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;

    return {
      timeframe,
      tasks: {
        completed: completedTasks,
        total: totalTasks,
        rate: completionRate
      },
      habits: {
        completed: habitsCompleted,
        total: totalHabits,
        rate: habitRate,
        avgStreak
      },
      summary: {
        emoji: completionRate >= 80 ? '🚀' : completionRate >= 60 ? '💪' : '📈',
        message: completionRate >= 80 ? 'Crushing it!' : completionRate >= 60 ? 'Great progress!' : 'Building momentum!'
      }
    };
  }

  static formatProgressText(report: any): string {
    const { timeframe, tasks, habits, summary } = report;
    return `${summary.emoji} ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Update:
    
📝 Tasks: ${tasks.completed}/${tasks.total} (${tasks.rate}%)
🎯 Habits: ${habits.completed}/${habits.total} (${habits.rate}%)
🔥 Avg Streak: ${habits.avgStreak} days

${summary.message} #Productivity #Goals`;
  }
}
