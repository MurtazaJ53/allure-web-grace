import { cn } from "@/lib/utils";
import { CheckCircle, Target, TrendingUp } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "pulse" | "orbit" | "progress";
  className?: string;
  message?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "default",
  className,
  message
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6", 
    xl: "w-8 h-8"
  };

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className="relative">
          <div className={cn(
            "rounded-full border-4 border-blue-200 dark:border-blue-900",
            sizeClasses[size]
          )}>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          </div>
          <div className={cn(
            "absolute inset-0 flex items-center justify-center animate-pulse",
          )}>
            <CheckCircle className={cn("text-blue-600", iconSizeClasses[size])} />
          </div>
        </div>
        {message && (
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === "orbit") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          {/* Central icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Target className={cn("text-blue-600", iconSizeClasses[size])} />
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
            <CheckCircle className={cn(
              "absolute top-0 left-1/2 transform -translate-x-1/2 text-green-500",
              iconSizeClasses[size === "xl" ? "md" : "sm"]
            )} />
          </div>
          
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }}>
            <TrendingUp className={cn(
              "absolute bottom-0 left-1/2 transform -translate-x-1/2 text-purple-500",
              iconSizeClasses[size === "xl" ? "md" : "sm"]
            )} />
          </div>
        </div>
        {message && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === "progress") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className="relative">
          <div className={cn(
            "rounded-full border-4 border-gray-200 dark:border-gray-700",
            sizeClasses[size]
          )}>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-r-transparent border-b-transparent animate-spin" 
                 style={{ animationDuration: "1.5s" }} />
          </div>
          <div className={cn(
            "absolute inset-0 flex items-center justify-center",
          )}>
            <div className="text-blue-600 font-bold text-xs">
              {size === "xl" ? "TF" : "T"}
            </div>
          </div>
        </div>
        {message && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
            <div className="mt-2 w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" 
                   style={{ width: "60%", animation: "progress 2s ease-in-out infinite" }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className={cn(
        "relative rounded-full border-4 border-blue-200 dark:border-blue-900",
        sizeClasses[size]
      )}>
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <div className="absolute inset-0 rounded-full border-4 border-purple-400 border-r-transparent border-l-transparent animate-spin" 
             style={{ animationDuration: "2s", animationDirection: "reverse" }} />
      </div>
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
}

// Add custom keyframes to global CSS
export const loadingSpinnerStyles = `
@keyframes progress {
  0% { width: 10%; }
  50% { width: 70%; }
  100% { width: 10%; }
}
`;