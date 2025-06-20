
export interface TaskSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  estimatedTime: number; // in minutes
  reasoning: string;
}

export interface HabitSuggestion {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly';
  difficulty: 'easy' | 'medium' | 'hard';
  reasoning: string;
}

export interface OptimizationSuggestion {
  id: string;
  type: 'schedule' | 'habit' | 'goal';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionSteps: string[];
}

export class AIService {
  static generateTaskSuggestions(tasks: any[], habits: any[], currentTime: Date = new Date()): TaskSuggestion[] {
    const suggestions: TaskSuggestion[] = [];
    const completedTasksCount = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const hour = currentTime.getHours();
    
    // Morning productivity tasks
    if (hour >= 6 && hour < 12 && completedTasksCount < 3) {
      suggestions.push({
        id: 'morning-focus-1',
        title: 'Deep Work Session',
        description: 'Tackle your most challenging task while your mind is fresh',
        priority: 'high',
        category: 'productivity',
        estimatedTime: 90,
        reasoning: 'Morning hours are optimal for complex cognitive tasks'
      });
    }

    // Afternoon organization tasks
    if (hour >= 12 && hour < 17) {
      suggestions.push({
        id: 'afternoon-org-1',
        title: 'Inbox Zero Challenge',
        description: 'Clear and organize your email inbox',
        priority: 'medium',
        category: 'organization',
        estimatedTime: 30,
        reasoning: 'Afternoon energy is perfect for administrative tasks'
      });
    }

    // Evening reflection tasks
    if (hour >= 17 && hour < 22) {
      suggestions.push({
        id: 'evening-reflect-1',
        title: 'Daily Review & Planning',
        description: 'Review today\'s accomplishments and plan tomorrow',
        priority: 'medium',
        category: 'planning',
        estimatedTime: 15,
        reasoning: 'Evening reflection helps consolidate learning and prepare for tomorrow'
      });
    }

    // Task completion based suggestions
    if (totalTasks > 0 && (completedTasksCount / totalTasks) < 0.5) {
      suggestions.push({
        id: 'quick-win-1',
        title: 'Quick Win Task',
        description: 'Complete a simple 5-minute task to build momentum',
        priority: 'low',
        category: 'motivation',
        estimatedTime: 5,
        reasoning: 'Small wins create positive momentum for larger tasks'
      });
    }

    return suggestions;
  }

  static generateHabitSuggestions(habits: any[], tasks: any[]): HabitSuggestion[] {
    const suggestions: HabitSuggestion[] = [];
    const currentHabits = habits.map(h => h.name.toLowerCase());
    
    // Basic productivity habits
    if (!currentHabits.some(h => h.includes('water') || h.includes('hydrat'))) {
      suggestions.push({
        id: 'habit-water-1',
        name: 'Drink 8 Glasses of Water',
        description: 'Stay hydrated throughout the day for better focus and energy',
        category: 'health',
        frequency: 'daily',
        difficulty: 'easy',
        reasoning: 'Proper hydration improves cognitive function and productivity'
      });
    }

    if (!currentHabits.some(h => h.includes('exercise') || h.includes('workout'))) {
      suggestions.push({
        id: 'habit-exercise-1',
        name: '20-Minute Morning Exercise',
        description: 'Start your day with light exercise or stretching',
        category: 'fitness',
        frequency: 'daily',
        difficulty: 'medium',
        reasoning: 'Morning exercise boosts energy and mental clarity for the day'
      });
    }

    if (!currentHabits.some(h => h.includes('read') || h.includes('book'))) {
      suggestions.push({
        id: 'habit-reading-1',
        name: 'Read for 15 Minutes',
        description: 'Read books, articles, or educational content daily',
        category: 'learning',
        frequency: 'daily',
        difficulty: 'easy',
        reasoning: 'Regular reading enhances knowledge and cognitive abilities'
      });
    }

    if (!currentHabits.some(h => h.includes('meditat') || h.includes('mindful'))) {
      suggestions.push({
        id: 'habit-meditation-1',
        name: '10-Minute Meditation',
        description: 'Practice mindfulness or meditation to reduce stress',
        category: 'wellness',
        frequency: 'daily',
        difficulty: 'medium',
        reasoning: 'Meditation improves focus, reduces stress, and enhances emotional well-being'
      });
    }

    return suggestions;
  }

