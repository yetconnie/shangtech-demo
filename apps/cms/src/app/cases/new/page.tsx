'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';

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

export default function NewCasePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
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
  }, [router]);

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

  const validateForm = (): boolean => {
    if (!formData.clientName.trim()) {
      setError('客户名称不能为空');
      return false;
    }
    if (!formData.projectName.trim()) {
      setError('项目名称不能为空');
      return false;
    }
    if (!formData.projectSummary.trim()) {
      setError('项目概述不能为空');
      return false;
    }
    
    const hasValidResult = formData.results.some(r => r.metric.trim() !== '' || r.value.trim() !== '');
    if (!hasValidResult) {
      setError('至少需要一个有效的项目成果');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
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

      const response = await fetch('http://localhost:4000/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        router.push('/cases');
      } else {
        const data = await response.json();
        setError(data.message || '创建案例失败');
      }
    } catch (err) {
      console.error('Failed to create case:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
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

        <h2 className="text-2xl font-bold text-gray-800 mb-6">新增案例</h2>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                客户名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                placeholder="请输入客户名称"
              />
            </div>

            <div>
              <label htmlFor="clientLogoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                客户Logo URL
              </label>
              <input
                type="text"
                id="clientLogoUrl"
                value={formData.clientLogoUrl}
                onChange={(e) => handleInputChange('clientLogoUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                placeholder="请输入客户Logo URL"
              />
            </div>

            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                项目名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                placeholder="请输入项目名称"
              />
            </div>

            <div>
              <label htmlFor="projectSummary" className="block text-sm font-medium text-gray-700 mb-2">
                项目概述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="projectSummary"
                value={formData.projectSummary}
                onChange={(e) => handleInputChange('projectSummary', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入项目概述"
              />
            </div>

            <div>
              <label htmlFor="clientBackground" className="block text-sm font-medium text-gray-700 mb-2">
                客户背景
              </label>
              <textarea
                id="clientBackground"
                value={formData.clientBackground}
                onChange={(e) => handleInputChange('clientBackground', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入客户背景"
              />
            </div>

            <div>
              <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-2">
                挑战与问题
              </label>
              <textarea
                id="challenges"
                value={formData.challenges}
                onChange={(e) => handleInputChange('challenges', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入挑战与问题"
              />
            </div>

            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
                解决方案
              </label>
              <textarea
                id="solution"
                value={formData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入解决方案"
              />
            </div>

            <div>
              <label htmlFor="implementation" className="block text-sm font-medium text-gray-700 mb-2">
                实施过程
              </label>
              <textarea
                id="implementation"
                value={formData.implementation}
                onChange={(e) => handleInputChange('implementation', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入实施过程"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目成果 <span className="text-red-500">*</span>
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
              <label htmlFor="clientTestimonial" className="block text-sm font-medium text-gray-700 mb-2">
                客户评价
              </label>
              <textarea
                id="clientTestimonial"
                value={formData.clientTestimonial}
                onChange={(e) => handleInputChange('clientTestimonial', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
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
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="offline">已下线</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '提交中...' : '提交'}
              </button>
              <Link
                href="/cases"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
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