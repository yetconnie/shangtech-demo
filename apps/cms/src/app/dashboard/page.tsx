'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    products: 0,
    cases: 0,
    insights: 0,
    publishedProducts: 0,
    publishedCases: 0,
    publishedInsights: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_info');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userStr));
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const [productsRes, casesRes, insightsRes] = await Promise.all([
        fetch('http://localhost:4000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:4000/api/cases', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:4000/api/insights', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const productsData = await productsRes.json();
      const casesData = await casesRes.json();
      const insightsData = await insightsRes.json();

      setStats({
        products: productsData.data?.length || 0,
        cases: casesData.data?.length || 0,
        insights: insightsData.data?.length || 0,
        publishedProducts:
          productsData.data?.filter((p: any) => p.status === 'published').length || 0,
        publishedCases:
          casesData.data?.filter((c: any) => c.status === 'published').length || 0,
        publishedInsights:
          insightsData.data?.filter((i: any) => i.status === 'published').length || 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
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
            <Link href="/dashboard" className="text-[#0047AB] font-medium">
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
            <Link href="/inquiries" className="text-gray-600 hover:text-[#0047AB]">
              询价管理
            </Link>
          </li>
        </ul>
      </nav>

      <main className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">仪表板</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600">总产品数</h3>
            <p className="text-3xl font-bold text-[#0047AB] mt-2">{stats.products}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600">已发布产品</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.publishedProducts}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600">总案例数</h3>
            <p className="text-3xl font-bold text-[#0047AB] mt-2">{stats.cases}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600">已发布案例</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.publishedCases}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600">总洞察数</h3>
            <p className="text-3xl font-bold text-[#0047AB] mt-2">{stats.insights}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600">已发布洞察</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.publishedInsights}</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">快速操作</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products/new"
              className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors"
            >
              新增产品
            </Link>
            <Link
              href="/cases/new"
              className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors"
            >
              新增案例
            </Link>
            <Link
              href="/insights/new"
              className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-[#003D8F] transition-colors"
            >
              新增洞察
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
