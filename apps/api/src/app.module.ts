import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { storageConfig } from './config/storage.config';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CasesModule } from './modules/cases/cases.module';
import { InsightsModule } from './modules/insights/insights.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, storageConfig],
      envFilePath: ['../../.env', '.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = (configService.get<string>('database.type') as 'better-sqlite3' | 'postgres') || 'better-sqlite3';
        const isSQLite = dbType === 'better-sqlite3';

        return {
          type: dbType,
          // SQLite 使用 better-sqlite3 驱动，PostgreSQL 使用连接参数
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
    }),

    AuthModule,
    ProductsModule,
    CasesModule,
    InsightsModule,
    InquiriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
