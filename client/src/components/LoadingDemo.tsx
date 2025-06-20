import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoadingDemo() {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          TaskFlow Loading Spinners
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Branded loading animations with personality
        </p>
      </div>

      {/* Size Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Size Variants</CardTitle>
          <CardDescription>Different sizes for various use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-8 items-center">
            <div className="text-center space-y-2">
              <LoadingSpinner size="sm" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Small</p>
            </div>
            <div className="text-center space-y-2">
              <LoadingSpinner size="md" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Medium</p>
            </div>
            <div className="text-center space-y-2">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Large</p>
            </div>
            <div className="text-center space-y-2">
              <LoadingSpinner size="xl" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Extra Large</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animation Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Animation Variants</CardTitle>
          <CardDescription>Different animations for different contexts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <LoadingSpinner variant="default" size="lg" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Default</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dual ring animation</p>
              </div>
            </div>
            <div className="text-center space-y-4">
              <LoadingSpinner variant="pulse" size="lg" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Pulse</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pulsing completion icon</p>
              </div>
            </div>
            <div className="text-center space-y-4">
              <LoadingSpinner variant="orbit" size="lg" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Orbit</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Orbiting productivity icons</p>
              </div>
            </div>
            <div className="text-center space-y-4">
              <LoadingSpinner variant="progress" size="lg" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Progress</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Progress bar with branding</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* With Messages */}
      <Card>
        <CardHeader>
          <CardTitle>With Context Messages</CardTitle>
          <CardDescription>Loading states with helpful messaging</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <LoadingSpinner 
                variant="progress" 
                size="lg" 
                message="Loading your tasks..." 
              />
            </div>
            <div className="flex justify-center">
              <LoadingSpinner 
                variant="orbit" 
                size="lg" 
                message="Syncing across devices..." 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Real Use Cases</CardTitle>
          <CardDescription>How they appear in actual application contexts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Authentication Loading */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8 flex items-center justify-center">
              <LoadingSpinner 
                variant="progress" 
                size="xl" 
                message="Authenticating..."
              />
            </div>
            
            {/* Dashboard Loading */}
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 rounded-lg p-8 flex items-center justify-center">
              <LoadingSpinner 
                variant="orbit" 
                size="xl" 
                message="Loading your dashboard..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}