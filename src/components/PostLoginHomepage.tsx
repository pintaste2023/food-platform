// Post-login Homepage Components
'use client';

import { mockData } from '@/data/mockData';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import StoryCarousel from '@/components/StoryCarousel';
import { useAuth } from '@/contexts/AuthContext';

export default function PostLoginHomepage() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentStage, setUserStage, advanceStage } = useAuth();
  const [shareVersion, setShareVersion] = useState<'pain' | 'result'>('pain');
  const [selectedProduct, setSelectedProduct] = useState<typeof mockData.products[0] | null>(null);
  // Route-based auto-update (listen to route changes)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = (pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/')).toLowerCase();
    const earningsThisMonth = (typeof (window as any).__mockEarningsThisMonth !== 'undefined')
      ? (window as any).__mockEarningsThisMonth
      : 0;
    let targetStage: number | null = null;
    if (typeof earningsThisMonth === 'number' && earningsThisMonth > 0) {
      targetStage = 5;
    } else if (path.startsWith('/create/result')) {
      targetStage = 3;
    } else if (path.startsWith('/create')) {
      targetStage = 2;
    } else if (path.startsWith('/home') || (typeof (window as any).__hasPublishedProducts !== 'undefined' && (window as any).__hasPublishedProducts)) {
      targetStage = 4;
    }
    if (targetStage != null && targetStage !== currentStage) {
      if (typeof setUserStage === 'function') {
        setUserStage(targetStage);
      } else if (typeof advanceStage === 'function') {
        const delta = targetStage - (currentStage ?? 0);
        for (let i = 0; i < delta; i++) advanceStage();
      }
    }
  }, [pathname, currentStage, setUserStage, advanceStage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* New Creator Start */}
        <NewCreatorStart />
        <StoryCarousel currentStage={currentStage} />

        {/* Live Ticker */}
        <LiveTickerSection data={mockData.liveTicker} />

        {/* Feed Section */}
        <FeedSection shareVersion={shareVersion} setShareVersion={setShareVersion} />

        {/* Earnings Section */}
        <EarningsSection />

        {/* Wish Pool - 敲碗許願池 */}
        <WishPoolSection demands={mockData.demandCards} />

        {/* Brand Footer */}
        <BrandFooter />
      </main>
    </div>
  );
}

// Header Component
function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
          品點子
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="flex items-center gap-2">
                {/* 個人 Logo 顯示 */}
                {user.personalLogo?.logoData?.color_guidelines?.primary ? (
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: user.personalLogo.logoData.color_guidelines.primary.hex }}
                    title={user.personalLogo.brandName}
                  >
                    {user.personalLogo.brandName?.charAt(0) || 'L'}
                  </div>
                ) : (
                  <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">🏷️</span>
                  </div>
                )}
                <span className="text-sm text-gray-600">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                登出
              </button>
            </>
          )}
          <Link href="/creator" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors">
            <span>👤</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

// New Creator Start Component - 升級版
function NewCreatorStart() {
  const router = useRouter();
  
  return (
    <section className="mb-4">
      <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4">
        <h2 className="text-sm font-bold text-gray-800 mb-1">
          🎉 你剛剛完成第一次賺錢！
        </h2>
        <p className="text-orange-500 font-bold text-lg mb-2">+NT$30</p>
        <p className="text-gray-600 text-xs mb-3">
          🔥 多數人停在這裡 👉 但真正賺錢的人會這樣做：
        </p>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-gray-400 text-xs">做自己的商品 → 每單賺 NT$100+</div>
          <div className="text-orange-500 text-xs font-medium">
            現在有 324 人在找商品
          </div>
        </div>
        <button 
          onClick={() => window.location.href = '/create'}
          className="btn-primary text-sm py-2 px-4"
        >
          做我的第一個商品
        </button>
      </div>
    </section>
  );
}

