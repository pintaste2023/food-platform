// P5: Logo Design Page
// Step 2 of Brand Creation Flow

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import BrandWizardLayout, { 
  BrandInputField, 
  BrandSelect,
  BrandSelectWithOther,
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
  const { user, savePersonalLogo, isLoading: authLoading } = useAuth();
  
  // Form state
  const [hasExistingLogo, setHasExistingLogo] = useState<boolean | null>(null);
  const [useExistingLogo, setUseExistingLogo] = useState(false);
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
    // Wait for auth to load
    if (authLoading) return;

    console.log('User:', user);
    console.log('Personal logo:', user?.personalLogo);

    // Check if user already has a personal logo
    if (user?.personalLogo && Object.keys(user.personalLogo).length > 0) {
      setHasExistingLogo(true);
    } else {
      setHasExistingLogo(false);
    }

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
  }, [user, authLoading]);

  const handleGenerate = async () => {
    if (!brandName) {
      setError('請輸入品牌名稱');
      return;
    }
    if (!brandPositioning) {
      setError('請選擇品牌定位');
      return;
    }
    if (!targetAudience) {
      setError('請選擇目標客群');
      return;
    }
    if (!preferredStyle) {
      setError('請選擇偏好風格');
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
        
        // Save to user's personal logo
        savePersonalLogo({
          brandName: brandName,
          ...data.data,
        });
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
    // Must have result in these cases:
    // - No existing logo (must create one)
    // - Has existing logo but chooses to create new (must create new)
    const mustHaveResult = hasExistingLogo === false || (hasExistingLogo === true && useExistingLogo === false);
    
    if (!mustHaveResult || result) {
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
      canProceed={
        hasExistingLogo === false && !!result ||  // Must create new logo
        hasExistingLogo === true && useExistingLogo === true ||  // Can reuse existing
        hasExistingLogo === true && useExistingLogo === false && !!result  // Must create new
      }
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
        {/* 檢查是否有現有 Logo */}
        {hasExistingLogo === true && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <p className="font-bold text-gray-800 mb-3">🎯 你已經有一個個人品牌 Logo 了！</p>
            <p className="text-sm text-gray-600 mb-4">
              你在 <strong>{user?.personalLogo?.createdAt}</strong> 設計了 <strong>{user?.personalLogo?.brandName}</strong> 的 Logo
            </p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="logoChoice"
                  checked={!useExistingLogo}
                  onChange={() => setUseExistingLogo(false)}
                  className="w-5 h-5 accent-orange-500"
                />
                <span className="text-gray-700">產生一個新的 Logo（這次設計新的）</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="logoChoice"
                  checked={useExistingLogo}
                  onChange={() => setUseExistingLogo(true)}
                  className="w-5 h-5 accent-orange-500"
                />
                <span className="text-gray-700">沿用之前的 Logo（直接使用之前的設計）</span>
              </label>
            </div>
          </div>
        )}

        {/* 如果選擇沿用之前的 Logo */}
        {hasExistingLogo === true && useExistingLogo && (
          <div className="mb-6 text-center py-8 bg-green-50 rounded-xl">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">沿用個人品牌 Logo</h3>
            <p className="text-gray-600 mb-4">
              你即將使用 <strong>{user?.personalLogo?.brandName}</strong> 的 Logo
            </p>
            <button
              onClick={() => {
                if (user?.personalLogo?.logoData) {
                  setResult(user.personalLogo.logoData);
                  sessionStorage.setItem('logoResult', JSON.stringify(user.personalLogo.logoData));
                }
              }}
              className="btn-primary"
            >
              確認使用 →
            </button>
          </div>
        )}

        {/* 如果選擇產生新的 Logo 或沒有現有 Logo */}
        {hasExistingLogo !== null && (
          <>
            {hasExistingLogo === true && !useExistingLogo && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-4">🎨 設計個人品牌 Logo</h3>
                <p className="text-sm text-gray-500 mb-4">
                  這是你的個人品牌 Logo，將來會用在所有產品包裝上
                </p>
              </div>
            )}
            {hasExistingLogo === false && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-4">🎨 設計個人品牌 Logo</h3>
                <p className="text-sm text-gray-500 mb-4">
                  這是你的第一款產品，現在讓我們為你建立個人品牌 Logo
                </p>
              </div>
            )}
            
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

            <BrandSelectWithOther
              label="品牌定位"
              value={brandPositioning}
              onChange={setBrandPositioning}
              options={[
                { value: '', label: '請選擇品牌定位' },
                { value: '健康取向', label: '健康取向' },
                { value: '美味優先', label: '美味優先' },
                { value: '方便快速', label: '方便快速' },
                { value: '高端品質', label: '高端品質' },
                { value: '平價實惠', label: '平價實惠' },
                { value: '天然有機', label: '天然有機' },
              ]}
              otherPlaceholder="例如：網紅美食、派對點心"
            />

            <BrandSelectWithOther
              label="目標客群"
              value={targetAudience}
              onChange={setTargetAudience}
              options={[
                { value: '', label: '請選擇目標客群' },
                { value: '忙碌上班族', label: '忙碌上班族' },
                { value: '健身族群', label: '健身族群' },
                { value: '學生族群', label: '學生族群' },
                { value: '家庭煮婦/夫', label: '家庭煮婦/夫' },
                { value: '銀髮族', label: '銀髮族' },
                { value: '愛美人士', label: '愛美人士' },
                { value: '環保意識者', label: '環保意識者' },
              ]}
              otherPlaceholder="例如：減肥族群、創業者"
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
              disabled={loading || !brandName || !brandPositioning || !targetAudience || !preferredStyle}
              className={`btn-primary w-full mt-4 ${(loading || !brandName || !brandPositioning || !targetAudience || !preferredStyle) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? '🤔 AI 設計中...' : '✨ 產生 Logo 設計'}
            </button>
          </>
        )}
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
