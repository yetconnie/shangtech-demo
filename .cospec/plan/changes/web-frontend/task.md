# Web前台展示页面实现任务清单

## 阶段1：公共组件开发
- [x] 1.1 创建Header组件 (apps/web/src/components/Header.tsx)
  - 创建导航栏组件，包含Logo和导航链接（首页、产品、案例）
  - 使用Tailwind CSS实现样式
  - 实现响应式设计（移动端汉堡菜单）
  - 主题色：钴蓝 #0047AB、深灰 #333333

- [x] 1.2 创建Footer组件 (apps/web/src/components/Footer.tsx)
  - 创建页脚组件，包含公司信息、联系方式、版权信息
  - 使用Tailwind CSS实现样式
  - 响应式设计

- [x] 1.3 更新布局文件 (apps/web/src/app/layout.tsx)
  - 导入Header和Footer组件
  - 更新metadata信息
  - 构建页面整体布局结构

## 阶段2：首页实现
- [x] 2.1 更新首页 (apps/web/src/app/page.tsx)
  - Hero区域：公司介绍和核心价值主张
  - 产品展示区：调用 GET /api/products?status=published
  - 案例展示区：调用 GET /api/cases?status=published
  - 公司优势区：展示技术实力和服务优势
  - 联系信息区：公司联系方式
  - 使用现代企业科技美学风格
  - 响应式设计

## 阶段3：产品页面实现
- [x] 3.1 创建产品列表页面 (apps/web/src/app/products/page.tsx)
  - 调用 GET /api/products?status=published API
  - 使用卡片式布局展示产品
  - 每个产品卡片包含：名称、描述、特点标签
  - 实现点击跳转到产品详情页面
  - 响应式设计

- [x] 3.2 创建产品详情页面 (apps/web/src/app/products/[id]/page.tsx)
  - 调用 GET /api/products/:id API
  - 显示产品完整信息
  - 使用表格展示技术参数
  - 使用卡片展示应用场景
  - 包含返回按钮
  - 响应式设计

## 阶段4：案例页面实现
- [x] 4.1 创建案例列表页面 (apps/web/src/app/cases/page.tsx)
  - 调用 GET /api/cases?status=published API
  - 使用卡片式布局展示案例
  - 每个案例卡片包含：客户Logo、客户名称、项目名称、项目概述
  - 实现点击跳转到案例详情页面
  - 响应式设计

- [x] 4.2 创建案例详情页面 (apps/web/src/app/cases/[id]/page.tsx)
  - 调用 GET /api/cases/:id API
  - 分区块展示：客户背景、挑战与问题、解决方案、实施过程、项目成果、客户评价
  - 项目成果使用可视化展示
  - 包含返回按钮
  - 响应式设计

## 技术约束
- 所有页面使用 'use client' 声明为客户端组件
- 使用 fetch 调用 http://localhost:4000/api API（公开接口，无需认证）
- 使用 Next.js 14 App Router
- 使用 Tailwind CSS
- 主题色：钴蓝 #0047AB、深灰 #333333、银色 #C0C0C0
- 响应式设计（适配移动端和桌面端）
- 现代企业科技美学风格

## Bug修复任务
- [x] fix-1: 修复首页API响应处理 - 访问.data字段获取实际数据
- [x] fix-2: 修复产品列表页面API响应处理 - 访问.data字段获取实际数据
- [x] fix-3: 修复产品详情页面API响应处理 - 访问.data字段获取实际数据
- [x] fix-4: 修复案例列表页面API响应处理 - 访问.data字段获取实际数据
- [x] fix-5: 修复案例详情页面API响应处理 - 访问.data字段获取实际数据