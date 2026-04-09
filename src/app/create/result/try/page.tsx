// Try Page - 試作頁面
// 顯示配方內容、規格、價格和試吃方案

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RecipeData {
  recipe_name: string;
  description: string;
  serving_size: string;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
    notes?: string;
  }>;
  steps: string[];
  flavor_profile: {
    taste: string;
    aroma: string;
    texture: string;
  };
  shelf_life: string;
  target_price: string;
  difficulty: string;
  prep_time: string;
  notes: string;
}

function TryContent() {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);

  // 試吃方案剩餘次數（Mock 數據）
  const [trialRemaining, setTrialRemaining] = useState(2);

  useEffect(() => {
    // 從 sessionStorage 獲取配方數據
    const storedResult = sessionStorage.getItem('recipeResult');
    const recipeData = sessionStorage.getItem('currentRecipe');

    let recipeDataToUse = null;

    if (storedResult) {
      try {
        recipeDataToUse = JSON.parse(storedResult);
      } catch (e) {
        console.error('解析配方數據失敗:', e);
      }
    }

    if (recipeData) {
      try {
        recipeDataToUse = JSON.parse(recipeData);
      } catch (e) {
        console.error('解析配方數據失敗:', e);
      }
    }

    if (recipeDataToUse) {
      setRecipe(recipeDataToUse);
    }

    setLoading(false);
  }, [router]);

  const handleTrialOrder = () => {
    if (trialRemaining > 0) {
      // 模擬下單邏輯
      alert('試吃訂單已送出！請留意通知。');
      setTrialRemaining(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/create/result/summary" className="text-gray-600 hover:text-gray-800">
            ← 返回
          </Link>
          <h1 className="font-bold text-xl gradient-text">試作</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {recipe ? (
          <div className="space-y-6">
            {/* 配方內容 */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📝</span>
                <h2 className="text-lg font-bold text-gray-800">配方內容</h2>
              </div>
              
              {/* 產品名稱 */}
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800">{recipe.recipe_name}</h3>
                <p className="text-gray-600 text-sm">{recipe.description}</p>
              </div>

              {/* 食材清單 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">🥬 食材</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {recipe.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{ing.name}</span>
                        <span className="text-orange-600 font-medium">
                          {ing.amount} {ing.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 風味描述 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center border">
                  <p className="text-gray-500 text-xs mb-1">味道</p>
                  <p className="font-semibold text-gray-800 text-sm">{recipe.flavor_profile.taste}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border">
                  <p className="text-gray-500 text-xs mb-1">香氣</p>
                  <p className="font-semibold text-gray-800 text-sm">{recipe.flavor_profile.aroma}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border">
                  <p className="text-gray-500 text-xs mb-1">口感</p>
                  <p className="font-semibold text-gray-800 text-sm">{recipe.flavor_profile.texture}</p>
                </div>
              </div>
            </div>

            {/* 規格 */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📏</span>
                <h2 className="text-lg font-bold text-gray-800">規格</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">單包重量</span>
                  <span className="font-bold text-gray-800">{recipe.serving_size}</span>
                </div>
              </div>
            </div>

            {/* 價格方案 */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💰</span>
                <h2 className="text-lg font-bold text-gray-800">價格</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 border-2 border-orange-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800">5包組</span>
                    <p className="text-gray-500 text-sm">適合初次嘗試</p>
                  </div>
                  <span className="text-2xl font-bold text-orange-500">$199</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800">10包組</span>
                    <p className="text-gray-500 text-sm">適合全家享用</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">$350</span>
                </div>
              </div>
            </div>

            {/* 試吃方案 */}
            <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎁</span>
                <h2 className="text-lg font-bold text-gray-800">試吃方案</h2>
              </div>
              
              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">✨</span>
                  <div>
                    <span className="font-bold text-gray-800">99元 / 3包（含運）</span>
                    <p className="text-gray-500 text-sm">限時優惠！</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                    ✔ 剩餘次數：{trialRemaining} 次
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleTrialOrder}
                  disabled={trialRemaining === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg ${
                    trialRemaining > 0
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {trialRemaining > 0 ? '🎯 我要試吃' : '已無試吃次數'}
                </button>
                <Link
                  href="/create/result/recipe"
                  className="block w-full py-3 text-center text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl"
                >
                  ← 返回修改配方
                </Link>
              </div>
            </div>

            {/* 備註 */}
            {recipe.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  💡 {recipe.notes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">😢</div>
            <p className="text-gray-500 mb-4">找不到配方資料</p>
            <Link href="/create" className="btn-primary">
              開始新產品
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    }>
      <TryContent />
    </Suspense>
  );
}