
import { useState } from 'react';
import { Plus, Flame, Target, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  createdAt: Date;
  lastCompleted?: Date;
}

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

export const HabitTracker = ({ habits, setHabits }: HabitTrackerProps) => {
  const [newHabit, setNewHabit] = useState('');

  const addHabit = () => {
    if (newHabit.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit.trim(),
        streak: 0,
        completedToday: false,
        createdAt: new Date()
      };
      setHabits([...habits, habit]);
      setNewHabit('');
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const today = new Date();
        const wasCompletedToday = habit.completedToday;
        
        return {
          ...habit,
          completedToday: !wasCompletedToday,
          streak: !wasCompletedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          lastCompleted: !wasCompletedToday ? today : habit.lastCompleted
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-blue-600';
    if (streak >= 7) return 'text-green-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-600" />
          Habits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Habit Form */}
        <div className="flex gap-2">
          <Input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="What habit do you want to build?"
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            className="flex-1"
          />
          <Button onClick={addHabit} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Habits List */}
        {habits.length > 0 ? (
          <div className="space-y-4">
            {habits.map(habit => (
              <div key={habit.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{habit.name}</h3>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flame className={`w-5 h-5 ${getStreakColor(habit.streak)}`} />
                    <span className={`font-bold ${getStreakColor(habit.streak)}`}>
                      {habit.streak} day streak
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => toggleHabit(habit.id)}
                    variant={habit.completedToday ? "default" : "outline"}
                    size="sm"
                    className={habit.completedToday ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {habit.completedToday ? "Completed!" : "Mark Done"}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress to next milestone</span>
                    <span>{habit.streak % 7}/7 days</span>
                  </div>
                  <Progress value={(habit.streak % 7) * (100 / 7)} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No habits yet. Add one above to start building!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
