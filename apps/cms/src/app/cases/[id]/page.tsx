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

interface Case {
  id: string;
  clientName: string;
  clientLogoUrl: string;
  projectName: string;
  projectSummary: string;
  clientBackground: string;
  challenges: string;
  solution: string;
  implementation: string;
  results: Array<{ metric: string; value: string; description: string }>;
  clientTestimonial: string;
  images: string[];
  videos: string[];
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

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [caseItem, setCaseItem] = useState<Case | null>(null);
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
    fetchCase();
  }, [router, caseId]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');

      const response = await fetch(`http://localhost:4000/api/cases/${caseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('案例不存在');
        }
        throw new Error('获取案例详情失败');
      }

      const data = await response.json();
      setCaseItem(data.data);
    } catch (err) {
      console.error('Failed to fetch case:', err);
      setError(err instanceof Error ? err.message : '获取案例详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!caseItem) return;

    if (!confirm(`确定要删除案例"${caseItem.projectName}"吗？此操作不可撤销。`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`http://localhost:4000/api/cases/${caseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('删除成功');
        router.push('/cases');
      } else {
        const data = await response.json();
        alert(data.message || '删除失败');
      }
    } catch (err) {
      console.error('Failed to delete case:', err);
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
              <Link href="/products" className="text-gray-600 hover:text-[#0047AB]">
                产品管理
              </Link>
            </li>
            <li>
              <Link href="/cases" className="text-[#0047AB] font-medium">
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
              <Link href="/products" className="text-gray-600 hover:text-[#0047AB]">
                产品管理
              </Link>
            </li>
            <li>
              <Link href="/cases" className="text-[#0047AB] font-medium">
                案例管理
              </Link>
            </li>
          </ul>
        </nav>

        <main className="p-6">
          <div className="mb-6">
            <Link href="/cases" className="text-[#0047AB] hover:text-[#003D8F] text-sm">
              ← 返回案例列表
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Link
                href="/cases"
                className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors"
              >
                返回案例列表
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!caseItem) {
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
            <Link href="/products" className="text-gray-600 hover:text-[#0047AB]">
              产品管理
            </Link>
          </li>
          <li>
            <Link href="/cases" className="text-[#0047AB] font-medium">
              案例管理
            </Link>
          </li>
        </ul>
      </nav>

      <main className="p-6">
        <div className="mb-6">
          <Link href="/cases" className="text-[#0047AB] hover:text-[#003D8F] text-sm">
            ← 返回案例列表
          </Link>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">案例详情</h2>
          <div className="flex gap-3">
            <Link
              href={`/cases/${caseId}/edit`}
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
              href="/cases"
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
                <label className="block text-sm font-medium text-gray-600 mb-1">客户名称</label>
                <p className="text-gray-900 text-lg font-medium">{caseItem.clientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">项目名称</label>
                <p className="text-gray-900 text-lg font-medium">{caseItem.projectName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">状态</label>
                <div>{getStatusBadge(caseItem.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">项目概述</label>
                <p className="text-gray-900 whitespace-pre-wrap">{caseItem.projectSummary}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">客户Logo</label>
                {caseItem.clientLogoUrl ? (
                  <img 
                    src={getImageUrl(caseItem.clientLogoUrl)}
                    alt="客户Logo" 
                    className="max-w-xs h-auto rounded-md"
                  />
                ) : (
                  <p className="text-gray-500 text-sm">暂无Logo</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">创建时间</label>
                  <p className="text-gray-900">{formatDate(caseItem.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">更新时间</label>
                  <p className="text-gray-900">{formatDate(caseItem.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 项目成果 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">项目成果</h3>
            {caseItem.results && caseItem.results.length > 0 ? (
              <div className="space-y-3">
                {caseItem.results.map((result, index) => (
                  <div key={index} className="border-l-4 border-[#0047AB] pl-4 py-2">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-600">{result.metric}</span>
                      <span className="text-2xl font-bold text-[#0047AB]">{result.value}</span>
                    </div>
                    {result.description && (
                      <p className="text-gray-700 text-sm">{result.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无项目成果</p>
            )}
          </div>

          {/* 客户背景 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">客户背景</h3>
            {caseItem.clientBackground ? (
              <p className="text-gray-900 whitespace-pre-wrap">{caseItem.clientBackground}</p>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无客户背景</p>
            )}
          </div>

          {/* 挑战与问题 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">挑战与问题</h3>
            {caseItem.challenges ? (
              <p className="text-gray-900 whitespace-pre-wrap">{caseItem.challenges}</p>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无挑战与问题</p>
            )}
          </div>

          {/* 解决方案 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">解决方案</h3>
            {caseItem.solution ? (
              <p className="text-gray-900 whitespace-pre-wrap">{caseItem.solution}</p>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无解决方案</p>
            )}
          </div>

          {/* 实施过程 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">实施过程</h3>
            {caseItem.implementation ? (
              <p className="text-gray-900 whitespace-pre-wrap">{caseItem.implementation}</p>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无实施过程</p>
            )}
          </div>

          {/* 客户评价 */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">客户评价</h3>
            {caseItem.clientTestimonial ? (
              <div className="bg-gray-50 rounded-md p-4 border-l-4 border-[#0047AB]">
                <p className="text-gray-900 italic whitespace-pre-wrap">{caseItem.clientTestimonial}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无客户评价</p>
            )}
          </div>

          {/* 案例图片 */}
          {caseItem.images && caseItem.images.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">案例图片</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {caseItem.images.map((image, index) => (
                  <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={getImageUrl(image)}
                      alt={`${caseItem.projectName} - 图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}