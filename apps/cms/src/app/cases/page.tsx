'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function CasesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_info');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userStr));
    fetchCases();
  }, [router]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredCases(cases);
    } else {
      setFilteredCases(cases.filter(c => c.status === statusFilter));
    }
  }, [statusFilter, cases]);

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('http://localhost:4000/api/cases', {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });

      const data = await response.json();
      setCases(data.data || []);
      setFilteredCases(data.data || []);
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, projectName: string) => {
    if (!confirm(`确定要删除案例"${projectName}"吗？`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`http://localhost:4000/api/cases/${id}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });

      if (response.ok) {
        setCases(cases.filter(c => c.id !== id));
        alert('删除成功');
      } else {
        alert('删除失败');
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
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
          <li>
            <Link href="/insights" className="text-gray-600 hover:text-[#0047AB]">
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
          <h2 className="text-2xl font-bold text-gray-800">案例管理</h2>
          <Link
            href="/cases/new"
            className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors"
          >
            新增案例
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">状态筛选：</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
            >
              <option value="all">全部</option>
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
              <option value="offline">已下线</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无案例数据</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      客户名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      项目名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCases.map((caseItem) => (
                    <tr key={caseItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {caseItem.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {caseItem.projectName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(caseItem.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(caseItem.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/cases/${caseItem.id}`}
                          className="text-[#0047AB] hover:text-[#003D8F]"
                        >
                          查看
                        </Link>
                        <Link
                          href={`/cases/${caseItem.id}/edit`}
                          className="text-[#0047AB] hover:text-[#003D8F]"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(caseItem.id, caseItem.projectName)}
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
        </div>
      </main>
    </div>
  );
}