
import { useState, useEffect, useMemo } from 'react';
import { Trophy, Star, Flame, Target, Gift, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GamificationService, Achievement, DailyChallenge } from '@/services/gamificationService';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface GamificationDashboardProps {
  tasks: any[];
  habits: any[];
}

export const GamificationDashboard = ({ tasks, habits }: GamificationDashboardProps) => {
  const [totalPoints, setTotalPoints] = useLocalStorage<number>('gamification-points', 0);
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<string[]>('unlocked-achievements', []);
  const [dailyChallenges, setDailyChallenges] = useLocalStorage<DailyChallenge[]>('daily-challenges', []);
  const [showAchievementModal, setShowAchievementModal] = useState<Achievement | null>(null);

  // Generate daily challenges if none exist or if they're expired
  useEffect(() => {
    const now = new Date();
    if (dailyChallenges.length === 0 || (dailyChallenges[0] && new Date(dailyChallenges[0].expiresAt) <= now)) {
      setDailyChallenges(GamificationService.generateDailyChallenges());
    }
  }, [dailyChallenges, setDailyChallenges]);

  // Calculate current stats for achievements and challenges
  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const maxStreak = Math.max(...habits.map(h => h.streak), 0);
    const habitsCompletedToday = habits.filter(h => h.completedToday).length;
    const allHabitsCompleted = habits.length > 0 && habitsCompletedToday === habits.length;

    return {
      completedTasks,
      totalTasks,
      completionRate,
      maxStreak,
      totalHabits: habits.length,
      habitsCompletedToday,
      allHabitsCompleted,
      perfectDays: 0, // This would need to be tracked over time
      totalPoints
    };
  }, [tasks, habits, totalPoints]);

  // Check for new achievements
  useEffect(() => {
    const newAchievements = GamificationService.checkAchievements(stats, unlockedAchievements);
    if (newAchievements.length > 0) {
      const updatedAchievements = [...unlockedAchievements, ...newAchievements.map(a => a.id)];
      setUnlockedAchievements(updatedAchievements);
      
      const pointsEarned = newAchievements.reduce((sum, a) => sum + a.points, 0);
      setTotalPoints(prev => prev + pointsEarned);
      
      // Show the first new achievement
      setShowAchievementModal(newAchievements[0]);
    }
  }, [stats, unlockedAchievements, setUnlockedAchievements, setTotalPoints]);

  // Update daily challenges progress
  useEffect(() => {
    setDailyChallenges(prev => prev.map(challenge => {
      let progress = 0;
      switch (challenge.type) {
        case 'tasks':
          progress = Math.min(stats.completedTasks, challenge.target);
          break;
        case 'habits':
          progress = stats.allHabitsCompleted ? 1 : 0;
          break;
        case 'productivity':
          progress = Math.min(stats.completionRate, challenge.target);
          break;
      }
      
      const completed = progress >= challenge.target;
      if (completed && !challenge.completed) {
        setTotalPoints(prev => prev + challenge.points);
      }
      
      return { ...challenge, progress, completed };
    }));
  }, [stats, setTotalPoints, setDailyChallenges]);

  const levelInfo = GamificationService.getProgressToNextLevel(totalPoints);
  const achievements = GamificationService.ACHIEVEMENTS;
  const unlockedAchievementObjects = achievements.filter(a => unlockedAchievements.includes(a.id));

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${levelInfo.current.color}`}>
              <span className="text-2xl">{levelInfo.current.icon}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{levelInfo.current.title}</h3>
              <p className="text-gray-600">Level {levelInfo.current.level}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-bold text-blue-600">{totalPoints}</p>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {levelInfo.next && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {levelInfo.next.title}</span>
                <span>{Math.round(levelInfo.progress)}%</span>
              </div>
              <Progress value={levelInfo.progress} className="h-3" />
              <p className="text-xs text-gray-600">
                {levelInfo.next.pointsRequired - totalPoints} points until next level
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Challenges */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-600" />
              Daily Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dailyChallenges.map(challenge => (
              <div key={challenge.id} className={`p-4 rounded-lg border transition-all ${
                challenge.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{challenge.title}</h4>
                  <Badge className={challenge.completed ? 'bg-green-600' : 'bg-gray-400'}>
                    {challenge.points} pts
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.target}</span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.target) * 100} 
                    className="h-2" 
                  />
                </div>
                {challenge.completed && (
                  <div className="mt-2 text-green-600 font-medium text-sm">
                    ✓ Challenge Complete!
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Achievements
              <Badge variant="outline" className="ml-2">
                {unlockedAchievements.length}/{achievements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {achievements.map(achievement => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h4 className="font-semibold text-xs mb-1">{achievement.title}</h4>
                    <Badge className={`${getRarityColor(achievement.rarity)} text-xs`}>
                      {achievement.rarity}
                    </Badge>
                    {isUnlocked && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        +{achievement.points} pts
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Modal */}
      {showAchievementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white max-w-md mx-4 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">{showAchievementModal.icon}</div>
              <h2 className="text-2xl font-bold mb-2">Achievement Unlocked!</h2>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{showAchievementModal.title}</h3>
              <p className="text-gray-600 mb-4">{showAchievementModal.description}</p>
              <Badge className={`${getRarityColor(showAchievementModal.rarity)} mb-4`}>
                {showAchievementModal.rarity} • +{showAchievementModal.points} points
              </Badge>
              <Button onClick={() => setShowAchievementModal(null)} className="w-full">
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
