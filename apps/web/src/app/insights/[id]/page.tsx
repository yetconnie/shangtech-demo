'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE = 'http://localhost:4000';
const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return API_BASE + path;
};

const categoryLabels: Record<string, string> = {
  technology: '技术趋势',
  industry: '行业观察',
  leadership: '领导力',
};

// Insight数据结构
interface Insight {
  id: string;
  title: string;
  summary: string;
  category: 'technology' | 'industry' | 'leadership';
  coverImage?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  status: 'draft' | 'published' | 'offline';
  createdAt: string;
  updatedAt: string;
}

export default function InsightDetailPage() {
  const params = useParams();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        setLoading(true);
        setError(null);

        const insightId = params.id;
        const response = await fetch(`http://localhost:4000/api/insights/${insightId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('洞察不存在');
          }
          throw new Error('获取洞察详情失败');
        }

        const data = await response.json();
        setInsight(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInsight();
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
              <Link href="/#insights" className="btn btn-outline text-center">返回洞察列表</Link>
            </div>
          </div>
        </div>
      ) : insight ? (
        <>
          {/* 洞察头部 */}
          <section className="py-10 md:py-14 border-b border-[var(--line)]">
            <div className="container-custom">
              <Link
                href="/#insights"
                className="inline-flex items-center text-[var(--cobalt-bright)] hover:text-[var(--ink)] mb-6 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回洞察列表
              </Link>

              <div className="inline-block px-3 py-1 text-sm rounded-full border border-[var(--line-strong)] text-[var(--ink-2)] mb-4">
                {categoryLabels[insight.category] || '洞察'}
              </div>

              <h1 className="font-[family-name:var(--serif)] text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--ink)] mb-6">
                {insight.title}
              </h1>

              {/* 作者信息 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[var(--cobalt)] text-white flex items-center justify-center text-sm font-medium">
                  {insight.authorName ? insight.authorName.slice(0, 2).toUpperCase() : 'ST'}
                </div>
                <div>
                  <div className="text-[var(--ink)] font-medium">{insight.authorName || 'ShangTech'}</div>
                  <div className="text-[var(--mute)] text-sm">{insight.authorRole || '专家'}</div>
                </div>
              </div>

              {/* 封面图片 */}
              {insight.coverImage && (
                <div className="mt-6 rounded-[var(--radius-lg)] overflow-hidden border border-[var(--line)]">
                  <img
                    src={getImageUrl(insight.coverImage)}
                    alt={insight.title}
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}
            </div>
          </section>

          {/* 洞察内容 */}
          <section className="py-12 md:py-16">
            <div className="container-custom">
              <div className="max-w-3xl">
                <div className="bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius-lg)] p-8">
                  <h2 className="font-[family-name:var(--serif)] text-2xl font-normal text-[var(--ink)] mb-4">
                    洞察摘要
                  </h2>
                  <p className="text-[var(--ink-3)] text-lg leading-relaxed whitespace-pre-wrap">
                    {insight.summary}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
