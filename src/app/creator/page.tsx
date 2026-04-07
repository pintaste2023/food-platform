// Creator Profile Page - Post-login only
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatorProfilePage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'earnings'>('overview');

  // 檢查登入狀態
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?redirect=/creator');
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  // 模擬數據
  const stats = {
    totalProducts: 3,
    totalEarnings: 1250,
    totalOrders: 28,
    memberSince: '2026-03-15',
    level: user.level || 1,
    points: 450,
  };

  const products = [
    { id: 1, name: '低卡咖哩粉', status: 'selling', earnings: 450 },
    { id: 2, name: '燕麥能量棒', status: 'draft', earnings: 0 },
    { id: 3, name: '堅果脆片', status: 'selling', earnings: 800 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/home" className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
            ← 返回
          </Link>
          <Link href="/" className="font-bold text-xl gradient-text">
            品點子
          </Link>
          <Link href="/create" className="text-orange-500 font-medium hover:text-orange-600">
            + 新建商品
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.charAt(0) || '用'}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                  Lv.{stats.level} 創作者
                </span>
                <span className="text-gray-400 text-sm">
                  加入於 {stats.memberSince}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
              <p className="text-gray-500 text-sm">商品數</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">NT${stats.totalEarnings}</p>
              <p className="text-gray-500 text-sm">總收入</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
              <p className="text-gray-500 text-sm">訂單數</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.points}</p>
              <p className="text-gray-500 text-sm">點數</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'overview' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            總覽
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'products' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            我的商品
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'earnings' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            收益
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4">⚡ 快速操作</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/create" className="p-4 bg-orange-50 rounded-xl text-center hover:bg-orange-100 transition-colors">
                    <div className="text-2xl mb-2">🆕</div>
                    <p className="text-sm font-medium text-gray-800">新建商品</p>
                  </Link>
                  <Link href="/creator" className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors">
                    <div className="text-2xl mb-2">📊</div>
                    <p className="text-sm font-medium text-gray-800">數據分析</p>
                  </Link>
                  <Link href="/creator" className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
                    <div className="text-2xl mb-2">💰</div>
                    <p className="text-sm font-medium text-gray-800">收益紀錄</p>
                  </Link>
                  <Link href="/creator" className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors">
                    <div className="text-2xl mb-2">⚙️</div>
                    <p className="text-sm font-medium text-gray-800">帳號設定</p>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4">📝 最近活動</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xl">💰</span>
                    <div>
                      <p className="text-gray-800 text-sm">新訂單：低卡咖哩粉</p>
                      <p className="text-gray-400 text-xs">今天 14:30</p>
                    </div>
                    <span className="ml-auto text-green-600 font-medium">+NT$99</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xl">👁️</span>
                    <div>
                      <p className="text-gray-800 text-sm">商品瀏覽次數增加</p>
                      <p className="text-gray-400 text-xs">昨天</p>
                    </div>
                    <span className="ml-auto text-gray-600 font-medium">+52</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xl">⭐</span>
                    <div>
                      <p className="text-gray-800 text-sm">獲得評價</p>
                      <p className="text-gray-400 text-xs">3天前</p>
                    </div>
                    <span className="ml-auto text-orange-500 font-medium">★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center text-2xl">
                      🍛
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className={`text-sm ${product.status === 'selling' ? 'text-green-600' : 'text-gray-400'}`}>
                        {product.status === 'selling' ? '銷售中' : '草稿'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">NT${product.earnings}</p>
                    <p className="text-gray-400 text-xs">總收入</p>
                  </div>
                </div>
              ))}
              <Link href="/create" className="block text-center py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors">
                + 建立新商品
              </Link>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-600">NT$1,250</p>
                  <p className="text-gray-500 text-sm">總收入</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-blue-600">NT$850</p>
                  <p className="text-gray-500 text-sm">本月收入</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-orange-600">NT$400</p>
                  <p className="text-gray-500 text-sm">待入帳</p>
                </div>
              </div>

              {/* Transaction List */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4">📜 交易紀錄</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-800 text-sm">訂單收入 - 低卡咖哩粉</p>
                      <p className="text-gray-400 text-xs">2026-04-07</p>
                    </div>
                    <span className="text-green-600 font-medium">+NT$99</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-800 text-sm">訂單收入 - 堅果脆片</p>
                      <p className="text-gray-400 text-xs">2026-04-06</p>
                    </div>
                    <span className="text-green-600 font-medium">+NT$150</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-800 text-sm">訂單收入 - 低卡咖哩粉</p>
                      <p className="text-gray-400 text-xs">2026-04-05</p>
                    </div>
                    <span className="text-green-600 font-medium">+NT$99</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}