
import { useAuth } from '@/contexts/AuthContext';
import { TaskManagerDB } from '@/components/TaskManagerDB';
import { HabitTrackerDB } from '@/components/HabitTrackerDB';
import { ActivityFeedDB } from '@/components/ActivityFeedDB';
import { ProfileButton } from '@/components/ProfileButton';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Let's make today productive and build great habits.
            </p>
          </div>
          <ProfileButton />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-1">
            <TaskManagerDB />
          </div>

          {/* Habits Section */}
          <div className="lg:col-span-1">
            <HabitTrackerDB />
          </div>

          {/* Activity Feed Section */}
          <div className="lg:col-span-1">
            <ActivityFeedDB />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
