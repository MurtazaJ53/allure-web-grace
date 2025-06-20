import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { toast } = useToast();
  const { isAuthenticated, loading, signIn } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        signIn();
      }, 500); // Wait for 0.5 second before redirecting
      return;
    }
  }, [isAuthenticated, loading, toast, signIn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner 
          size="lg" 
          variant="orbit" 
          message="Authenticating..."
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}