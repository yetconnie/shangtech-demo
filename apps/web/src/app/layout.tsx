import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ShangTech — 以智能技术驱动企业未来',
  description: 'ShangTech 融合云计算、人工智能与数据智能，为全球企业打造可信赖的数字化转型基础设施。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pt-[30px]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
