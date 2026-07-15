# 上科官网项目

## 项目简介

上科官网是一个企业级网站管理系统，采用 Monorepo 架构，包含访客前台展示、管理员后台管理和 API 服务三个核心应用。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **Web 前台** | Next.js 14 + React 18 + TypeScript 5 + Tailwind CSS 3 | 访客展示页（端口 3000） |
| **CMS 后台** | Next.js 14 + React 18 + TypeScript 5 | 内容管理后台（端口 3001） |
| **API 服务** | NestJS 10 + TypeORM 0.3 + TypeScript 5 | REST API（端口 4000） |
| **数据库** | SQLite (better-sqlite3) / PostgreSQL 15 | 开发默认 SQLite，生产切 PostgreSQL |
| **文件存储** | MinIO | 可选，本地开发可不启用 |
| **基础设施** | Elasticsearch 8 + Redis 7 | 通过 Docker Compose 可选启动 |

## 项目结构

```
shangtech-website/
├── apps/
│   ├── web/                  # 访客前台 (Next.js, 端口 3000)
│   ├── cms/                  # 管理后台 (Next.js, 端口 3001)
│   └── api/                  # API 服务 (NestJS, 端口 4000)
│       └── src/
│           ├── config/       # 配置文件
│           └── modules/
│               ├── auth/         # 认证模块 (JWT)
│               ├── products/     # 产品管理
│               ├── cases/        # 案例管理
│               ├── insights/     # 行业洞察
│               ├── inquiries/    # 在线咨询
│               └── upload/       # 文件上传
├── database/                 # 数据库脚本
│   ├── init.sql              # PostgreSQL 初始化
│   ├── seed-data.sql         # 种子数据
│   └── seed-admin.sql        # 管理员账号种子
├── docker-compose.yml        # Docker 服务编排（可选）
├── .env.example              # 环境变量模板
├── package.json              # 根项目配置 (npm workspaces)
└── README.md
```

## 快速开始

### 1. 环境要求

- **Node.js** >= 18.0.0（推荐 22.x）
- **npm** >= 9.0.0
- **Docker Desktop**（仅 PostgreSQL / MinIO / Elasticsearch / Redis 需要，本地 SQLite 开发可跳过）

### 2. 克隆项目

```bash
git clone https://github.com/y574444354/shangtech-demo.git
cd shangtech-demo
```

### 3. 安装依赖

```bash
npm install
```

命令执行过程：

1. 下载所有依赖包到 `node_modules/`
2. 为 `better-sqlite3` 编译原生 C++ 绑定（需要 C++ 编译工具链）
3. 从 `.env.example` 复制 `.env`（首次执行时）

**前置条件 — C++ 编译工具链**（`better-sqlite3` 需要）：

- **Windows**：安装 [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)（勾选"使用 C++ 的桌面开发"工作负载），还需安装 Python 3.x
- **macOS**：`xcode-select --install`
- **Linux**：`apt install build-essential python3`

