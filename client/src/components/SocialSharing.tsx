
import { useState } from 'react';
import { Share2, Copy, Twitter, Linkedin, Facebook, TrendingUp, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SocialService, ShareableContent } from '@/services/socialService';

interface SocialSharingProps {
  tasks: any[];
  habits: any[];
  userLevel?: any;
  recentAchievements?: any[];
}

export const SocialSharing = ({ tasks, habits, userLevel, recentAchievements = [] }: SocialSharingProps) => {
  const [selectedContent, setSelectedContent] = useState<ShareableContent | null>(null);
  const { toast } = useToast();

  const progressReport = SocialService.generateProgressReport(tasks, habits, 'weekly');
  
  const shareableItems = [
    // Weekly progress
    SocialService.generateShareableContent('summary', {
      tasks: progressReport.tasks.completed,
      habits: progressReport.habits.completed,
      points: progressReport.tasks.completed * 5 + progressReport.habits.completed * 10
    }),
    
    // Recent achievements
    ...recentAchievements.slice(0, 3).map(achievement => 
      SocialService.generateShareableContent('achievement', achievement)
    ),
    
    // Level progress
    ...(userLevel ? [SocialService.generateShareableContent('level', userLevel)] : []),
    
    // Best habit streak
    ...(habits.length > 0 ? [{
      ...SocialService.generateShareableContent('streak', {
        streak: Math.max(...habits.map(h => h.streak)),
        habitName: habits.find(h => h.streak === Math.max(...habits.map(h => h.streak)))?.name || 'Unknown'
      })
    }] : [])
  ];

  const handleShare = async (content: ShareableContent, platform: 'twitter' | 'linkedin' | 'facebook' | 'copy') => {
    try {
      await SocialService.shareToSocialMedia(content, platform);
      
      if (platform === 'copy') {
        toast({
          title: "Copied to clipboard! 📋",
          description: "Your progress update is ready to share!",
          duration: 3000,
        });
      } else {
        toast({
          title: "Shared successfully! 🎉",
          description: `Your progress has been shared to ${platform}!`,
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "There was an error sharing your progress.",
        duration: 3000,
      });
    }
  };

  const exportProgress = () => {
    const progressText = SocialService.formatProgressText(progressReport);
    const blob = new Blob([progressText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Progress exported! 📊",
      description: "Your progress report has been downloaded.",
      duration: 3000,
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return Twitter;
      case 'linkedin': return Linkedin;
      case 'facebook': return Facebook;
      case 'copy': return Copy;
      default: return Share2;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-500 hover:bg-blue-600';
      case 'linkedin': return 'bg-blue-700 hover:bg-blue-800';
      case 'facebook': return 'bg-blue-600 hover:bg-blue-700';
      case 'copy': return 'bg-gray-600 hover:bg-gray-700';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Share Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{progressReport.tasks.completed}</p>
              <p className="text-sm text-gray-600">Tasks Done</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{progressReport.habits.completed}</p>
              <p className="text-sm text-gray-600">Habits Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{progressReport.tasks.rate}%</p>
              <p className="text-sm text-gray-600">Task Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{progressReport.habits.avgStreak}</p>
              <p className="text-sm text-gray-600">Avg Streak</p>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={exportProgress} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shareable Content */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-6 h-6 text-blue-600" />
            Ready to Share
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {shareableItems.map((item, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded border text-sm text-gray-700 mb-3 font-mono">
                {item.shareText}
              </div>
              
              <div className="flex gap-2">
                {['twitter', 'linkedin', 'facebook', 'copy'].map(platform => {
                  const Icon = getPlatformIcon(platform);
                  return (
                    <Button
                      key={platform}
                      onClick={() => handleShare(item, platform as any)}
                      size="sm"
                      className={`${getPlatformColor(platform)} text-white`}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
