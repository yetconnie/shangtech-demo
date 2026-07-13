'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api';

interface Insight {
  id: string;
  title: string;
  summary: string;
  category: 'technology' | 'industry' | 'leadership';
  status: 'draft' | 'published' | 'offline';
  coverImage?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

const categoryLabels: Record<string, string> = {
  technology: '技术趋势',
  industry: '行业观察',
  leadership: '领导力',
};

export default function InsightsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_info');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userStr));
    fetchInsights();
  }, [router]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await apiClient.get('/api/insights', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInsights(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      alert('获取洞察列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定要删除洞察「${title}」吗？`)) return;

    try {
      const token = localStorage.getItem('auth_token');
      await apiClient.delete(`/api/insights/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInsights((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error('Failed to delete insight:', err);
      alert(err?.response?.data?.message || '删除失败');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      offline: 'bg-gray-100 text-gray-800',
    };
    const labels: Record<string, string> = {
      published: '已发布',
      draft: '草稿',
      offline: '下线',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const filteredInsights =
    filter === 'all' ? insights : insights.filter((item) => item.status === filter);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#0047AB] text-white py-4 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">上科官网管理后台</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {user.username} ({user.role})
            </span>
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
            <Link href="/cases" className="text-gray-600 hover:text-[#0047AB]">
              案例管理
            </Link>
          </li>
          <li>
            <Link href="/insights" className="text-[#0047AB] font-medium">
              洞察管理
            </Link>
          </li>
          <li>
            <Link href="/inquiries" className="text-gray-600 hover:text-[#0047AB]">
              询价管理
            </Link>
          </li>
        </ul>
      </nav>

      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">洞察管理</h2>
          <Link
            href="/insights/new"
            className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors"
          >
            新增洞察
          </Link>
        </div>

        <div className="mb-4 flex gap-2 items-center">
          <label className="text-sm text-gray-600">状态筛选：</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">全部</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
            <option value="offline">下线</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : filteredInsights.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            暂无洞察数据，点击右上角新增洞察
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分类
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    排序
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInsights.map((insight) => (
                  <tr key={insight.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {insight.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoryLabels[insight.category] || insight.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {insight.authorName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(insight.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {insight.sortOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/insights/${insight.id}/edit`}
                        className="text-[#0047AB] hover:text-[#003D8F]"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(insight.id, insight.title)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
