
import { useState, useMemo } from 'react';
import { Plus, Flame, Target, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHabits, Habit } from '@/hooks/useHabits';

export const HabitTrackerDB = () => {
  const { habits, loading, addHabit, updateHabit, deleteHabit } = useHabits();
  const [newHabit, setNewHabit] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const handleAddHabit = async () => {
    if (newHabit.trim()) {
      await addHabit({
        name: newHabit.trim(),
        streak: 0,
        completedToday: false,
        targetFrequency: frequency
      });
      setNewHabit('');
    }
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      const today = new Date();
      const wasCompletedToday = habit.completedToday;
      
      await updateHabit(id, {
        completedToday: !wasCompletedToday,
        streak: !wasCompletedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
        lastCompleted: !wasCompletedToday ? today : habit.lastCompleted
      });
    }
  };

  const handleDeleteHabit = async (id: string) => {
    await deleteHabit(id);
  };

  const getStreakTier = (streak: number) => {
    if (streak >= 100) return { 
      name: 'Legendary', 
      color: 'text-purple-600 bg-purple-100', 
      emoji: '👑', 
      next: null 
    };
    if (streak >= 50) return { 
      name: 'Master', 
      color: 'text-indigo-600 bg-indigo-100', 
      emoji: '🏆', 
      next: 100 
    };
    if (streak >= 30) return { 
      name: 'Expert', 
      color: 'text-blue-600 bg-blue-100', 
      emoji: '💎', 
      next: 50 
    };
    if (streak >= 14) return { 
      name: 'Advanced', 
      color: 'text-green-600 bg-green-100', 
      emoji: '🌟', 
      next: 30 
    };
    if (streak >= 7) return { 
      name: 'Consistent', 
      color: 'text-yellow-600 bg-yellow-100', 
      emoji: '🔥', 
      next: 14 
    };
    if (streak >= 3) return { 
      name: 'Building', 
      color: 'text-orange-600 bg-orange-100', 
      emoji: '💪', 
      next: 7 
    };
    return { 
      name: 'Starting', 
      color: 'text-gray-600 bg-gray-100', 
      emoji: '🌱', 
      next: 3 
    };
  };

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => {
      if (a.completedToday !== b.completedToday) {
        return a.completedToday ? 1 : -1;
      }
      return b.streak - a.streak;
    });
  }, [habits]);

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;

  if (loading) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl h-fit">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Habits
            <Badge variant="outline" className="ml-2">
              {completedToday}/{totalHabits} today
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Habit Form */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="What habit do you want to build?"
              onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
              className="flex-1 border-gray-300 focus:border-purple-500 transition-colors"
            />
            <Select value={frequency} onValueChange={(value: 'daily' | 'weekly') => setFrequency(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddHabit} className="bg-purple-600 hover:bg-purple-700 px-6">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Daily Progress Overview */}
        {habits.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Today's Progress
              </h3>
              <span className="text-sm font-medium text-purple-600">
                {Math.round((completedToday / totalHabits) * 100)}%
              </span>
            </div>
            <Progress 
              value={(completedToday / totalHabits) * 100} 
              className="h-3 bg-white" 
            />
            <p className="text-xs text-gray-600 mt-2">
              {completedToday} of {totalHabits} habits completed today
            </p>
          </div>
        )}

        {/* Habits List */}
        {sortedHabits.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {sortedHabits.map(habit => {
              const streakTier = getStreakTier(habit.streak);
              const progressToNext = streakTier.next ? 
                ((habit.streak % (streakTier.next === 100 ? 50 : streakTier.next === 50 ? 20 : streakTier.next === 30 ? 16 : streakTier.next)) / 
                 (streakTier.next === 100 ? 50 : streakTier.next === 50 ? 20 : streakTier.next === 30 ? 16 : streakTier.next)) * 100 : 100;

              return (
                <div 
                  key={habit.id} 
                  className={`group p-5 rounded-lg border transition-all duration-300 ${
                    habit.completedToday 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-800 text-lg">{habit.name}</h3>
                      <Badge className={`${streakTier.color} font-medium`}>
                        {streakTier.emoji} {streakTier.name}
                      </Badge>
                    </div>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-2 transition-all duration-200 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Flame className={`w-5 h-5 ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                        <span className="font-bold text-xl text-gray-800">
                          {habit.streak}
                        </span>
                        <span className="text-sm text-gray-600">day streak</span>
                      </div>
                      {habit.targetFrequency === 'weekly' && (
                        <Badge variant="outline" className="text-xs">
                          Weekly
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => toggleHabit(habit.id)}
                      variant={habit.completedToday ? "default" : "outline"}
                      size="sm"
                      className={`transition-all duration-200 ${
                        habit.completedToday 
                          ? "bg-green-600 hover:bg-green-700 shadow-md" 
                          : "hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700"
                      }`}
                    >
                      {habit.completedToday ? "✓ Completed!" : "Mark Complete"}
                    </Button>
                  </div>
                  
                  {streakTier.next && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress to {streakTier.next === 100 ? 'Legendary' : streakTier.next === 50 ? 'Master' : streakTier.next === 30 ? 'Expert' : streakTier.next === 14 ? 'Advanced' : streakTier.next === 7 ? 'Consistent' : 'Building'}</span>
                        <span>{habit.streak}/{streakTier.next} days</span>
                      </div>
                      <Progress value={progressToNext} className="h-2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <div className="space-y-2">
              <p className="font-medium">No habits yet</p>
              <p className="text-sm">Start building powerful habits that compound over time!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
