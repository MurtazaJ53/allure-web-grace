
import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Target, Clock } from 'lucide-react';

interface WelcomeHeaderProps {
  stats: {
    completedTasks: number;
    totalTasks: number;
    completionRate: number;
    habitsCompletedToday: number;
    activeHabits: number;
    avgStreak: number;
  };
}

export const WelcomeHeader = ({ stats }: WelcomeHeaderProps) => {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting('Good Morning');
      } else if (hour < 17) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 1000);

    updateGreeting();
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Dynamic motivational messages based on performance
    const messages = [
      stats.completionRate >= 80 ? "You're absolutely crushing it! 🚀" : 
      stats.completionRate >= 60 ? "Great momentum! Keep it up! 💪" :
      stats.completionRate >= 40 ? "You're making solid progress! 📈" :
      "Every step forward counts! 🌟",
      
      stats.habitsCompletedToday >= 3 ? "Habit master in action! 🏆" :
      stats.habitsCompletedToday >= 1 ? "Building strong habits! 🎯" :
      "Small habits, big results! ✨"
    ];
    
    setMotivationalMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [stats]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            {greeting}!
          </h1>
        </div>
        
        <div className="space-y-2 text-gray-600 mb-6">
          <p className="text-xl font-medium">{formatDate(currentTime)}</p>
          <p className="text-3xl font-mono font-bold text-blue-600">{formatTime(currentTime)}</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 mb-4">
            {motivationalMessage}
          </p>
          <div className="inline-flex items-center gap-6 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">{stats.completedTasks}/{stats.totalTasks} tasks</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-gray-700">{stats.habitsCompletedToday}/{stats.activeHabits} habits</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">{stats.completionRate}% completion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
