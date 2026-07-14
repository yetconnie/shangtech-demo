'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Insight {
  id: string;
  title: string;
  summary: string;
  category: 'technology' | 'industry' | 'leadership';
  status: 'draft' | 'published' | 'offline';
  coverImage?: string;
  url?: string;
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

export default function InsightDetailPage() {
  const router = useRouter();
  const params = useParams();
  const insightId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_info');
    if (!token || !userStr) { router.push('/login'); return; }
    setUser(JSON.parse(userStr));
    fetchInsight();
  }, [router, insightId]);

  const fetchInsight = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:4000/api/insights/${insightId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(response.status === 404 ? '洞察不存在' : '获取洞察详情失败');
      }
      const data = await response.json();
      setInsight(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取洞察详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!insight) return;
    if (!confirm(`确定要删除洞察"${insight.title}"吗？此操作不可撤销。`)) return;
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:4000/api/insights/${insightId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) { alert('删除成功'); router.push('/insights'); }
      else { const data = await response.json(); alert(data.message || '删除失败'); }
    } catch { alert('删除失败'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; text: string }> = {
      draft: { cls: 'bg-gray-100 text-gray-700', text: '草稿' },
      published: { cls: 'bg-green-100 text-green-700', text: '已发布' },
      offline: { cls: 'bg-red-100 text-red-700', text: '已下线' },
    };
    const s = map[status] || map.draft;
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${s.cls}`}>{s.text}</span>;
  };

  const categoryMap: Record<string, string> = {
    technology: '技术趋势',
    industry: '行业观察',
    leadership: '领导力',
  };

  const formatDate = (s: string) => new Date(s).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  if (!user) return <div className="min-h-screen flex items-center justify-center">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#0047AB] text-white py-4 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">上科官网管理后台</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.username} ({user.role})</span>
            <button onClick={handleLogout} className="px-3 py-1 bg-white text-[#0047AB] rounded-md hover:bg-gray-100 transition-colors text-sm">登出</button>
          </div>
        </div>
      </header>
      <nav className="bg-white shadow-sm py-3 px-6">
        <ul className="flex gap-6">
          <li><Link href="/dashboard" className="text-gray-600 hover:text-[#0047AB]">仪表板</Link></li>
          <li><Link href="/products" className="text-gray-600 hover:text-[#0047AB]">产品管理</Link></li>
          <li><Link href="/cases" className="text-gray-600 hover:text-[#0047AB]">案例管理</Link></li>
          <li><Link href="/insights" className="text-[#0047AB] font-medium">洞察管理</Link></li>
        </ul>
      </nav>

      <main className="p-6">
        <div className="mb-6">
          <Link href="/insights" className="text-[#0047AB] hover:text-[#003D8F] text-sm">← 返回洞察列表</Link>
        </div>

        {loading && <div className="text-center py-12 text-gray-500">加载中...</div>}

        {error && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Link href="/insights" className="px-4 py-2 bg-[#0047AB] text-white rounded-md">返回洞察列表</Link>
            </div>
          </div>
        )}

        {insight && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">洞察详情</h2>
              <div className="flex gap-3">
                <Link href={`/insights/${insightId}/edit`} className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors">编辑</Link>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">删除</button>
                <Link href="/insights" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">返回</Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">基本信息</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">标题</label>
                    <p className="text-gray-900 text-lg font-medium">{insight.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">分类</label>
                      <p className="text-gray-900">{categoryMap[insight.category] || insight.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">状态</label>
                      <div>{getStatusBadge(insight.status)}</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">摘要</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{insight.summary}</p>
                  </div>
                  {insight.url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">外部链接</label>
                      <a href={insight.url} target="_blank" rel="noopener noreferrer" className="text-[#0047AB] hover:underline break-all">{insight.url}</a>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">创建时间</label>
                      <p className="text-gray-900">{formatDate(insight.createdAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">更新时间</label>
                      <p className="text-gray-900">{formatDate(insight.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">作者信息</h3>
                <div className="space-y-4">
                  {insight.coverImage && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">封面图片</label>
                      <img src={`http://localhost:4000${insight.coverImage}`} alt={insight.title} className="w-full max-w-md rounded-lg object-cover" />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">作者</label>
                    <p className="text-gray-900">{insight.authorName || '未设置'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">作者职位</label>
                    <p className="text-gray-900">{insight.authorRole || '未设置'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">排序权重</label>
                    <p className="text-gray-900">{insight.sortOrder}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
