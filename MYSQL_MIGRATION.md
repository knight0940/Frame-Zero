# Frame Zero - MySQL 版本配置指南

## ✅ 项目已调整为 MySQL 数据库

项目已成功从 PostgreSQL 迁移到 MySQL，所有相关配置已更新。

---

## 📋 主要变更

### 1. Docker Compose 配置

**变更前:**
```yaml
postgres:
  image: postgres:14-alpine
  ports:
    - "5432:5432"
```

**变更后:**
```yaml
mysql:
  image: mysql:8.0
  ports:
    - "3306:3306"
```

### 2. Prisma Schema

**变更前:**
```prisma
datasource db {
  provider = "postgresql"
}

model CheckIn {
  learnings String[]
}
```

**变更后:**
```prisma
datasource db {
  provider = "mysql"
}

model CheckIn {
  learnings Json  // MySQL 不支持原生数组，使用 Json 类型
}
```

### 3. 数据库连接字符串

**变更前:**
```
postgresql://postgres:postgres@localhost:5432/frame_zero
```

**变更后:**
```
mysql://framezero:framezero@localhost:3306/frame_zero
```

---

## 🚀 快速开始（MySQL 版本）

### 方式一：使用你本地安装的 MySQL

如果你已经有本地 MySQL 环境：

#### 1. 创建数据库

```bash
mysql -u root -p
```

```sql
CREATE DATABASE frame_zero CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'framezero'@'localhost' IDENTIFIED BY 'framezero';
GRANT ALL PRIVILEGES ON frame_zero.* TO 'framezero'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 2. 启动后端

```bash
cd backend

# 安装依赖（首次运行）
npm install

# 生成 Prisma Client
npx prisma generate

# 推送数据库结构
npx prisma db push

# （可选）运行种子数据
npx prisma db seed

# 启动开发服务器
npm run start:dev
```

#### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

---

### 方式二：使用 Docker（推荐）

如果你希望通过 Docker 运行 MySQL：

#### 1. 启动 MySQL 容器

```bash
docker-compose up -d mysql
```

**MySQL 连接信息:**
- Host: localhost
- Port: 3306
- Database: frame_zero
- User: framezero
- Password: framezero
- Root Password: rootpassword

#### 2. 初始化数据库

```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed  # 可选
```

#### 3. 启动服务

```bash
# 后端
cd backend
npm run start:dev

# 前端（新终端）
cd frontend
npm run dev
```

---

## 📊 数据库差异对比

### PostgreSQL vs MySQL

| 特性 | PostgreSQL | MySQL (当前) |
|------|-----------|--------------|
| JSON 类型 | Jsonb (更高效) | Json (基本支持) |
| 数组类型 | 原生 String[] | Json (模拟数组) |
| 全文搜索 | 内置强大支持 | 需要额外配置 |
| 复杂查询 | 更强大 | 基本支持 |
| 数据库大小 | 较大 | 较小 |

### 对项目的影响

**✅ 完全兼容的功能:**
- 用户认证系统
- 帖子 CRUD
- 评论系统（嵌套评论）
- 点赞功能
- 打卡系统
- 通知系统
- 权限管理

**⚠️ 需要注意的变化:**
1. **学习标签存储**: 从 String[] 改为 Json，读写时需要序列化/反序列化
2. **全文搜索**: 暂不支持，需要使用 LIKE 查询或集成外部搜索引擎
3. **某些高级查询**: 如需要使用 PostgreSQL 特有的功能，需要调整代码

---

## 🔧 MySQL 特定配置

### 连接本地 MySQL

如果你本地 MySQL 运行在不同端口或配置：

```env
# .env
DATABASE_URL="mysql://username:password@localhost:3307/frame_zero"
```

### 使用 Workbench 查看

1. 打开 MySQL Workbench
2. 创建新连接：
   - Hostname: localhost
   - Port: 3306
   - Username: framezero
   - Password: framezero
3. 查看 frame_zero 数据库

### 命令行查看

```bash
# 连接到 MySQL
mysql -u framezero -p framezero

# 查看表
SHOW TABLES;

# 查看用户
SELECT id, username, email, role FROM users;
```

---

## 🛠️ 数据库操作

### 重新初始化数据库

```bash
cd backend

# 删除所有表和数据
npx prisma db push --force-reset

# 重新创建种子数据
npx prisma db seed
```

### 查看数据库

```bash
# 使用 Prisma Studio（可视化工具）
npx prisma studio
```

访问 http://localhost:5555

---

## 📝 代码调整示例

### 读写学习标签（learnings 字段）

由于 MySQL 不支持数组，需要使用 Json 类型：

```typescript
// 读取
const checkIn = await prisma.checkIn.findUnique({
  where: { id }
});

// learnings 是 Json 类型，需要解析
const learnings = checkIn.learnings as string[];

// 写入
const newCheckIn = await prisma.checkIn.create({
  data: {
    userId,
    learnings: ['Python', '算法'] as any, // 需要转换为 Json
  }
});
```

---

## 🎯 总结

### ✅ 已完成的调整

1. ✅ docker-compose.yml - 使用 MySQL 8.0
2. ✅ Prisma schema - provider 改为 mysql，learnings 改为 Json
3. ✅ .env 文件 - MySQL 连接字符串
4. ✅ .env.example - 更新示例配置

### 📦 数据库配置

```yaml
数据库: MySQL 8.0
端口: 3306
数据库名: frame_zero
用户: framezero
密码: framezero
字符集: utf8mb4
```

### 🚀 下一步

你现在可以：
1. 使用本地 MySQL 直接开发
2. 使用 Docker 运行 MySQL 容器
3. 初始化数据库并启动项目

---

**需要帮助？** 查看 [DEV_GUIDE.md](./DEV_GUIDE.md)
