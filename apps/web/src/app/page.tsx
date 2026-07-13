'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import ContactForm from '@/components/ContactForm';

// 数据接口
interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  technicalParams?: Record<string, any>;
  applicationScenarios?: string[];
  status: 'draft' | 'published' | 'offline';
  sortOrder: number;
}

interface Case {
  id: string;
  clientName: string;
  clientLogoUrl: string;
  projectName: string;
  projectSummary: string;
  status: 'draft' | 'published' | 'offline';
  sortOrder: number;
}

interface Insight {
  id: string;
  title: string;
  summary: string;
  category: 'technology' | 'industry' | 'leadership';
  status: 'draft' | 'published' | 'offline';
  coverImage?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  url?: string;
  sortOrder: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const categoryLabels: Record<string, string> = {
  technology: '技术趋势',
  industry: '行业观察',
  leadership: '领导力',
};

const categoryImageClass: Record<string, string> = {
  technology: 'tech-img',
  industry: 'industry-img',
  leadership: 'lead-img',
};

// 默认产品图标映射
const productIconClass: Record<string, string> = {
  cloud: 'cloud-icon',
  ai: 'ai-icon',
  data: 'data-icon',
  security: 'security-icon',
};

// 为没有匹配的产品生成一个稳定的 key
const getProductKey = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('云') || lower.includes('cloud')) return 'cloud';
  if (lower.includes('ai') || lower.includes('智能') || lower.includes('mind')) return 'ai';
  if (lower.includes('数据') || lower.includes('data')) return 'data';
  if (lower.includes('安全') || lower.includes('security') || lower.includes('shield')) return 'security';
  return 'cloud';
};

const getInitials = (name: string) => {
  if (!name) return 'ST';
  return name.slice(0, 2).toUpperCase();
};

