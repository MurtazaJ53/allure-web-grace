
import { useMemo } from 'react';
import { TrendingUp, Brain, Target, Zap, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Pie } from 'recharts';
import { AnalyticsService } from '@/services/analyticsService';

interface AnalyticsDashboardProps {
  tasks: any[];
  habits: any[];
}

export const AnalyticsDashboard = ({ tasks, habits }: AnalyticsDashboardProps) => {
  const analytics = useMemo(() => 
    AnalyticsService.generateAnalytics(tasks, habits), 
    [tasks, habits]
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return '🎉';
      case 'warning': return '⚠️';
      case 'suggestion': return '💡';
      default: return '📊';
    }
  };

  return (
    <div className="space-y-8">
      {/* Productivity Score Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Productivity Score</h2>
              <p className="text-blue-100">Your overall performance rating</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold mb-2">{analytics.productivityScore}</div>
              <div className="flex items-center gap-2">
                <Badge className={`${getScoreColor(analytics.productivityScore)} text-gray-800`}>
                  {analytics.productivityScore >= 80 ? 'Excellent' :
                   analytics.productivityScore >= 60 ? 'Good' :
                   analytics.productivityScore >= 40 ? 'Fair' : 'Needs Focus'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Progress 
              value={analytics.productivityScore} 
              className="h-3 bg-white/20" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Trends */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              14-Day Completion Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analytics.completionTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  formatter={(value, name) => [value, name === 'tasks' ? 'Tasks' : 'Habits']}
                />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="habits" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Productivity Score */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              7-Day Productivity Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  formatter={(value) => [`${value}%`, 'Productivity Score']}
                />
                <Bar 
                  dataKey="productivityScore" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Priority Distribution */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Task Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Tooltip formatter={(value) => [`${Math.round(value as number)}%`, 'Percentage']} />
                <Pie 
                  data={analytics.timeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.timeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {analytics.timeDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.weeklyTrends.map((trend, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-gray-800">{trend.week}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Avg Tasks/Day</p>
                    <p className="text-2xl font-bold text-blue-800">{trend.avgTasksPerDay}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Avg Habits/Day</p>
                    <p className="text-2xl font-bold text-purple-800">{trend.avgHabitsPerDay}</p>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Completion Rate</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-green-800">{trend.completionRate}%</p>
                    <Progress value={trend.completionRate} className="flex-1 h-2" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.insights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.insights.map((insight) => (
                <div 
                  key={insight.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'positive' ? 'border-green-500 bg-green-50' :
                    insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{insight.title}</h3>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                      {insight.value && (
                        <Badge className="mt-2" variant="outline">
                          Score: {Math.round(insight.value)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Complete more tasks and habits to unlock personalized insights!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
