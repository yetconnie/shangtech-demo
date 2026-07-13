'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const productId = params.id;
        const response = await fetch(`http://localhost:4000/api/products/${productId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('产品不存在');
          }
          throw new Error('获取产品详情失败');
        }

        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  // 将技术参数对象转换为数组
  const getTechnicalParamsArray = (params: Record<string, any> | undefined) => {
    if (!params) return [];
    return Object.entries(params).map(([key, value]) => ({
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value)
    }));
  };

  return (
    <main className="flex-1 min-h-screen" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="inline-block w-12 h-12 rounded-full border-2 border-[var(--line-strong)] border-t-[var(--cobalt)] animate-spin"></div>
            <p className="mt-4 text-[var(--mute)]">加载中...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-32">
          <div className="max-w-md mx-4 p-8 rounded-lg border border-[var(--line)] bg-[var(--bg-2)]">
            <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-400 mb-6 text-center">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleRetry} className="btn btn-primary">重试</button>
              <Link href="/products" className="btn btn-outline text-center">返回产品列表</Link>
            </div>
          </div>
        </div>
      ) : product ? (
        <>
          {/* 产品头部 */}
          <section className="py-10 md:py-14 border-b border-[var(--line)]">
            <div className="container-custom">
              <Link
                href="/products"
                className="inline-flex items-center text-[var(--cobalt-bright)] hover:text-[var(--ink)] mb-6 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回产品列表
              </Link>

              <h1 className="font-[family-name:var(--serif)] text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--ink)] mb-4">
                {product.name}
              </h1>

              {product.images && product.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-[var(--bg-3)] rounded-[var(--radius-md)] overflow-hidden border border-[var(--line)]">
                      <img
                        src={image}
                        alt={`${product.name} - 图片 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 产品详情内容 */}
          <section className="py-12 md:py-16">
            <div className="container-custom">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 左列：基本信息 */}
                <div className="space-y-6">
                  {/* 产品描述 */}
                  <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                    <h2 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      产品描述
                    </h2>
                    <p className="text-[var(--ink-3)] leading-relaxed whitespace-pre-wrap">
                      {product.description}
                    </p>
                  </div>

                  {/* 产品特点 */}
                  {product.features && product.features.length > 0 && (
                    <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                      <h2 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        产品特点
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {product.features.map((feature, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center px-4 py-2 rounded-full border border-[var(--line-strong)] text-[var(--ink)] bg-transparent"
                          >
                            <svg className="w-4 h-4 mr-2 text-[var(--cobalt-bright)]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 应用场景 */}
                  {product.applicationScenarios && product.applicationScenarios.length > 0 && (
                    <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                      <h2 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        应用场景
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.applicationScenarios.map((scenario, index) => (
                          <div
                            key={index}
                            className="bg-[var(--bg-3)] border border-[var(--line)] rounded-[var(--radius-md)] p-4"
                          >
                            <div className="flex items-start">
                              <div className="bg-[var(--cobalt)] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                                {index + 1}
                              </div>
                              <p className="text-[var(--ink-3)] pt-1">{scenario}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 右列：技术参数 */}
                <div className="space-y-6">
                  {product.technicalParams && Object.keys(product.technicalParams).length > 0 && (
                    <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                      <h2 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        技术参数
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[var(--line-strong)]">
                              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--ink)]">
                                参数名称
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--ink)]">
                                参数值
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getTechnicalParamsArray(product.technicalParams).map((param, index) => (
                              <tr key={index} className="border-b border-[var(--line)] last:border-b-0">
                                <td className="px-4 py-3 text-sm text-[var(--ink-3)]">
                                  {param.key}
                                </td>
                                <td className="px-4 py-3 text-sm text-[var(--ink-2)]">
                                  {param.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 相关文档 */}
                  {product.documents && product.documents.length > 0 && (
                    <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                      <h2 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        相关文档
                      </h2>
                      <div className="space-y-3">
                        {product.documents.map((document, index) => (
                          <a
                            key={index}
                            href={document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-3)] hover:border-[var(--cobalt)] transition-colors group"
                          >
                            <svg className="w-5 h-5 text-[var(--cobalt-bright)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-[var(--ink-2)] group-hover:text-[var(--cobalt-bright)] transition-colors">
                              文档 {index + 1}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
