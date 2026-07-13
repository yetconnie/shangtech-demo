'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  technicalParams: Record<string, string>;
  applicationScenarios: string[];
  status: 'draft' | 'published' | 'offline';
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: '',
    technicalParams: '',
    applicationScenarios: '',
    status: 'draft' as 'draft' | 'published' | 'offline',
  });

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
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('产品不存在');
        } else {
          setError('加载产品信息失败');
        }
        return;
      }

      const data = await response.json();
      const product: Product = data.data;

      setFormData({
        name: product.name || '',
        description: product.description || '',
        features: Array.isArray(product.features) ? product.features.join('\n') : '',
        technicalParams: product.technicalParams 
          ? JSON.stringify(product.technicalParams, null, 2) 
          : '',
        applicationScenarios: Array.isArray(product.applicationScenarios) 
          ? product.applicationScenarios.join('\n') 
          : '',
        status: product.status || 'draft',
      });
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('加载产品信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');

      const features = formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      let technicalParams = {};
      if (formData.technicalParams.trim()) {
        try {
          technicalParams = JSON.parse(formData.technicalParams);
        } catch {
          setError('技术参数格式错误，请输入有效的JSON格式');
          setSubmitting(false);
          return;
        }
      }

      const applicationScenarios = formData.applicationScenarios
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          features,
          technicalParams,
          applicationScenarios,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || '更新失败');
        return;
      }

      alert('产品更新成功');
      router.push(`/products/${productId}`);
    } catch (err) {
      console.error('Failed to update product:', err);
      setError('更新失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/login');
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
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
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
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-500 mb-4">{error}</div>
          <Link href="/products" className="text-[#0047AB] hover:underline">
            返回产品列表
          </Link>
        </div>
      </div>
    );
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
        <div className="mb-6 flex items-center gap-2">
          <Link href="/products" className="text-[#0047AB] hover:underline">
            产品管理
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">编辑产品</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">编辑产品</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                placeholder="请输入产品名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                placeholder="请输入产品描述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品特点
              </label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent font-mono"
                placeholder="每行输入一个特点，例如：&#10;高性能处理能力&#10;低功耗设计&#10;易于集成"
              />
              <p className="mt-1 text-sm text-gray-500">每行输入一个特点</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                技术参数
              </label>
              <textarea
                value={formData.technicalParams}
                onChange={(e) => setFormData({ ...formData, technicalParams: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent font-mono text-sm"
                placeholder={'{\n  "处理器": "ARM Cortex-A72",\n  "内存": "8GB DDR4",\n  "存储": "256GB SSD"\n}'}
              />
              <p className="mt-1 text-sm text-gray-500">请输入JSON格式的技术参数</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                应用场景
              </label>
              <textarea
                value={formData.applicationScenarios}
                onChange={(e) => setFormData({ ...formData, applicationScenarios: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent font-mono"
                placeholder="每行输入一个应用场景，例如：&#10;工业自动化&#10;智能家居&#10;智慧城市"
              />
              <p className="mt-1 text-sm text-gray-500">每行输入一个应用场景</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'offline' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="offline">已下线</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '保存中...' : '保存'}
              </button>
              <Link
                href="/products"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                取消
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}