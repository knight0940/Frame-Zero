# 🚀 Frame Zero 服务启动指南

## ✅ 环境准备完成

- ✅ MySQL 数据库已创建
- ✅ Redis 容器已启动（端口 6379）
- ✅ 后端依赖正在安装中
- ✅ 前端依赖已安装

---

## 📋 接下来的步骤

### 情况 A：等待当前命令完成后

如果当前的后台命令（`npx prisma db push`）成功完成，你会看到类似这样的输出：

```
📋 Prisma Migrate
✅ 创建了 9 个表
```

然后我会帮你启动后端和前端服务。

---

### 情况 B：手动启动（推荐）

如果你想更快的控制，可以手动在新终端窗口执行：

#### 终端 1 - 后端

```bash
cd backend
npm run start:dev
```

**启动成功的标志：**
```
[Nest] xxxxx   INFO [NestFactory] Starting Nest application...
✅ 应用启动成功
```

#### 终端 2 - 前端

```bash
cd frontend
npm run dev
```

**启动成功的标志：**
```
✓ Ready in 2.5s
- Local: http://localhost:3000
```

---

## 🎯 访问应用

启动成功后，访问：

- **前端**: http://localhost:3000
- **后端 API**: http://localhost:3001

你会看到 VSCode 风格的界面！

---

## 🛑 如何停止服务

### 停止后端
在后端终端按 `Ctrl + C`

### 停止前端
在前端终端按 `Ctrl + C`

---

## 🔍 验证服务状态

### 检查端口占用

```bash
# 检查所有服务
lsof -i :3000  # 前端
lsof -i :3001  # 后端
lsof -i :3306  # MySQL
lsof -i :6379  # Redis
```

### 查看 Redis 状态

```bash
docker-compose ps redis
```

---

## 📝 测试账号

启动成功后，你可以：

1. 访问 http://localhost:3000
2. 看到 VSCode 风格界面
3. 后续可以通过注册页面创建账号

---

## 💡 提示

- 首次启动可能需要 1-2 分钟
- 看到 "Ready" 或 "应用启动成功" 即可访问
- 如果遇到端口占用，先关闭占用进程

---

**正在为你启动服务...** ⏳

完成后我会告诉你！
