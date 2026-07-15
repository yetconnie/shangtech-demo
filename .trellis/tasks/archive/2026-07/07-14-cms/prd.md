# CMS 洞察详情页 & 图片上传

## 1. CMS 洞察详情页

**现状**：`apps/cms/src/app/insights/[id]/` 只有 `edit/` 子目录，缺少 `page.tsx` 详情页。

**目标**：参照 `products/[id]/page.tsx` 模式，创建洞察详情页，展示标题/摘要/分类/作者/状态/创建/更新时间。

**文件**：`apps/cms/src/app/insights/[id]/page.tsx`

## 2. 本地图片上传 API

**现状**：MinIO 已移除，无文件上传能力。

**目标**：基于 multer 实现本地文件上传，存储到 `apps/api/uploads/` 目录，通过静态文件服务提供访问。

**API 端点**：
- `POST /api/upload` — 上传图片，返回文件 URL
- `GET /uploads/:filename` — NestJS ServeStatic 提供静态文件访问

**文件**：
- `apps/api/src/modules/upload/upload.module.ts`
- `apps/api/src/modules/upload/upload.controller.ts`
- `apps/api/src/app.module.ts` — 注册 UploadModule + ServeStaticModule

**依赖**：`@nestjs/serve-static`（需安装）、`multer`（已有 @types/multer）

## 3. CMS 图片上传组件

**目标**：创建可复用的 `ImageUploader` 组件，用于产品/案例/洞察表单中的图片字段。

**文件**：`apps/cms/src/components/ImageUploader.tsx`

## 4. 集成到现有表单

**目标**：在产品和案例的创建/编辑表单中集成图片上传组件。

**文件**：
- `apps/cms/src/app/products/new/page.tsx`
- `apps/cms/src/app/products/[id]/edit/page.tsx`
- `apps/cms/src/app/cases/new/page.tsx`
- `apps/cms/src/app/cases/[id]/edit/page.tsx`
- `apps/cms/src/app/insights/new/page.tsx`
- `apps/cms/src/app/insights/[id]/edit/page.tsx`
