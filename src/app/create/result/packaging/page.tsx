// P7: Packaging Design Page
// Step 4 of Brand Creation Flow

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BrandWizardLayout, { 
  BrandInputField, 
  BrandSelect,
  LoadingState 
} from '@/components/brand-wizard/BrandWizardLayout';

interface PackagingConcept {
  concept_name: string;
  description: string;
  structure: {
    type: string;
    size: string;
    material: string;
    finish: string;
  };
  design_elements: {
    front: { main_visual: string; product_name: string; tagline: string };
    back: { ingredients: string; nutrition: string; company_info: string };
    side: { usage: string; storage: string; barcode: string };
  };
  color_scheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  printing_technique: string;
  cost_estimate: string;
  pros: string[];
  cons: string[];
  reason: string;
}

interface PackagingResult {
  packaging_concepts: PackagingConcept[];
  label_requirements: {
    required: string[];
    recommended: string[];
    optional: string[];
  };
  packaging_checklist: {
    functionality: string[];
    legal: string[];
    aesthetics: string[];
    cost: string[];
  };
  sustainability: {
    material_options: string[];
    recyclability: string;
    tips: string;
  };
  production_tips: string;
}

const STEP_TITLES = ['品牌命名', 'Logo 設計', '品牌故事', '包裝設計'];

function PackagingDesignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form state
  const [brandName, setBrandName] = useState('');
  const [productType, setProductType] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [packagingForm, setPackagingForm] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [brandPositioning, setBrandPositioning] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('');

  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PackagingResult | null>(null);

  // Load from sessionStorage
  useEffect(() => {
    // Get brand inputs from previous step
    const brandInputs = sessionStorage.getItem('brandInputs');
    if (brandInputs) {
      try {
        const inputs = JSON.parse(brandInputs);
        setTargetAudience(inputs.targetAudience || '');
        setBrandPositioning(inputs.brandPositioning || '');
        setPreferredStyle(inputs.preferredStyle || '');
      } catch (e) {
        console.error('Failed to parse brand inputs', e);
      }
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

    // Load existing result
    const packagingResult = sessionStorage.getItem('packagingResult');
    if (packagingResult) {
      try {
        setResult(JSON.parse(packagingResult));
      } catch (e) {
        console.error('Failed to parse packaging result', e);
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
          type: 'packaging',
          brandName: brandName,
          productIdea: productType,
          currentRecipe: { description: productFeatures },
          targetAudience: targetAudience || '一般消費者',
          styleTags: [packagingForm],
          budgetRange: budgetRange,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
        sessionStorage.setItem('packagingResult', JSON.stringify(data.data));
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
    // Navigate to completion/summary page
    if (result) {
      router.push('/create/result/summary');
    }
  };

  const handleBack = () => {
    router.push('/create/result/story');
  };

  return (
    <BrandWizardLayout
      currentStep={4}
      totalSteps={4}
      stepTitles={STEP_TITLES}
      onNext={handleNext}
      onBack={handleBack}
      canProceed={!!result}
      nextLabel="完成！查看總結"
    >
      {/* Page Title */}
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="text-5xl mb-4">📦</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          設計你的產品包裝
        </h1>
        <p className="text-gray-500">
          讓 AI 為你產生专业的包裝設計建議
        </p>
      </div>

      {/* Form */}
      <div className="card mb-6 animate-fade-in-up">
        <h3 className="font-bold text-gray-800 mb-4">包裝設計資訊</h3>
        
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
          label="產品特色"
          value={productFeatures}
          onChange={setProductFeatures}
          placeholder="產品的特色和卖点"
        />

        <BrandSelect
          label="包裝形式"
          value={packagingForm}
          onChange={setPackagingForm}
          options={[
            { value: '', label: '請選擇包裝形式' },
            { value: '袋裝', label: '袋裝（夾鏈袋/站立袋）' },
            { value: '盒裝', label: '盒裝（天地蓋盒/摺疊盒）' },
            { value: '罐裝', label: '罐裝（金屬罐/玻璃罐）' },
            { value: '瓶裝', label: '瓶裝（塑膠瓶/玻璃瓶）' },
            { value: '組合', label: '組合包裝' },
          ]}
        />

        <BrandSelect
          label="預算範圍"
          value={budgetRange}
          onChange={setBudgetRange}
          options={[
            { value: '', label: '請選擇預算' },
            { value: '低', label: '低成本（每個 < NT$3）' },
            { value: '中', label: '中等成本（每個 NT$3-8）' },
            { value: '高', label: '較高成本（每個 > NT$8）' },
          ]}
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
              value={targetAudience}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
              placeholder="從品牌命名頁帶入"
            />
            <span className="text-xs text-orange-500 whitespace-nowrap">
              如需更改請回到上一步
            </span>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !brandName}
          className={`btn-primary w-full mt-4 ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? '🤔 AI 設計中...' : '✨ 產生包裝設計'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {loading && <LoadingState message="AI 正在設計你的包裝..." />}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Packaging Concepts */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">📦 包裝設計概念</h3>
            <div className="space-y-4">
              {result.packaging_concepts?.map((concept, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-purple-800">{concept.concept_name}</h4>
                    <span className="text-sm text-gray-500">{concept.cost_estimate}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{concept.description}</p>
                  
                  {/* Structure */}
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">包裝結構</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">類型：</span>{concept.structure?.type}</div>
                      <div><span className="text-gray-500">尺寸：</span>{concept.structure?.size}</div>
                      <div><span className="text-gray-500">材質：</span>{concept.structure?.material}</div>
                      <div><span className="text-gray-500">表面：</span>{concept.structure?.finish}</div>
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-500">配色：</span>
                    <div className="flex gap-2">
                      {[
                        concept.color_scheme?.primary,
                        concept.color_scheme?.secondary,
                        concept.color_scheme?.accent,
                        concept.color_scheme?.text,
                      ].map((color, cidx) => (
                        <div 
                          key={cidx}
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: color?.match(/#[\dA-Fa-f]+/) ? color.match(/#[\dA-Fa-f]+/)?.[0] : undefined }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-green-600">優點：</span>
                      <span className="text-gray-600">{concept.pros?.join('、')}</span>
                    </div>
                    <div>
                      <span className="text-red-600">缺點：</span>
                      <span className="text-gray-600">{concept.cons?.join('、')}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm">{concept.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Label Requirements */}
          <div className="card">
            <h4 className="font-bold text-gray-800 mb-3">🏷️ 標籤要求</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-red-600 font-medium mb-1">必要標示</p>
                <div className="flex flex-wrap gap-2">
                  {result.label_requirements?.required?.map((item, idx) => (
                    <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium mb-1">建議標示</p>
                <div className="flex flex-wrap gap-2">
                  {result.label_requirements?.recommended?.map((item, idx) => (
                    <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">可選標示</p>
                <div className="flex flex-wrap gap-2">
                  {result.label_requirements?.optional?.map((item, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="card">
            <h4 className="font-bold text-gray-800 mb-3">✅ 包裝檢查清單</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-600 font-medium mb-2">功能檢查</p>
                <ul className="space-y-1">
                  {result.packaging_checklist?.functionality?.map((item, idx) => (
                    <li key={idx} className="text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-red-600 font-medium mb-2">法規檢查</p>
                <ul className="space-y-1">
                  {result.packaging_checklist?.legal?.map((item, idx) => (
                    <li key={idx} className="text-gray-600 flex items-start gap-2">
                      <span className="text-red-500">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sustainability */}
          <div className="card bg-green-50">
            <h4 className="font-bold text-green-800 mb-3">🌱 環保包裝</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">環保材質選項：</span>
                <span className="text-gray-700">{result.sustainability?.material_options?.join('、')}</span>
              </div>
              <div>
                <span className="text-gray-500">可回收性：</span>
                <span className="text-gray-700">{result.sustainability?.recyclability}</span>
              </div>
              <div>
                <span className="text-gray-500">建議：</span>
                <span className="text-gray-700">{result.sustainability?.tips}</span>
              </div>
            </div>
          </div>

          {/* Production Tips */}
          <div className="card bg-yellow-50">
            <h4 className="font-bold text-yellow-800 mb-2">💡 生產製作小提示</h4>
            <p className="text-sm text-gray-600">{result.production_tips}</p>
          </div>
        </div>
      )}
    </BrandWizardLayout>
  );
}

export default function PackagingDesignPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">📦</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    }>
      <PackagingDesignContent />
    </Suspense>
  );
}
