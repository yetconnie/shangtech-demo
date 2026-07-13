import { registerAs } from '@nestjs/config';

export const storageConfig = registerAs('storage', () => ({
  endpoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  accessKey: process.env.MINIO_ACCESS_KEY || 'your_access_key_here',
  secretKey: process.env.MINIO_SECRET_KEY || 'your_secret_key_here',
  useSSL: process.env.MINIO_USE_SSL === 'true',
  bucket: process.env.MINIO_BUCKET || 'shangtech-website',
}));