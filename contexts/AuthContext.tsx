import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent hydration error by only running on client
    if (typeof window === 'undefined') {
      console.log('AuthContext useEffect - server side, skipping...');
      setIsLoading(false);
      return;
    }
    
    console.log('AuthContext useEffect - client side, checking storage...');
    
    // Check if user is logged in on app start
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    console.log('Storage check:', { 
      token: token ? '[FOUND]' : '[NOT FOUND]', 
      savedUser: savedUser ? '[FOUND]' : '[NOT FOUND]' 
    });
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Parsed user from storage:', parsedUser);
        setUser(parsedUser);
        console.log('User set in context, isAuthenticated will be:', !!parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }
    } else {
      console.log('No valid auth data found, user remains null');
    }
    
    setIsLoading(false);
    console.log('AuthContext loading finished');
  }, []);

  const login = (userData: User, token: string) => {
    console.log('=== AUTHCONTEXT LOGIN CALLED ===');
    console.log('AuthContext.login called with:', { 
      userData: userData ? `${userData.name} (${userData.email})` : '[NULL]', 
      token: token ? '[TOKEN PROVIDED]' : '[NO TOKEN]' 
    });
    
    // Validate inputs
    if (!userData) {
      console.error('AuthContext.login: No user data provided!');
      return;
    }
    
    if (!token) {
      console.error('AuthContext.login: No token provided!');
      return;
    }
    
    // Only use localStorage on client side
    if (typeof window !== 'undefined') {
      console.log('Storing to localStorage...');
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Verify storage
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');
      console.log('Storage verification:', {
        token: storedToken ? '[STORED SUCCESSFULLY]' : '[STORAGE FAILED]',
        user: storedUser ? '[STORED SUCCESSFULLY]' : '[STORAGE FAILED]'
      });
    }
    
    console.log('Setting user state...');
    setUser(userData);
    
    console.log('=== AUTHCONTEXT LOGIN COMPLETED ===');
    console.log('Final auth state will be:', { 
      user: userData.name,
      isAuthenticated: true 
    });
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
