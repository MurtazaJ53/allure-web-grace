
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export const WelcomeHeader = () => {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

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
    <div className="mb-12 text-center">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          {greeting}!
        </h1>
      </div>
      
      <div className="space-y-2 text-gray-600">
        <p className="text-xl font-medium">{formatDate(currentTime)}</p>
        <p className="text-3xl font-mono font-bold text-blue-600">{formatTime(currentTime)}</p>
      </div>
      
      <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
        Ready to make today productive? Let's organize your tasks and build great habits.
      </p>
    </div>
  );
};
