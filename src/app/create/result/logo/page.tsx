// P5: Logo Design Page
// Step 2 of Brand Creation Flow

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BrandWizardLayout, { 
  BrandInputField, 
  BrandSelect,
  LoadingState, 
  ErrorState 
} from '@/components/brand-wizard/BrandWizardLayout';

interface LogoConcept {
  concept_name: string;
  description: string;
  visual_elements: {
    icon: string;
    color_palette: Array<{ color: string; hex: string; usage: string }>;
    typography: { font_style: string; recommendations: string };
    layout: string;
  };
  mood: string;
  versatility: string;
  reason: string;
}

interface LogoResult {
  logo_concepts: LogoConcept[];
  color_guidelines: {
    primary: { name: string; hex: string; usage: string; psychology: string };
    secondary: { name: string; hex: string; usage: string; psychology: string };
    accent: { name: string; hex: string; usage: string; psychology: string };
  };
  design_tips: string;
  do_and_dont: { do: string[]; dont: string[] };
}

const STEP_TITLES = ['品牌命名', 'Logo 設計', '品牌故事', '包裝設計'];

function LogoDesignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form state
  const [brandName, setBrandName] = useState('');
  const [productType, setProductType] = useState('');
  const [brandPositioning, setBrandPositioning] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('');

  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LogoResult | null>(null);

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

    // Get product type from recipe
    const recipe = sessionStorage.getItem('recipeResult');
    if (recipe) {
      try {
        const data = JSON.parse(recipe);
        setProductType(data.recipe_name || '');
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
    const logoResult = sessionStorage.getItem('logoResult');
    if (logoResult) {
      try {
        setResult(JSON.parse(logoResult));
      } catch (e) {
        console.error('Failed to parse logo result', e);
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
          type: 'logo',
          brandName: brandName,
          productIdea: productType,
          currentRecipe: { positioning_statement: brandPositioning },
          targetAudience: targetAudience || '一般消費者',
          styleTags: [preferredStyle],
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
        sessionStorage.setItem('logoResult', JSON.stringify(data.data));
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
      router.push('/create/result/story');
    }
  };

  const handleBack = () => {
    router.push('/create/result/brand');
  };

  return (
    <BrandWizardLayout
      currentStep={2}
      totalSteps={4}
      stepTitles={STEP_TITLES}
      onNext={handleNext}
      onBack={handleBack}
      canProceed={!!result}
      nextLabel="下一步：品牌故事"
    >
      {/* Page Title */}
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="text-5xl mb-4">🎨</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          設計你的品牌 Logo
        </h1>
        <p className="text-gray-500">
          讓 AI 為你產生专业的 Logo 設計建議
        </p>
      </div>

      {/* Form */}
      <div className="card mb-6 animate-fade-in-up">
        <h3 className="font-bold text-gray-800 mb-4">Logo 設計資訊</h3>
        
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

        <BrandSelect
          label="偏好風格"
          value={preferredStyle}
          onChange={setPreferredStyle}
          options={[
            { value: '', label: '請選擇風格' },
            { value: '簡約', label: '簡約現代' },
            { value: '手繪', label: '手繪溫馨' },
            { value: '幾何', label: '幾何時尚' },
            { value: '復古', label: '復古經典' },
            { value: '自然', label: '自然清新' },
          ]}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !brandName}
          className={`btn-primary w-full mt-4 ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? '🤔 AI 設計中...' : '✨ 產生 Logo 設計'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {loading && <LoadingState message="AI 正在設計你的 Logo..." />}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Color Guidelines */}
          <div className="card bg-gradient-to-r from-orange-50 to-yellow-50">
            <h3 className="font-bold text-gray-800 mb-4">🎨 品牌色彩</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: result.color_guidelines?.primary?.name, hex: result.color_guidelines?.primary?.hex },
                { name: result.color_guidelines?.secondary?.name, hex: result.color_guidelines?.secondary?.hex },
                { name: result.color_guidelines?.accent?.name, hex: result.color_guidelines?.accent?.hex },
              ].map((color, idx) => (
                <div key={idx} className="text-center">
                  <div 
                    className="w-16 h-16 rounded-xl mx-auto mb-2 shadow-md"
                    style={{ backgroundColor: color.hex || '#ccc' }}
                  />
                  <p className="text-sm font-medium text-gray-800">{color.name}</p>
                  <p className="text-xs text-gray-500">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Logo Concepts */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">💡 Logo 設計概念</h3>
            <div className="space-y-4">
              {result.logo_concepts?.map((concept, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-purple-800 mb-2">{concept.concept_name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{concept.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">圖示：</span>
                      <span className="text-gray-700">{concept.visual_elements?.icon}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">字體：</span>
                      <span className="text-gray-700">{concept.visual_elements?.typography?.font_style}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">氛圍：</span>
                      <span className="text-gray-700">{concept.mood}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">應用：</span>
                      <span className="text-gray-700">{concept.versatility}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm">{concept.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Do and Don't */}
          <div className="card">
            <h4 className="font-bold text-gray-800 mb-3">✅ 做與不做</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-green-600 font-medium mb-2">建議事項</p>
                <ul className="space-y-1">
                  {result.do_and_dont?.do?.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-red-600 font-medium mb-2">避免事項</p>
                <ul className="space-y-1">
                  {result.do_and_dont?.dont?.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-blue-50">
            <h4 className="font-bold text-blue-800 mb-2">💡 設計小提示</h4>
            <p className="text-sm text-gray-600">{result.design_tips}</p>
          </div>
        </div>
      )}
    </BrandWizardLayout>
  );
}

export default function LogoDesignPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🎨</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    }>
      <LogoDesignContent />
    </Suspense>
  );
}
