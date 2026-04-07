// AI Generation Flow Components
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface GenerateParams {
  ingredient: string;
  productType: string;
  brandName: string;
  tags: string[];
}

// 食材選項
const INGREDIENTS = [
  { name: '雞胸肉', icon: '🍗', category: '蛋白質' },
  { name: '燕麥', icon: '🌾', category: '穀物' },
  { name: '堅果', icon: '🥜', category: '堅果' },
  { name: '地瓜', icon: '🍠', category: '根莖' },
  { name: '香蕉', icon: '🍌', category: '水果' },
  { name: '雞蛋', icon: '🥚', category: '蛋白質' },
  { name: '豆腐', icon: '🧈', category: '豆製品' },
  { name: '優格', icon: '🥛', category: '乳製品' },
  { name: '蜂蜜', icon: '🍯', category: '甜味' },
  { name: '抹茶', icon: '🍵', category: '調味' },
];

// 產品類型選項
const PRODUCT_TYPES = [
  { name: '零食', icon: '🍪', description: '方便隨身攜帶、隨時享用' },
  { name: '甜點', icon: '🍰', description: '甜味滿足、療癒人心' },
  { name: '主食', icon: '🍚', description: '正餐替代、飽足感強' },
  { name: '飲品', icon: '🧋', description: '液體形式、方便飲用' },
  { name: '代餐', icon: '🥣', description: '營養均衡、快速補充' },
  { name: '調味醬', icon: '🥫', description: '搭配其他食材使用' },
];

// API 調用函數
async function generateRecipe(params: GenerateParams): Promise<any> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'recipe',
      ingredient: params.ingredient,
      productType: params.productType,
      targetAudience: '一般消費者',
      styleTags: params.tags,
      brandName: params.brandName,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '生成失敗');
  }

  return response.json();
}

// Main Create Page (Ingredient + Product Type Input)
export default function CreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 從 URL 參數初始化
  const urlIngredient = searchParams.get('ingredient');
  const urlStep = searchParams.get('step');
  
  const [step, setStep] = useState(urlStep === '2' ? 2 : 1);
  
  // Step 1: 食材
  const [ingredient, setIngredient] = useState(urlIngredient || '');
  const [customIngredient, setCustomIngredient] = useState('');
  
  // Step 2: 產品類型
  const [productType, setProductType] = useState('');
  const [customProductType, setCustomProductType] = useState('');
  
  // 進階設定
  const [brandName, setBrandName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (step === 1 && (ingredient || customIngredient)) {
      setStep(2);
    }
  };

  const handleGenerate = async () => {
    const finalIngredient = ingredient || customIngredient;
    const finalProductType = productType || customProductType;
    
    if (!finalIngredient || !finalProductType) return;

    setIsGenerating(true);
    setError('');

    try {
      // 儲存參數到 sessionStorage，供 loading 頁面使用
      const ideaText = `${finalIngredient}做的${finalProductType}`;
      sessionStorage.setItem(
        'generateParams',
        JSON.stringify({ 
          idea: ideaText,
          ingredient: finalIngredient,
          productType: finalProductType,
          brandName, 
          tags: selectedTags 
        })
      );

      // 導航到 loading 頁面
      router.push(
        `/create/loading?idea=${encodeURIComponent(ideaText)}&brand=${encodeURIComponent(brandName)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生錯誤，請重試');
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(1) : router.back()} className="text-gray-600 hover:text-gray-800">
            ← 返回
          </button>
          <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
            品點子
          </Link>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s === step ? 'bg-orange-500 text-white' : s < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 2 && <div className={`w-16 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: 選擇食材 */}
        {step === 1 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                你有什麼食材？
              </h1>
              <p className="text-gray-500">選擇你想用來創作的主要食材</p>
            </div>

            {/* 食材選擇 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {INGREDIENTS.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setIngredient(item.name);
                      setCustomIngredient('');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      ingredient === item.name 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-sm font-medium text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.category}</div>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="block text-gray-600 text-sm mb-2">或其他食材</label>
                <input
                  type="text"
                  value={customIngredient}
                  onChange={(e) => {
                    setCustomIngredient(e.target.value);
                    setIngredient('');
                  }}
                  placeholder="例如：藜麥、奇亞籽..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!ingredient && !customIngredient}
              className={`w-full btn-primary text-xl py-5 ${
                (!ingredient && !customIngredient) ? 'opacity-50 cursor-not-allowed' : ''
              }}`}
            >
              下一步：選擇產品類型 →
            </button>
          </>
        )}

        {/* Step 2: 選擇產品類型 */}
        {step === 2 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                你想把它做成什麼？
              </h1>
              <p className="text-gray-500">
                選擇你想做的產品類型，AI 會幫你想辦法
              </p>
            </div>

            {/* 已選食材提示 */}
            <div className="bg-orange-50 rounded-xl p-4 mb-6 flex items-center justify-center gap-2">
              <span className="text-orange-600">食材：</span>
              <span className="font-semibold text-gray-800">{ingredient || customIngredient}</span>
              <button onClick={() => setStep(1)} className="text-orange-500 text-sm ml-2 hover:underline">
                修改
              </button>
            </div>

            {/* 產品類型選擇 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {PRODUCT_TYPES.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setProductType(item.name);
                      setCustomProductType('');
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      productType === item.name 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-semibold text-gray-800">{item.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="block text-gray-600 text-sm mb-2">或其他類型</label>
                <input
                  type="text"
                  value={customProductType}
                  onChange={(e) => {
                    setCustomProductType(e.target.value);
                    setProductType('');
                  }}
                  placeholder="例如：能量棒、脆片..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔧 進階設定（可選）</h3>

              <div className="mb-4">
                <label className="block text-gray-600 text-sm mb-2">品牌名稱</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="例如：FitMeal（AI 會提供建議）"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-2">風格標籤</label>
                <div className="flex flex-wrap gap-2">
                  {['健康', '自然', '極簡', '健身', '減脂', '美味'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTags([...new Set([...selectedTags, tag])]);
                      }}
                      className={`tag ${selectedTags.includes(tag) ? 'bg-orange-500 text-white' : 'tag-primary'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!(productType || customProductType) || isGenerating}
              className={`w-full btn-primary text-xl py-5 ${
                (!(productType || customProductType) || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? '✨ AI 正在生成中...' : '✨ 讓 AI 幫我想想怎麼做'}
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">
              AI 會根據「{ingredient || customIngredient}」+「{productType || customProductType}」給你專屬建議
            </p>
          </>
        )}
      </main>
    </div>
  );
}