  static generateOptimizationSuggestions(tasks: any[], habits: any[], analytics: any): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // Schedule optimization
    if (analytics.productivityScore < 60) {
      suggestions.push({
        id: 'opt-schedule-1',
        type: 'schedule',
        title: 'Optimize Your Daily Schedule',
        description: 'Your productivity score suggests room for improvement in time management',
        impact: 'high',
        actionSteps: [
          'Time-block your most important tasks',
          'Identify and eliminate time wasters',
          'Set specific work hours and break times',
          'Use the Pomodoro Technique for focused work'
        ]
      });
    }

    // Habit stacking
    const habitsWithLowStreaks = habits.filter(h => h.streak < 7).length;
    if (habitsWithLowStreaks > habits.length * 0.5) {
      suggestions.push({
        id: 'opt-habit-1',
        type: 'habit',
        title: 'Implement Habit Stacking',
        description: 'Many habits have low streaks. Try linking new habits to existing routines',
        impact: 'medium',
        actionSteps: [
          'Choose one existing strong routine',
          'Attach a new small habit immediately after',
          'Start with just 2-3 minutes per habit',
          'Track completion consistently'
        ]
      });
    }

    // Goal setting
    const completionRate = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;
    if (completionRate < 70) {
      suggestions.push({
        id: 'opt-goal-1',
        type: 'goal',
        title: 'Refine Your Goal Setting',
        description: 'Your task completion rate could be improved with better goal setting',
        impact: 'high',
        actionSteps: [
          'Break large tasks into smaller, actionable steps',
          'Set deadlines for each task',
          'Prioritize tasks using the Eisenhower Matrix',
          'Review and adjust goals weekly'
        ]
      });
    }

    return suggestions;
  }

  static predictOptimalSchedule(tasks: any[], habits: any[]): { timeSlot: string; activity: string; reasoning: string }[] {
    const schedule = [];
    
    // Morning (6-9 AM)
    schedule.push({
      timeSlot: '6:00-7:00 AM',
      activity: 'Morning Routine & Exercise',
      reasoning: 'Start with energy-boosting activities when willpower is highest'
    });

    schedule.push({
      timeSlot: '7:00-9:00 AM',
      activity: 'Deep Work - High Priority Tasks',
      reasoning: 'Peak cognitive performance time for complex problem-solving'
    });

    // Mid-Morning (9-12 PM)
    schedule.push({
      timeSlot: '9:00-12:00 PM',
      activity: 'Focused Work Sessions',
      reasoning: 'Maintain momentum with structured work blocks and short breaks'
    });

    // Afternoon (12-5 PM)
    schedule.push({
      timeSlot: '12:00-1:00 PM',
      activity: 'Lunch & Mental Break',
      reasoning: 'Recharge with proper nutrition and mental rest'
    });

    schedule.push({
      timeSlot: '1:00-3:00 PM',
      activity: 'Collaborative Work & Meetings',
      reasoning: 'Social energy peaks are ideal for teamwork and communication'
    });

    schedule.push({
      timeSlot: '3:00-5:00 PM',
      activity: 'Administrative Tasks & Planning',
      reasoning: 'Handle routine tasks when decision fatigue starts to set in'
    });

    // Evening (5-10 PM)
    schedule.push({
      timeSlot: '5:00-7:00 PM',
      activity: 'Personal Time & Light Activities',
      reasoning: 'Transition to personal life with relaxing or light physical activities'
    });

    schedule.push({
      timeSlot: '7:00-9:00 PM',
      activity: 'Learning & Skill Development',
      reasoning: 'Evening is great for passive learning and creative activities'
    });

    schedule.push({
      timeSlot: '9:00-10:00 PM',
      activity: 'Reflection & Tomorrow\'s Planning',
      reasoning: 'End the day with reflection and preparation for tomorrow'
    });

    return schedule;
  }
}
