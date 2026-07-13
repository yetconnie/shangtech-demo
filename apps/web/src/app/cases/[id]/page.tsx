'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Case数据结构
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
  results: Array<{
    metric: string;
    value: string;
    description?: string;
  }>;
  clientTestimonial: string;
  images: string[];
  videos: string[];
  status: 'draft' | 'published' | 'offline';
  createdAt: string;
  updatedAt: string;
}

export default function CaseDetailPage() {
  const params = useParams();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        setError(null);

        const caseId = params.id;
        const response = await fetch(`http://localhost:4000/api/cases/${caseId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('案例不存在');
          }
          throw new Error('获取案例详情失败');
        }

        const data = await response.json();
        setCaseData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCase();
    }
  }, [params.id]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
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
              <Link href="/cases" className="btn btn-outline text-center">返回案例列表</Link>
            </div>
          </div>
        </div>
      ) : caseData ? (
        <>
          {/* 案例头部 */}
          <section className="py-10 md:py-14 border-b border-[var(--line)]">
            <div className="container-custom">
              <Link
                href="/cases"
                className="inline-flex items-center text-[var(--cobalt-bright)] hover:text-[var(--ink)] mb-6 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回案例列表
              </Link>

              {/* 客户Logo */}
              {caseData.clientLogoUrl && (
                <div className="mb-6">
                  <img
                    src={caseData.clientLogoUrl}
                    alt={caseData.clientName}
                    className="h-12 md:h-16 object-contain"
                  />
                </div>
              )}

              <div className="text-[var(--mute)] text-sm mb-2">{caseData.clientName}</div>

              <h1 className="font-[family-name:var(--serif)] text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--ink)] mb-4">
                {caseData.projectName}
              </h1>

              <p className="text-[var(--ink-3)] text-lg leading-relaxed max-w-4xl">
                {caseData.projectSummary}
              </p>

              {caseData.images && caseData.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {caseData.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-[var(--bg-3)] rounded-[var(--radius-md)] overflow-hidden border border-[var(--line)]">
                      <img
                        src={image}
                        alt={`${caseData.projectName} - 图片 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 案例详情内容 */}
          <section className="py-12 md:py-16">
            <div className="container-custom">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 左列 */}
                <div className="space-y-6">
                  {/* 客户背景 */}
                  {caseData.clientBackground && (
                    <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                      <h3 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        客户背景
                      </h3>
                      <p className="text-[var(--ink-3)] leading-relaxed whitespace-pre-wrap">
                        {caseData.clientBackground}
                      </p>
                    </div>
                  )}

                  {/* 挑战与问题 */}
                  {caseData.challenges && (
                    <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                      <h3 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        挑战与问题
                      </h3>
                      <p className="text-[var(--ink-3)] leading-relaxed whitespace-pre-wrap">
                        {caseData.challenges}
                      </p>
                    </div>
                  )}

                  {/* 解决方案 */}
                  {caseData.solution && (
                    <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                      <h3 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        解决方案
                      </h3>
                      <p className="text-[var(--ink-3)] leading-relaxed whitespace-pre-wrap">
                        {caseData.solution}
                      </p>
                    </div>
                  )}
                </div>

                {/* 右列 */}
                <div className="space-y-6">
                  {/* 实施过程 */}
                  {caseData.implementation && (
                    <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                      <h3 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        实施过程
                      </h3>
                      <p className="text-[var(--ink-3)] leading-relaxed whitespace-pre-wrap">
                        {caseData.implementation}
                      </p>
                    </div>
                  )}

                  {/* 项目成果 */}
                  {caseData.results && caseData.results.length > 0 && (
                    <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                      <h3 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        项目成果
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {caseData.results.map((result, index) => (
                          <div
                            key={index}
                            className="bg-[var(--bg-3)] border border-[var(--line)] rounded-[var(--radius-lg)] p-5"
                          >
                            <div className="text-[var(--mute)] text-sm mb-2">
                              {result.metric}
                            </div>
                            <div className="font-[family-name:var(--serif)] text-2xl sm:text-3xl font-normal text-[var(--cobalt-bright)] mb-2">
                              {result.value}
                            </div>
                            {result.description && (
                              <div className="text-[var(--ink-3)] text-sm">
                                {result.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 客户评价 */}
                  {caseData.clientTestimonial && (
                    <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6">
                      <h3 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--cobalt-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        客户评价
                      </h3>
                      <div className="border-l-2 border-[var(--cobalt)] pl-5 py-2">
                        <p className="text-[var(--ink-3)] leading-relaxed whitespace-pre-wrap italic">
                          &ldquo;{caseData.clientTestimonial}&rdquo;
                        </p>
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
