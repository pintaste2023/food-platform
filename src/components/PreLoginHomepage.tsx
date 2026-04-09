// Pre-login Homepage Components
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { mockData } from '@/data/mockData';
import CartButton from '@/components/CartButton';

// 常用食材建议
const INGREDIENT_SUGGESTIONS = [
  '雞胸肉', '燕麥', '地瓜', '香蕉', '雞蛋', '豆腐', '堅果', '優格', '蜂蜜', '抹茶'
];

export default function PreLoginHomepage() {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [ingredient, setIngredient] = useState('');

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // 主 CTA 按钮：直接跳到 /create (使用 window.location 以支援 ngrok)
  const handleMainCta = () => {
    if (!isLoggedIn) {
      window.location.href = '/login?redirect=/create';
    } else {
      window.location.href = '/create';
    }
  };

  // 选择食材建议 → 填入输入框
  const handleIngredientClick = (ing: string) => {
    setIngredient(ing);
  };

  // 产生按钮 (使用 window.location 以支援 ngrok)
  const handleGenerate = () => {
    if (!isLoggedIn) {
      window.location.href = '/login?redirect=/create';
      return;
    }
    if (ingredient) {
      window.location.href = `/create?ingredient=${encodeURIComponent(ingredient)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header with Login Status */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
            品點子
          </Link>
          <div className="flex items-center gap-4">
            <CartButton />
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <Link href="/creator" className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1 -ml-2 transition-colors">
                  <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    {user.name.charAt(0)}
                  </span>
                  <span className="text-sm text-gray-600">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  登出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800">
                  登入
                </Link>
                <Link href="/login?redirect=/create" className="btn-primary text-sm py-2 px-4">
                  開始創作
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection 
        onMainCta={handleMainCta} 
        ingredient={ingredient}
        setIngredient={setIngredient}
        onIngredientClick={handleIngredientClick}
        onGenerate={handleGenerate}
      />

      {/* Story Carousel - Timeline Style */}
      <StoryCarousel stories={mockData.stories} />

      {/* Live Ticker */}
      <LiveTicker data={mockData.liveTicker} />

      {/* Product Carousel */}
      <ProductCarousel products={mockData.products} />

      {/* Wish Pool - 敲碗許願池 */}
      <WishPool demands={mockData.demandCards} />

      {/* Social Proof */}
      <SocialProof cases={mockData.socialProof} />

      {/* Trust Section */}
      <TrustSection />

      {/* Final CTA */}
      <FinalCTA />

      {/* Brand Footer */}
      <BrandFooter />
    </div>
  );
}

// Hero Section Component
function HeroSection({ 
  onMainCta, 
  ingredient,
  setIngredient,
  onIngredientClick,
  onGenerate
}: {
  onMainCta: () => void;
  ingredient: string;
  setIngredient: (v: string) => void;
  onIngredientClick: (ing: string) => void;
  onGenerate: () => void;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Video placeholder - Reels style */}
        <div className="mb-12 relative">
          <div className="w-full max-w-md mx-auto aspect-[9/16] md:aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl">▶</span>
                </div>
                <p className="text-white/70 text-sm">（點擊播放）</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-12 animate-fade-in-up stagger-1">
          <button
            onClick={onMainCta}
            className="btn-primary text-lg px-8 py-4"
          >
            🎮 我也玩一個點子
          </button>
        </div>

        {/* Interactive Input Section - 只保留食材输入 */}
        <div id="idea-input" className="animate-fade-in-up stagger-2">
          <p className="text-gray-500 mb-4">👇 你有什麼食材？</p>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xl mx-auto">
            {/* 食材输入 */}
            <div className="mb-4">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                placeholder="例如：雞胸肉、燕麥、地瓜..."
                className="w-full text-lg px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
              />
              {/* 食材建议 */}
              <div className="flex flex-wrap gap-2 mt-3 justify-start">
                {INGREDIENT_SUGGESTIONS.map((ing) => (
                  <button
                    key={ing}
                    onClick={() => onIngredientClick(ing)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      ingredient === ing 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={onGenerate}
              disabled={!ingredient}
              className={`w-full btn-primary text-lg py-3 ${!ingredient ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ✨ 讓 AI 幫我想想做什麼產品
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-8 animate-bounce">
          <span className="text-gray-400">↓ 往下滑</span>
        </div>
      </div>
    </section>
  );
}

// Story Carousel Component - Timeline Style with Icons
const storyIcons = ['💭', '🤖', '🏭', '📱', '💰'];

function StoryCarousel({ stories }: { stories: typeof mockData.stories }) {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-800">
          5 個階段，看看它怎麼發生
        </h2>
        <p className="text-center text-gray-500 mb-12">
          從點子到賺錢，AI 幫你一步一步完成
        </p>
        
        {/* Timeline Container - Desktop */}
        <div className="hidden md:block relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 via-purple-400 via-blue-400 via-green-400 to-yellow-400 transform -translate-x-1/2"></div>
          
          {/* Story Cards - Desktop */}
          <div className="space-y-12">
            {stories.map((story, index) => (
              <div
                key={story.id}
                className={`relative flex items-center justify-between ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                  <div 
                    className="story-timeline-card group"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4 ${
                      story.bgGradient
                    } text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {storyIcons[index]}
                    </div>
                    <div className="text-xs font-semibold text-orange-500 mb-1">Step {index + 1}</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{story.subtitle}</p>
                    <div className="inline-flex items-center text-sm font-medium text-orange-600">
                      <span>{story.action}</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="flex absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-xl ${
                    story.bgGradient
                  } text-white animate-float hover:scale-110 transition-transform duration-300`}>
                    {storyIcons[index]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Cards - Mobile */}
        <div className="md:hidden relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 via-purple-400 via-blue-400 via-green-400 to-yellow-400"></div>
          
          <div className="space-y-6">
            {stories.map((story, index) => (
              <div key={story.id} className="flex items-start ml-4">
                <div className="story-timeline-card-mobile w-full">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                      story.bgGradient
                    } text-white shadow-md`}>
                      {storyIcons[index]}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-orange-500 mb-1">Step {index + 1}</div>
                      <h3 className="text-base font-bold text-gray-800 mb-1">{story.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{story.subtitle}</p>
                      <div className="text-sm font-medium text-orange-600">{story.action}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-500 mt-12 bg-white/60 backdrop-blur-sm rounded-2xl py-4 px-6 inline-block mx-auto">
          ✅ 登入後，你只需要<strong>試著玩</strong>就好，其他的都幫你準備好了
        </p>
      </div>
    </section>
  );
}

// Live Ticker Component
function LiveTicker({ data }: { data: typeof mockData.liveTicker }) {
  const tickerItems = [
    `「${data.trendingSearches[0].keyword}」搜尋上升 ${data.trendingSearches[0].growth}`,
    `「${data.trendingSearches[1].keyword}」搜尋上升 ${data.trendingSearches[1].growth}`,
    `今天有 ${data.activeDevelopers} 人正在開發新產品`,
  ];

  return (
    <section className="py-4 bg-gray-50 border-y border-gray-100">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={index} className="inline-flex items-center px-6 text-sm text-gray-600">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// Product Carousel Component
function ProductCarousel({ products }: { products: typeof mockData.products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockData.products[0] | null>(null);
  const router = useRouter();
  
  // Show exactly 3 products (loop if needed)
  const getVisibleProducts = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % products.length;
      result.push(products[index]);
    }
    return result;
  };
  
  const visibleProducts = getVisibleProducts();
  
  const goLeft = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
  };
  
  const goRight = () => {
    setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
  };

  const handleViewAll = () => {
    router.push('/home');
  };

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            熱門商品
          </h2>
          <button 
            onClick={handleViewAll}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
          >
            看更多
            <span>→</span>
          </button>
        </div>

        <div className="relative">
          {/* Left Button */}
          <button
            onClick={goLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-600 text-2xl">‹</span>
          </button>

          {/* Product Cards - Exactly 3 */}
          <div className="grid grid-cols-3 gap-4 px-8">
            {visibleProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="text-4xl mb-3 text-center">{product.image}</div>
                <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">已售 {product.sales} 件</span>
                  <span className="text-orange-500 font-medium">+NT${product.earnings}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={goRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
          <span className="text-gray-600 text-2xl">›</span>
          </button>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </section>
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

// Wish Pool Component - 敲碗許願池
function WishPool({ demands }: { demands: typeof mockData.demandCards }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleVote = () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/create');
    } else {
      router.push('/create');
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🥣</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            敲碗許願池
          </h2>
          <p className="text-gray-500">
            大家最想要的產品，等你來實現！
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {demands.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={handleVote}
            >
              {/* Category Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                  {item.category}
                </span>
                <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                  ↑ {item.recentGrowth}%
                </span>
              </div>

              {/* Demand */}
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {item.demand}
              </h3>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <span>👍</span> {item.votes} 人敲碗
                </span>
                <span className="flex items-center gap-1">
                  <span>👨‍🍳</span> {item.developers} 人開發中
                </span>
              </div>

              {/* AI Analysis (if available) */}
              {item.aiAnalysis && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-purple-700 mb-2">🤖 AI 分析建議</p>
                  <p className="text-sm text-gray-600">
                    {item.aiAnalysis.recommended}
                  </p>
                  {item.aiAnalysis.suggestion && (
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                        💰 {item.aiAnalysis.suggestion.price}
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                        🍯 {item.aiAnalysis.suggestion.flavor}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <button className="w-full mt-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors">
                我來做！ →
              </button>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <button 
            onClick={handleVote}
            className="text-orange-600 font-medium hover:underline"
          >
            查看更多許願 →
          </button>
        </div>
      </div>
    </section>
  );
}

// Social Proof Component
function SocialProof({ cases }: { cases: typeof mockData.socialProof }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleTryIt = () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/create');
    } else {
      router.push('/create');
    }
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          大家都是這樣開始的
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((item) => (
            <div key={item.id} className="card text-center">
              <div className="text-4xl mb-4">🎥</div>
              <p className="text-gray-800 font-medium mb-2">「{item.quote}」</p>
              <p className="text-orange-500 font-bold">{item.earnings}</p>
            </div>
          ))}
        </div>

          <div className="text-center mt-8">
          <button type="button" onClick={handleTryIt} className="btn-secondary">
            👉 我也試試
          </button>
          <p className="text-gray-400 text-sm mt-4">
            不用上架商品，不用處理訂單 👉 不適合就關掉就好
          </p>
        </div>
      </div>
    </section>
  );
}

// Trust Section Component
function TrustSection() {
  const trusts = [
    '✔ 食品安全規範處理',
    '✔ 合作工廠製作',
    '✔ 自動分潤結算',
  ];

  return (
    <section className="py-8 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-sm">
          {trusts.map((trust, index) => (
            <span key={index}>{trust}</span>
          ))}
        </div>
        <p className="text-gray-400 text-xs mt-4">你不需要自己處理這些</p>
      </div>
    </section>
  );
}

// Final CTA Component
function FinalCTA() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleEarnFirst = () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/create');
    } else {
      router.push('/create');
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-500">
      <div className="max-w-2xl mx-auto text-center text-white">
        <h2 className="text-3xl font-bold mb-4">如果現在開始</h2>
        <p className="text-xl mb-6">你可能會做出第一個商品</p>
        <p className="mb-8 opacity-90">試試看一個食材會變成什麼樣子</p>
        <button 
          type="button"
          onClick={handleEarnFirst}
          className="bg-white text-orange-500 px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
        >
          🔥 試著玩看看
        </button>
      </div>
    </section>
  );
}

// Brand Footer Component
function BrandFooter() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleCreatorClick = () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/create');
    } else {
      router.push('/create');
    }
  };

  return (
    <footer className="py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-gray-400">
          薑博士 | 快加一 | Lonera
        </p>
        <div className="mt-6">
          <button type="button" onClick={handleCreatorClick} className="text-orange-500 font-semibold hover:underline">
            👨‍🍳 創作者 Lv1：「做出你的第一個會賣的產品」
          </button>
        </div>
      </div>
    </footer>
  );
}