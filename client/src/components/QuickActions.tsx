
import { Coffee, Book, Dumbbell, Moon, Sun, Music } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export const QuickActions = () => {
  const handleQuickAction = (action: string) => {
    toast({
      title: "Great choice!",
      description: `Time for ${action}. You've got this! 💪`,
    });
  };

  const actions = [
    { icon: Coffee, label: "Coffee Break", color: "bg-amber-500 hover:bg-amber-600" },
    { icon: Book, label: "Read", color: "bg-blue-500 hover:bg-blue-600" },
    { icon: Dumbbell, label: "Exercise", color: "bg-red-500 hover:bg-red-600" },
    { icon: Music, label: "Meditate", color: "bg-purple-500 hover:bg-purple-600" },
    { icon: Sun, label: "Fresh Air", color: "bg-yellow-500 hover:bg-yellow-600" },
    { icon: Moon, label: "Rest", color: "bg-indigo-500 hover:bg-indigo-600" }
  ];

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800">Quick Actions</CardTitle>
        <p className="text-sm text-gray-600">Take a productive break</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleQuickAction(action.label)}
              className={`${action.color} text-white border-0 hover:scale-105 transition-all duration-200 flex flex-col gap-2 h-auto py-4`}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
