
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, Calendar, Target, TrendingUp, Zap, Clock, Star, AlertTriangle } from 'lucide-react';
import { EnhancedAIService, SmartScheduleSlot, ProductivityInsight, HabitOptimization } from '@/services/enhancedAIService';
import { AnalyticsService } from '@/services/analyticsService';
import { AISettings } from '@/components/AISettings';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAIDashboardProps {
  tasks: any[];
  habits: any[];
}

export const EnhancedAIDashboard = ({ tasks, habits }: EnhancedAIDashboardProps) => {
  const [smartSchedule, setSmartSchedule] = useState<SmartScheduleSlot[]>([]);
  const [insights, setInsights] = useState<ProductivityInsight[]>([]);
  const [habitOptimizations, setHabitOptimizations] = useState<HabitOptimization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const { toast } = useToast();

  const analytics = useMemo(() => 
    AnalyticsService.generateAnalytics(tasks, habits), 
    [tasks, habits]
  );

  const isAIConnected = Boolean(EnhancedAIService.getApiKey());

  const generateSmartSchedule = async () => {
    if (!isAIConnected) return;
    
    setIsLoading(true);
    try {
      const userPreferences = {
        workStart: '9:00 AM',
        workEnd: '5:00 PM',
        preferredBreakDuration: 15,
        energyPeakHours: ['9:00 AM', '2:00 PM']
      };
      
      const schedule = await EnhancedAIService.generateSmartSchedule(tasks, habits, userPreferences);
      setSmartSchedule(schedule);
      
      toast({
        title: "Smart Schedule Generated! 🧠",
        description: "AI has optimized your daily schedule",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate smart schedule",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = async () => {
    if (!isAIConnected) return;
    
    setIsLoading(true);
    try {
      const aiInsights = await EnhancedAIService.generateProductivityInsights(analytics);
      setInsights(aiInsights);
      
      toast({
        title: "Insights Generated! 💡",
        description: "AI has analyzed your productivity patterns",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate insights",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeHabits = async () => {
    if (!isAIConnected) return;
    
    setIsLoading(true);
    try {
      const optimizations = await EnhancedAIService.optimizeHabits(habits);
      setHabitOptimizations(optimizations);
      
      toast({
        title: "Habits Optimized! 🎯",
        description: "AI has provided habit improvement suggestions",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize habits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="w-4 h-4" />;
      case 'recommendation': return <Target className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'opportunity': return <Star className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'recommendation': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'opportunity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Enhanced AI Dashboard
          {isAIConnected && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              AI Enabled
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="schedule" disabled={!isAIConnected}>
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="insights" disabled={!isAIConnected}>
              <TrendingUp className="w-4 h-4 mr-1" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="optimize" disabled={!isAIConnected}>
              <Zap className="w-4 h-4 mr-1" />
              Optimize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-6">
            <AISettings />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI-Optimized Schedule</h3>
              <Button onClick={generateSmartSchedule} disabled={isLoading}>
                <Calendar className="w-4 h-4 mr-1" />
                {isLoading ? 'Generating...' : 'Generate Schedule'}
              </Button>
            </div>
            
            {smartSchedule.length > 0 ? (
              <div className="space-y-3">
                {smartSchedule.map((slot, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{slot.time}</Badge>
                        <span className="font-medium">{slot.activity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getEnergyColor(slot.energyLevel)}>
                          {slot.energyLevel} energy
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {slot.estimatedDuration}min
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">{slot.reasoning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Click "Generate Schedule" to create your AI-optimized daily schedule
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Productivity Insights</h3>
              <Button onClick={generateInsights} disabled={isLoading}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {isLoading ? 'Analyzing...' : 'Generate Insights'}
              </Button>
            </div>
            
            {insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <h4 className="font-semibold">{insight.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getInsightColor(insight.type)}>
                          {insight.type}
                        </Badge>
                        <Badge variant="outline">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    {insight.actionable && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Actionable
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Click "Generate Insights" to analyze your productivity patterns
              </div>
            )}
          </TabsContent>

          <TabsContent value="optimize" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Habit Optimization</h3>
              <Button onClick={optimizeHabits} disabled={isLoading}>
                <Zap className="w-4 h-4 mr-1" />
                {isLoading ? 'Optimizing...' : 'Optimize Habits'}
              </Button>
            </div>
            
            {habitOptimizations.length > 0 ? (
              <div className="space-y-3">
                {habitOptimizations.map((optimization) => {
                  const habit = habits.find(h => h.id === optimization.habitId);
                  return (
                    <div key={optimization.habitId} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{habit?.name || 'Unknown Habit'}</h4>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          +{optimization.predictedImprovement}% improvement
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Current Performance:</span>
                          <Progress value={optimization.currentPerformance} className="flex-1" />
                          <span className="text-sm font-medium">{optimization.currentPerformance}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Suggested Improvements:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {optimization.suggestedChanges.map((change, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-500 mt-1">•</span>
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <p className="text-xs text-gray-500 italic">{optimization.reasoning}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Click "Optimize Habits" to get AI-powered improvement suggestions
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
