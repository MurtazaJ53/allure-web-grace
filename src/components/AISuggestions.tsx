
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Clock, Target, Lightbulb, Plus, CheckCircle, Calendar } from 'lucide-react';
import { AIService, TaskSuggestion, HabitSuggestion, OptimizationSuggestion } from '@/services/aiService';
import { AnalyticsService } from '@/services/analyticsService';
import { useToast } from '@/hooks/use-toast';

interface AISuggestionsProps {
  tasks: any[];
  habits: any[];
  onAddTask: (task: Omit<any, 'id' | 'createdAt'>) => void;
  onAddHabit: (habit: Omit<any, 'id' | 'createdAt'>) => void;
}

export const AISuggestions = ({ tasks, habits, onAddTask, onAddHabit }: AISuggestionsProps) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const { toast } = useToast();

  const analytics = useMemo(() => 
    AnalyticsService.generateAnalytics(tasks, habits), 
    [tasks, habits]
  );

  const taskSuggestions = useMemo(() => 
    AIService.generateTaskSuggestions(tasks, habits), 
    [tasks, habits]
  );

  const habitSuggestions = useMemo(() => 
    AIService.generateHabitSuggestions(habits, tasks), 
    [habits, tasks]
  );

  const optimizationSuggestions = useMemo(() => 
    AIService.generateOptimizationSuggestions(tasks, habits, analytics), 
    [tasks, habits, analytics]
  );

  const scheduleOptimization = useMemo(() => 
    AIService.predictOptimalSchedule(tasks, habits), 
    [tasks, habits]
  );

  const handleAddSuggestedTask = (suggestion: TaskSuggestion) => {
    onAddTask({
      text: suggestion.title,
      completed: false,
      priority: suggestion.priority,
      category: suggestion.category
    });

    toast({
      title: "Task Added! 📝",
      description: `"${suggestion.title}" has been added to your task list`,
      duration: 3000,
    });
  };

  const handleAddSuggestedHabit = (suggestion: HabitSuggestion) => {
    onAddHabit({
      name: suggestion.name,
      streak: 0,
      completedToday: false,
      category: suggestion.category,
      targetFrequency: suggestion.frequency
    });

    toast({
      title: "Habit Added! 🎯",
      description: `"${suggestion.name}" has been added to your habit tracker`,
      duration: 3000,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI-Powered Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks" className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Habits
            </TabsTrigger>
            <TabsTrigger value="optimize" className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4" />
              Optimize
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4 mt-6">
            <div className="text-sm text-gray-600 mb-4">
              Based on your current time and productivity patterns, here are some suggested tasks:
            </div>
            {taskSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddSuggestedTask(suggestion)}
                    className="ml-4"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority} priority
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {suggestion.estimatedTime}min
                  </Badge>
                  <Badge variant="outline">{suggestion.category}</Badge>
                </div>
                <div className="text-xs text-gray-500 italic">
                  💡 {suggestion.reasoning}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="habits" className="space-y-4 mt-6">
            <div className="text-sm text-gray-600 mb-4">
              Recommended habits to boost your productivity and well-being:
            </div>
            {habitSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{suggestion.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddSuggestedHabit(suggestion)}
                    className="ml-4"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getDifficultyColor(suggestion.difficulty)}>
                    {suggestion.difficulty}
                  </Badge>
                  <Badge variant="outline">{suggestion.frequency}</Badge>
                  <Badge variant="outline">{suggestion.category}</Badge>
                </div>
                <div className="text-xs text-gray-500 italic">
                  💡 {suggestion.reasoning}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="optimize" className="space-y-4 mt-6">
            <div className="text-sm text-gray-600 mb-4">
              Personalized optimization recommendations based on your performance:
            </div>
            {optimizationSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                  </div>
                  <Badge className={getImpactColor(suggestion.impact)}>
                    {suggestion.impact} impact
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Action Steps:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {suggestion.actionSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-6">
            <div className="text-sm text-gray-600 mb-4">
              AI-optimized daily schedule based on productivity research:
            </div>
            <div className="space-y-3">
              {scheduleOptimization.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{item.timeSlot}</h3>
                    <Badge variant="outline">{item.activity}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    💡 {item.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
