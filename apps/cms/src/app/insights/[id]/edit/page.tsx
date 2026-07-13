'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface InsightForm {
  title: string;
  summary: string;
  category: 'technology' | 'industry' | 'leadership';
  status: 'draft' | 'published' | 'offline';
  coverImage: string;
  url: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  sortOrder: number;
}

export default function EditInsightPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<InsightForm>({
    title: '',
    summary: '',
    category: 'technology',
    status: 'draft',
    coverImage: '',
    url: '',
    authorName: '',
    authorRole: '',
    authorAvatar: '',
    sortOrder: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_info');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userStr));
    fetchInsight(token);
  }, [router, id]);

  const fetchInsight = async (token: string) => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/insights/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data;
      if (!data) {
        alert('洞察不存在');
        router.push('/insights');
        return;
      }

      setFormData({
        title: data.title || '',
        summary: data.summary || '',
        category: data.category || 'technology',
        status: data.status || 'draft',
        coverImage: data.coverImage || '',
        url: data.url || '',
        authorName: data.authorName || '',
        authorRole: data.authorRole || '',
        authorAvatar: data.authorAvatar || '',
        sortOrder: data.sortOrder || 0,
      });
    } catch (err) {
      console.error('Failed to fetch insight:', err);
      alert('获取洞察详情失败');
      router.push('/insights');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/login');
  };

  const handleInputChange = (field: keyof InsightForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      alert('标题不能为空');
      return false;
    }
    if (!formData.summary.trim()) {
      alert('摘要不能为空');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('auth_token');

      const payload = {
        ...formData,
        sortOrder: Number(formData.sortOrder),
      };

      await apiClient.put(`/api/insights/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('洞察更新成功');
      router.push('/insights');
    } catch (err: any) {
      console.error('Failed to update insight:', err);
      alert(err?.response?.data?.message || '更新失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || loading) {
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

      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">编辑洞察</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="请输入洞察标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">摘要 *</label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="请输入摘要"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="technology">技术趋势</option>
                <option value="industry">行业观察</option>
                <option value="leadership">领导力</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="offline">下线</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">封面图片 URL</label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) => handleInputChange('coverImage', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">链接 URL</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="https://example.com/article"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">作者姓名</label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => handleInputChange('authorName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="请输入作者姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">作者职位</label>
              <input
                type="text"
                value={formData.authorRole}
                onChange={(e) => handleInputChange('authorRole', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="请输入作者职位"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">作者头像（留空自动取姓名首字母）</label>
            <input
              type="text"
              value={formData.authorAvatar}
              onChange={(e) => handleInputChange('authorAvatar', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="两位字母，如 LZ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors disabled:opacity-50"
            >
              {submitting ? '保存中...' : '保存'}
            </button>
            <Link
              href="/insights"
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              取消
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
