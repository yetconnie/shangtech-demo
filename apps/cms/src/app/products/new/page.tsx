'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import FileUploader from '@/components/FileUploader';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface TechnicalParam {
  key: string;
  value: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [''],
    technicalParams: [{ key: '', value: '' }] as TechnicalParam[],
    applicationScenarios: [''],
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

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
    setError(null);
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  const handleTechnicalParamChange = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...formData.technicalParams];
    newParams[index][field] = value;
    setFormData(prev => ({ ...prev, technicalParams: newParams }));
    setError(null);
  };

  const addTechnicalParam = () => {
    setFormData(prev => ({ ...prev, technicalParams: [...prev.technicalParams, { key: '', value: '' }] }));
  };

  const removeTechnicalParam = (index: number) => {
    if (formData.technicalParams.length > 1) {
      const newParams = formData.technicalParams.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, technicalParams: newParams }));
    }
  };

  const handleScenarioChange = (index: number, value: string) => {
    const newScenarios = [...formData.applicationScenarios];
    newScenarios[index] = value;
    setFormData(prev => ({ ...prev, applicationScenarios: newScenarios }));
    setError(null);
  };

  const addScenario = () => {
    setFormData(prev => ({ ...prev, applicationScenarios: [...prev.applicationScenarios, ''] }));
  };

  const removeScenario = (index: number) => {
    if (formData.applicationScenarios.length > 1) {
      const newScenarios = formData.applicationScenarios.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, applicationScenarios: newScenarios }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('产品名称不能为空');
      return false;
    }
    if (!formData.description.trim()) {
      setError('产品描述不能为空');
      return false;
    }
    
    const hasValidFeature = formData.features.some(f => f.trim() !== '');
    if (!hasValidFeature) {
      setError('至少需要一个有效的产品特点');
      return false;
    }

    const hasValidScenario = formData.applicationScenarios.some(s => s.trim() !== '');
    if (!hasValidScenario) {
      setError('至少需要一个有效的应用场景');
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
        name: formData.name,
        description: formData.description,
        features: formData.features.filter(f => f.trim() !== ''),
        technicalParams: formData.technicalParams
          .filter(p => p.key.trim() !== '' && p.value.trim() !== '')
          .reduce((acc, p) => {
            acc[p.key] = p.value;
            return acc;
          }, {} as Record<string, string>),
        applicationScenarios: formData.applicationScenarios.filter(s => s.trim() !== ''),
        images,
        documents,
        status: formData.status,
      };

      const response = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        router.push('/products');
      } else {
        const data = await response.json();
        setError(data.message || '创建产品失败');
      }
    } catch (err) {
      console.error('Failed to create product:', err);
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

        <h2 className="text-2xl font-bold text-gray-800 mb-6">新增产品</h2>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                产品名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                placeholder="请输入产品名称"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                产品描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent resize-none"
                placeholder="请输入产品描述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品特点 <span className="text-red-500">*</span>
              </label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                    placeholder={`特点 ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                    >
                      删除
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 text-[#0047AB] hover:text-[#003D8F] border border-[#0047AB] rounded-md hover:bg-blue-50 transition-colors text-sm"
              >
                + 添加特点
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                技术参数
              </label>
              {formData.technicalParams.map((param, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => handleTechnicalParamChange(index, 'key', e.target.value)}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                    placeholder="参数名"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => handleTechnicalParamChange(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                    placeholder="参数值"
                  />
                  {formData.technicalParams.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTechnicalParam(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                    >
                      删除
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTechnicalParam}
                className="px-4 py-2 text-[#0047AB] hover:text-[#003D8F] border border-[#0047AB] rounded-md hover:bg-blue-50 transition-colors text-sm"
              >
                + 添加参数
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                应用场景 <span className="text-red-500">*</span>
              </label>
              {formData.applicationScenarios.map((scenario, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={scenario}
                    onChange={(e) => handleScenarioChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                    placeholder={`应用场景 ${index + 1}`}
                  />
                  {formData.applicationScenarios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeScenario(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                    >
                      删除
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addScenario}
                className="px-4 py-2 text-[#0047AB] hover:text-[#003D8F] border border-[#0047AB] rounded-md hover:bg-blue-50 transition-colors text-sm"
              >
                + 添加场景
              </button>
            </div>

            <div>
              <ImageUploader images={images} onChange={setImages} label="产品图片" />
            </div>

            <div>
              <FileUploader files={documents} onChange={setDocuments} label="相关文档" />
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
                href="/products"
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