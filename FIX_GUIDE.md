# ShangTech官网启动问题修复方案

## 当前问题

**错误**: `Error: Cannot find module 'typeorm'`

**原因**: npm包安装不完整，typeorm模块缺少关键文件

## 解决方案

### 方案一：使用pnpm安装（推荐）

pnpm对monorepo支持更好，包管理更可靠：

```bash
# 1. 安装pnpm（如果没有）
npm install -g pnpm

# 2. 删除现有node_modules
Remove-Item node_modules -Recurse -Force
Remove-Item apps/api/node_modules -Recurse -Force
Remove-Item apps/cms/node_modules -Recurse -Force
Remove-Item apps/web/node_modules -Recurse -Force

# 3. 使用pnpm重新安装
pnpm install

# 4. 启动服务
pnpm run dev
```

### 方案二：手动下载typeorm包

如果npm持续报错，可以手动处理：

```bash
# 1. 从npm registry直接下载
Invoke-WebRequest -Uri "https://registry.npmjs.org/typeorm/-/typeorm-0.3.20.tgz" -OutFile "typeorm.tgz"

# 2. 解压到node_modules
tar -xzf typeorm.tgz
Move-Item package node_modules/typeorm

# 3. 启动服务
npm run dev
```

### 方案三：降级Node版本

Node.js v24.11.0是实验版本，可能存在兼容性问题：

```bash
# 建议使用Node.js 18 LTS或20 LTS
# 下载地址: https://nodejs.org/

# 安装后重新安装依赖
npm install
npm run dev
```

### 方案四：分步启动（临时方案）

先启动不依赖typeorm的服务：

```bash
# 1. 只启动Web前台
npm run dev:web

# 2. 只启动CMS前台  
npm run dev:cms

# 3. API服务暂时无法启动（需要typeorm）
```

---

## 建议

**最推荐方案一**：使用pnpm，它能更好地处理monorepo和依赖提升问题。

如果问题持续，建议检查Node版本，使用稳定的LTS版本（18.x或20.x）。

---

**生成时间**: 2026-07-01