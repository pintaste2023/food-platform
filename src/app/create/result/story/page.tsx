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

  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BrandStoryResult | null>(null);

  // Load from sessionStorage
  useEffect(() => {
    // Get brand name from naming result
    const namingResult = sessionStorage.getItem('namingResult');
    if (namingResult) {
      try {
        const data = JSON.parse(namingResult);
        if (data.brand_names && data.brand_names.length > 0) {
          setBrandName(data.brand_names[0].name);
        }
      } catch (e) {
        console.error('Failed to parse naming result', e);
      }
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

    // Load existing result
    const storyResult = sessionStorage.getItem('storyResult');
    if (storyResult) {
      try {
        setResult(JSON.parse(storyResult));
      } catch (e) {
        console.error('Failed to parse story result', e);
      }
    }
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
          targetAudience: targetAudience || '一般消費者',
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
        
        <BrandInputField
          label="品牌名稱"
          value={brandName}
          onChange={setBrandName}
          placeholder="你的品牌叫什麼？"
          required
        />

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

        <BrandInputField
          label="目標客群"
          value={targetAudience}
          onChange={setTargetAudience}
          placeholder="例如：忙碌上班族、健身族群"
        />

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
