'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '../lib/api';

interface Product {
  id: string;
  name: string;
}

export default function Footer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/api/products?status=published');
        const data = response.data?.data || [];
        setHasMore(data.length > 4);
        setProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Footer fetch products failed:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <footer className="site-footer">
      <div className="container-custom footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <span className="logo-mark">S</span>
              <span className="logo-text">ShangTech</span>
            </Link>
            <p>以智能技术，驱动企业未来。</p>
          </div>

          <div className="footer-col">
            <h4>产品</h4>
            {products.length === 0 ? (
              <>
                <Link href="/products">云原生平台</Link>
                <Link href="/products">AI 智能引擎</Link>
                <Link href="/products">数据中枢</Link>
                <Link href="/products">安全护盾</Link>
              </>
            ) : (
              <>
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    {product.name}
                  </Link>
                ))}
                {hasMore && (
                  <Link href="/products" className="footer-more">
                    更多 →
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="footer-col">
            <h4>资源</h4>
            <Link href="/cases">案例研究</Link>
            <Link href="/#insights">洞察中心</Link>
            <Link href="/#investors">投资者关系</Link>
            <a href="#">开发者文档</a>
          </div>

          <div className="footer-col">
            <h4>公司</h4>
            <a href="#">关于我们</a>
            <a href="#">加入我们</a>
            <Link href="/#contact">联系方式</Link>
            <a href="#">隐私政策</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ShangTech. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
}
