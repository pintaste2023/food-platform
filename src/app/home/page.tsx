// All Products Page - /home
// Displays all products in a grid

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import CartButton from '@/components/CartButton';
import { mockData } from '@/data/mockData';

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const { addItem, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addingProduct, setAddingProduct] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockData.products[0] | null>(null);

  const categories = ['all', '低卡', '高蛋白', '無糖', '健身', '素食'];

  const filteredProducts = selectedCategory === 'all' 
    ? mockData.products 
    : mockData.products.filter(p => p.tags.includes(selectedCategory));

  const handleCreateClick = () => {
    if (!isLoggedIn) {
      window.location.href = '/login?redirect=/create';
    } else {
      window.location.href = '/create';
    }
  };

  const handleAddToCart = (product: typeof mockData.products[0]) => {
    setAddingProduct(product.id);
    addItem({
      id: product.id,
      name: product.name,
      price: product.earnings,
      image: product.image,
    });
    setTimeout(() => setAddingProduct(null), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
            品點子
          </Link>
          <div className="flex items-center gap-3">
            <CartButton />
            <button 
              onClick={handleCreateClick}
              className="btn-primary text-sm py-2 px-4"
            >
              開始創作
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              全部商品
            </h1>
            <p className="text-gray-500">
              探索 AI 協助的食品商品
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-orange-50'
                }`}
              >
                {cat === 'all' ? '全部' : cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                addingProduct={addingProduct}
                onOpenModal={setSelectedProduct}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500">沒有找到符合的商品</p>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium">
              ← 返回首頁
            </Link>
          </div>
        </div>
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          addingProduct={addingProduct}
        />
      )}
    </div>
  );
}

// Product Card Component with Hover Effect
function ProductCard({ 
  product, 
  onAddToCart, 
  addingProduct,
  onOpenModal
}: { 
  product: typeof mockData.products[0]; 
  onAddToCart: (p: typeof product) => void;
  addingProduct: number | null;
  onOpenModal: (p: typeof product) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200 ${
        isHovered ? 'shadow-xl scale-[1.02]' : 'hover:shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal(product)}
    >
      <div className="text-5xl mb-4 text-center">{product.image}</div>
      <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-gray-500">已售 {product.sales} 件</span>
        <span className="text-orange-500 font-bold">+NT${product.earnings}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {product.tags.map((tag, idx) => (
          <span key={idx} className="text-xs px-3 py-1 bg-orange-50 text-orange-600 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        disabled={addingProduct === product.id}
        className={`w-full btn-primary ${addingProduct === product.id ? 'opacity-50' : ''}`}
      >
        {addingProduct === product.id ? '已加入！' : '加入購物車'}
      </button>
    </div>
  );
}

// Product Modal Component
function ProductModal({ 
  product, 
  onClose,
  onAddToCart,
  addingProduct
}: { 
  product: typeof mockData.products[0]; 
  onClose: () => void;
  onAddToCart: (p: typeof product) => void;
  addingProduct: number | null;
}) {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 z-10"
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
            <button 
              onClick={handleAddToCart}
              disabled={addingProduct === product.id}
              className={`flex-1 btn-primary py-3 flex items-center justify-center gap-2 ${addingProduct === product.id ? 'opacity-50' : ''}`}
            >
              <span>🛒</span>
              <span>{addingProduct === product.id ? '已加入！' : '放入購物車'}</span>
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
