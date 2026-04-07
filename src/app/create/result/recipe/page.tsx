// Recipe Detail Page - Left: Formula Editor, Right: Real-time Results
// With AI Flavor Adjustment Integration

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Ingredient {
  name: string;
  weight: number;
  category: 'main' | 'required' | 'optional';
  selected?: boolean;
}

interface FlavorAdjustResult {
  adjustments: Array<{
    aspect: string;
    current: string;
    suggestion: string;
    new_amount: string;
    reason: string;
  }>;
  revised_ingredients: Array<{
    name: string;
    old_amount: string;
    new_amount: string;
    reason: string;
  }>;
  revised_flavor_profile: {
    taste: string;
    aroma: string;
    texture: string;
  };
  prep_notes: string;
  estimated_cost_change: string;
  testing_suggestions: string;
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

function RecipeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idea = searchParams.get('idea') || '低卡咖哩';

  // 從 sessionStorage 獲取配方數據
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('recipeResult') || sessionStorage.getItem('currentRecipe');
    if (stored) {
      try {
        setRecipe(JSON.parse(stored));
      } catch (e) {
        console.error('解析配方失敗:', e);
      }
    }
  }, []);

  // 左側配方編輯區狀態
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '雞胸肉粉', weight: 6, category: 'main', selected: true },
    { name: '咖哩香料', weight: 2, category: 'main', selected: true },
    { name: '薑黃', weight: 1, category: 'required', selected: true },
    { name: '黑胡椒', weight: 0.5, category: 'optional', selected: false },
    { name: '孜然', weight: 0.5, category: 'optional', selected: false },
  ]);

  const [flavorProfile, setFlavorProfile] = useState<{浓郁: boolean; 微辣: boolean; 香料感: boolean }>({
    浓郁: true,
    微辣: true,
    香料感: false,
  });

  // AI 風味調整狀態
  const [chatMessage, setChatMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<FlavorAdjustResult | null>(null);
  const [aiError, setAiError] = useState('');

  // 產品定位狀態
  const [positioning, setPositioning] = useState<PositioningData | null>(null);
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
          productIdea: idea,
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

  // 從 sessionStorage 載入已保存的定位數據
  useEffect(() => {
    const storedPositioning = sessionStorage.getItem('positioningResult');
    if (storedPositioning) {
      try {
        setPositioning(JSON.parse(storedPositioning));
      } catch (e) {
        console.error('解析定位數據失敗:', e);
      }
    }
  }, []);

  // 右側即時結果計算
  const totalWeight = ingredients
    .filter(i => i.selected)
    .reduce((sum, i) => sum + i.weight, 0);

  const mainWeight = ingredients
    .filter(i => i.selected && i.category === 'main')
    .reduce((sum, i) => sum + i.weight, 0);

  const requiredWeight = ingredients
    .filter(i => i.selected && i.category === 'required')
    .reduce((sum, i) => sum + i.weight, 0);

  const costPerUnit = totalWeight * 1.2; // 假設每克成本 NT$1.2

  // 風味動態計算
  const flavorText = [
    flavorProfile.浓郁 ? '濃郁' : '',
    flavorProfile.微辣 ? '微辣' : '',
    flavorProfile.香料感 ? '香料感' : '',
  ].filter(Boolean).join(' / ');

  const handleIngredientToggle = (name: string) => {
    setIngredients(ingredients.map(i => 
      i.name === name ? { ...i, selected: !i.selected } : i
    ));
  };

  const handleWeightChange = (name: string, weight: number) => {
    setIngredients(ingredients.map(i => 
      i.name === name ? { ...i, weight } : i
    ));
  };

  // API 調用函數
  const handleAskAI = async () => {
    if (!chatMessage.trim()) return;
    
    setAiLoading(true);
    setAiError('');

    try {
      // 根據用戶輸入推斷調整方向
      let adjustmentDirection = '更甜';
      const msg = chatMessage.toLowerCase();
      
      if (msg.includes('辣') || msg.includes('更辣')) {
        adjustmentDirection = '更辣';
      } else if (msg.includes('健康') || msg.includes('少糖') || msg.includes('低糖')) {
        adjustmentDirection = '更健康';
      } else if (msg.includes('甜') || msg.includes('更甜')) {
        adjustmentDirection = '更甜';
      }

      // 呼叫 API
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'flavor',
          currentRecipe: recipe || {},
          adjustmentDirection,
          preference: chatMessage,
          targetAudience: '一般消費者',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAiResponse(result.data);
      } else {
        setAiError(result.error || '發生錯誤');
      }
    } catch (err) {
      setAiError('網路錯誤，請重試');
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/create/result" className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
            ← 返回
          </Link>
          <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
            品點子
          </Link>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Product Name Banner */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <span>🍛</span>
            <span>產品名稱：{recipe?.recipe_name || 'AI 配方'}</span>
          </h1>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 左側：配方編輯區 */}
          <div className="space-y-6">
            {/* 主題成分 */}
            <div className="card">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">▶</span>
                主題成分
              </h3>
              <div className="space-y-3">
                {ingredients.filter(i => i.category === 'main').map(ingredient => (
                  <div key={ingredient.name} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={ingredient.selected}
                        onChange={() => handleIngredientToggle(ingredient.name)}
                        className="w-5 h-5 accent-orange-500"
                      />
                      <span className="font-medium text-gray-800">{ingredient.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={ingredient.weight}
                        onChange={(e) => handleWeightChange(ingredient.name, parseFloat(e.target.value) || 0)}
                        disabled={!ingredient.selected}
                        className="w-16 px-2 py-1 border-2 border-gray-200 rounded-lg text-center disabled:opacity-50"
                      />
                      <span className="text-gray-500 text-sm">g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 必選成分 */}
            <div className="card">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">▶</span>
                必選成分
              </h3>
              <div className="space-y-3">
                {ingredients.filter(i => i.category === 'required').map(ingredient => (
                  <div key={ingredient.name} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-orange-500">🔒</span>
                      <span className="font-medium text-gray-800">{ingredient.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={ingredient.weight}
                        onChange={(e) => handleWeightChange(ingredient.name, parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border-2 border-gray-200 rounded-lg text-center"
                      />
                      <span className="text-gray-500 text-sm">g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 自選成分 */}
            <div className="card">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">▶</span>
                自選成分
              </h3>
              <div className="space-y-3">
                {ingredients.filter(i => i.category === 'optional').map(ingredient => (
                  <div key={ingredient.name} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={ingredient.selected}
                        onChange={() => handleIngredientToggle(ingredient.name)}
                        className="w-5 h-5 accent-orange-500"
                      />
                      <span className="font-medium text-gray-800">{ingredient.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={ingredient.weight}
                        onChange={(e) => handleWeightChange(ingredient.name, parseFloat(e.target.value) || 0)}
                        disabled={!ingredient.selected}
                        className="w-16 px-2 py-1 border-2 border-gray-200 rounded-lg text-center disabled:opacity-50"
                      />
                      <span className="text-gray-500 text-sm">g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI 配方調整問答 */}
            <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">🤖</span>
                請教 AI 怎麼調整配方
              </h3>
              <div className="space-y-4">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="例如：如何讓成本更低？如何讓風味更濃郁？如何更健康？"
                  className="w-full h-20 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
                />
                <button
                  onClick={handleAskAI}
                  disabled={aiLoading || !chatMessage.trim()}
                  className={`btn-primary w-full ${aiLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {aiLoading ? '🤔 AI 思考中...' : '💬 問 AI'}
                </button>

                {/* 錯誤訊息 */}
                {aiError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {aiError}
                  </div>
                )}

                {/* AI 回應 */}
                {aiResponse && (
                  <div className="bg-white rounded-xl p-4 border-l-4 border-purple-400 space-y-4">
                    <div className="font-semibold text-purple-800">✨ AI 調整建議</div>
                    
                    {/* 調整項目 */}
                    {aiResponse.adjustments && aiResponse.adjustments.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">調整項目：</p>
                        {aiResponse.adjustments.map((adj, idx) => (
                          <div key={idx} className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">{adj.aspect}：</span>
                            {adj.suggestion} ({adj.new_amount})
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 食材變更 */}
                    {aiResponse.revised_ingredients && aiResponse.revised_ingredients.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">食材變更：</p>
                        {aiResponse.revised_ingredients.map((ing, idx) => (
                          <div key={idx} className="text-sm text-gray-600 mb-1">
                            • {ing.name}: {ing.old_amount} → {ing.new_amount}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 風味描述 */}
                    {aiResponse.revised_flavor_profile && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">調整後風味：</p>
                        <p className="text-sm text-gray-600">
                          味道：{aiResponse.revised_flavor_profile.taste}<br/>
                          香氣：{aiResponse.revised_flavor_profile.aroma}<br/>
                          口感：{aiResponse.revised_flavor_profile.texture}
                        </p>
                      </div>
                    )}

                    {/* 製作備註 */}
                    {aiResponse.prep_notes && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">📝 製作建議：</p>
                        <p className="text-sm text-yellow-700">{aiResponse.prep_notes}</p>
                      </div>
                    )}

                    {/* 測試建議 */}
                    {aiResponse.testing_suggestions && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">🧪 測試建議：</p>
                        <p className="text-sm text-blue-700">{aiResponse.testing_suggestions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右側：即時結果 */}
          <div className="space-y-6">
            {/* 總重量 & 狀態 */}
            <div className="card">
              <h3 className="font-bold text-gray-800 mb-4">即時結果</h3>
              
              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm mb-2">總重量 (目標：10g)</p>
                <p className={`text-4xl font-bold ${totalWeight === 10 ? 'text-green-600' : totalWeight > 10 ? 'text-red-500' : 'text-orange-500'}`}>
                  {totalWeight}g
                  {totalWeight === 10 && <span className="text-green-500 text-2xl ml-2">✔</span>}
                </p>
              </div>

              {/* 警告訊息 */}
              {totalWeight !== 10 && (
                <div className={`p-3 rounded-xl mb-4 ${totalWeight > 10 ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'}`}>
                  <p className={`text-sm font-medium ${totalWeight > 10 ? 'text-red-600' : 'text-orange-600'}`}>
                    {totalWeight > 10 
                      ? `⚠️ 已超過 10g，請減少 ${totalWeight - 10}g` 
                      : `⚠️ 尚未達到 10g，需再增加 ${10 - totalWeight}g`}
                  </p>
                </div>
              )}

              {/* 成分狀態 */}
              <div className="space-y-3 mb-6">
                <div className={`flex items-center justify-between p-3 rounded-xl ${mainWeight > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <span className="text-gray-600">✔ 主題成分</span>
                  <span className={mainWeight > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {mainWeight > 0 ? 'OK' : '未選擇'}
                  </span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-xl ${requiredWeight > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <span className="text-gray-600">✔ 必選成分</span>
                  <span className={requiredWeight > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {requiredWeight > 0 ? 'OK' : '未選擇'}
                  </span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-xl ${totalWeight === 10 ? 'bg-green-50' : 'bg-orange-50'}`}>
                  <span className="text-gray-600">✔ 重量達標 (10g)</span>
                  <span className={totalWeight === 10 ? 'text-green-600 font-medium' : 'text-orange-500 font-medium'}>
                    {totalWeight === 10 ? '達標' : `${totalWeight < 10 ? 10 - totalWeight : totalWeight - 10}g`}
                  </span>
                </div>
              </div>

              {/* 風味 */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-500 text-sm mb-2">風味</p>
                <p className="font-bold text-gray-800 text-lg">
                  {flavorText || '尚未設定'}
                </p>
              </div>

              {/* 成本 */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-2">成本</p>
                <p className="font-bold text-orange-600 text-2xl">
                  約 NT${costPerUnit.toFixed(0)} / 包
                </p>
              </div>
            </div>

            {/* 市場小提醒 */}
            <div className="card bg-gradient-to-r from-blue-50 to-cyan-50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                🤖 市場小提醒
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">搜尋趨勢</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    上升中 <span>📈</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">競爭程度</span>
                  <span className="text-yellow-600 font-medium">
                    中等
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">建議定價</span>
                  <span className="text-orange-600 font-bold text-lg">
                    NT$99（參考）
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  以建議售價 NT$99 計算，毛利約 {totalWeight > 0 ? Math.round((99 - costPerUnit) / 99 * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/create/result/brand')}
                disabled={totalWeight !== 10}
                className={`btn-primary w-full text-lg py-4 ${totalWeight !== 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {totalWeight === 10 ? '👉 確認配方並開始品牌設計' : totalWeight > 10 ? '⚠️ 總重量已超過 10g' : '⚠️ 總重量未達 10g'}
              </button>
              <button 
                onClick={() => router.push('/create')}
                className="btn-secondary w-full text-lg py-4"
              >
                🔄 重新生成
              </button>
            </div>
          </div>
        </div>

        {/* 🎯 產品定位 Section - After Flavor Adjustment */}
        <div className="card mt-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <h3 className="text-xl font-bold text-gray-800">市場定位</h3>
            </div>
            <button
              onClick={fetchPositioning}
              disabled={positioningLoading || positioning !== null}
              className={`btn-secondary text-sm py-2 px-4 ${positioningLoading ? 'opacity-50' : ''}`}
            >
              {positioningLoading ? '🤔 AI 分析中...' : positioning ? '✓ 已生成' : '✨ AI 帮我定位'}
            </button>
          </div>

          {positioningError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
              {positioningError}
            </div>
          )}

          {positioning ? (
            <div className="space-y-6">
              {/* 定位陳述 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <p className="text-sm text-purple-600 font-medium mb-2">定位宣言</p>
                <p className="text-lg font-bold text-gray-800">{positioning.positioning_statement}</p>
              </div>

              {/* 目標客群 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">🎯 目標客群</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {positioning.target_segments.map((segment, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-gray-800 mb-2">{segment.name}</p>
                      <p className="text-sm text-gray-500 mb-1">年齡：{segment.age_range}</p>
                      <p className="text-sm text-gray-500 mb-1">痛點：{segment.pain_points}</p>
                      <p className="text-sm text-gray-500">購買行為：{segment.buying_behavior}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 核心利益 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">✨ 核心利益</p>
                <div className="flex flex-wrap gap-2">
                  {positioning.core_benefits.map((benefit, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* 差異化點 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">🚀 差異化點</p>
                <div className="flex flex-wrap gap-2">
                  {positioning.differentiators.map((diff, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {diff}
                    </span>
                  ))}
                </div>
              </div>

              {/* 價格策略 */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">價位層級</p>
                  <p className="font-bold text-orange-600">{positioning.price_strategy.tier}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">建議售價</p>
                  <p className="font-bold text-orange-600">{positioning.price_strategy.price_range}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">預估毛利</p>
                  <p className="font-bold text-orange-600">{positioning.price_strategy.margin_estimate}</p>
                </div>
              </div>

              {/* 通路策略 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">🛒 建議通路</p>
                <div className="flex flex-wrap gap-2">
                  {positioning.channel_strategy.map((channel, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>

              {/* 市場缺口 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-medium text-yellow-800 mb-2">💡 市場缺口</p>
                <p className="text-sm text-gray-700">{positioning.competitor_gap}</p>
              </div>

              {/* 風險提醒 */}
              {positioning.risk_notes && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-red-800 mb-2">⚠️ 風險提醒</p>
                  <p className="text-sm text-gray-700">{positioning.risk_notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>完成風味調整後，讓 AI 幫你分析市場定位</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function RecipePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center">
        <div className="text-4xl mb-8">🍛</div>
        <p className="text-gray-500">載入配方中...</p>
      </div>
    }>
      <RecipeContent />
    </Suspense>
  );
}