# 产品管理页面实现

## 变更原因
CMS后台缺少产品管理功能，需要实现完整的产品CRUD操作界面。

## 变更内容
实现CMS后台的产品管理模块，包括：
1. 产品列表页面 - 展示所有产品，支持筛选和操作
2. 新增产品页面 - 创建新产品
3. 编辑产品页面 - 修改现有产品
4. 产品详情页面 - 查看产品详细信息

## 技术方案
- 使用Next.js 14 App Router
- 使用Tailwind CSS进行样式设计
- 主题色：钴蓝 #0047AB
- 使用fetch调用 http://localhost:4000/api/products API
- 从localStorage获取auth_token进行身份验证
- 所有页面使用'use client'客户端组件

## 影响范围
- 新增文件：
  - apps/cms/src/app/products/page.tsx（产品列表）
  - apps/cms/src/app/products/new/page.tsx（新增产品）
  - apps/cms/src/app/products/[id]/edit/page.tsx（编辑产品）
  - apps/cms/src/app/products/[id]/page.tsx（产品详情）