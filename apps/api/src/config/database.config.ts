import { registerAs } from '@nestjs/config';

// 数据库类型：better-sqlite3（本地开发）或 postgres（生产环境）
export type DatabaseType = 'better-sqlite3' | 'postgres';

export const databaseConfig = registerAs('database', () => {
  const type: DatabaseType = (process.env.DATABASE_TYPE as DatabaseType) || 'better-sqlite3';

  if (type === 'better-sqlite3') {
    return {
      type,
      database: process.env.DATABASE_PATH || './data/shangtech.db',
      synchronize: process.env.NODE_ENV === 'development',
      logging: false,
    };
  }

  // PostgreSQL 配置（保留向后兼容）
  return {
    type,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'your_password_here',
    database: process.env.DATABASE_NAME || 'shangtech_website',
    synchronize: process.env.NODE_ENV === 'development',
    logging: false,
  };
});
