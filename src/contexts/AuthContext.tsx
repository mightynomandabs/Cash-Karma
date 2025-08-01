import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
  signUp: (username: string, password: string, name: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user accounts for testing
const MOCK_ACCOUNTS = [
  {
    id: '1',
    email: 'testuser@example.com',
    password: 'password123',
    name: 'Test User',
    avatar_url: undefined
  },
  {
    id: '2',
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Admin User',
    avatar_url: undefined
  },
  {
    id: '3',
    email: 'demo@demo.com',
    password: 'demo123',
    name: 'Demo User',
    avatar_url: undefined
  }
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('cashkarma_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('cashkarma_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string): Promise<{ error?: string }> => {
    try {
      // Find user in mock accounts
      const account = MOCK_ACCOUNTS.find(
        acc => acc.email === username && acc.password === password
      );

      if (!account) {
        return { error: 'Invalid username or password' };
      }

      // Create user object without password
      const userData: User = {
        id: account.id,
        email: account.email,
        name: account.name,
        avatar_url: account.avatar_url
      };

      // Save to localStorage
      localStorage.setItem('cashkarma_user', JSON.stringify(userData));
      setUser(userData);

      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An error occurred during sign in' };
    }
  };

  const signUp = async (username: string, password: string, name: string): Promise<{ error?: string }> => {
    try {
      // Check if user already exists
      const existingUser = MOCK_ACCOUNTS.find(acc => acc.email === username);
      if (existingUser) {
        return { error: 'User already exists' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: username,
        name: name,
        avatar_url: undefined
      };

      // Save to localStorage
      localStorage.setItem('cashkarma_user', JSON.stringify(newUser));
      setUser(newUser);

      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An error occurred during sign up' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('cashkarma_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};