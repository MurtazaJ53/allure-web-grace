import { useState, useEffect } from 'react';
import { Users, Heart, MessageCircle, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CommunityPost {
  id: string;
  user: {
    name: string;
    level: string;
    avatar: string;
  };
  type: 'achievement' | 'streak' | 'milestone' | 'tip';
  content: {
    title: string;
    description: string;
    emoji: string;
  };
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export const CommunityFeed = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'achievements' | 'streaks' | 'tips'>('all');

  // Mock community data - in a real app, this would come from an API
  useEffect(() => {
    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        user: { name: 'Sarah Chen', level: 'Champion', avatar: '👩‍💼' },
        type: 'achievement',
        content: {
          title: 'Task Master Achievement Unlocked!',
          description: 'Just completed my 100th task! The key is breaking big goals into smaller, manageable chunks.',
          emoji: '🏆'
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: 24,
        comments: 8,
        isLiked: false
      },
      {
        id: '2',
        user: { name: 'Alex Rivera', level: 'Dedicated', avatar: '🧑‍🎨' },
        type: 'streak',
        content: {
          title: '30-Day Meditation Streak! 🧘‍♂️',
          description: 'Finally hit 30 days of daily meditation. Starting small with just 5 minutes really works!',
          emoji: '🔥'
        },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        likes: 31,
        comments: 12,
        isLiked: true
      },
      {
        id: '3',
        user: { name: 'Jamie Park', level: 'Focused', avatar: '👨‍💻' },
        type: 'tip',
        content: {
          title: 'Productivity Tip: Time Blocking',
          description: 'Try time blocking your calendar! I block 2-hour chunks for deep work and it\'s been a game changer.',
          emoji: '💡'
        },
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        likes: 18,
        comments: 5,
        isLiked: false
      },
      {
        id: '4',
        user: { name: 'Taylor Johnson', level: 'Master', avatar: '👩‍🔬' },
        type: 'milestone',
        content: {
          title: 'Level Up: Reached Master Level!',
          description: 'Just hit 1500 points and reached Master level! Consistency really pays off.',
          emoji: '⭐'
        },
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        likes: 42,
        comments: 15,
        isLiked: false
      },
      {
        id: '5',
        user: { name: 'Morgan Davis', level: 'Motivated', avatar: '🧑‍🎓' },
        type: 'achievement',
        content: {
          title: 'First Week Complete! 🎉',
          description: 'Completed my first week using this app. Already feeling more organized and motivated!',
          emoji: '🌟'
        },
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        likes: 15,
        comments: 3,
        isLiked: true
      }
    ];
    
    setPosts(mockPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'achievements') return post.type === 'achievement';
    if (filter === 'streaks') return post.type === 'streak';
    if (filter === 'tips') return post.type === 'tip';
    return true;
  });

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-yellow-600 bg-yellow-100';
      case 'streak': return 'text-red-600 bg-red-100';
      case 'milestone': return 'text-purple-600 bg-purple-100';
      case 'tip': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Beginner': 'text-gray-600 bg-gray-100',
      'Motivated': 'text-green-600 bg-green-100',
      'Focused': 'text-blue-600 bg-blue-100',
      'Dedicated': 'text-purple-600 bg-purple-100',
      'Champion': 'text-yellow-600 bg-yellow-100',
      'Master': 'text-orange-600 bg-orange-100',
      'Legend': 'text-red-600 bg-red-100'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Community Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {[
              { key: 'all', label: 'All Posts', icon: TrendingUp },
              { key: 'achievements', label: 'Achievements', icon: Award },
              { key: 'streaks', label: 'Streaks', icon: '🔥' },
              { key: 'tips', label: 'Tips', icon: '💡' }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => setFilter(key as any)}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                className="text-xs"
              >
                {typeof Icon === 'string' ? (
                  <span className="mr-1">{Icon}</span>
                ) : (
                  <Icon className="w-3 h-3 mr-1" />
                )}
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <Card key={post.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              {/* User info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">{post.user.avatar}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{post.user.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getLevelColor(post.user.level)} text-xs`}>
                      {post.user.level}
                    </Badge>
                    <span className="text-xs text-gray-500">{getTimeAgo(post.timestamp)}</span>
                  </div>
                </div>
                <Badge className={`${getTypeColor(post.type)} text-xs`}>
                  {post.type}
                </Badge>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-xl">{post.content.emoji}</span>
                  {post.content.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {post.content.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                <Button
                  onClick={() => toggleLike(post.id)}
                  variant="ghost"
                  size="sm"
                  className={`${post.isLiked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Motivational footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-2">🌟 You're part of an amazing community!</h3>
          <p className="text-gray-600 text-sm">
            Share your wins, learn from others, and stay motivated together. Every small step counts!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
