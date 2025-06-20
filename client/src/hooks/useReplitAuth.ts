import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export function useReplitAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await apiRequest<User>('/api/auth/user');
      setUser(userData);
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = () => {
    window.location.href = '/api/login';
  };

  const signOut = () => {
    window.location.href = '/api/logout';
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
}