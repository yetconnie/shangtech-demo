'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Product数据结构
interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  technicalParams: Record<string, any>;
  applicationScenarios: string[];
  images: string[];
  documents: string[];
  status: 'draft' | 'published' | 'offline';
  createdAt: string;
  updatedAt: string;
}

// 截取文本
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:4000/api/products?status=published');

        if (!response.ok) {
          throw new Error('获取产品列表失败');
        }

        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  return (
    <main className="flex-1 min-h-screen" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      {/* 页面标题 */}
      <section className="py-16 md:py-20 border-b border-[var(--line)]">
        <div className="container-custom">
          <div className="section-header light">
            <span className="section-label">产品中心</span>
            <h1 className="section-title">产品中心</h1>
            <p className="section-desc">专业企业级解决方案，助力数字化转型</p>
          </div>
        </div>
      </section>

      {/* 产品列表 */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 rounded-full border-2 border-[var(--line-strong)] border-t-[var(--cobalt)] animate-spin"></div>
              <p className="mt-4 text-[var(--mute)]">加载中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto p-8 rounded-lg border border-[var(--line)] bg-[var(--bg-2)]">
                <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-400 mb-6">{error}</p>
                <button
                  onClick={handleRetry}
                  className="btn btn-primary"
                >
                  重试
                </button>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto p-8 rounded-lg border border-[var(--line)] bg-[var(--bg-2)]">
                <svg className="w-16 h-16 mx-auto mb-4 text-[var(--mute)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-[var(--mute)]">暂无产品信息</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] overflow-hidden transition-all duration-500 hover:border-[var(--line-strong)] hover:-translate-y-1"
                >
                  {/* 产品图片区域 */}
                  {product.images && product.images.length > 0 && (
                    <div className="h-48 bg-[var(--bg-3)] relative overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* 产品信息 */}
                  <div className="p-6">
                    <h2 className="font-[family-name:var(--serif)] text-xl font-normal mb-3 text-[var(--ink)] group-hover:text-[var(--cobalt-bright)] transition-colors">
                      {product.name}
                    </h2>

                    <p className="text-[var(--ink-3)] text-[0.94rem] leading-relaxed mb-4 line-clamp-3 min-h-[4.5rem]">
                      {truncateText(product.description, 100)}
                    </p>

                    {/* 特点标签 */}
                    {product.features && product.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {product.features.slice(0, 5).map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border border-[var(--line-strong)] text-[var(--ink-2)] bg-transparent"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 查看详情提示 */}
                    <div className="pt-4 border-t border-[var(--line)] flex items-center text-[var(--ink)] group-hover:text-[var(--cobalt-bright)] transition-colors">
                      <span className="text-sm font-medium">查看详情</span>
                      <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
