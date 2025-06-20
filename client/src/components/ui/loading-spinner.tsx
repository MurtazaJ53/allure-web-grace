import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'orbit' | 'progress';
  message?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  message, 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'orbit':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
            <div className="absolute inset-1 rounded-full border border-transparent border-t-blue-400 dark:border-t-blue-300 animate-spin animation-delay-150"></div>
          </div>
        );
      case 'progress':
        return (
          <div className={cn('flex items-center space-x-2', sizeClasses[size])}>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className={cn(
            'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400',
            sizeClasses[size]
          )}></div>
        );
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      {renderSpinner()}
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}