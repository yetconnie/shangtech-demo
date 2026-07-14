'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';

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

interface ResultItem {
  metric: string;
  value: string;
  description: string;
}

export default function EditCasePage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    clientName: '',
    clientLogoUrl: '',
    projectName: '',
    projectSummary: '',
    clientBackground: '',
    challenges: '',
    solution: '',
    implementation: '',
    results: [{ metric: '', value: '', description: '' }] as ResultItem[],
    clientTestimonial: '',
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
    fetchCase();
  }, [router, caseId]);

  const fetchCase = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`http://localhost:4000/api/cases/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('案例不存在');
        } else {
          setError('加载案例信息失败');
        }
        return;
      }

      const data = await response.json();
      const caseItem: Case = data.data;

      setFormData({
        clientName: caseItem.clientName || '',
        clientLogoUrl: caseItem.clientLogoUrl || '',
        projectName: caseItem.projectName || '',
        projectSummary: caseItem.projectSummary || '',
        clientBackground: caseItem.clientBackground || '',
        challenges: caseItem.challenges || '',
        solution: caseItem.solution || '',
        implementation: caseItem.implementation || '',
        results: Array.isArray(caseItem.results) && caseItem.results.length > 0 
          ? caseItem.results 
          : [{ metric: '', value: '', description: '' }],
        clientTestimonial: caseItem.clientTestimonial || '',
        status: caseItem.status || 'draft',
      });
      setImages(Array.isArray(caseItem.images) ? caseItem.images : []);
      setVideos(Array.isArray(caseItem.videos) ? caseItem.videos : []);
    } catch (err) {
      console.error('Failed to fetch case:', err);
      setError('加载案例信息失败');
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

      const submitData = {
        clientName: formData.clientName,
        clientLogoUrl: formData.clientLogoUrl,
        projectName: formData.projectName,
        projectSummary: formData.projectSummary,
        clientBackground: formData.clientBackground,
        challenges: formData.challenges,
        solution: formData.solution,
        implementation: formData.implementation,
        results: formData.results.filter(r => r.metric.trim() !== '' || r.value.trim() !== ''),
        clientTestimonial: formData.clientTestimonial,
        images,
        videos,
        status: formData.status,
      };

      const response = await fetch(`http://localhost:4000/api/cases/${caseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || '更新失败');
        return;
      }

      alert('案例更新成功');
      router.push(`/cases/${caseId}`);
    } catch (err) {
      console.error('Failed to update case:', err);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleResultChange = (index: number, field: 'metric' | 'value' | 'description', value: string) => {
    const newResults = [...formData.results];
    newResults[index][field] = value;
    setFormData(prev => ({ ...prev, results: newResults }));
    setError(null);
  };

  const addResult = () => {
    setFormData(prev => ({ 
      ...prev, 
      results: [...prev.results, { metric: '', value: '', description: '' }] 
    }));
  };

  const removeResult = (index: number) => {
    if (formData.results.length > 1) {
      const newResults = formData.results.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, results: newResults }));
    }
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

  if (error && !formData.clientName) {
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
          <Link href="/cases" className="text-[#0047AB] hover:underline">
            返回案例列表
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
        <div className="mb-6 flex items-center gap-2">
          <Link href="/cases" className="text-[#0047AB] hover:underline">
            案例管理
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">编辑案例</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">编辑案例</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                客户名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                placeholder="请输入客户名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                客户Logo URL
              </label>
              <input
                type="text"
                value={formData.clientLogoUrl}
                onChange={(e) => handleInputChange('clientLogoUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                placeholder="请输入客户Logo URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                placeholder="请输入项目名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目概述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.projectSummary}
                onChange={(e) => handleInputChange('projectSummary', e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入项目概述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                客户背景
              </label>
              <textarea
                value={formData.clientBackground}
                onChange={(e) => handleInputChange('clientBackground', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入客户背景"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                挑战与问题
              </label>
              <textarea
                value={formData.challenges}
                onChange={(e) => handleInputChange('challenges', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入挑战与问题"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                解决方案
              </label>
              <textarea
                value={formData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入解决方案"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                实施过程
              </label>
              <textarea
                value={formData.implementation}
                onChange={(e) => handleInputChange('implementation', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入实施过程"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目成果
              </label>
              {formData.results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">成果 {index + 1}</span>
                    {formData.results.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResult(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        删除
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">指标名称</label>
                      <input
                        type="text"
                        value={result.metric}
                        onChange={(e) => handleResultChange(index, 'metric', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent text-sm"
                        placeholder="如：效率提升"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">数值</label>
                      <input
                        type="text"
                        value={result.value}
                        onChange={(e) => handleResultChange(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent text-sm"
                        placeholder="如：50%"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-500 mb-1">描述</label>
                      <input
                        type="text"
                        value={result.description}
                        onChange={(e) => handleResultChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent text-sm"
                        placeholder="成果详细描述"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addResult}
                className="px-4 py-2 text-[#0047AB] hover:text-[#003D8F] border border-[#0047AB] rounded-md hover:bg-blue-50 transition-colors text-sm"
              >
                + 添加成果
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                客户评价
              </label>
              <textarea
                value={formData.clientTestimonial}
                onChange={(e) => handleInputChange('clientTestimonial', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入客户评价"
              />
            </div>

            <div>
              <ImageUploader images={images} onChange={setImages} label="案例图片" />
            </div>

            <div>
              <ImageUploader images={videos} onChange={setVideos} label="案例视频" />
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
                href="/cases"
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