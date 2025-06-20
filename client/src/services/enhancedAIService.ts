
export interface SmartScheduleSlot {
  time: string;
  activity: string;
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: number;
  reasoning: string;
  energyLevel: 'high' | 'medium' | 'low';
}

export interface ProductivityInsight {
  id: string;
  title: string;
  description: string;
  type: 'pattern' | 'recommendation' | 'warning' | 'opportunity';
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  confidence: number;
}

export interface HabitOptimization {
  habitId: string;
  currentPerformance: number;
  suggestedChanges: string[];
  predictedImprovement: number;
  reasoning: string;
}

export interface WorkloadBalance {
  currentLoad: number;
  optimalLoad: number;
  suggestions: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export class EnhancedAIService {
  private static apiKey: string | null = null;

  static setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('ai-api-key', key);
  }

  static getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    return localStorage.getItem('ai-api-key');
  }

  static async generateSmartSchedule(tasks: any[], habits: any[], userPreferences: any): Promise<SmartScheduleSlot[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not provided');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'You are an expert productivity coach. Generate a smart daily schedule based on tasks, habits, and user preferences. Return a JSON array of schedule slots with time, activity, priority, estimatedDuration, reasoning, and energyLevel.'
            },
            {
              role: 'user',
              content: `Please create an optimized daily schedule for:
              Tasks: ${JSON.stringify(tasks)}
              Habits: ${JSON.stringify(habits)}
              Preferences: ${JSON.stringify(userPreferences)}
              
              Focus on energy optimization, task batching, and habit stacking.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the AI response and return structured data
      try {
        return JSON.parse(content);
      } catch {
        // Fallback schedule if parsing fails
        return this.generateFallbackSchedule();
      }
    } catch (error) {
      console.error('Error generating smart schedule:', error);
      return this.generateFallbackSchedule();
    }
  }

  static async generateProductivityInsights(analytics: any): Promise<ProductivityInsight[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return this.generateFallbackInsights();
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'You are a productivity analytics expert. Analyze user data and provide actionable insights. Return a JSON array of insights with id, title, description, type, impact, actionable, and confidence fields.'
            },
            {
              role: 'user',
              content: `Analyze this productivity data and provide insights:
              ${JSON.stringify(analytics)}
              
              Focus on patterns, trends, and actionable recommendations.`
            }
          ],
          temperature: 0.5,
          max_tokens: 1500,
        }),
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch {
        return this.generateFallbackInsights();
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.generateFallbackInsights();
    }
  }

  static async optimizeHabits(habits: any[]): Promise<HabitOptimization[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return this.generateFallbackOptimizations(habits);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'You are a habit optimization expert. Analyze habits and suggest improvements. Return a JSON array with habitId, currentPerformance, suggestedChanges, predictedImprovement, and reasoning.'
            },
            {
              role: 'user',
              content: `Optimize these habits:
              ${JSON.stringify(habits)}
              
              Suggest specific, actionable improvements.`
            }
          ],
          temperature: 0.6,
          max_tokens: 1500,
        }),
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch {
        return this.generateFallbackOptimizations(habits);
      }
    } catch (error) {
      console.error('Error optimizing habits:', error);
      return this.generateFallbackOptimizations(habits);
    }
  }

  private static generateFallbackSchedule(): SmartScheduleSlot[] {
    return [
      {
        time: '9:00 AM',
        activity: 'Deep Work Session',
        priority: 'high',
        estimatedDuration: 90,
        reasoning: 'Morning hours are optimal for focused work',
        energyLevel: 'high'
      },
      {
        time: '11:00 AM',
        activity: 'Habit: Exercise',
        priority: 'medium',
        estimatedDuration: 30,
        reasoning: 'Physical activity boosts energy for the day',
        energyLevel: 'medium'
      },
      {
        time: '2:00 PM',
        activity: 'Administrative Tasks',
        priority: 'low',
        estimatedDuration: 60,
        reasoning: 'Post-lunch period good for routine tasks',
        energyLevel: 'medium'
      }
    ];
  }

  private static generateFallbackInsights(): ProductivityInsight[] {
    return [
      {
        id: 'consistency-pattern',
        title: 'Consistency Pattern Detected',
        description: 'Your productivity peaks on weekdays between 9-11 AM. Consider scheduling important tasks during this window.',
        type: 'pattern',
        impact: 'high',
        actionable: true,
        confidence: 85
      },
      {
        id: 'habit-optimization',
        title: 'Habit Stacking Opportunity',
        description: 'You could link your reading habit to your morning coffee routine for better consistency.',
        type: 'recommendation',
        impact: 'medium',
        actionable: true,
        confidence: 70
      }
    ];
  }

  private static generateFallbackOptimizations(habits: any[]): HabitOptimization[] {
    return habits.map(habit => ({
      habitId: habit.id,
      currentPerformance: habit.streak > 7 ? 80 : 60,
      suggestedChanges: [
        'Start with smaller, more achievable goals',
        'Link this habit to an existing routine',
        'Track progress more consistently'
      ],
      predictedImprovement: 25,
      reasoning: 'Small, consistent improvements lead to better long-term success'
    }));
  }
}
