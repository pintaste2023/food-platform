// Admin Dashboard Page
'use client';

import { AdminProvider, useAdmin, DevelopmentStage, StageLabels } from '@/contexts/AdminContext';

const STAGES = [
  DevelopmentStage.STAGE_IDEA,
  DevelopmentStage.STAGE_RECIPE,
  DevelopmentStage.STAGE_MAKING,
  DevelopmentStage.STAGE_PUBLISH,
  DevelopmentStage.STAGE_EARN,
];

function AdminDashboard() {
  const { users, products, loading } = useAdmin();

  // Calculate statistics
  const totalUsers = users.length;
  const totalProducts = products.length;
  const productsByStage: Record<number, number> = {
    [DevelopmentStage.STAGE_IDEA]: 0,
    [DevelopmentStage.STAGE_RECIPE]: 0,
    [DevelopmentStage.STAGE_MAKING]: 0,
    [DevelopmentStage.STAGE_PUBLISH]: 0,
    [DevelopmentStage.STAGE_EARN]: 0,
  };
  products.forEach(p => {
    productsByStage[p.stage] = (productsByStage[p.stage] || 0) + 1;
  });

  const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);
  const activeProducts = products.filter(p => p.stage >= DevelopmentStage.STAGE_PUBLISH).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">管理者儀表板</h1>
          <div className="text-sm text-gray-500">品點子後台管理</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistics Overview */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 數據概覽</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600">{totalUsers}</div>
              <div className="text-gray-500 mt-1">總使用者數</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-green-600">{totalProducts}</div>
              <div className="text-gray-500 mt-1">總產品數</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-orange-600">{activeProducts}</div>
              <div className="text-gray-500 mt-1">已上架產品</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-purple-600">{totalSales.toLocaleString()}</div>
              <div className="text-gray-500 mt-1">總銷售額</div>
            </div>
          </div>
        </section>

        {/* Development Stages Overview */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🔄 產品開發階段分布</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap gap-4">
              {STAGES.map(stage => (
                <div key={stage} className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    stage === DevelopmentStage.STAGE_IDEA ? 'bg-gray-100 text-gray-700' :
                    stage === DevelopmentStage.STAGE_RECIPE ? 'bg-blue-100 text-blue-700' :
                    stage === DevelopmentStage.STAGE_MAKING ? 'bg-yellow-100 text-yellow-700' :
                    stage === DevelopmentStage.STAGE_PUBLISH ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {StageLabels[stage]}
                  </span>
                  <span className="text-xl font-bold text-gray-900">{productsByStage[stage] || 0}</span>
                </div>
              ))}
            </div>
            
            {/* Progress bar visualization */}
            <div className="mt-6">
              <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
                {STAGES.map(stage => {
                  const count = productsByStage[stage] || 0;
                  const percentage = totalProducts > 0 ? (count / totalProducts) * 100 : 0;
                  if (percentage === 0) return null;
                  return (
                    <div
                      key={stage}
                      className={`${
                        stage === DevelopmentStage.STAGE_IDEA ? 'bg-gray-400' :
                        stage === DevelopmentStage.STAGE_RECIPE ? 'bg-blue-400' :
                        stage === DevelopmentStage.STAGE_MAKING ? 'bg-yellow-400' :
                        stage === DevelopmentStage.STAGE_PUBLISH ? 'bg-green-400' :
                        'bg-purple-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Users List */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">👥 使用者列表</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">等級</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">註冊日期</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">產品數</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.level === 1 ? 'bg-gray-100 text-gray-700' :
                        user.level === 2 ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        Lv {user.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.productsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Products List */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📦 產品列表與開發階段</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">產品名稱</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">開發者</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">開發階段</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">標籤</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">銷售額</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">建立日期</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新日期</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.developerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          product.stage === DevelopmentStage.STAGE_IDEA ? 'bg-gray-400' :
                          product.stage === DevelopmentStage.STAGE_RECIPE ? 'bg-blue-400' :
                          product.stage === DevelopmentStage.STAGE_MAKING ? 'bg-yellow-400' :
                          product.stage === DevelopmentStage.STAGE_PUBLISH ? 'bg-green-400' :
                          'bg-purple-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          product.stage === DevelopmentStage.STAGE_IDEA ? 'text-gray-700' :
                          product.stage === DevelopmentStage.STAGE_RECIPE ? 'text-blue-700' :
                          product.stage === DevelopmentStage.STAGE_MAKING ? 'text-yellow-700' :
                          product.stage === DevelopmentStage.STAGE_PUBLISH ? 'text-green-700' :
                          'text-purple-700'
                        }`}>
                          {StageLabels[product.stage]}
                        </span>
                        {/* Stage progress indicator */}
                        <div className="flex gap-0.5 ml-2">
                          {STAGES.map(stage => (
                            <div
                              key={stage}
                              className={`w-2 h-2 rounded-full ${
                                stage <= product.stage ? (
                                  stage === DevelopmentStage.STAGE_IDEA ? 'bg-gray-400' :
                                  stage === DevelopmentStage.STAGE_RECIPE ? 'bg-blue-400' :
                                  stage === DevelopmentStage.STAGE_MAKING ? 'bg-yellow-400' :
                                  stage === DevelopmentStage.STAGE_PUBLISH ? 'bg-green-400' :
                                  'bg-purple-400'
                                ) : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.tags?.map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sales ? product.sales.toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminDashboard />
    </AdminProvider>
  );
}