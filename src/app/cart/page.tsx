// Cart Page - /cart
// Shopping cart to view and manage items

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      // 導向登入頁面，登入後回購物車
      router.push('/login?redirect=/cart');
      return;
    }
    alert('感謝您的訂單！這是示範頁面，實際結帳功能尚未開放。');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl gradient-text">
              品點子
            </Link>
            <Link href="/home" className="text-orange-500 hover:text-orange-600 font-medium">
              逛商品
            </Link>
          </div>
        </header>

        <main className="pt-24 px-4 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">購物車是空的</h1>
          <p className="text-gray-500 mb-8">快去逛逛有什麼好商品吧！</p>
          <Link href="/home" className="btn-primary">
            去購物 →
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl gradient-text">
            品點子
          </Link>
          <Link href="/home" className="text-orange-500 hover:text-orange-600 font-medium">
            繼續購物
          </Link>
        </div>
      </header>

      <main className="pt-20 px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">購物車</h1>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
                <div className="text-4xl">{item.image}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-orange-500 font-medium">NT${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  刪除
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between text-lg mb-2">
              <span>商品數量：</span>
              <span>{totalItems} 件</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>總計：</span>
              <span className="text-orange-500">NT${totalPrice}</span>
            </div>
            <button onClick={handleCheckout} className="w-full btn-primary py-3">
              {isLoggedIn ? '前往結帳' : '登入後結帳'}
            </button>
            <button onClick={clearCart} className="w-full mt-2 text-gray-500 text-sm hover:text-gray-600">
              清空購物車
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
