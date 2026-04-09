// P6: Brand Story Page
// Step 3 of Brand Creation Flow

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BrandWizardLayout, { 
  BrandInputField, 
  BrandTextArea,
  LoadingState 
} from '@/components/brand-wizard/BrandWizardLayout';

interface BrandStoryResult {
  brand_story: {
    headline: string;
    story: string;
    mission: string;
    values: string[];
    tone_of_voice: string;
  };
  story_variants: {
    short: string;
    medium: string;
    long: string;
  };
  key_messages: Array<{ message: string; context: string }>;
  storytelling_elements: {
    hero: string;
    conflict: string;
    resolution: string;
    call_to_action: string;
  };
  content_tips: string;
}

const STEP_TITLES = ['品牌命名', 'Logo 設計', '品牌故事', '包裝設計'];

function BrandStoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form state
  const [brandName, setBrandName] = useState('');
  const [productType, setProductType] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [brandPositioning, setBrandPositioning] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  
  // 個人感想狀態
  const [personalStory, setPersonalStory] = useState('');
  const [aiRefining, setAiRefining] = useState(false);
  const [aiRefinedStory, setAiRefinedStory] = useState('');

  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BrandStoryResult | null>(null);

  // Load from sessionStorage
  useEffect(() => {
    // Get brand inputs from previous step
    const brandInputs = sessionStorage.getItem('brandInputs');
    if (brandInputs) {
      try {
        const inputs = JSON.parse(brandInputs);
        setTargetAudience(inputs.targetAudience || '');
        setBrandPositioning(inputs.brandPositioning || '');
      } catch (e) {
        console.error('Failed to parse brand inputs', e);
      }
    }

    // Get selected brand name from naming step (user must have selected one to reach this page)
    const savedBrandName = sessionStorage.getItem('selectedBrandName');
    if (savedBrandName) {
      setBrandName(savedBrandName);
    }

    // Get product info from recipe
    const recipe = sessionStorage.getItem('recipeResult');
    if (recipe) {
      try {
        const data = JSON.parse(recipe);
        setProductType(data.recipe_name || '');
        setProductFeatures(data.description || '');
      } catch (e) {
        console.error('Failed to parse recipe', e);
      }
    }

    // Get positioning
    const positioning = sessionStorage.getItem('positioningResult');
    if (positioning) {
      try {
        const pos = JSON.parse(positioning);
        setBrandPositioning(pos.positioning_statement || '');
      } catch (e) {
        console.error('Failed to parse positioning', e);
      }
    }
    // NOTE: Do NOT auto-load storyResult from sessionStorage
    // User must fill form and click "產生品牌故事" to see results
  }, []);

  const handleGenerate = async () => {
    if (!brandName) {
      setError('請輸入品牌名稱');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'story',
          brandName: brandName,
          productIdea: productType,
          currentRecipe: { description: productFeatures },
          targetAudience: Array.isArray(targetAudience) && targetAudience.length > 0 
            ? targetAudience.join('、') 
            : (targetAudience || '一般消費者'),
          styleTags: [],
          positioning: { positioning_statement: brandPositioning },
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
        sessionStorage.setItem('storyResult', JSON.stringify(data.data));
      } else {
        setError(data.error || '生成失敗');
      }
    } catch (err) {
      setError('網路錯誤，請重試');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (result) {
      router.push('/create/result/packaging');
    }
  };

  const handleBack = () => {
    router.push('/create/result/logo');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // AI 調整個人感想
  const handleRefinePersonalStory = async () => {
    if (!personalStory.trim()) return;
    
    setAiRefining(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'story-refine',
          personalStory: personalStory,
          brandName: brandName,
          targetAudience: targetAudience,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAiRefinedStory(data.data.refined_story || data.data);
      }
    } catch (err) {
      console.error('AI 調整失敗:', err);
    } finally {
      setAiRefining(false);
    }
  };

  return (
    <BrandWizardLayout
      currentStep={3}
      totalSteps={4}
      stepTitles={STEP_TITLES}
      onNext={handleNext}
      onBack={handleBack}
      canProceed={!!result}
      nextLabel="下一步：包裝設計"
    >
      {/* Page Title */}
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="text-5xl mb-4">📖</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          撰寫你的品牌故事
        </h1>
        <p className="text-gray-500">
          讓 AI 幫你說一個動人的品牌故事
        </p>
      </div>

      {/* Form */}
      <div className="card mb-6 animate-fade-in-up">
        <h3 className="font-bold text-gray-800 mb-4">品牌故事資訊</h3>
        
        {/* 品牌名稱 - 從品牌命名頁帶入，不可修改 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            品牌名稱
            <span className="text-xs text-gray-400 ml-2">（從品牌命名頁帶入）</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={brandName}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
              placeholder="從品牌命名頁帶入"
            />
            <span className="text-xs text-orange-500 whitespace-nowrap">
              如需更改請回到上一步
            </span>
          </div>
        </div>

        <BrandInputField
          label="產品類型"
          value={productType}
          onChange={setProductType}
          placeholder="例如：即食咖哩、健康零食"
        />

        <BrandTextArea
          label="產品特色"
          value={productFeatures}
          onChange={setProductFeatures}
          placeholder="你的產品有什麼特色？"
          rows={3}
        />

        <BrandInputField
          label="品牌定位"
          value={brandPositioning}
          onChange={setBrandPositioning}
          placeholder="你想傳達的品牌形象"
        />

        {/* 目標客群 - 從品牌命名頁帶入，不可修改 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目標客群
            <span className="text-xs text-gray-400 ml-2">（從品牌命名頁帶入）</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={Array.isArray(targetAudience) ? targetAudience.join('、') : targetAudience}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
              placeholder="從品牌命名頁帶入"
            />
            <span className="text-xs text-orange-500 whitespace-nowrap">
              如需更改請回到上一步
            </span>
          </div>
        </div>

        {/* 個人感想區塊 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-xl">💭</span>
            或者，寫下你的個人感想
          </h4>
          <p className="text-sm text-gray-500 mb-3">
            寫下你對品牌的想法，讓 AI 幫你調整成更專業的品牌故事
          </p>
          
          <div className="space-y-3">
            <textarea
              value={personalStory}
              onChange={(e) => setPersonalStory(e.target.value)}
              placeholder="例如：我創立這個品牌是因為想要把媽媽的廚房味道分享給更多人..."
              className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
            />
            
            <button
              onClick={handleRefinePersonalStory}
              disabled={aiRefining || !personalStory.trim()}
              className={`btn-secondary w-full ${aiRefining ? 'opacity-50' : ''}`}
            >
              {aiRefining ? '🤔 AI 調整中...' : '✨ 讓 AI 幫我調整'}
            </button>

            {/* AI 調整後的結果 */}
            {aiRefinedStory && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-600 font-medium">✨ AI 調整後的品牌故事</span>
                  <button
                    onClick={() => copyToClipboard(aiRefinedStory)}
                    className="text-xs text-purple-500 hover:text-purple-700"
                  >
                    📋 複製
                  </button>
                </div>
                <p className="text-gray-700 whitespace-pre-line mb-3">{aiRefinedStory}</p>
                <button
                  onClick={() => {
                    // Create a result object from the AI refined story
                    const customResult = {
                      brand_story: {
                        headline: brandName,
                        story: aiRefinedStory,
                        mission: '傳遞溫暖與美味',
                        values: ['用心', '分享', '品質'],
                        tone_of_voice: '溫馨真誠',
                      },
                      story_variants: {
                        short: aiRefinedStory.substring(0, 100),
                        medium: aiRefinedStory,
                        long: aiRefinedStory,
                      },
                      key_messages: [],
                      storytelling_elements: {
                        hero: brandName,
                        conflict: '尋找健康的美味選擇',
                        resolution: '提供天然健康的食品',
                        call_to_action: '嘗試我們的產品',
                      },
                      content_tips: '',
                    };
                    setResult(customResult);
                    sessionStorage.setItem('storyResult', JSON.stringify(customResult));
                  }}
                  className="btn-primary w-full"
                >
                  使用這個故事 →
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !brandName}
          className={`btn-primary w-full mt-4 ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? '🤔 AI 撰寫中...' : '✨ 產生品牌故事'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {loading && <LoadingState message="AI 正在撰寫你的品牌故事..." />}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Main Story */}
          <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-purple-800 text-lg">📖 品牌故事</h3>
              <button
                onClick={() => copyToClipboard(result.brand_story?.story || '')}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                📋 複製
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-lg font-bold text-gray-800 mb-2">{result.brand_story?.headline}</p>
              <div className="text-gray-600 whitespace-pre-line">
                {result.brand_story?.story}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/50 rounded-lg p-3">
                <p className="text-gray-500 mb-1">🎯 使命</p>
                <p className="text-gray-800">{result.brand_story?.mission}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <p className="text-gray-500 mb-1">🎨 語調</p>
                <p className="text-gray-800">{result.brand_story?.tone_of_voice}</p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="card">
            <h4 className="font-bold text-gray-800 mb-3">💎 品牌價值觀</h4>
            <div className="flex flex-wrap gap-2">
              {result.brand_story?.values?.map((value, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {value}
                </span>
              ))}
            </div>
          </div>

          {/* Story Variants */}
          <div className="card">
            <h4 className="font-bold text-gray-800 mb-3">📝 不同長度的故事版本</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">短版（社群媒體）</p>
                <p className="text-gray-700">{result.story_variants?.short}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">中版（About 頁面）</p>
                <p className="text-gray-700">{result.story_variants?.medium}</p>
              </div>
            </div>
          </div>

          {/* Key Messages */}
          <div className="card">
            <h4 className="font-bold text-gray-800 mb-3">💬 關鍵訊息</h4>
            <div className="space-y-2">
              {result.key_messages?.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <div>
                    <p className="text-gray-700">{msg.message}</p>
                    <p className="text-gray-400 text-xs">使用場景：{msg.context}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storytelling Elements */}
          <div className="card bg-blue-50">
            <h4 className="font-bold text-blue-800 mb-3">🎭 故事元素</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">主角</p>
                <p className="text-gray-800">{result.storytelling_elements?.hero}</p>
              </div>
              <div>
                <p className="text-gray-500">挑戰</p>
                <p className="text-gray-800">{result.storytelling_elements?.conflict}</p>
              </div>
              <div>
                <p className="text-gray-500">解決方案</p>
                <p className="text-gray-800">{result.storytelling_elements?.resolution}</p>
              </div>
              <div>
                <p className="text-gray-500">呼籲行動</p>
                <p className="text-gray-800">{result.storytelling_elements?.call_to_action}</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-yellow-50">
            <h4 className="font-bold text-yellow-800 mb-2">💡 內容創作小提示</h4>
            <p className="text-sm text-gray-600">{result.content_tips}</p>
          </div>
        </div>
      )}
    </BrandWizardLayout>
  );
}

export default function BrandStoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">📖</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    }>
      <BrandStoryContent />
    </Suspense>
  );
}
