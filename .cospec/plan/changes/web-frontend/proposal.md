# Web前台展示页面实现提案

## 变更原因
ShangTech官网需要面向公众的展示页面，用于展示产品、案例和企业形象，提升品牌影响力和客户信任度。

## 变更内容
### 公共组件
- Header.tsx: 导航栏组件，包含Logo和导航链接
- Footer.tsx: 页脚组件，包含公司信息和联系方式

### 页面实现
1. **首页** (apps/web/src/app/page.tsx)
   - Hero区域：公司介绍和核心价值主张
   - 产品展示区：展示已发布的产品
   - 案例展示区：展示已发布的案例
   - 公司优势区：展示技术实力和服务优势
   - 联系信息区：公司联系方式

2. **产品展示页面** (apps/web/src/app/products/page.tsx)
   - 展示所有已发布的产品列表
   - 卡片式布局
   - 跳转到产品详情

3. **产品详情页面** (apps/web/src/app/products/[id]/page.tsx)
   - 显示产品完整信息
   - 技术参数表格
   - 应用场景展示

4. **案例展示页面** (apps/web/src/app/cases/page.tsx)
   - 展示所有已发布的案例列表
   - 卡片式布局
   - 跳转到案例详情

5. **案例详情页面** (apps/web/src/app/cases/[id]/page.tsx)
   - 分区块展示案例完整信息
   - 项目成果可视化

## 影响分析
### 文件新增
- apps/web/src/components/Header.tsx
- apps/web/src/components/Footer.tsx
- apps/web/src/app/products/page.tsx
- apps/web/src/app/products/[id]/page.tsx
- apps/web/src/app/cases/page.tsx
- apps/web/src/app/cases/[id]/page.tsx

### 文件修改
- apps/web/src/app/page.tsx (更新首页内容)
- apps/web/src/app/layout.tsx (添加Header和Footer)

### 依赖项
- 调用 GET /api/products?status=published API
- 调用 GET /api/cases?status=published API
- 调用 GET /api/products/:id API
- 调用 GET /api/cases/:id API

### 风险评估
- 低风险：所有API已存在且已测试
- 需要确保响应式设计在不同设备上的兼容性