const getCaseThumbClass = (clientName: string) => {
  const lower = clientName?.toLowerCase() || '';
  if (lower.includes('零售') || lower.includes('retail')) return 'retail';
  if (lower.includes('金融') || lower.includes('finance') || lower.includes('银行')) return 'finance';
  if (lower.includes('制造') || lower.includes('manufacturing')) return 'manufacturing';
  if (lower.includes('医疗') || lower.includes('healthcare')) return 'healthcare';
  return 'retail';
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [caseIndex, setCaseIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, casesRes, insightsRes] = await Promise.all([
          apiClient.get(`${API_BASE}/api/products?status=published`),
          apiClient.get(`${API_BASE}/api/cases?status=published`),
          apiClient.get(`${API_BASE}/api/insights?status=published`),
        ]);

        const productsData = productsRes.data?.data || [];
        const casesData = casesRes.data?.data || [];
        const insightsData = insightsRes.data?.data || [];

        setProducts(
          productsData
            .sort((a: Product, b: Product) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .slice(0, 4)
        );
        setCases(
          casesData
            .sort((a: Case, b: Case) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .slice(0, 6)
        );
        setInsights(
          insightsData
            .sort((a: Insight, b: Insight) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .slice(0, 6)
        );
      } catch (err: any) {
        setError(err?.message || '数据加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 洞察过滤
  const filteredInsights = useMemo(() => {
    if (activeCategory === 'all') return insights;
    return insights.filter((item) => item.category === activeCategory);
  }, [insights, activeCategory]);

  // 案例轮播控制
  const handlePrev = () => {
    setCaseIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCaseIndex((prev) => {
      const maxIndex = Math.max(cases.length - 1, 0);
      return Math.min(prev + 1, maxIndex);
    });
  };

  // 加载与错误状态组件
  const LoadingBlock = () => (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="mt-4" style={{ color: 'var(--mute)' }}>
        加载中...
      </p>
    </div>
  );

  const ErrorBlock = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <p className="mb-4" style={{ color: 'var(--cobalt-bright)' }}>
        {message}
      </p>
      <button onClick={() => window.location.reload()} className="btn btn-primary">
        重试
      </button>
    </div>
  );

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="hero">
        <div className="container-custom">
          <span className="hero-eyebrow">ShangTech · 企业智能基础设施</span>
          <h1 className="hero-title">
            <span>以智能技术，</span>
            <span>驱动企业未来</span>
          </h1>
          <p className="hero-sub">
            ShangTech 融合云计算、人工智能与数据智能，为全球 500+ 企业打造可信赖的数字化基座。
          </p>
          <div className="hero-actions">
            <Link href="/products" className="btn btn-primary">
              探索产品
            </Link>
            <Link href="/cases" className="btn btn-text">
              查看案例 <span className="arrow">&rarr;</span>
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>500+</strong>
              <span>全球企业客户</span>
            </div>
            <div className="stat">
              <strong>98%</strong>
              <span>客户满意度</span>
            </div>
            <div className="stat">
              <strong>35</strong>
              <span>国家及地区</span>
            </div>
          </div>
        </div>
        <div className="hero-mesh"></div>
      </section>

      {/* Products */}
      <section id="products" className="products section">
        <div className="container-custom">
          <div className="section-header">
            <span className="section-label">产品</span>
            <h2 className="section-title">全栈式企业数字产品</h2>
            <p className="section-desc">
              从基础架构到智能应用，模块化产品组合灵活满足不同规模企业的需求。
            </p>
          </div>

          {loading ? (
            <LoadingBlock />
          ) : error ? (
            <ErrorBlock message={error} />
          ) : (
            <>
              <div className="product-grid">
                {products.length === 0 ? (
                  <div style={{ color: 'var(--mute)', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>
                    暂无产品信息
                  </div>
                ) : (
                  products.map((product) => {
                    const key = getProductKey(product.name);
                    return (
                      <article key={product.id} className="product-card" data-product={key}>
                        <div className={`product-icon ${productIconClass[key] || 'cloud-icon'}`}>
                          {key === 'cloud' && (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                              <path d="M4 16a4 4 0 0 1-1-7.87 4 4 0 0 1 7.75-1.24A6 6 0 1 1 18 16H4" />
                            </svg>
                          )}
                          {key === 'ai' && (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                              <circle cx="12" cy="5" r="3" />
                              <circle cx="5" cy="19" r="3" />
                              <circle cx="19" cy="19" r="3" />
                              <path d="M8.5 15.5L12 7l3.5 8.5" />
                            </svg>
                          )}
                          {key === 'data' && (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                              <rect x="2" y="2" width="8" height="8" rx="1" />
                              <rect x="14" y="2" width="8" height="8" rx="1" />
                              <rect x="2" y="14" width="8" height="8" rx="1" />
                              <rect x="14" y="14" width="8" height="8" rx="1" />
                            </svg>
                          )}
                          {key === 'security' && (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                          )}
                        </div>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <Link href={`/products/${product.id}`} className="card-link">
                          了解详情 <span className="arrow">&rarr;</span>
                        </Link>
                      </article>
                    );
                  })
                )}
              </div>

              <div className="comparison-section">
                <div className="comparison-header">
                  <h3 className="comparison-title">产品能力对比</h3>
                </div>
                <div className="comparison-table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>维度</th>
                        <th>云原生平台</th>
                        <th>AI 智能引擎</th>
                        <th>数据中枢</th>
                        <th>安全护盾</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>核心能力</td>
                        <td>弹性计算与多云管理</td>
                        <td>大模型推理与训练</td>
                        <td>数据集成与治理</td>
                        <td>零信任安全架构</td>
                      </tr>
                      <tr>
                        <td>部署方式</td>
                        <td>公有云 / 私有云 / 混合云</td>
                        <td>云端 / 本地化</td>
                        <td>云端 / 本地化</td>
                        <td>SaaS / 私有化</td>
                      </tr>
                      <tr>
                        <td>典型收益</td>
                        <td>降低 40% IT 成本</td>
                        <td>提升 3x 业务效率</td>
                        <td>数据时间减少 70%</td>
                        <td>安全事件减少 90%</td>
                      </tr>
                      <tr>
                        <td>目标用户</td>
                        <td>IT 运维 · 架构师</td>
                        <td>数据科学家 · 业务线</td>
                        <td>数据工程师 · 分析师</td>
                        <td>安全团队 · 合规官</td>
                      </tr>
                      <tr>
                        <td>SLA</td>
                        <td>99.99%</td>
                        <td>99.95%</td>
                        <td>99.95%</td>
                        <td>99.99%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Cases */}
      <section id="cases" className="cases section">
        <div className="container-custom">
          <div className="section-header light">
            <span className="section-label">案例研究</span>
            <h2 className="section-title">客户成功故事</h2>
            <p className="section-desc">全球领先企业如何借助 ShangTech 实现业务突破。</p>
          </div>

          {loading ? (
            <LoadingBlock />
          ) : error ? (
            <ErrorBlock message={error} />
          ) : (
            <div className="carousel" id="caseCarousel">
              <button className="carousel-btn prev" onClick={handlePrev} aria-label="上一个">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <div className="carousel-track-wrapper">
                <div className="carousel-track" ref={trackRef} style={{ transform: `translateX(-${caseIndex * 344}px)` }}>
                  {cases.length === 0 ? (
                    <div style={{ color: 'var(--mute)', textAlign: 'center', padding: '2rem 0', width: '100%' }}>
                      暂无案例信息
                    </div>
                  ) : (
                    cases.map((caseItem) => (
                      <article key={caseItem.id} className="case-card">
                        <div className="case-card-body">
                          <span className="case-tag">{caseItem.clientName}</span>
                          <h3>{caseItem.projectName}</h3>
                          <p>{caseItem.projectSummary}</p>
                        </div>
                        <div className="case-card-footer">
                          <Link href={`/cases/${caseItem.id}`} className="btn btn-text">
                            阅读完整案例 <span className="arrow">&rarr;</span>
                          </Link>
                          <div className={`case-thumb ${getCaseThumbClass(caseItem.clientName)}`}></div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
              <button className="carousel-btn next" onClick={handleNext} aria-label="下一个">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}

          {cases.length > 1 && (
            <div className="carousel-dots">
              {cases.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === caseIndex ? 'active' : ''}`}
                  onClick={() => setCaseIndex(idx)}
                  aria-label={`跳转到第 ${idx + 1} 个案例`}
                ></button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Insights */}
      <section id="insights" className="insights section">
        <div className="container-custom">
          <div className="section-header">
            <span className="section-label">洞察</span>
            <h2 className="section-title">前沿洞察</h2>
            <p className="section-desc">来自 ShangTech 专家团队、行业领袖与研究者的深度观点。</p>
          </div>

          {loading ? (
            <LoadingBlock />
          ) : error ? (
            <ErrorBlock message={error} />
          ) : (
            <>
              <div className="insights-filter">
                <button className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>
                  全部
                </button>
                <button className={`filter-btn ${activeCategory === 'technology' ? 'active' : ''}`} onClick={() => setActiveCategory('technology')}>
                  技术趋势
                </button>
                <button className={`filter-btn ${activeCategory === 'industry' ? 'active' : ''}`} onClick={() => setActiveCategory('industry')}>
                  行业观察
                </button>
                <button className={`filter-btn ${activeCategory === 'leadership' ? 'active' : ''}`} onClick={() => setActiveCategory('leadership')}>
                  领导力
                </button>
              </div>

              <div className="insights-grid">
                {filteredInsights.length === 0 ? (
                  <div style={{ color: 'var(--mute)', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>
                    暂无洞察信息
                  </div>
                ) : (
                  filteredInsights.map((insight) => (
                    <a
                      key={insight.id}
                      className="insight-card"
                      data-category={insight.category}
                      href={insight.url || '#'}
                      target={insight.url ? '_blank' : undefined}
                      rel={insight.url ? 'noopener noreferrer' : undefined}
                    >
                      <div
                        className={`insight-image ${categoryImageClass[insight.category] || 'tech-img'}`}
                        style={insight.coverImage ? { backgroundImage: `url(${insight.coverImage})`, backgroundSize: 'cover' } : undefined}
                      ></div>
                      <div className="insight-content">
                        <span className="insight-cat">{categoryLabels[insight.category] || '洞察'}</span>
                        <h3>{insight.title}</h3>
                        <p>{insight.summary}</p>
                        <div className="author-row">
                          <span className="author-avatar">
                            {insight.authorAvatar || getInitials(insight.authorName || '')}
                          </span>
                          <div>
                            <span className="author-name">{insight.authorName || 'ShangTech'}</span>
                            <span className="author-role">{insight.authorRole || '专家'}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Investors */}
      <section id="investors" className="investors section">
        <div className="container-custom">
          <div className="section-header light">
            <span className="section-label">投资者与新闻</span>
            <h2 className="section-title">公司动态与财务透明</h2>
            <p className="section-desc">获取 ShangTech 最新财报、新闻稿与投资者资料。</p>
          </div>

          <div className="investor-grid">
            <div className="investor-card highlights">
              <span className="highlight-label">2026 第一季度亮点</span>
              <div className="metric-row">
                <div className="metric">
                  <strong>¥12.8亿</strong>
                  <span>营收</span>
                </div>
                <div className="metric">
                  <strong>34%</strong>
                  <span>同比增长</span>
                </div>
                <div className="metric">
                  <strong>¥2.1亿</strong>
                  <span>研发投入</span>
                </div>
              </div>
            </div>

            <div className="investor-card">
              <h3 className="investor-subtitle">最新新闻</h3>
              <ul className="news-list">
                <li>
                  <span className="news-date">06.15</span>
                  <a href="#">ShangTech 发布新一代企业大模型 ShangMind 3.0</a>
                </li>
                <li>
                  <span className="news-date">05.22</span>
                  <a href="#">与东南亚领先银行签署战略合作协议</a>
                </li>
                <li>
                  <span className="news-date">04.08</span>
                  <a href="#">入选 Gartner 云原生平台魔力象限</a>
                </li>
              </ul>
            </div>

            <div className="investor-card">
              <h3 className="investor-subtitle">可下载报告</h3>
              <ul className="report-list">
                <li>
                  <span className="report-title">2025 年度财报</span>
                  <a href="#" className="btn btn-small">
                    下载 PDF
                  </a>
                </li>
                <li>
                  <span className="report-title">2026 Q1 投资者简报</span>
                  <a href="#" className="btn btn-small">
                    下载 PDF
                  </a>
                </li>
                <li>
                  <span className="report-title">ESG 可持续发展报告</span>
                  <a href="#" className="btn btn-small">
                    下载 PDF
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="cta section">
        <div className="container-custom cta-inner">
          <span className="section-label cta-label">联系我们</span>
          <h2 className="cta-title">准备好开启数字化转型了吗？</h2>
          <p className="cta-desc">联系 ShangTech 专家团队，获取量身定制的解决方案。</p>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
