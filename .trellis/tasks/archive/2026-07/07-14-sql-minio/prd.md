# 关闭 SQL 日志 & 移除 MinIO 依赖

## 1. 关闭 SQL 日志输出

**现状**：`database.config.ts` 中 `logging: process.env.NODE_ENV === 'development'`，开发环境输出全部 SQL 查询日志，控制台信息量过大。

**目标**：关闭 TypeORM SQL 日志，`logging: false`。

**改动文件**：
- `apps/api/src/config/database.config.ts` — logging 改为 `false`

---

## 2. 移除 MinIO 依赖

**现状**：`storage.config.ts` 定义了 MinIO 连接配置，被 `app.module.ts` 加载，但实际业务代码（Service/Controller）中没有任何地方使用 MinIO，属于无效依赖。

**目标**：彻底移除 MinIO 相关代码和环境变量。

**改动文件**：
- `apps/api/src/config/storage.config.ts` — 删除
- `apps/api/src/app.module.ts` — 移除 storageConfig 导入和 load
- `.env` — 移除 MinIO 相关环境变量
