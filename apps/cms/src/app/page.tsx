export default function Home() {
  return (
    <main className="admin-container">
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-sans text-sm">
          <h1 className="text-4xl font-bold text-cobalt-blue mb-8">
            上科官网管理后台
          </h1>
          <p className="text-dark-gray text-lg mb-8">
            CMS后台管理系统
          </p>
          <a
            href="/login"
            className="admin-button inline-block"
          >
            进入登录
          </a>
        </div>
      </div>
    </main>
  );
}