# PostgreSQL → SQLite 本地数据库迁移

## 目标

将开发环境数据库从 PostgreSQL 切换为 SQLite，使开发者无需安装 PostgreSQL 即可在本地运行项目。

## 变更范围

### 1. 数据库驱动替换
- 移除 `pg`（PostgreSQL 驱动）
- 添加 `better-sqlite3`（SQLite 驱动）

### 2. 数据库配置更新
- `app.module.ts`: `type: 'postgres'` → 从配置读取类型，本地默认 sqlite
- `database.config.ts`: 移除 host/port/username/password，新增 database 文件路径
- `.env` / `.env.example`: 新增 `DATABASE_TYPE=sqlite` 和 `DATABASE_PATH`

### 3. Entity 兼容性适配
- `jsonb` → `simple-json`（SQLite 不支持 jsonb）
- `uuid` 列类型 → `varchar`（SQLite 不支持原生 uuid 类型）
- 保留 `PrimaryGeneratedColumn('uuid')`（TypeORM 会在应用层生成 UUID）

### 4. 不影响的功能
- `synchronize: true` 自动建表
- ManyToMany 关联表
- QueryRunner 事务（SQLite 支持）
- DataSource API

## 验收标准
- `npm run dev:api` 启动后自动创建 sqlite 数据库文件
- TypeORM 同步建表成功，无报错
- 可通过 API 进行 CRUD 操作
