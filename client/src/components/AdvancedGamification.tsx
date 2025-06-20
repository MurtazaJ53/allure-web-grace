
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Crown, Flame, Star, Zap, Target, Gift, TrendingUp } from 'lucide-react';
import { GamificationService, Achievement, DailyChallenge } from '@/services/gamificationService';
import { useToast } from '@/hooks/use-toast';

interface AdvancedGamificationProps {
  tasks: any[];
  habits: any[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  icon: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: string;
  rank: number;
}

export const AdvancedGamification = ({ tasks, habits }: AdvancedGamificationProps) => {
  const [dailyChallenges] = useState<DailyChallenge[]>(GamificationService.generateDailyChallenges());
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const { toast } = useToast();

  const userStats = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const maxStreak = Math.max(...habits.map(h => h.streak), 0);
    const perfectDays = habits.filter(h => h.streak >= 7).length;
    const totalPoints = completedTasks * 5 + habits.reduce((sum, h) => sum + h.streak, 0) * 2;

    return {
      completedTasks,
      totalTasks,
      completionRate,
      maxStreak,
      perfectDays,
      totalHabits: habits.length,
      totalPoints
    };
  }, [tasks, habits]);

  const currentLevel = GamificationService.calculateUserLevel(userStats.totalPoints);
  const levelProgress = GamificationService.getProgressToNextLevel(userStats.totalPoints);
  const unlockedAchievements = GamificationService.checkAchievements(userStats, []);

  // Advanced milestones
  const milestones: Milestone[] = [
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Reach 50-day streak',
      target: 50,
      current: userStats.maxStreak,
      reward: '500 Bonus Points',
      icon: '🔥'
    },
    {
      id: 'task-crusher',
      title: 'Task Crusher',
      description: 'Complete 500 tasks',
      target: 500,
      current: userStats.completedTasks,
      reward: 'Special Badge',
      icon: '⚡'
    },
    {
      id: 'perfect-week',
      title: 'Perfect Week',
      description: 'Complete all habits for 7 days',
      target: 7,
      current: userStats.perfectDays,
      reward: 'Custom Theme',
      icon: '👑'
    }
  ];

  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'You', points: userStats.totalPoints, level: currentLevel.title, rank: 1 },
    { id: '2', name: 'Alex Chen', points: userStats.totalPoints - 50, level: 'Motivated', rank: 2 },
    { id: '3', name: 'Sarah Johnson', points: userStats.totalPoints - 120, level: 'Focused', rank: 3 },
    { id: '4', name: 'Mike Davis', points: userStats.totalPoints - 200, level: 'Beginner', rank: 4 },
    { id: '5', name: 'Emma Wilson', points: userStats.totalPoints - 280, level: 'Beginner', rank: 5 }
  ];

  const completeChallenge = (challengeId: string) => {
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (challenge) {
      challenge.completed = true;
      challenge.progress = challenge.target;
      
      toast({
        title: "Challenge Complete! 🎉",
        description: `You earned ${challenge.points} points!`,
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{currentLevel.icon}</div>
              <div>
                <h3 className="text-xl font-bold">{currentLevel.title}</h3>
                <p className="text-purple-100">Level {currentLevel.level}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{userStats.totalPoints}</div>
              <div className="text-purple-100">Total Points</div>
            </div>
          </div>
          
          {levelProgress.next && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {levelProgress.next.title}</span>
                <span>{Math.round(levelProgress.progress)}%</span>
              </div>
              <Progress value={levelProgress.progress} className="bg-purple-400" />
              <div className="text-xs text-purple-100">
                {levelProgress.next.pointsRequired - userStats.totalPoints} points to next level
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenges">
            <Target className="w-4 h-4 mr-1" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="w-4 h-4 mr-1" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="milestones">
            <Star className="w-4 h-4 mr-1" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Crown className="w-4 h-4 mr-1" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <h3 className="text-lg font-semibold">Daily Challenges</h3>
          {dailyChallenges.map((challenge) => (
            <Card key={challenge.id} className={challenge.completed ? 'bg-green-50 border-green-200' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{challenge.title}</h4>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Gift className="w-3 h-3 mr-1" />
                      {challenge.points} pts
                    </Badge>
                    {challenge.completed && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Trophy className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.target}</span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.target) * 100} 
                    className={challenge.completed ? 'bg-green-200' : ''}
                  />
                </div>
                
                {!challenge.completed && challenge.progress >= challenge.target && (
                  <Button 
                    className="w-full mt-3" 
                    onClick={() => completeChallenge(challenge.id)}
                  >
                    <Trophy className="w-4 h-4 mr-1" />
                    Claim Reward
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <h3 className="text-lg font-semibold">Achievements</h3>
          {unlockedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedAchievements.map((achievement) => (
                <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            {achievement.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Complete tasks and build habits to unlock achievements!
            </div>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <h3 className="text-lg font-semibold">Long-term Milestones</h3>
          {milestones.map((milestone) => (
            <Card key={milestone.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{milestone.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        {milestone.reward}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{milestone.current}/{milestone.target}</span>
                      </div>
                      <Progress value={(milestone.current / milestone.target) * 100} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <h3 className="text-lg font-semibold">Community Leaderboard</h3>
          <Card>
            <CardContent className="p-0">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={`flex items-center justify-between p-4 border-b last:border-b-0 ${
                    entry.name === 'You' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {entry.rank}
                    </div>
                    <div>
                      <div className="font-semibold">{entry.name}</div>
                      <div className="text-sm text-gray-600">{entry.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{entry.points}</div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
