import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: crypto.randomUUID(),
        username: email.split('@')[0],
        email: email,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign in failed' } };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: crypto.randomUUID(),
        username: userData?.username || email.split('@')[0],
        email: email,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign up failed' } };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign out failed' } };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Mock password reset
      return { error: null };
    } catch (error) {
      return { error: { message: 'Password reset failed' } };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}