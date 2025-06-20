
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function FocusMode() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      if (!isBreak) {
        setCompletedSessions(prev => prev + 1);
        toast({
          title: "Focus Session Complete! 🎉",
          description: "Time for a 5-minute break",
        });
        setTimeLeft(5 * 60); // 5-minute break
        setIsBreak(true);
      } else {
        toast({
          title: "Break Complete! ⚡",
          description: "Ready for another focus session?",
        });
        setTimeLeft(25 * 60); // Back to 25 minutes
        setIsBreak(false);
        setIsActive(false);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, toast]);

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            Focus Mode
          </div>
          <Badge variant={isBreak ? "secondary" : "default"}>
            {isBreak ? "Break" : "Focus"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                isBreak ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!isActive ? (
            <Button onClick={startTimer} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start
            </Button>
          ) : (
            <Button onClick={pauseTimer} variant="outline" className="flex items-center gap-2">
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}
          <Button onClick={resetTimer} variant="outline" className="flex items-center gap-2">
            <Square className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Stats */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sessions completed today: <span className="font-semibold">{completedSessions}</span>
          </p>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Use the Pomodoro Technique - 25 minutes of focused work followed by a 5-minute break.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
