# 上科官网项目

## 项目简介

上科官网是一个企业级网站管理系统，采用Monorepo架构，包含访客前台展示、管理员后台管理和API服务三个核心应用。

## 技术栈

### 前端
- **Web前台**: Next.js 14 + React 18 + TypeScript 5 + Tailwind CSS 3
- **CMS后台**: Next.js 14 + React 18 + TypeScript 5

### 后端
- **API服务**: NestJS 10 + TypeORM 0.3 + TypeScript 5

### 数据库
- PostgreSQL 15

### 文件存储
- MinIO

## 项目结构

```
shangtech-website/
├── apps/                    # 子项目目录
│   ├── web/                # 访客前台展示应用 (端口: 3000)
│   ├── cms/                # 管理员后台应用 (端口: 3001)
│   └── api/                # API服务 (端口: 4000)
├── database/               # 数据库脚本目录
│   ├── migrations/        # 数据库迁移脚本
│   └── seeds/             # 数据库初始化脚本
├── package.json           # 根项目配置
├── .env.example           # 环境变量模板
└── README.md              # 项目说明文档
```

## 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL 15
- MinIO (可选，用于文件存储)

### 安装依赖

```bash
npm install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库、MinIO等信息
```

### 启动开发服务器

```bash
# 启动所有服务
npm run dev

# 单独启动
npm run dev:web    # Web前台
npm run dev:cms    # CMS后台
npm run dev:api    # API服务
```

### 构建生产版本

```bash
npm run build
```

## 应用端口

- **Web前台**: http://localhost:3000
- **CMS后台**: http://localhost:3001
- **API服务**: http://localhost:4000

## 主题色

- **钴蓝**: #0047AB
- **深灰**: #333333
- **银色**: #C0C0C0

## 开发规范

### 代码规范
- 使用TypeScript严格模式
- 遵循ESLint规则
- 代码提交前需通过Lint检查

### Git提交规范
- `feat`: 新功能
- `fix`: 修复Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

## 许可证

MIT