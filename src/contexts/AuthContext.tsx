// Auth Context - Manage login state
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Stage enum to track user journey progression
export enum Stage {
  STAGE_IDEA = 1,    // 💭 想法
  STAGE_RECIPE = 2,    // 🤖 生成配方
  STAGE_MAKING = 3,    // 🏭 試做
  STAGE_PUBLISH = 4,   // 📱 發布商品
  STAGE_EARN = 5,      // 💰 賺錢
}

interface DraftProject {
  id: string;
  name: string;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
  // 品牌設計資料
  naming?: any;
  logo?: any;
  story?: any;
  packaging?: any;
  // 配方資料
  recipe?: any;
  positioning?: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  personalLogo?: {
    brandName: string;
    logoData: any;
    createdAt: string;
  } | null;
  // 進行中的專案（暫存）
  draftProjects?: DraftProject[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  savePersonalLogo: (logoData: any) => void;
  saveDraftProject: (projectData: any) => void;
  getDraftProjects: () => DraftProject[];
  deleteDraftProject: (projectId: string) => void;
  isLoading: boolean;
  // New stage-related properties
  currentStage: number;
  setUserStage: (stage: number) => void;
  advanceStage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Load user from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('food-platform-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Load user journey stage from localStorage on init
  useEffect(() => {
    const storedStage = localStorage.getItem('food-platform-user-stage');
    if (storedStage) {
      const n = parseInt(storedStage, 10);
      if (!Number.isNaN(n)) {
        setCurrentStage(n);
      }
    }
  }, []);

  // 處理瀏覽器返回時的狀態恢復
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const storedUser = localStorage.getItem('food-platform-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      }
    };

    // 處理 bfcache 返回的狀態
    const handlePageshow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        const storedUser = localStorage.getItem('food-platform-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageshow);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageshow);
    };
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
        personalLogo: null,
      };
      setUser(mockUser);
      localStorage.setItem('food-platform-user', JSON.stringify(mockUser));
      // Reset stage on login for a clean new journey
      setCurrentStage(1);
      localStorage.setItem('food-platform-user-stage', '1');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('food-platform-user');
  };

  const savePersonalLogo = (logoData: any) => {
    if (user) {
      const updatedUser = {
        ...user,
        personalLogo: {
          brandName: logoData.brandName || '個人品牌',
          logoData: logoData,
          createdAt: new Date().toISOString(),
        },
      };
      setUser(updatedUser);
      localStorage.setItem('food-platform-user', JSON.stringify(updatedUser));
    }
  };

  // 儲存草稿專案（進行中）
  const saveDraftProject = (projectData: any) => {
    if (user) {
      const now = new Date().toISOString();
      const draftProjects = user.draftProjects || [];
      
      // 檢查是否已有同名稱的草稿
      const existingIndex = draftProjects.findIndex(p => p.name === projectData.name);
      
      let updatedDrafts: DraftProject[];
      if (existingIndex >= 0) {
        // 更新現有草稿
        updatedDrafts = [...draftProjects];
        updatedDrafts[existingIndex] = {
          ...updatedDrafts[existingIndex],
          ...projectData,
          updatedAt: now,
        };
      } else {
        // 新增草稿
        const newDraft: DraftProject = {
          id: `draft_${Date.now()}`,
          name: projectData.name || '未命名專案',
          status: 'draft',
          createdAt: now,
          updatedAt: now,
          ...projectData,
        };
        updatedDrafts = [...draftProjects, newDraft];
      }
      
      const updatedUser = {
        ...user,
        draftProjects: updatedDrafts,
      };
      setUser(updatedUser);
      localStorage.setItem('food-platform-user', JSON.stringify(updatedUser));
    }
  };

  // 取得所有草稿專案
  const getDraftProjects = (): DraftProject[] => {
    return user?.draftProjects || [];
  };

  // 刪除草稿專案
  const deleteDraftProject = (projectId: string) => {
    if (user) {
      const updatedDrafts = (user.draftProjects || []).filter(p => p.id !== projectId);
      const updatedUser = {
        ...user,
        draftProjects: updatedDrafts,
      };
      setUser(updatedUser);
      localStorage.setItem('food-platform-user', JSON.stringify(updatedUser));
    }
  };

  // Stage handling helpers
  const setUserStage = (stage: number) => {
    const clamped = Math.max(1, Math.min(5, stage));
    setCurrentStage(clamped);
    localStorage.setItem('food-platform-user-stage', String(clamped));
  };

  const advanceStage = () => {
    setUserStage(Math.min(currentStage + 1, 5));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        savePersonalLogo,
        saveDraftProject,
        getDraftProjects,
        deleteDraftProject,
        isLoading,
        currentStage,
        setUserStage,
        advanceStage,
      }}
    >
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
