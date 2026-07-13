# ShangTech官网启动指南

## 方案一：使用Docker完整环境（推荐）

### 步骤1：安装Docker Desktop
1. 访问 https://www.docker.com/products/docker-desktop/
2. 下载并安装Docker Desktop for Windows
3. 启动Docker Desktop，等待服务就绪（图标变绿）
4. 重启PowerShell终端

### 步骤2：验证Docker安装
```bash
docker --version
docker compose version
```

### 步骤3：启动数据库服务
```bash
docker compose up -d
```

等待服务启动（约1-2分钟），查看状态：
```bash
docker compose ps
```

### 步骤4：初始化数据库
```bash
docker exec -i shangtech-postgres psql -U postgres -d shangtech_website < database/init.sql
docker exec -i shangtech-postgres psql -U postgres -d shangtech_website < database/seed-admin.sql
docker exec -i shangtech-postgres psql -U postgres -d shangtech_website < database/seed-data.sql
```

### 步骤5：安装API依赖
```bash
cd apps/api
npm install @nestjs/jwt @nestjs/passport passport passport-jwt @nestjs/mapped-types
cd ../..
```

### 步骤6：启动应用
```bash
npm run dev
```

### 步骤7：访问应用
- **Web前台**: http://localhost:3000
- **CMS后台**: http://localhost:3001
- **API服务**: http://localhost:4000/api

**CMS登录账号**: 
- 用户名: `admin`
- 密码: `admin123`

---

## 方案二：使用本地PostgreSQL

### 步骤1：准备PostgreSQL
确保您已安装PostgreSQL 15，并且服务正在运行。

### 步骤2：创建数据库
使用pgAdmin或命令行创建数据库：
```bash
psql -U postgres
CREATE DATABASE shangtech_website;
```

### 步骤3：配置.env文件
编辑`.env`文件，设置数据库连接信息：
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=你的密码
DATABASE_NAME=shangtech_website
```

### 步骤4：初始化数据
```bash
psql -U postgres -d shangtech_website < database/init.sql
psql -U postgres -d shangtech_website < database/seed-admin.sql
psql -U postgres -d shangtech_website < database/seed-data.sql
```

### 步骤5：安装依赖并启动
```bash
cd apps/api
npm install @nestjs/jwt @nestjs/passport passport passport-jwt @nestjs/mapped-types
cd ../..
npm run dev
```

---

## 常见问题

### 1. Docker服务启动慢？
等待2-3分钟，确保所有容器都显示为"running"状态。

### 2. 数据库连接失败？
检查.env配置和数据库密码是否正确。

### 3. API启动失败？
确保已安装所有依赖包：
```bash
npm install
```

### 4. 端口被占用？
修改.env中的端口配置（API_PORT、WEB_PORT、CMS_PORT）。

---

## 服务停止

停止所有服务：
```bash
docker compose down
npm run dev停止（Ctrl+C）
```

数据会保留在Docker volume中，下次启动自动恢复。