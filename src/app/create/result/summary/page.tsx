// Summary Page - Shows all brand creation results
// End of the brand creation flow

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STEPS = [
  { title: '品牌命名', icon: '✨', path: '/create/result/brand' },
  { title: 'Logo 設計', icon: '🎨', path: '/create/result/logo' },
  { title: '品牌故事', icon: '📖', path: '/create/result/story' },
  { title: '包裝設計', icon: '📦', path: '/create/result/packaging' },
];

function SummaryContent() {
  const [results, setResults] = useState<{
    naming?: any;
    logo?: any;
    story?: any;
    packaging?: any;
  }>({});

  useEffect(() => {
    // Load all results from sessionStorage
    const namingResult = sessionStorage.getItem('namingResult');
    const logoResult = sessionStorage.getItem('logoResult');
    const storyResult = sessionStorage.getItem('storyResult');
    const packagingResult = sessionStorage.getItem('packagingResult');

    setResults({
      naming: namingResult ? JSON.parse(namingResult) : null,
      logo: logoResult ? JSON.parse(logoResult) : null,
      story: storyResult ? JSON.parse(storyResult) : null,
      packaging: packagingResult ? JSON.parse(packagingResult) : null,
    });
  }, []);

  const hasAnyResult = results.naming || results.logo || results.story || results.packaging;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/create/result/packaging" className="text-gray-600 hover:text-gray-800">
            ← 返回上一步
          </Link>
          <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
            品點子
          </Link>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Celebration Banner */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            恭喜！你已完成品牌設計
          </h1>
          <p className="text-gray-500">
            以下是你在 AI 幫助下生成的產品與品牌資產
          </p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((step, idx) => {
            const hasResult = results[step.path.includes('brand') ? 'naming' : 
              step.path.includes('logo') ? 'logo' : 
              step.path.includes('story') ? 'story' : 'packaging'];
            return (
              <div key={idx} className="flex items-center">
                <div className={`flex flex-col items-center ${hasResult ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="text-2xl mb-1">{step.icon}</span>
                  <span className="text-sm">{step.title}</span>
                  {hasResult && <span className="text-xs">✓</span>}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${hasResult ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {!hasAnyResult ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-gray-500 mb-4">還沒有產生任何品牌資產</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create/result/brand" className="btn-primary">
                從品牌命名開始
              </Link>
              <Link href="/create" className="btn-secondary">
                重新開始
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Naming Result */}
            {results.naming && (
              <div className="card animate-fade-in-up">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✨</span>
                  <h3 className="text-lg font-bold text-gray-800">品牌命名</h3>
                </div>
                <div className="space-y-2">
                  {results.naming.brand_names?.slice(0, 2).map((brand: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-lg text-gray-800">{brand.name}</span>
                        <span className="text-gray-500 text-sm ml-2">({brand.emotional_tone})</span>
                      </div>
                      <Link 
                        href="/create/result/brand" 
                        className="text-orange-500 text-sm hover:underline"
                      >
                        查看詳情 →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logo Result */}
            {results.logo && (
              <div className="card animate-fade-in-up">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎨</span>
                  <h3 className="text-lg font-bold text-gray-800">Logo 設計</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {results.logo.color_guidelines && (
                      <>
                        <div 
                          className="w-12 h-12 rounded-lg shadow"
                          style={{ backgroundColor: results.logo.color_guidelines.primary?.hex }}
                          title={results.logo.color_guidelines.primary?.name}
                        />
                        <div 
                          className="w-12 h-12 rounded-lg shadow"
                          style={{ backgroundColor: results.logo.color_guidelines.secondary?.hex }}
                          title={results.logo.color_guidelines.secondary?.name}
                        />
                        <div 
                          className="w-12 h-12 rounded-lg shadow"
                          style={{ backgroundColor: results.logo.color_guidelines.accent?.hex }}
                          title={results.logo.color_guidelines.accent?.name}
                        />
                      </>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm">
                      {results.logo.logo_concepts?.[0]?.concept_name}
                    </p>
                    <Link 
                      href="/create/result/logo" 
                      className="text-orange-500 text-sm hover:underline"
                    >
                      查看詳情 →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Story Result */}
            {results.story && (
              <div className="card animate-fade-in-up">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📖</span>
                  <h3 className="text-lg font-bold text-gray-800">品牌故事</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-800">{results.story.brand_story?.headline}</p>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {results.story.story_variants?.short}
                  </p>
                  <Link 
                    href="/create/result/story" 
                    className="text-orange-500 text-sm hover:underline"
                  >
                    查看詳情 →
                  </Link>
                </div>
              </div>
            )}

            {/* Packaging Result */}
            {results.packaging && (
              <div className="card animate-fade-in-up">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📦</span>
                  <h3 className="text-lg font-bold text-gray-800">包裝設計</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700">
                    推薦包裝：{results.packaging.packaging_concepts?.[0]?.structure?.type}
                  </p>
                  <p className="text-gray-500 text-sm">
                    預估成本：{results.packaging.packaging_concepts?.[0]?.cost_estimate}
                  </p>
                  <Link 
                    href="/create/result/packaging" 
                    className="text-orange-500 text-sm hover:underline"
                  >
                    查看詳情 →
                  </Link>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/create" className="btn-primary flex-1 text-center">
                🔄 開始新產品
              </Link>
              <Link href="/" className="btn-secondary flex-1 text-center">
                🏠 回首頁
              </Link>
            </div>

            {/* Tips */}
            <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 mt-8">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">下一步建議</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 實際製作樣品，驗證配方</li>
                    <li>• 聯繫包裝廠商，詢價並打樣</li>
                    <li>• 註冊品牌名稱和 Logo 商標</li>
                    <li>• 建立社群媒體帳號開始宣傳</li>
                    <li>• 規劃首批生產和銷售渠道</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🎉</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    }>
      <SummaryContent />
    </Suspense>
  );
}
