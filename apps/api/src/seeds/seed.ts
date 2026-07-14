// 数据库种子数据初始化脚本
// 用法: npx tsx apps/api/src/seeds/seed.ts
//
// 数据来源: apps/api/src/seeds/data/
//   products.ts   — 30 条产品数据
//   cases.ts      — 30 条案例数据
//   insights.ts   — 30 条洞察数据
//   inquiries.ts  — 10 条询盘数据

import Database from 'better-sqlite3';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { products } from './data/products';
import { cases } from './data/cases';
import { insights } from './data/insights';
import { inquiries } from './data/inquiries';

const DB_PATH = path.resolve(__dirname, '../../data/shangtech.db');

function seed() {
  console.log('正在连接数据库:', DB_PATH);
  const db = new Database(DB_PATH);

  // 启用 WAL 模式提升性能
  db.pragma('journal_mode = WAL');

  // 检查是否已有数据，避免重复初始化
  const userCount = db.prepare('SELECT count(*) as cnt FROM users').get() as { cnt: number };
  if (userCount.cnt > 0) {
    console.log('数据库已有数据 (users: ' + userCount.cnt + ')，跳过种子初始化。');
    console.log('如需重新初始化，请删除数据库文件后重试: rm apps/api/data/shangtech.db');
    db.close();
    return;
  }

  console.log('开始写入种子数据...\n');

  // ========== 1. 管理员用户 ==========
  const adminId = uuidv4();
  const passwordHash = bcrypt.hashSync('admin123', 10);
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO users (id, username, password_hash, email, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(adminId, 'admin', passwordHash, 'admin@shangtech.com', 'admin', now, now);

  // 编辑用户
  const editorId = uuidv4();
  const editorHash = bcrypt.hashSync('editor123', 10);
  db.prepare(`
    INSERT INTO users (id, username, password_hash, email, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(editorId, 'editor', editorHash, 'editor@shangtech.com', 'editor', now, now);

  console.log('  ✓ 创建用户: 2 个 (admin, editor)');

  // ========== 2. 产品数据 ==========
  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, description, features, technical_params, application_scenarios, images, documents, status, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)
  `);

  const insertProducts = db.transaction(() => {
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      insertProduct.run(
        uuidv4(), p.name, p.description,
        JSON.stringify(p.features), JSON.stringify(p.technicalParams),
        JSON.stringify(p.applicationScenarios), JSON.stringify(p.images),
        JSON.stringify(p.documents), i, now, now,
      );
    }
  });
  insertProducts();
  console.log('  ✓ 创建产品: ' + products.length + ' 个');

  // ========== 3. 案例数据 ==========
  const insertCase = db.prepare(`
    INSERT INTO cases (id, client_name, project_name, project_summary, client_background, challenges, solution, implementation, results, client_testimonial, images, videos, status, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)
  `);

  const insertCases = db.transaction(() => {
    for (let i = 0; i < cases.length; i++) {
      const c = cases[i];
      insertCase.run(
        uuidv4(), c.clientName, c.projectName,
        c.projectSummary, c.clientBackground, c.challenges,
        c.solution, c.implementation, JSON.stringify(c.results),
        null, JSON.stringify(c.images), JSON.stringify(c.videos),
        i, now, now,
      );
    }
  });
  insertCases();
  console.log('  ✓ 创建案例: ' + cases.length + ' 个');

  // ========== 4. 洞察文章数据 ==========
  const insertInsight = db.prepare(`
    INSERT INTO insights (id, title, summary, category, status, cover_image, author_name, author_role, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?)
  `);

  const insertInsights = db.transaction(() => {
    for (let i = 0; i < insights.length; i++) {
      const ins = insights[i];
      insertInsight.run(
        uuidv4(), ins.title, ins.summary,
        ins.category, ins.coverImage,
        ins.authorName, ins.authorRole,
        i, now, now,
      );
    }
  });
  insertInsights();
  console.log('  ✓ 创建洞察: ' + insights.length + ' 篇');

  // ========== 5. 询盘数据 ==========
  const insertInquiry = db.prepare(`
    INSERT INTO inquiries (id, name, company, position, email, phone, product_interest, message, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertInquiries = db.transaction(() => {
    for (let i = 0; i < inquiries.length; i++) {
      const inq = inquiries[i];
      insertInquiry.run(
        uuidv4(), inq.name, inq.company,
        inq.position, inq.email, inq.phone,
        inq.productInterest, inq.message,
        inq.status, now, now,
      );
    }
  });
  insertInquiries();
  console.log('  ✓ 创建询盘: ' + inquiries.length + ' 条');

  // ========== 汇总 ==========
  db.close();
  console.log('\n========================================');
  console.log('  种子数据初始化完成！');
  console.log('========================================');
  console.log('  用户:   2 个 (admin / editor)');
  console.log('  产品:   ' + products.length + ' 个 (6大领域)');
  console.log('  案例:   ' + cases.length + ' 个 (10+行业)');
  console.log('  洞察:   ' + insights.length + ' 篇 (3分类)');
  console.log('  询盘:   ' + inquiries.length + ' 条');
  console.log('----------------------------------------');
  console.log('  管理员: admin@shangtech.com / admin123');
  console.log('  编辑:   editor@shangtech.com / editor123');
  console.log('========================================\n');
}

seed();
