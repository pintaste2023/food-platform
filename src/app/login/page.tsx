// Login Page
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isLoggedIn, logout } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const redirectTo = searchParams.get('redirect') || '/creator';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        window.location.href = redirectTo;
      } else {
        setError('登入失敗，請檢查帳號密碼');
      }
    } catch (err) {
      setError('登入時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* Header with Login Status */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            ← 返回
          </Link>
          <Link href="/" className="font-bold text-xl gradient-text hover:opacity-80 transition-opacity">
            品點子
          </Link>
          {/* Login Status */}
          <div className="flex items-center gap-2">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  登出
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm text-orange-500 font-medium">
                登入
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">歡迎回來</h1>
            <p className="text-gray-500">登入後開始創作你的食品</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                電子郵件
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                密碼
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-primary text-lg py-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? '登入中...' : '登入'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              還沒有帳號？
              <Link href="/register" className="text-orange-500 font-medium ml-1">
                註冊新帳號
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-sm text-center">
              💡 測試帳號：输入任意邮箱和密码即可登录
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <div className="w-8"></div>
            <div className="font-bold text-xl gradient-text">品點子</div>
            <div className="w-8"></div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">載入中...</p>
        </main>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}