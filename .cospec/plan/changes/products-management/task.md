# 产品管理页面实现任务清单

## 阶段1：产品列表页面
- [x] 1.1 创建产品列表页面 (apps/cms/src/app/products/page.tsx)
  - 显示所有产品列表
  - 实现状态筛选功能（draft/published/offline）
  - 实现查看、编辑、删除操作按钮
  - 使用表格展示产品信息
  - 添加"新增产品"按钮跳转到新增页面

## 阶段2：新增产品页面
- [x] 2.1 创建新增产品页面 (apps/cms/src/app/products/new/page.tsx)
  - 创建产品表单，包含字段：name, description, features, technicalParams, applicationScenarios, status
  - 实现表单提交，调用 POST /api/products API
  - 使用Tailwind CSS样式
  - 添加表单验证

## 阶段3：编辑产品页面
- [x] 3.1 创建编辑产品页面 (apps/cms/src/app/products/[id]/edit/page.tsx)
  - 加载现有产品数据
  - 允许编辑所有字段
  - 实现表单提交，调用 PUT /api/products/:id API
  - 添加加载状态和错误处理

## 阶段4：产品详情页面
- [x] 4.1 创建产品详情页面 (apps/cms/src/app/products/[id]/page.tsx)
  - 显示产品详细信息
  - 包含编辑和删除按钮
  - 实现删除确认功能

## 技术约束
- 所有页面使用 'use client' 声明为客户端组件
- 使用 fetch 调用 http://localhost:4000/api/products API
- 从 localStorage 获取 auth_token 添加到请求头
- 主题色使用钴蓝 #0047AB
- 使用 Next.js 14 App Router 路由系统