// AI Loading Page Content with API Integration
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const loadingSteps = [
  { id: 1, text: '理解你的產品想法', icon: '💡' },
  { id: 2, text: '補齊完整產品設定', icon: '⚙️' },
  { id: 3, text: '設計風味與配方比例', icon: '🧪' },
  { id: 4, text: '調整成可試作版本', icon: '📝' },
  { id: 5, text: '評估市場接受度', icon: '📊' },
  { id: 6, text: '分析這個方向的競爭缺口', icon: '🔍' },
  { id: 7, text: '找出早期採用者的抱怨', icon: '👥' },
  { id: 8, text: '評估趨勢信號', icon: '📈' },
];

interface GenerateParams {
  idea: string;
  brandName: string;
  tags: string[];
}

interface RecipeResult {
  success: boolean;
  data?: any;
  mode?: string;
  message?: string;
  error?: string;
}

// API 調用
async function callGenerateAPI(params: GenerateParams): Promise<RecipeResult> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'recipe',
      productIdea: params.idea,
      targetAudience: '一般消費者',
      styleTags: params.tags,
      brandName: params.brandName,
    }),
  });

  return response.json();
}

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // 從 sessionStorage 獲取參數
    const storedParams = sessionStorage.getItem('generateParams');
    if (!storedParams) {
      router.push('/create');
      return;
    }

    const params: GenerateParams = JSON.parse(storedParams);
    const idea = searchParams.get('idea') || params.idea;

    // 模擬載入動畫
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
      setProgress((prev) => {
        if (prev < 95) {
          return Math.min(prev + 10, 95);
        }
        return 95;
      });
    }, 600);

    // 實際調用 API
    callGenerateAPI(params)
      .then((result) => {
        clearInterval(interval);
        setProgress(100);
        setCurrentStep(loadingSteps.length - 1);

        // 儲存結果到 sessionStorage
        if (result.success) {
          sessionStorage.setItem('recipeResult', JSON.stringify(result.data));
          
          // 延遲一點導航，讓用戶看到完成
          setTimeout(() => {
            router.push(`/create/result?idea=${encodeURIComponent(idea)}`);
          }, 800);
        } else {
          setError(result.error || '生成失敗，請重試');
        }
      })
      .catch((err) => {
        clearInterval(interval);
        setError('發生錯誤，請重試');
        console.error(err);
      });

    return () => {
      clearInterval(interval);
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
            ← 返回
          </button>
          <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
            品點子
          </Link>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 max-w-md text-center">
            {error}
            <button
              onClick={() => router.push('/create')}
              className="block mt-2 text-sm text-red-500 hover:underline"
            >
              回到上一頁重新嘗試
            </button>
          </div>
        )}

        {!error && (
          <>
            {/* Logo */}
            <div className="mb-8">
              <div className="text-4xl animate-bounce">🤖</div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-8">
              正在為你設計產品...
            </h1>

            {/* Progress Bar */}
            <div className="w-full max-w-md mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-500 mt-2">{Math.round(progress)}%</p>
            </div>

            {/* Steps */}
            <div className="w-full max-w-md space-y-3">
              {loadingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <span className="text-xl">{step.icon}</span>
                  <span className="font-medium">
                    {index <= currentStep ? '✓' : '○'} {step.text}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="w-8"></div>
            <div className="font-bold text-xl gradient-text">品點子</div>
            <div className="w-8"></div>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-4xl mb-8">🤖</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    }>
      <LoadingContent />
    </Suspense>
  );
}