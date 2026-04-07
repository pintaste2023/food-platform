// P4: Brand Naming Page
// Step 1 of Brand Creation Flow

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BrandWizardLayout, { 
  BrandInputField, 
  BrandSelect,
  LoadingState, 
  ErrorState 
} from '@/components/brand-wizard/BrandWizardLayout';

interface BrandName {
  name: string;
  reason: string;
  chinese_meaning: string;
  emotional_tone: string;
  memorability: number;
  suitable_for: string;
}

interface NamingResult {
  brand_names: BrandName[];
  domain_check: {
    domain_available: string;
    social_media: string;
  };
  naming_tips: string;
}

const STEP_TITLES = ['品牌命名', 'Logo 設計', '品牌故事', '包裝設計'];

function BrandNamingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form state
  const [productType, setProductType] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [brandPositioning, setBrandPositioning] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('');

  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<NamingResult | null>(null);

  // Load from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('recipeResult');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setProductType(data.recipe_name || '');
        setProductFeatures(data.description || '');
      } catch (e) {
        console.error('Failed to parse stored data', e);
      }
    }
    
    const positioning = sessionStorage.getItem('positioningResult');
    if (positioning) {
      try {
        const pos = JSON.parse(positioning);
        setBrandPositioning(pos.positioning_statement || '');
      } catch (e) {
        console.error('Failed to parse positioning', e);
      }
    }

    // Load existing result if any
    const namingResult = sessionStorage.getItem('namingResult');
    if (namingResult) {
      try {
        setResult(JSON.parse(namingResult));
      } catch (e) {
        console.error('Failed to parse naming result', e);
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (!productType) {
      setError('請輸入產品名稱');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'naming',
          productIdea: productType,
          currentRecipe: { description: productFeatures },
          targetAudience: targetAudience || '一般消費者',
          styleTags: [preferredStyle],
          positioning: { positioning_statement: brandPositioning },
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
        sessionStorage.setItem('namingResult', JSON.stringify(data.data));
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
      router.push('/create/result/logo');
    }
  };

  const handleBack = () => {
    router.push('/create/result/recipe');
  };

  return (
    <BrandWizardLayout
      currentStep={1}
      totalSteps={4}
      stepTitles={STEP_TITLES}
      onNext={handleNext}
      onBack={handleBack}
      canProceed={!!result}
      nextLabel="下一步：Logo 設計"
    >
      {/* Page Title */}
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="text-5xl mb-4">✨</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          為你的產品命名
        </h1>
        <p className="text-gray-500">
          讓 AI 幫你想一個好名字
        </p>
      </div>

      {/* Form */}
      <div className="card mb-6 animate-fade-in-up">
        <h3 className="font-bold text-gray-800 mb-4">產品資訊</h3>
        
        <BrandInputField
          label="產品名稱"
          value={productType}
          onChange={setProductType}
          placeholder="例如：低卡咖哩、健康餅乾"
          required
        />

        <BrandInputField
          label="產品特色"
          value={productFeatures}
          onChange={setProductFeatures}
          placeholder="例如：高纖維、低糖、天然食材"
        />

        <BrandInputField
          label="目標客群"
          value={targetAudience}
          onChange={setTargetAudience}
          placeholder="例如：忙碌上班族、健身族群"
        />

        <BrandInputField
          label="品牌定位"
          value={brandPositioning}
          onChange={setBrandPositioning}
          placeholder="你想傳達的品牌形象"
        />

        <BrandSelect
          label="偏好風格"
          value={preferredStyle}
          onChange={setPreferredStyle}
          options={[
            { value: '', label: '請選擇風格' },
            { value: '專業', label: '專業正式' },
            { value: '活潑', label: '活潑可愛' },
            { value: '自然', label: '自然清新' },
            { value: '時尚', label: '時尚潮流' },
            { value: '溫馨', label: '溫馨居家' },
          ]}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !productType}
          className={`btn-primary w-full mt-4 ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? '🤔 AI 思考中...' : '✨ 產生品牌名稱'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {loading && <LoadingState message="AI 正在為你命名..." />}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="font-bold text-purple-800 mb-4 text-lg">
              🎁 品牌名稱建議
            </h3>
            
            <div className="space-y-4">
              {result.brand_names?.map((brand, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border-2 border-purple-100 hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-800">{brand.name}</h4>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                      易記度 {brand.memorability}/10
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{brand.chinese_meaning}</p>
                  <p className="text-gray-500 text-sm mb-2">{brand.reason}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                      {brand.emotional_tone}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      適合：{brand.suitable_for}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-yellow-50">
            <h4 className="font-bold text-yellow-800 mb-2">💡 命名小提示</h4>
            <p className="text-sm text-gray-600">{result.naming_tips}</p>
          </div>

          {/* Domain Check */}
          <div className="card">
            <h4 className="font-bold text-gray-800 mb-2">🌐 可用性檢查</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>網域：{result.domain_check?.domain_available || '待確認'}</p>
              <p>社群：{result.domain_check?.social_media || '待確認'}</p>
            </div>
          </div>
        </div>
      )}
    </BrandWizardLayout>
  );
}

export default function BrandNamingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🤔</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    }>
      <BrandNamingContent />
    </Suspense>
  );
}
