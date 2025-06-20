import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, TrendingUp, Users } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            TaskFlow
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your complete productivity companion. Track tasks, build habits, and achieve your goals with AI-powered insights.
          </p>
          <Button 
            size="lg" 
            className="px-8 py-3 text-lg"
            onClick={() => window.location.href = "/api/login"}
          >
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Organize your tasks with priorities, categories, and due dates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle>Habit Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build lasting habits with streak tracking and daily goals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gain insights into your productivity patterns and progress.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-orange-500 mb-2" />
              <CardTitle>Sync Across Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access your data seamlessly across all your devices.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to boost your productivity?
          </h2>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => window.location.href = "/api/login"}
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    </div>
  );
}