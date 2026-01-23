# 🚀 Frame Zero 快速启动指南（使用本地 MySQL）

## 前提条件

- ✅ 已安装 Node.js 18+
- ✅ 已安装 MySQL 5.7+ 或 8.0+
- ✅ 已安装 Git

---

## 第一步：创建数据库

### 方式 A：使用命令行

```bash
# 登录 MySQL
mysql -u root -p

# 执行以下 SQL 命令
CREATE DATABASE frame_zero CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'framezero'@'localhost' IDENTIFIED BY 'framezero';
GRANT ALL PRIVILEGES ON frame_zero.* TO 'framezero'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 方式 B：使用 MySQL Workbench

1. 打开 MySQL Workbench
2. 点击 `Server` -> `Users and Privileges`
3. 创建新用户：
   - Username: `framezero`
   - Password: `framezero`
4. 点击 `Catalog` -> `Create Schema`
   - Schema Name: `frame_zero`
   - Collation: `utf8mb4_unicode_ci`

---

## 第二步：启动后端

```bash
cd backend

# 安装依赖（首次运行）
npm install

# 生成 Prisma Client
npx prisma generate

# 推送数据库结构（创建表）
npx prisma db push

# 运行种子数据（创建默认账号和板块）
npx prisma db seed

# 启动开发服务器
npm run start:dev
```

**后端启动成功后，你会看到：**
```
[Nest] xxxxx   INFO [NestFactory] Starting Nest application...
+---------+---------------+
| App     | version      |
+---------+---------------+
✔️  success    3.0.0
```

后端 API 地址: http://localhost:3001

---

## 第三步：启动前端（新终端窗口）

```bash
cd frontend

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

**前端启动成功后，你会看到：**
```
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

前端地址: http://localhost:3000

---

## 访问应用

打开浏览器访问: **http://localhost:3000**

你会看到 VSCode 风格的界面！

---

## 🧪 测试账号

种子数据会创建以下账号（密码需要自己设置）：

**创始人账号:**
- 邮箱: `admin@framezero.com`
- 用户名: `admin`
- 密码: 需要在种子数据中设置（或使用 bcrypt 生成）

**注意:** 当前种子数据中的密码是占位符，你需要：

1. 访问注册页面: http://localhost:3000/register
2. 创建新账号
3. 或者在代码中修改种子数据的密码

---

## 🛑 停止服务

### 停止后端
在运行后端的终端按 `Ctrl + C`

### 停止前端
在运行前端的终端按 `Ctrl + C`

---

## 🔧 常见问题

### Q: 数据库连接失败？

**A:** 检查以下几点：
1. MySQL 服务是否启动
2. 数据库、用户名、密码是否正确
3. backend/.env 中的 DATABASE_URL 是否正确

```bash
# 检查 MySQL 是否运行
ps aux | grep mysql

# 测试连接
mysql -u framezero -p framezero
```

### Q: Prisma 推送失败？

**A:** 确保数据库已创建，然后重新推送：

```bash
cd backend
npx prisma db push
```

### Q: 端口被占用？

**A:** 修改端口或终止占用进程

```bash
# 查看占用 3000 端口
lsof -i :3000

# 查看占用 3001 端口
lsof -i :3001

# 终止进程
kill -9 <PID>
```

### Q: 依赖安装很慢？

**A:** 使用国内镜像源

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

---

## 📝 数据库连接字符串格式

```
mysql://用户名:密码@主机:端口/数据库名
```

**示例:**
```
mysql://framezero:framezero@localhost:3306/frame_zero
```

---

## 🎯 下一步

启动成功后，你可以：

1. **浏览界面** - 查看 VSCode 风格的前端
2. **注册账号** - 创建第一个用户
3. **查看数据库** - 使用 `npx prisma studio` 查看数据
4. **继续开发** - 实现更多功能

---

## 📚 更多文档

- [MYSQL_MIGRATION.md](./MYSQL_MIGRATION.md) - MySQL 迁移详情
- [DEV_GUIDE.md](./DEV_GUIDE.md) - 开发环境完整指南
- [FRONTEND_READY.md](./FRONTEND_READY.md) - 前端功能说明

---

**祝开发顺利！🎉**