// Live Ticker Section - 升級版
function LiveTickerSection({ data }: { data: typeof mockData.liveTicker }) {
  const tickerItems = [
    ...data.trendingSearches.map(t => `「${t.keyword}」搜尋上升 ${t.growth}`),
    `這個方向正在被 ${data.activeDevelopers} 人開發`,
    `今天新增 ${data.newOrders} 筆訂單`,
    '這週最多人分享的商品',
  ];

  return (
    <section className="py-2 bg-white rounded-lg mb-3 shadow-sm overflow-hidden">
      <div className="flex items-center animate-[ticker_20s_linear_infinite]">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <span key={index} className="inline-flex items-center px-3 text-xs text-gray-600 whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

// Feed Section - 升級版
function FeedSection({ shareVersion, setShareVersion }: { shareVersion: 'pain' | 'result', setShareVersion: (v: 'pain' | 'result') => void }) {
  return (
    <section className="grid md:grid-cols-3 gap-4 mb-4">
      {/* Main Feed */}
      <div className="md:col-span-2 space-y-4">
        {/* 創作者成功案例卡 - 新增 */}
        <CreatorSuccessCard />
        
        {/* 敲碗許願池 - 新功能 */}
        <WishPoolSection demands={mockData.demandCards} />

        {/* 敲碗需求卡 */}
        <DemandCards />

        {/* 研發故事卡 */}
        <ResearchStoryCard />

        {/* 升級觸發卡 */}
        <UpgradeTriggerCard />

        {/* 商品卡 */}
        <ProductCards />
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Action */}
        <QuickActionCard shareVersion={shareVersion} setShareVersion={setShareVersion} />
        
        {/* 進行中的專案 - 草稿 */}
        <DraftProjectsCard />
      </div>
    </section>
  );
}

// 創作者成功案例卡 - 新增
function CreatorSuccessCard() {
  return (
    <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
      <div className="flex items-start gap-4">
        <div className="text-4xl">🎥</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2">第一個商品誕生</h3>
          <p className="text-gray-600 text-sm mb-2">「原本只是分享」「看到200人敲碗」</p>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-green-600 font-bold">💰 2週賺 NT$1080</span>
            <span className="text-gray-400 text-sm">（每單賺 NT$90）</span>
          </div>
          <button className="btn-primary text-sm py-2">
            我也想做一個 🔥
          </button>
        </div>
      </div>
    </div>
  );
}

// Demand Cards Component - 升級版（加入 AI 分析深化）
function DemandCards() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">🔥 市場缺口</h2>
      {mockData.demandCards.map((card) => (
        <div key={card.id} className="card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-2">
                {card.category}
              </span>
              <h3 className="text-lg font-bold text-gray-800">🧑 想要：{card.demand}</h3>
            </div>
            <div className="text-right">
              <span className="text-orange-500 font-bold text-xl">👍 {card.votes}</span>
              <p className="text-gray-400 text-xs">人敲碗</p>
            </div>
          </div>
          
          {/* AI Analysis for first card */}
          {card.aiAnalysis && (
            <div className="bg-orange-50 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <span className="font-semibold text-orange-600">AI 分析：這個缺口有兩個原因</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 mb-3">
                {card.aiAnalysis.reasons.map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">👉 你做出來，AI 建議</span>
                <span className="font-bold text-orange-600">{card.aiAnalysis.suggestion.price}</span>
                <span className="text-gray-500">、風味「{card.aiAnalysis.suggestion.flavor}」</span>
              </div>
            </div>
          )}

          {/* 展開更多 AI 建議 */}
          {expandedCard === card.id && card.aiAnalysis && (
            <div className="bg-purple-50 rounded-xl p-4 mb-3 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <span className="font-semibold text-purple-600">基於 {card.votes} 人需求，產出 3 種商品方向：</span>
              </div>
              <div className="space-y-2 mb-4">
                {card.aiAnalysis.directions?.map((dir, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-purple-600 font-bold">{i + 1}️⃣</span>
                    <span className="text-gray-700">{dir}</span>
                    {i === 0 && <span className="text-orange-500 text-xs">(推薦🔥)</span>}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <p className="font-medium mb-1">推薦理由：</p>
                <p>{card.aiAnalysis.reason}</p>
              </div>
              <button className="btn-primary text-sm py-2 w-full">
                直接用這個做商品
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>已有 {card.developers} 人正在開發</span>
              <span>🔥最近5天+{card.recentGrowth}人</span>
            </div>
            <div className="flex gap-2">
              {card.aiAnalysis && (
                <button 
                  onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                  className="btn-secondary text-sm py-2"
                >
                  {expandedCard === card.id ? '收起' : '看更多'}
                </button>
              )}
              <button className="btn-primary text-sm py-2">
                我要做這個商品
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Research Story Card
function ResearchStoryCard() {
  const story = mockData.研发Stories[0];
  return (
    <div className="card">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{story.image}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">🎥 {story.title}</h3>
          <p className="text-gray-600">{story.content}</p>
          <div className="mt-3 bg-purple-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🤖</span>
              <span className="font-semibold text-purple-600">AI 發現：</span>
            </div>
            <p className="text-sm text-gray-600">{story.aiInsight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Upgrade Trigger Card
function UpgradeTriggerCard() {
  return (
    <div className="card bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">🔥 324人正在找這個商品</h3>
          <p className="text-sm opacity-90">👉 不用懂製造 🤖 AI＋專人協助</p>
        </div>
        <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-bold">
          開始做我的商品
        </button>
      </div>
    </div>
  );
}

// Product Cards
function ProductCards() {
  const [selectedProduct, setSelectedProduct] = useState<typeof mockData.products[0] | null>(null);
  
  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">🛒 熱門商品</h2>
        {mockData.products.map((product) => (
          <div 
            key={product.id} 
            className="card flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="text-4xl">{product.image}</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{product.name}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="text-orange-500">🔥 已賣 {product.sales}單</span>
                <span className="text-green-600">💰 你可賺 NT${product.earnings}</span>
                <span>已有 {product.sharers} 人正在分享</span>
              </div>
              <div className="flex gap-2 mt-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn-primary text-sm py-2">一鍵分享</button>
              <button className="btn-secondary text-sm py-2">購買</button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}

// Product Modal Component
function ProductModal({ product, onClose }: { product: typeof mockData.products[0]; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
        >
          ✕
        </button>

        {/* Product Image */}
        <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-8 text-center">
          <div className="text-6xl mb-4">{product.image}</div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Brand Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl">
              {product.brandLogo}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{product.brandName}</h3>
              <p className="text-gray-500 text-sm">{product.name}</p>
            </div>
          </div>

          {/* Brand Story */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">📖 品牌故事</h4>
            <p className="text-gray-600 text-sm">{product.brandStory}</p>
          </div>

          {/* Price and Tags */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">價格</p>
              <p className="text-2xl font-bold text-orange-500">NT${product.price}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
              <span>🛒</span>
              <span>放入購物車</span>
            </button>
            <button className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2">
              <span>📤</span>
              <span>一鍵分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Action Card - 升級版（雙版本分享）
function QuickActionCard({ shareVersion, setShareVersion }: { shareVersion: 'pain' | 'result', setShareVersion: (v: 'pain' | 'result') => void }) {
  return (
    <div className="card">
      <h3 className="font-bold text-gray-800 mb-4">💡 最快賺錢方式</h3>
      <div className="bg-orange-50 rounded-xl p-4 text-center mb-4">
        <p className="text-orange-600 font-bold text-lg">🔥 新手最容易成交</p>
        <p className="text-gray-600">💰 單次賺 NT$30</p>
      </div>
      <button className="btn-primary w-full">一鍵分享</button>
      
      {/* Share Preview - 雙版本切換 */}
      <div className="mt-6 p-4 bg-gray-100 rounded-xl">
        <p className="text-sm text-gray-500 mb-3">IG 限動預覽</p>
        
        {/* 版本切換 */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setShareVersion('pain')}
            className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
              shareVersion === 'pain' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            痛點鉤子版
          </button>
          <button
            onClick={() => setShareVersion('result')}
            className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
              shareVersion === 'result' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            成果版
          </button>
        </div>

        {/* 預覽內容 */}
        {shareVersion === 'pain' ? (
          <div className="bg-black text-white p-3 rounded-lg">
            <p className="text-sm">⚡ 那個「找不到好吃的低卡咖哩」的問題</p>
            <p className="text-sm mt-1">我用 AI 做出了自己的答案</p>
            <p className="text-sm mt-1 text-orange-400">[我的商品：FitMeal 低卡咖哩]</p>
          </div>
        ) : (
          <div className="bg-black text-white p-3 rounded-lg">
            <p className="text-sm">我最近在試這個低卡咖哩</p>
            <p className="text-sm mt-1">本來只是想試一個點子</p>
            <p className="text-sm mt-1">結果真的被做出來了</p>
            <p className="text-sm mt-1 text-orange-400">[我的商品：FitMeal 低卡咖哩]</p>
          </div>
        )}
        
        <button className="btn-primary w-full mt-3">直接分享</button>
      </div>
    </div>
  );
}

// Earnings Section
function EarningsSection() {
  const { earnings } = mockData;
  return (
    <section className="card mb-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-800 text-sm">💰 收益摘要</h3>
        <span className="text-gray-400 text-xs">本月</span>
      </div>
      <div className="text-2xl font-bold gradient-text mb-1">NT$ {earnings.thisMonth}</div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <span>再賺 NT${earnings.nextLevel} → 升級 {earnings.nextLevelName}</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
        <div 
          className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full" 
          style={{ width: '60%' }}
        ></div>
      </div>
      
      <button className="text-orange-500 font-semibold text-xs">
        或 👉 做一個商品 → 直接升級 Lv2
      </button>
    </section>
  );
}

// Wish Pool Section - 敲碗許願池
function WishPoolSection({ demands }: { demands: typeof mockData.demandCards }) {
  const router = useRouter();
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [selectedWish, setSelectedWish] = useState<number | null>(null);

  const wishes = demands.map(d => ({
    id: d.id,
    demand: d.demand,
    votes: d.votes,
    developers: d.developers,
    recentGrowth: d.recentGrowth,
    directions: d.aiAnalysis?.directions || [],
    recommended: d.aiAnalysis?.recommended || d.demand,
    reason: d.aiAnalysis?.reason || '',
  }));

  const handleAnalyze = (wishId: number) => {
    setAnalyzingId(wishId);
    // 模擬 AI 分析
    setTimeout(() => {
      setAnalyzingId(null);
      setSelectedWish(wishId);
    }, 1500);
  };

  const handleCreateProduct = (wish: typeof wishes[0]) => {
    // 導向建立商品頁面
    router.push(`/create?ingredient=${encodeURIComponent(wish.recommended.split('咖哩')[0] || wish.demand)}`);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-bold text-gray-800">🎯 敲碗許願池</h2>
      
      {wishes.map((wish) => (
        <div key={wish.id} className="card border border-orange-200 py-2 px-3">
          {/* 許願內容 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <span className="inline-block px-1.5 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full mb-1">
                🔥 熱門
              </span>
              <h3 className="text-sm font-bold text-gray-800">🧑 想要：{wish.demand}</h3>
            </div>
            <div className="text-right">
              <span className="text-orange-500 font-bold text-sm">👍 {wish.votes}</span>
            </div>
          </div>

          {/* 競爭感資訊 */}
          <div className="flex items-center gap-3 mb-2 text-xs">
            <span className="text-red-500 font-medium">👨‍🍳 {wish.developers}人開發</span>
            <span className="text-orange-500">🔥 +{wish.recentGrowth}人</span>
          </div>

          {/* 警告訊息 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-2">
            <p className="text-yellow-700 text-xs">
              ⏳ 越晚做越可能被搶先
            </p>
          </div>

          {/* AI 分析結果 - 展開後顯示 */}
          {selectedWish === wish.id && (
            <div className="bg-purple-50 rounded-lg p-3 mb-2 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">🤖</span>
                <span className="font-semibold text-purple-600 text-xs">AI 已幫你完成初步規劃</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">基於 {wish.votes} 人需求，產出 3 種商品方向：</p>
              
              <div className="space-y-1 mb-2">
                {wish.directions.map((dir, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs">
                    <span className="text-purple-600 font-bold">{i + 1}️⃣</span>
                    <span className="text-gray-700">{dir}</span>
                    {dir === wish.recommended && <span className="text-orange-500 text-xs">(推薦🔥)</span>}
                  </div>
                ))}
              </div>

              {/* 推薦商品 */}
              <div className="bg-white rounded-lg p-2 mb-2 border border-purple-200">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-bold text-purple-600 text-xs">{wish.recommended}</span>
                  <span className="text-orange-500 text-xs">(推薦🔥)</span>
                </div>
                <p className="text-xs text-gray-500">理由：{wish.reason}</p>
              </div>

              <button 
                onClick={() => handleCreateProduct(wish)}
                className="btn-primary w-full text-xs py-2"
              >
                直接用這個做商品
              </button>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="flex gap-2">
            {analyzingId === wish.id ? (
              <button disabled className="btn-primary text-xs py-1.5 opacity-50">
                🤔 AI 分析中...
              </button>
            ) : selectedWish === wish.id ? (
              <button 
                onClick={() => setSelectedWish(null)}
                className="btn-secondary text-xs py-1.5"
              >
                收起
              </button>
            ) : (
              <>
                <button 
                  onClick={() => handleAnalyze(wish.id)}
                  className="btn-secondary text-xs py-1.5"
                >
                  🤖 AI 分析
                </button>
                <button className="btn-primary text-xs py-1.5">
                  我要做 🔥
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Brand Footer - 更新品牌名稱
function BrandFooter() {
  return (
    <footer className="py-8 text-center">
      <p className="text-gray-400">
        薑博士 | 快加一 | Lonera
      </p>
    </footer>
  );
}

// 進行中的專案卡片 - 草稿列表
function DraftProjectsCard() {
  const { getDraftProjects, deleteDraftProject, isLoggedIn } = useAuth();
  const router = useRouter();
  
  const drafts = getDraftProjects();
  
  if (!isLoggedIn || drafts.length === 0) {
    return null;
  }
  
  return (
    <div className="card">
      <h3 className="font-bold text-gray-800 text-sm mb-3">📝 進行中</h3>
      <div className="space-y-2">
        {drafts.map((draft) => (
          <div 
            key={draft.id}
            className="bg-orange-50 rounded-lg p-3 flex items-center justify-between"
          >
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => {
                // TODO: 未來可以恢復草稿
              }}
            >
              <h4 className="font-medium text-gray-800 text-sm">{draft.name}</h4>
              <p className="text-xs text-gray-500">
                儲存於 {new Date(draft.updatedAt).toLocaleDateString('zh-TW')}
              </p>
            </div>
            <button
              onClick={() => deleteDraftProject(draft.id)}
              className="text-gray-400 hover:text-red-500 p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
