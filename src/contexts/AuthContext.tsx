// Auth Context - Manage login state
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 檢查 localStorage 中的登入狀態
  useEffect(() => {
    const storedUser = localStorage.getItem('food-platform-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // 模擬登入 API 調用
    // 實際開發中應該調用真實的 API
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: '測試用戶',
        email: email,
        level: 1,
      };
      setUser(mockUser);
      localStorage.setItem('food-platform-user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('food-platform-user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}