> 如果全局 `.npmrc` 中有 `ignore-scripts=true`，项目根目录的 `.npmrc` 已设为 `ignore-scripts=false` 会覆盖它。如果仍然跳过了编译，见下方[常见问题](#常见问题)。

**安装耗时**：首次安装约 3-10 分钟（含原生模块编译）。后续 `npm install` 约 10-30 秒。

### 4. 配置环境变量

```bash
# 从模板创建 .env 文件
cp .env.example .env
```

**本地开发最小配置**（使用默认 SQLite，无需 Docker）：

```env
DATABASE_TYPE=better-sqlite3
DATABASE_PATH=./data/shangtech.db
JWT_SECRET=dev-secret-change-in-production
API_PORT=4000
WEB_PORT=3000
CMS_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CMS_API_URL=http://localhost:4000
```

数据库文件 `shangtech.db` 会在首次启动 API 时自动创建（TypeORM `synchronize` 已开启）。

**可选：使用 PostgreSQL + 基础设施服务**：

```bash
# 启动 PostgreSQL、MinIO、Elasticsearch、Redis
docker compose up -d

# 然后编辑 .env，将 DATABASE_TYPE 改为 postgres
# DATABASE_TYPE=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USERNAME=shangtech
# DATABASE_PASSWORD=shangtech123
# DATABASE_NAME=shangtech_website
```

### 5. 启动开发服务器

```bash
npm run dev
```

这会通过 `concurrently` 同时启动三个服务：

| 命令 | 应用 | 端口 | 技术栈 |
|------|------|------|--------|
| `npm run dev:web` | Web 前台 | 3000 | Next.js 14 |
| `npm run dev:cms` | CMS 后台 | 3001 | Next.js 14 |
| `npm run dev:api` | API 服务 | 4000 | NestJS 10 |

启动成功标志：

```
[0] ✓ Ready in Xs           ← Web 前台就绪
[1] ✓ Ready in Xs           ← CMS 后台就绪
[2] [Nest] Starting Nest application...  ← API 启动中
[2] [Nest] TypeOrmModule connected       ← 数据库连接成功
```

> API 默认使用 SQLite，首次启动会在 `apps/api/data/shangtech.db` 自动创建数据库文件。如果报 `Could not locate the bindings file`，说明 `better-sqlite3` 原生绑定未编译，参考[常见问题](#常见问题)。

也可以单独启动：

```bash
npm run dev:web    # 仅 Web 前台
npm run dev:cms    # 仅 CMS 后台
npm run dev:api    # 仅 API 服务
```

### 6. 访问应用

| 应用 | 地址 |
|------|------|
| Web 前台 | http://localhost:3000 |
| CMS 后台 | http://localhost:3001 |
| API 服务 | http://localhost:4000 |

### 7. 默认管理员账号

| 字段 | 值 |
|------|-----|
| 邮箱 | admin@shangtech.com |
| 密码 | admin123 |

> 如果使用 PostgreSQL Docker 环境，管理员账号会通过 `database/seed-admin.sql` 自动创建。

## 构建生产版本

```bash
# 构建所有应用
npm run build
```

构建流程：

1. `build:web` — Next.js 静态导出 + 客户端 JS 打包
2. `build:cms` — Next.js 管理后台构建
3. `build:api` — NestJS TypeScript 编译为 JavaScript（输出到 `apps/api/dist/`）

单独构建：

```bash
npm run build:web     # 仅 Web 前台
npm run build:cms     # 仅 CMS 后台
npm run build:api     # 仅 API 服务
```

构建产物：

| 应用 | 输出目录 |
|------|----------|
| Web | `apps/web/.next/` |
| CMS | `apps/cms/.next/` |
| API | `apps/api/dist/` |

生产环境启动（需先构建）：

```bash
npm run start

# 或单独启动
npm run start:web
npm run start:cms
npm run start:api
```

## Docker 服务说明

`docker-compose.yml` 包含以下可选服务：

| 服务 | 端口 | 说明 |
|------|------|------|
| PostgreSQL 15 | 5432 | 生产数据库 |
| Elasticsearch 8 | 9200 | 全文搜索 |
| Redis 7 | 6379 | 缓存 |
| MinIO | 9000 (API) / 9001 (Console) | 对象存储 |

```bash
# 启动全部基础设施
docker compose up -d

# 仅启动特定服务
docker compose up -d postgres minio

# 停止所有服务
docker compose down
```

## 常见问题

### `npm install` 报错 `Invalid Version`

删除 `package-lock.json` 后重新安装：

```bash
rm package-lock.json
npm install
```

### `better-sqlite3` 报错 `Could not locate the bindings file`

原因：`better-sqlite3` 的 C++ 原生 `.node` 文件未编译。可能由以下原因导致：

1. 全局 `~/.npmrc` 中 `ignore-scripts=true` 阻止了 install 脚本
2. 缺少 C++ 编译工具链（VS Build Tools / Xcode / build-essential）

**方案一（推荐）—— 直接编译**：

```bash
cd node_modules/better-sqlite3
npx --yes node-gyp rebuild --release
cd ../..
```

> 确保已安装 C++ 编译工具链，见[安装依赖](#3-安装依赖)章节的说明。

**方案二 —— 关闭 ignore-scripts 重装**：

```bash
rm -rf node_modules package-lock.json
npm install --ignore-scripts=false
```

### API 启动后数据库连接失败

- 确认 `.env` 中 `DATABASE_TYPE=better-sqlite3`（本地开发默认值）
- 如果使用 PostgreSQL，确认 Docker 容器已启动：`docker compose ps`
- SQLite 模式下数据库文件 `apps/api/data/shangtech.db` 会自动创建

### Web / CMS 页面报 API 连接错误

检查 `.env` 中的 API 地址是否正确：

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CMS_API_URL=http://localhost:4000
```

确保 API 服务已启动且端口未被占用。

## 主题色

| 颜色 | 色值 |
|------|------|
| 钴蓝 | `#0047AB` |
| 深灰 | `#333333` |
| 银色 | `#C0C0C0` |

## 开发规范

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 代码提交前通过 Lint 检查

```bash
npm run lint
npm test
```

### Git 提交规范

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 Bug |
| `docs` | 文档更新 |
| `style` | 代码格式调整 |
| `refactor` | 重构 |
| `test` | 测试相关 |
| `chore` | 构建 / 工具相关 |

## 许可证

MIT
