'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api';

interface Inquiry {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
  productInterest: string;
  message?: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

const statusStyles: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-green-100 text-green-800',
};

const statusLabels: Record<string, string> = {
  new: '新询价',
  read: '已查看',
  replied: '已回复',
};

export default function InquiriesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_info');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userStr));
    fetchInquiries();
  }, [router]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await apiClient.get('/api/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      alert('获取询价列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/login');
  };

  const handleView = async (inquiry: Inquiry) => {
    setSelected(inquiry);
    if (inquiry.status === 'new') {
      try {
        const token = localStorage.getItem('auth_token');
        await apiClient.put(
          `/api/inquiries/${inquiry.id}/status`,
          { status: 'read' },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === inquiry.id ? { ...item, status: 'read' as const } : item,
          ),
        );
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
  };

  const handleMarkReplied = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await apiClient.put(
        `/api/inquiries/${id}/status`,
        { status: 'replied' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'replied' as const } : item,
        ),
      );
      if (selected?.id === id) {
        setSelected({ ...selected, status: 'replied' as const });
      }
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert(err?.response?.data?.message || '更新状态失败');
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return iso;
    }
  };

  const filteredInquiries =
    filter === 'all' ? inquiries : inquiries.filter((item) => item.status === filter);

  const counts = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    read: inquiries.filter((i) => i.status === 'read').length,
    replied: inquiries.filter((i) => i.status === 'replied').length,
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
            <Link href="/insights" className="text-gray-600 hover:text-[#0047AB]">
              洞察管理
            </Link>
          </li>
          <li>
            <Link href="/inquiries" className="text-[#0047AB] font-medium">
              询价管理
            </Link>
          </li>
        </ul>
      </nav>

      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">询价管理</h2>
        </div>

        <div className="mb-4 flex gap-2 items-center">
          <label className="text-sm text-gray-600">状态筛选：</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">全部 ({counts.all})</option>
            <option value="new">新询价 ({counts.new})</option>
            <option value="read">已查看 ({counts.read})</option>
            <option value="replied">已回复 ({counts.replied})</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            暂无询价数据
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    提交时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    姓名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    公司
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    职位
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    感兴趣的产品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    联系方式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(inquiry.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {inquiry.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inquiry.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inquiry.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inquiry.productInterest}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{inquiry.email}</div>
                      {inquiry.phone && <div className="text-xs text-gray-400">{inquiry.phone}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[inquiry.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[inquiry.status] || inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleView(inquiry)}
                        className="text-[#0047AB] hover:text-[#003D8F]"
                      >
                        查看
                      </button>
                      {inquiry.status !== 'replied' && (
                        <button
                          onClick={() => handleMarkReplied(inquiry.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          标记已回复
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">询价详情</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="text-gray-500 w-24 flex-shrink-0">提交时间：</span>
                  <span className="text-gray-900">{formatTime(selected.createdAt)}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 flex-shrink-0">姓名：</span>
                  <span className="text-gray-900">{selected.name}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 flex-shrink-0">公司：</span>
                  <span className="text-gray-900">{selected.company}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 flex-shrink-0">职位：</span>
                  <span className="text-gray-900">{selected.position}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 flex-shrink-0">邮箱：</span>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-[#0047AB] hover:underline"
                  >
                    {selected.email}
                  </a>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 flex-shrink-0">电话：</span>
                  <span className="text-gray-900">{selected.phone || '未填写'}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 flex-shrink-0">感兴趣的产品：</span>
                  <span className="text-gray-900">{selected.productInterest}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24 flex-shrink-0">状态：</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[selected.status]}`}>
                    {statusLabels[selected.status]}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-gray-500 mb-2">留言：</div>
                  <div className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-md p-3">
                    {selected.message || '无'}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                {selected.status !== 'replied' && (
                  <button
                    onClick={() => handleMarkReplied(selected.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    标记已回复
                  </button>
                )}
                <a
                  href={`mailto:${selected.email}?subject=Re: ShangTech 产品试用咨询`}
                  className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors text-sm"
                >
                  回复邮件
                </a>
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
