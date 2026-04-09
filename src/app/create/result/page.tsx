// AI Result Page with Real Data from API
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

interface PositioningData {
  positioning_statement: string;
  target_segments: Array<{
    name: string;
    age_range: string;
    pain_points: string;
    buying_behavior: string;
  }>;
  core_benefits: string[];
  differentiators: string[];
  price_strategy: {
    tier: string;
    price_range: string;
    margin_estimate: string;
  };
  channel_strategy: string[];
  competitor_gap: string;
  risk_notes: string;
}

function ResultPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [positioning, setPositioning] = useState<PositioningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [positioningLoading, setPositioningLoading] = useState(false);
  const [positioningError, setPositioningError] = useState('');

  // 獲取產品定位
  const fetchPositioning = async () => {
    if (!recipe) return;
    
    setPositioningLoading(true);
    setPositioningError('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'positioning',
          productIdea: searchParams.get('idea') || '',
          currentRecipe: recipe,
          targetAudience: '一般消費者',
          budgetRange: '',
          competitors: '',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setPositioning(result.data);
        sessionStorage.setItem('positioningResult', JSON.stringify(result.data));
      } else {
        setPositioningError(result.error || '生成失敗');
      }
    } catch (err) {
      setPositioningError('網路錯誤，請重試');
    } finally {
      setPositioningLoading(false);
    }
  };

  useEffect(() => {
    // 從 sessionStorage 獲取配方數據
    const storedResult = sessionStorage.getItem('recipeResult');
    const storedPositioning = sessionStorage.getItem('positioningResult');
    const idea = searchParams.get('idea') || '';

    if (storedResult) {
      try {
        const data = JSON.parse(storedResult);
        setRecipe(data);
        
        // 嘗試載入已保存的定位
        if (storedPositioning) {
          try {
            setPositioning(JSON.parse(storedPositioning));
          } catch (e) {
            console.error('解析定位數據失敗:', e);
          }
        }
      } catch (e) {
        console.error('解析配方數據失敗:', e);
        router.push('/create');
      }
    } else {
      // 沒有數據，返回創建頁面
      router.push('/create');
    }

    setLoading(false);
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🤖</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <p className="text-gray-500 mb-4">無法找到配方資料</p>
          <Link href="/create" className="btn-primary">
            重新開始
          </Link>
        </div>
      </div>
    );
  }

  const idea = searchParams.get('idea') || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
            ← 返回
          </button>
          <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
            品點子
          </Link>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 🎉 Celebration Banner */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            我們幫你做出一個產品了
          </h1>
          <p className="text-gray-500">
            根據你的想法：「{idea}」
          </p>
        </div>

        {/* Main Product Card */}
        <div className="card mb-8 animate-fade-in-up stagger-1">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full mb-2">
                {recipe.difficulty}
              </span>
              <h2 className="text-2xl font-bold text-gray-800">
                {recipe.recipe_name}
              </h2>
              <p className="text-gray-500 mt-1">{recipe.description}</p>
            </div>
            <div className="text-6xl">🍽️</div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-sm">份量</p>
              <p className="font-semibold text-gray-800">{recipe.serving_size}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-sm">風味</p>
              <p className="font-semibold text-gray-800">{recipe.flavor_profile.taste}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-sm">難度</p>
              <p className="font-semibold text-gray-800">{recipe.difficulty}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-sm">建議售價</p>
              <p className="font-semibold text-gray-800">{recipe.target_price}</p>
            </div>
          </div>

          {/* 🤖 Recipe Details */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🧾</span>
              <h3 className="text-xl font-bold text-purple-800">配方內容</h3>
            </div>

            {/* 食材清單 */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">🥬 食材清單</h4>
              <div className="space-y-2">
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                    <span className="text-gray-700">{ing.name}</span>
                    <span className="text-gray-500 text-sm">
                      {ing.amount} {ing.unit}
                      {ing.notes && <span className="text-gray-400 ml-2">（{ing.notes}）</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 製作步驟 */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">👨‍🍳 製作步驟</h4>
              <ol className="space-y-3">
                {recipe.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* 風味描述 */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">味道</p>
                <p className="font-semibold text-gray-800">{recipe.flavor_profile.taste}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">香氣</p>
                <p className="font-semibold text-gray-800">{recipe.flavor_profile.aroma}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">口感</p>
                <p className="font-semibold text-gray-800">{recipe.flavor_profile.texture}</p>
              </div>
            </div>
          </div>

          {/* 保存與時間 */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-500 text-sm mb-1">⏱️ 準備時間</p>
              <p className="font-semibold text-gray-800">{recipe.prep_time}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-500 text-sm mb-1">📅 保存期限</p>
              <p className="font-semibold text-gray-800">{recipe.shelf_life}</p>
            </div>
          </div>

          {/* 備註 */}
          {recipe.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800">
                💡 {recipe.notes}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => {
                // 儲存完整配方供後續使用
                sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
                router.push('/create/result/recipe');
              }}
              className="btn-primary flex-1 text-lg py-4 text-center"
            >
              👉 調整配方
            </button>
            <button
              onClick={() => router.push('/create')}
              className="btn-secondary flex-1 text-lg py-4"
            >
              🔄 重新生成
            </button>
          </div>
        </div>

          {/* Action Buttons */}
        <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 animate-fade-in-up stagger-2">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">下一步建議</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 試著實際製作看看，調整風味到喜歡的口味</p>
                <p>• 命名你的品牌，開始建立品牌形象</p>
                <p>• 設計包裝，讓產品更有吸引力</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  );
}