// Admin Context - Manage admin state and mock data
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Development stages
export enum DevelopmentStage {
  STAGE_IDEA = 1,      // 💭 想法
  STAGE_RECIPE = 2,    // 🤖 生成配方  
  STAGE_MAKING = 3,    // 🏭 試做/打樣
  STAGE_PUBLISH = 4,   // 📱 發布商品
  STAGE_EARN = 5,      // 💰 賺錢
}

export const StageLabels: Record<DevelopmentStage, string> = {
  [DevelopmentStage.STAGE_IDEA]: '💭 想法',
  [DevelopmentStage.STAGE_RECIPE]: '🤖 生成配方',
  [DevelopmentStage.STAGE_MAKING]: '🏭 試做/打樣',
  [DevelopmentStage.STAGE_PUBLISH]: '📱 發布商品',
  [DevelopmentStage.STAGE_EARN]: '💰 賺錢',
};

export interface Product {
  id: string;
  name: string;
  developerId: string;
  developerName: string;
  stage: DevelopmentStage;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  sales?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  createdAt: string;
  productsCount: number;
}

interface AdminContextType {
  users: User[];
  products: Product[];
  isAdmin: boolean;
  loading: boolean;
  refreshData: () => void;
}

const defaultUsers: User[] = [
  { id: '1', name: '測試用戶', email: 'test@example.com', level: 1, createdAt: '2024-01-15', productsCount: 2 },
  { id: '2', name: '小明', email: 'ming@example.com', level: 2, createdAt: '2024-02-20', productsCount: 1 },
  { id: '3', name: '阿國', email: 'aguo@example.com', level: 3, createdAt: '2024-03-10', productsCount: 5 },
  { id: '4', name: '怡君', email: 'yijun@example.com', level: 1, createdAt: '2024-04-05', productsCount: 2 },
  { id: '5', name: '小美', email: 'mei@example.com', level: 2, createdAt: '2024-05-12', productsCount: 3 },
];

const defaultProducts: Product[] = [
  { id: 'p1', name: '低卡高蛋白咖哩粉', developerId: '1', developerName: '測試用戶', stage: DevelopmentStage.STAGE_EARN, createdAt: '2024-01-20', updatedAt: '2024-02-15', tags: ['新手首推', '熱賣中', '低卡'], sales: 1230 },
  { id: 'p2', name: '無糖奶茶粉', developerId: '1', developerName: '測試用戶', stage: DevelopmentStage.STAGE_PUBLISH, createdAt: '2024-02-10', updatedAt: '2024-03-01', tags: ['熱賣中', '無糖'], sales: 856 },
  { id: 'p3', name: '健身能量棒', developerId: '3', developerName: '阿國', stage: DevelopmentStage.STAGE_MAKING, createdAt: '2024-03-15', updatedAt: '2024-04-10', tags: ['高蛋白', '健身'], sales: 0 },
  { id: 'p4', name: '素食堅果罐', developerId: '4', developerName: '怡君', stage: DevelopmentStage.STAGE_RECIPE, createdAt: '2024-04-01', updatedAt: '2024-04-05', tags: ['素食', '天然'], sales: 0 },
  { id: 'p5', name: '低糖果乾', developerId: '5', developerName: '小美', stage: DevelopmentStage.STAGE_MAKING, createdAt: '2024-04-20', updatedAt: '2024-05-01', tags: ['低糖', '健康'], sales: 0 },
  { id: 'p6', name: '高蛋白雪糕', developerId: '2', developerName: '小明', stage: DevelopmentStage.STAGE_IDEA, createdAt: '2024-05-01', updatedAt: '2024-05-01', tags: ['健身'], sales: 0 },
  { id: 'p7', name: '無糖咖哩', developerId: '3', developerName: '阿國', stage: DevelopmentStage.STAGE_PUBLISH, createdAt: '2024-03-20', updatedAt: '2024-04-15', tags: ['低卡', '熱賣'], sales: 512 },
  { id: 'p8', name: '高蛋白餅乾', developerId: '5', developerName: '小美', stage: DevelopmentStage.STAGE_EARN, createdAt: '2024-02-28', updatedAt: '2024-04-01', tags: ['高蛋白', '健身'], sales: 428 },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(defaultUsers);
  const [products] = useState<Product[]>(defaultProducts);
  const [loading] = useState(false);

  const refreshData = () => {
    // In a real app, this would fetch from API
    console.log('Refreshing admin data...');
  };

  return (
    <AdminContext.Provider value={{ users, products, isAdmin: true, loading, refreshData }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}