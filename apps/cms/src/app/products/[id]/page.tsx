'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE = 'http://localhost:4000';
const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return API_BASE + path;
};

interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  technicalParams: Record<string, string>;
  applicationScenarios: string[];
  images: string[];
  documents: string[];
  status: 'draft' | 'published' | 'offline';
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_info');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userStr));
    fetchProduct();
  }, [router, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');

      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('产品不存在');
        }
        throw new Error('获取产品详情失败');
      }

      const data = await response.json();
      setProduct(data.data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError(err instanceof Error ? err.message : '获取产品详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    if (!confirm(`确定要删除产品"${product.name}"吗？此操作不可撤销。`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('删除成功');
        router.push('/products');
      } else {
        const data = await response.json();
        alert(data.message || '删除失败');
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('删除失败');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: 'bg-gray-100 text-gray-700',
      published: 'bg-green-100 text-green-700',
      offline: 'bg-red-100 text-red-700',
    };

    const statusTexts = {
      draft: '草稿',
      published: '已发布',
      offline: '已下线',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {statusTexts[status as keyof typeof statusTexts]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-[#0047AB] text-white py-4 px-6 shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">上科官网管理后台</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">{user.username} ({user.role})</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-white text-[#0047AB] rounded-md hover:bg-gray-100 transition-colors text-sm"
              >
                登出
              </button>
            </div>
          </div>
        </header>

        <nav className="bg-white shadow-sm py-3 px-6">
          <ul className="flex gap-6">
            <li>
              <Link href="/dashboard" className="text-gray-600 hover:text-[#0047AB]">
                仪表板
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-[#0047AB] font-medium">
                产品管理
              </Link>
            </li>
            <li>
              <Link href="/cases" className="text-gray-600 hover:text-[#0047AB]">
                案例管理
              </Link>
            </li>
          </ul>
        </nav>

        <main className="p-6">
          <div className="text-center py-12 text-gray-500">加载中...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-[#0047AB] text-white py-4 px-6 shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">上科官网管理后台</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">{user.username} ({user.role})</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-white text-[#0047AB] rounded-md hover:bg-gray-100 transition-colors text-sm"
              >
                登出
              </button>
            </div>
          </div>
        </header>

        <nav className="bg-white shadow-sm py-3 px-6">
          <ul className="flex gap-6">
            <li>
              <Link href="/dashboard" className="text-gray-600 hover:text-[#0047AB]">
                仪表板
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-[#0047AB] font-medium">
                产品管理
              </Link>
            </li>
            <li>
              <Link href="/cases" className="text-gray-600 hover:text-[#0047AB]">
                案例管理
              </Link>
            </li>
          </ul>
        </nav>

        <main className="p-6">
          <div className="mb-6">
            <Link href="/products" className="text-[#0047AB] hover:text-[#003D8F] text-sm">
              ← 返回产品列表
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Link
                href="/products"
                className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors"
              >
                返回产品列表
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#0047AB] text-white py-4 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">上科官网管理后台</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.username} ({user.role})</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-white text-[#0047AB] rounded-md hover:bg-gray-100 transition-colors text-sm"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm py-3 px-6">
        <ul className="flex gap-6">
          <li>
            <Link href="/dashboard" className="text-gray-600 hover:text-[#0047AB]">
              仪表板
            </Link>
          </li>
          <li>
            <Link href="/products" className="text-[#0047AB] font-medium">
              产品管理
            </Link>
          </li>
          <li>
            <Link href="/cases" className="text-gray-600 hover:text-[#0047AB]">
              案例管理
            </Link>
          </li>
        </ul>
      </nav>

      <main className="p-6">
        <div className="mb-6">
          <Link href="/products" className="text-[#0047AB] hover:text-[#003D8F] text-sm">
            ← 返回产品列表
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">产品详情</h2>
          <div className="flex gap-3">
            <Link
              href={`/products/${productId}/edit`}
              className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors"
            >
              编辑
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              删除
            </button>
            <Link
              href="/products"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              返回
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">基本信息</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">产品名称</label>
                <p className="text-gray-900 text-lg font-medium">{product.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">状态</label>
                <div>{getStatusBadge(product.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">产品描述</label>
                <p className="text-gray-900 whitespace-pre-wrap">{product.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">创建时间</label>
                  <p className="text-gray-900">{formatDate(product.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">更新时间</label>
                  <p className="text-gray-900">{formatDate(product.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 技术参数 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">技术参数</h3>
            {product.technicalParams && Object.keys(product.technicalParams).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(product.technicalParams).map(([key, value]) => (
                  <div key={key} className="flex border-b border-gray-100 pb-3 last:border-0">
                    <span className="text-sm font-medium text-gray-600 w-1/3">{key}</span>
                    <span className="text-gray-900 flex-1">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无技术参数</p>
            )}
          </div>

          {/* 产品特点 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">产品特点</h3>
            {product.features && product.features.length > 0 ? (
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#0047AB] mr-2">•</span>
                    <span className="text-gray-900">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无产品特点</p>
            )}
          </div>

          {/* 应用场景 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">应用场景</h3>
            {product.applicationScenarios && product.applicationScenarios.length > 0 ? (
              <ul className="space-y-2">
                {product.applicationScenarios.map((scenario, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#0047AB] mr-2">•</span>
                    <span className="text-gray-900">{scenario}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无应用场景</p>
            )}
          </div>

          {/* 产品图片 */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">产品图片</h3>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} - 图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无产品图片</p>
            )}
          </div>

          {/* 相关文档 */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">相关文档</h3>
            {product.documents && product.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.documents.map((doc, index) => {
                  const fileName = doc.split('/').pop() || doc;
                  return (
                    <a
                      key={index}
                      href={`http://localhost:4000${doc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md hover:border-[#0047AB] hover:bg-blue-50 transition-colors group"
                    >
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-[#0047AB] group-hover:underline truncate">{fileName}</span>
                      <svg className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无相关文档</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}