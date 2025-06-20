import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";
import { User as UserType } from "@shared/schema";

export function Home() {
  const { user } = useAuth() as { user: UserType | null };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your productivity dashboard is synced across all devices
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user?.profileImageUrl && (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/api/logout"}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user?.email || 'Not provided'}</p>
                <p><strong>Name:</strong> {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.firstName || 'Not provided'}</p>
                <p><strong>Sync Status:</strong> <span className="text-green-600">Active</span></p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cross-Device Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your tasks, habits, and progress are automatically synced across all your devices. 
                Sign in on any device to access your data.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your productivity tools are ready! Create tasks, track habits, and view analytics 
                to optimize your daily routine.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ready to dive into your productivity dashboard?
          </p>
          <Button size="lg" onClick={() => window.location.href = "/"}>
            Open Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}