# Database Guidelines

> TypeORM 双数据库（SQLite 本地 / PostgreSQL 生产）配置规范。

---

## Overview

- **ORM**: TypeORM 0.3.x，通过 `@nestjs/typeorm` 集成
- **本地开发**: `better-sqlite3`（轻量、零配置）
- **生产环境**: PostgreSQL（通过 `pg` 驱动）
- **切换方式**: 通过 `DATABASE_TYPE` 环境变量控制，无需改代码

---

## Scenario: 双数据库驱动配置

### 1. Scope / Trigger

数据库驱动选择涉及 4 层：环境变量 → Config 注册 → AppModule TypeORM 初始化 → 实体类型兼容。
新增或修改数据库字段时必须检查跨层一致性。

### 2. Signatures

**database.config.ts**:
```typescript
export type DatabaseType = 'better-sqlite3' | 'postgres';

// 注册命名空间 'database'，根据 DATABASE_TYPE 返回不同配置
export const databaseConfig = registerAs('database', () => {
  const type: DatabaseType =
    (process.env.DATABASE_TYPE as DatabaseType) || 'better-sqlite3';

  if (type === 'better-sqlite3') {
    return {
      type,
      database: process.env.DATABASE_PATH || './data/shangtech.db',
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    };
  }

  return {
    type,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'your_password_here',
    database: process.env.DATABASE_NAME || 'shangtech_website',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  };
});
```

