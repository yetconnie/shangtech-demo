// 项目初始化脚本 — 检查环境并引导用户完成首次配置
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

let hasIssue = false;

// 1. 检查 .env 文件
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✓ 已从 .env.example 创建 .env 文件，请根据需要修改数据库密码等配置');
  } else {
    console.log('⚠ 未找到 .env.example 文件，请手动创建 .env 配置文件');
    hasIssue = true;
  }
} else {
  console.log('✓ .env 文件已存在');
}

// 2. 检查 .env 中的占位符是否已修改
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const placeholders = [
    'your_password_here',
    'your_access_key_here',
    'your_secret_key_here',
    'your_jwt_secret_key_here',
    'your_email@example.com',
    'your_email_password_here',
  ];
  const foundPlaceholders = placeholders.filter(p => envContent.includes(p));
  if (foundPlaceholders.length > 0) {
    console.log('⚠ .env 中存在未修改的占位符，建议编辑 .env 文件填入真实配置');
    hasIssue = true;
  }
}

// 3. 检查 Docker 服务
try {
  const { execSync } = require('child_process');
  const dockerPs = execSync('docker compose ps --format json 2>/dev/null || docker-compose ps --format json 2>/dev/null', {
    cwd: rootDir,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
  if (dockerPs) {
    console.log('✓ Docker 服务正在运行');
  } else {
    console.log('⚠ Docker 服务未启动，请运行: docker compose up -d');
    hasIssue = true;
  }
} catch {
  console.log('⚠ Docker 未安装或未运行，请安装 Docker Desktop 并运行: docker compose up -d');
  hasIssue = true;
}

console.log('');
if (hasIssue) {
  console.log('存在待处理的配置项，请根据上述提示完成配置后重新运行 npm run dev');
} else {
  console.log('项目环境配置完成，运行 npm run dev 启动开发服务');
}
