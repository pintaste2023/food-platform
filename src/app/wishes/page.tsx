// Wish Pool Page - 全部許願池頁面

'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockData } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

interface DemandCard {
  id: number;
  demand: string;
  votes: number;
  developers: number;
  recentGrowth: number;
  category: string;
  aiAnalysis?: {
    reasons: string[];
    suggestion: {
      price: string;
      flavor: string;
    };
    directions: string[];
    recommended: string;
    reason: string;
  };
}

function WishPoolContent() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [demands, setDemands] = useState<DemandCard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<'votes' | 'recentGrowth'>('votes');

  useEffect(() => {
    // 載入許願數據
    setDemands(mockData.demandCards);
  }, []);

  // 取得所有類別
  const categories = ['全部', ...new Set(demands.map(d => d.category))];

  // 過濾和排序
  const filteredDemands = demands
    .filter(d => selectedCategory === '全部' || d.category === selectedCategory)
    .sort((a, b) => sortBy === 'votes' ? b.votes - a.votes : b.recentGrowth - a.recentGrowth);

  const handleCreate = () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/create');
    } else {
      router.push('/create');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
            品點子
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            ← 回首頁
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🥣</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            敲碗許願池
          </h1>
          <p className="text-gray-500">
            這裡收集了大家最想要的產品，等你來實現！
          </p>
        </div>

        {/* Filter & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">排序：</span>
            <button
              onClick={() => setSortBy('votes')}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                sortBy === 'votes'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              👍 最多投票
            </button>
            <button
              onClick={() => setSortBy('recentGrowth')}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                sortBy === 'recentGrowth'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              🔥 最近成長
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-500">{demands.length}</div>
            <div className="text-xs text-gray-500">個許願</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-500">
              {demands.reduce((sum, d) => sum + d.votes, 0)}
            </div>
            <div className="text-xs text-gray-500">總投票數</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-500">
              {demands.filter(d => d.developers > 0).length}
            </div>
            <div className="text-xs text-gray-500">正在開發</div>
          </div>
        </div>

        {/* Demand List */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredDemands.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${
                    item.category === '低卡' ? 'bg-green-100 text-green-600' :
                    item.category === '健身' ? 'bg-blue-100 text-blue-600' :
                    item.category === '飲品' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800">{item.demand}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-500">👍 {item.votes}</div>
                  <div className="text-xs text-gray-400">人敲碗</div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="text-red-500 font-medium">
                  👨‍🍳 {item.developers} 人開發中
                </span>
                <span className="text-orange-500">
                  🔥 最近 +{item.recentGrowth}%
                </span>
              </div>

              {/* AI Analysis */}
              {item.aiAnalysis && (
                <div className="bg-purple-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🤖</span>
                    <span className="text-xs font-semibold text-purple-600">AI 分析建議</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.aiAnalysis.recommended}
                  </p>
                  {item.aiAnalysis.suggestion && (
                    <div className="flex gap-2">
                      <span className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                        💰 {item.aiAnalysis.suggestion.price}
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                        🍯 {item.aiAnalysis.suggestion.flavor}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <button 
                onClick={handleCreate}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                我來做這個商品！ 🎯
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDemands.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500">沒有找到符合條件的許願</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            有更好的想法嗎？
          </h3>
          <p className="text-gray-600 mb-4">
            如果這裡沒有你想要的，歡迎自己創造新產品！
          </p>
          <button 
            onClick={handleCreate}
            className="btn-primary px-8 py-3"
          >
            🚀 開始創作
          </button>
        </div>
      </main>
    </div>
  );
}

export default function WishPoolPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🥣</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    }>
      <WishPoolContent />
    </Suspense>
  );
}