**app.module.ts**:
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const dbType = (configService.get<string>('database.type')
      as 'better-sqlite3' | 'postgres') || 'better-sqlite3';
    const isSQLite = dbType === 'better-sqlite3';

    return {
      type: dbType,
      ...(isSQLite
        ? { database: configService.get<string>('database.database') }
        : {
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            username: configService.get<string>('database.username'),
            password: configService.get<string>('database.password'),
            database: configService.get<string>('database.database'),
          }),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: configService.get<boolean>('database.synchronize'),
      logging: configService.get<boolean>('database.logging'),
    };
  },
  inject: [ConfigService],
});
```

### 3. Contracts

**环境变量（必需）**:
| Key | 类型 | 必需 | 说明 |
|-----|------|------|------|
| `DATABASE_TYPE` | `'better-sqlite3'` \| `'postgres'` | 是 | 驱动类型，默认 `better-sqlite3` |
| `DATABASE_PATH` | string | SQLite 时必需 | SQLite 数据库文件路径，默认 `./data/shangtech.db` |
| `DATABASE_HOST` | string | PostgreSQL 时必需 | 数据库主机地址 |
| `DATABASE_PORT` | number | PostgreSQL 时必需 | 数据库端口，默认 5432 |
| `DATABASE_USERNAME` | string | PostgreSQL 时必需 | 数据库用户名 |
| `DATABASE_PASSWORD` | string | PostgreSQL 时必需 | 数据库密码 |
| `DATABASE_NAME` | string | PostgreSQL 时必需 | 数据库名称 |

**ConfigService 路径**:
| 路径 | 类型 | 来源 |
|------|------|------|
| `database.type` | `'better-sqlite3'` \| `'postgres'` | `DATABASE_TYPE` env |
| `database.database` | string | `DATABASE_PATH` 或 `DATABASE_NAME` env |
| `database.host` | string | `DATABASE_HOST` env（仅 PostgreSQL） |
| `database.port` | number | `DATABASE_PORT` env（仅 PostgreSQL） |
| `database.username` | string | `DATABASE_USERNAME` env（仅 PostgreSQL） |
| `database.password` | string | `DATABASE_PASSWORD` env（仅 PostgreSQL） |
| `database.synchronize` | boolean | `NODE_ENV === 'development'` |
| `database.logging` | boolean | `NODE_ENV === 'development'` |

### 4. Validation & Error Matrix

| 条件 | 错误 |
|------|------|
| `DATABASE_TYPE=sqlite`（错误的类型字符串） | `DriverPackageNotInstalledError: SQLite package has not been found installed.` — TypeORM 将 `"sqlite"` 路由到 `SqliteDriver`，需要 `sqlite3` 包 |
| `DATABASE_TYPE=better-sqlite3` 但未安装 `better-sqlite3` 包 | `DriverPackageNotInstalledError: better-sqlite3 package has not been found installed.` |
| 实体使用 `@Column('jsonb')` + SQLite 驱动 | 运行时类型不匹配，SQLite 不支持 JSONB |
| 实体使用 `@Column('timestamp')` + SQLite 驱动 | 运行时类型不匹配，SQLite 使用 DATETIME |
| 实体使用 `@Column('uuid')` 在外键列 + SQLite 驱动 | SQLite 无 UUID 原生类型，应用层需自行生成 |

### 5. Good/Base/Bad Cases

**Good — 正确配置**:
```env
DATABASE_TYPE=better-sqlite3
DATABASE_PATH=./data/shangtech.db
```

**Base — PostgreSQL 生产配置**:
```env
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=shangtech
DATABASE_PASSWORD=shangtech123
DATABASE_NAME=shangtech_website
```

**Bad — 错误的类型字符串**:
```env
# 这会让 TypeORM 寻找 sqlite3 包而非 better-sqlite3
DATABASE_TYPE=sqlite
```

### 6. Tests Required

- **单元测试**: `database.config.ts` — `DATABASE_TYPE=better-sqlite3` 返回 `{ type, database }`；`DATABASE_TYPE=postgres` 返回 `{ type, host, port, ... }`
- **集成测试**: 服务启动后验证 SQLite 数据库文件在 `DATABASE_PATH` 自动创建
- **集成测试**: 实体 CRUD 操作在两种数据库类型下均正常

### 7. Wrong vs Correct

#### Wrong — 手动指定 driver 选项
```typescript
// 当 type: "better-sqlite3" 时不需要这行
driver: require('better-sqlite3'),
```
**问题**: TypeORM 根据 `type` 字符串自动加载对应驱动，手动指定 `driver` 是多余的，可能导致类型冲突。

#### Correct — 仅设置 type
```typescript
{
  type: 'better-sqlite3',
  database: './data/shangtech.db',
}
```

---

## 实体类型兼容性

SQLite 不支持某些 PostgreSQL 类型。编写实体时必须使用两种数据库都兼容的类型：

| PostgreSQL 类型 | SQLite 兼容类型 | TypeORM 装饰器 |
|----------------|----------------|----------------|
| `jsonb` | TEXT (JSON) | `@Column('simple-json')` |
| `timestamp` | DATETIME | `@Column('datetime')` |
| `uuid`（外键列） | VARCHAR | `@Column('varchar')` |
| `uuid`（主键） | VARCHAR | `@PrimaryGeneratedColumn('uuid')` — 安全，TypeORM 在应用层生成 UUID |

### Common Mistake: 混用 jsonb 和 simple-json

**Symptom**: SQLite 下 `@Column('jsonb')` 的字段在数据库中存储为空或报错。

**Cause**: SQLite 没有 JSONB 二进制类型，`simple-json` 将对象序列化为 JSON 字符串存储。

**Fix**: 将所有 `@Column('jsonb')` 改为 `@Column('simple-json')`，TypeORM 自动处理序列化/反序列化。

**Prevention**: 添加新实体列时，检查现有实体中的类似字段使用什么类型，保持一致。

---

## Package 依赖

| 环境 | 包 | 版本 |
|------|-----|------|
| 本地开发 | `better-sqlite3` | `^11.0.0` |
| 生产 | `pg` | 按需安装 |
| ORM | `typeorm` | `^0.3.20` |
| NestJS 集成 | `@nestjs/typeorm` | `^10.0.2` |

> **Warning**: `sqlite3` 包在 Node.js v22 Windows 上原生绑定编译失败，必须使用 `better-sqlite3`。
>
> TypeORM 0.3.x 有两个 SQLite 驱动：`SqliteDriver`（type=`"sqlite"`，需要 `sqlite3` 包）和 `BetterSqlite3Driver`（type=`"better-sqlite3"`，需要 `better-sqlite3` 包）。两者不通用！

---

## Query Patterns

所有数据访问使用 TypeORM Repository / QueryBuilder API，不写原始 SQL，确保跨数据库兼容。

```typescript
// Good — 跨数据库兼容
this.repository.find({ where: { status: 'published' } });
this.repository.createQueryBuilder('entity').where('entity.status = :status', { status: 'published' });

// Bad — 原始 SQL 可能不兼容 SQLite 和 PostgreSQL
this.entityManager.query('SELECT * FROM products WHERE features->>'$.color' = 'red'');
```

---

## Common Mistakes

1. **用 `type: "sqlite"` 代替 `type: "better-sqlite3"`**
   - TypeORM 会将 `"sqlite"` 路由到 `SqliteDriver`（需要 `sqlite3` 包），而非 `BetterSqlite3Driver`
   - 始终使用 `"better-sqlite3"` 作为类型字符串

2. **新增实体字段忘记考虑类型兼容性**
   - 添加字段前检查现有实体的类似字段用了什么类型
   - 避免使用 `jsonb`、`timestamp`、外键 `uuid` — 它们在 SQLite 下不工作

3. **修改数据库配置但不同步更新 .env.example**
   - `.env` 和 `.env.example` 中 `DATABASE_TYPE` 必须一致
   - .env.example 应包含注释说明 PostgreSQL 配置块
