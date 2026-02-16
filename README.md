# Frame Zero - 计算机学习社区

> 一个具有 VSCode 风格 UI 的开源计算机学习社区，为编程学习者打造一站式成长平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

## ✨ 项目简介

Frame Zero 是一个为编程学习者打造的学习社区平台，采用熟悉的 VSCode Dark+ 主题风格，让学习变得更有趣。

### 🎯 核心功能

- 📅 **打卡系统** - 每日学习打卡，连续打卡统计，成长记录
- 📚 **学习分享** - 分享学习资源和技术文章
- 💼 **就业分享** - 面试经验、求职心得、薪资交流
- ✍️ **博客广场** - 发布技术博客，展示个人实力
- 🔔 **通知中心** - 实时通知，不错过任何互动
- 🔍 **全文搜索** - 快速查找帖子、用户和内容
- ⭐ **收藏功能** - 收藏有价值的内容
- 👤 **用户设置** - 完善个人资料，管理账户安全

## 🛠 技术栈

### 前端
- **框架**: Next.js 14 (App Router) + TypeScript
- **UI组件**: Radix UI + shadcn/ui
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **API客户端**: Axios with interceptors

### 后端
- **框架**: NestJS + TypeScript
- **ORM**: Prisma v5.22.0
- **数据库**: MySQL 8.0
- **缓存**: Redis 7
- **认证**: JWT (Access Token + Refresh Token)
- **密码加密**: bcrypt (10 rounds)

## 🏗 项目结构

```
frame-zero/
├── frontend/                 # Next.js 前端应用
│   ├── src/
│   │   ├── app/              # App Router 页面
│   │   ├── components/       # React 组件
│   │   ├── lib/             # 工具库
│   │   │   └── api/         # API 客户端
│   │   └── store/           # Zustand 状态管理
│   └── public/              # 静态资源
├── backend/                  # NestJS 后端应用
│   ├── src/
│   │   ├── auth/            # 认证模块
│   │   ├── users/           # 用户模块
│   │   ├── check-ins/       # 打卡模块
│   │   ├── posts/           # 帖子模块
│   │   ├── comments/        # 评论模块
│   │   ├── likes/           # 点赞模块
│   │   ├── notifications/   # 通知模块
│   │   ├── boards/          # 板块模块
│   │   ├── common/          # 公共组件
│   │   └── prisma/          # Prisma 服务
│   └── prisma/
│       └── schema.prisma    # 数据库模型
└── docker-compose.yml        # Docker 配置（可选）
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- MySQL 8.0+
- Redis 7+
- Git

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/frame-zero.git
cd frame-zero
```

### 2. 数据库设置

#### 方式一：本地 MySQL（推荐开发）

```bash
# 创建数据库和用户
mysql -u root -p
```

```sql
CREATE DATABASE frame_zero CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'framezero'@'localhost' IDENTIFIED BY 'framezero';
GRANT ALL PRIVILEGES ON frame_zero.* TO 'framezero'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 方式二：Docker（推荐生产）

```bash
docker-compose up -d mysql redis
```

### 3. 后端设置

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接

# 生成 Prisma Client
npx prisma generate

# 推送数据库结构
npx prisma db push

# 填充种子数据（可选）
npx prisma db seed

# 启动开发服务器
npm run start:dev
```

后端 API 将在 http://localhost:3001 启动

### 4. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，配置 API 地址

# 启动开发服务器
npm run dev
```

前端应用将在 http://localhost:3000 启动

### 5. 访问应用

打开浏览器访问 http://localhost:3000

**默认测试账号:**
- 邮箱: `admin@framezero.com`
- 密码: `Admin123!`
- 角色: FOUNDER（创始人）

## 📋 功能特性

### ✅ 已实现功能 (v1.0)

#### 认证与用户系统
- [x] 用户注册/登录
- [x] JWT 双 Token 认证（Access + Refresh）
- [x] 密码加密存储
- [x] 用户资料编辑
- [x] 密码修改功能
- [x] 三级权限系统（FOUNDER / ADMIN / USER）

#### 打卡系统
- [x] 每日打卡
- [x] 打卡内容记录
- [x] 学习时长统计
- [x] 连续打卡天数统计
- [x] 累积打卡天数统计
- [x] 打卡排行榜
- [x] 打卡广场（查看所有人打卡）
- [x] 时区问题修复（UTC 午夜）

#### 内容管理
- [x] 帖子发布（草稿/发布）
- [x] 帖子编辑/删除
- [x] 评论系统
- [x] 点赞功能
- [x] 四大板块（学习/就业/博客/打卡）

#### 社交功能
- [x] 通知中心
- [x] 未读通知提醒
- [x] 通知已读/未读状态
- [x] 批量标为已读
- [x] 删除通知
- [x] 收藏功能
- [x] 全文搜索

#### UI/UX
- [x] VSCode Dark+ 风格界面
- [x] 响应式布局（支持浏览器拉伸）
- [x] 活动栏导航
- [x] 侧边栏板块导航
- [x] 标签页多任务管理
- [x] 状态栏信息显示
- [x] 所有页面响应式适配

#### 其他
- [x] API 统一响应格式
- [x] 全局错误处理
- [x] Token 自动刷新
- [x] 路由守卫
- [x] 数据库索引优化
- [x] 时区问题修复

### 🚧 计划中功能 (v1.1)

- [ ] 实时通知（WebSocket）
- [ ] 管理员后台
- [ ] 数据统计仪表板
- [ ] 邮箱验证
- [ ] 密码重置
- [ ] OAuth2 登录（Google、GitHub）
- [ ] 用户头像上传
- [ ] 附件上传

### 🔮 未来功能 (v2.0)

- [ ] 私信功能
- [ ] 关注系统
- [ ] 用户成就徽章
- [ ] 学习计划
- [ ] 学习小组
- [ ] 移动端适配
- [ ] PWA 支持
- [ ] API 限流

## 🔐 权限系统

### 三级权限

| 角色 | 权限 | 说明 |
|------|------|------|
| 👑 **FOUNDER** | 创始人 | 最高权限，系统管理和运营 |
| ⭐ **ADMIN** | 管理员 | 内容审核和板块管理 |
| 👤 **USER** | 用户 | 参与社区互动 |

## 📊 数据库设计

### 核心表结构

- **users** - 用户表
- **sessions** - 会话表
- **boards** - 板块表
- **posts** - 帖子表
- **comments** - 评论表
- **likes** - 点赞表
- **check_ins** - 打卡表
- **notifications** - 通知表
- **activities** - 活动日志表

## 🎨 UI 预览

### VSCode 风格界面
- 左侧活动栏 - 快速导航
- 侧边栏 - 板块列表
- 标签页 - 多任务管理
- 状态栏 - 系统信息

### 板块分类
- 📅 打卡板块
- 📚 学习分享
- 💼 就业分享
- ✍️ 博客广场

## 🛠 开发指南

### API 文档

API 端点遵循 RESTful 设计：

```
POST   /api/auth/register     # 用户注册
POST   /api/auth/login        # 用户登录
POST   /api/auth/logout       # 用户登出
GET    /api/auth/me           # 获取当前用户
POST   /api/auth/refresh      # 刷新 Token

GET    /api/users/:id         # 获取用户资料
PATCH  /api/users/me          # 更新资料
PATCH  /api/users/me/password # 修改密码

POST   /api/check-ins         # 创建打卡
GET    /api/check-ins/today   # 今日打卡
GET    /api/check-ins/history # 打卡历史
GET    /api/check-ins/leaderboard # 排行榜

GET    /api/posts             # 帖子列表
POST   /api/posts             # 创建帖子
GET    /api/posts/:id         # 帖子详情
PATCH  /api/posts/:id         # 更新帖子
DELETE /api/posts/:id         # 删除帖子
```

详细 API 文档请查看项目 Wiki

### 代码规范

- **TypeScript** - 类型安全
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks

### Git 工作流

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

**Commit Message 规范:**
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试
chore: 构建/工具更新
```

## 📦 部署指南

### 生产环境部署

#### 服务器要求
- CPU: 2 核心及以上
- 内存: 2GB 及以上
- 存储: 20GB SSD
- 操作系统: Ubuntu 20.04+ / CentOS 8+

#### 部署步骤

1. **安装依赖**
```bash
# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 MySQL 8
sudo apt-get install mysql-server

# 安装 Redis
sudo apt-get install redis-server

# 安装 PM2
sudo npm install -g pm2

# 安装 Nginx
sudo apt-get install nginx
```

2. **克隆代码**
```bash
cd /var/www
git clone https://github.com/yourusername/frame-zero.git
cd frame-zero
```

3. **配置后端**
```bash
cd backend
npm install --production
cp .env.example .env
# 编辑 .env 配置生产环境数据库
npx prisma generate
npx prisma db push
```

4. **配置前端**
```bash
cd ../frontend
npm install --production
npm run build
```

5. **配置 PM2**
```bash
cd ../backend
pm2 start dist/main.js --name frame-zero-backend
pm2 save
pm2 startup
```

6. **配置 Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/frame-zero/frontend/.next;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker 部署（可选）

```bash
docker-compose up -d
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. 报告 Bug
2. 讨论代码变更
3. 提交 Pull Request
4. 完善文档

### 开发规范

- 遵循现有代码风格
- 添加测试用例
- 更新相关文档
- 确保所有测试通过

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 团队

- **创始人**: @evilgenius

## 📮 联系方式

- 项目主页: https://github.com/yourusername/frame-zero
- 问题反馈: https://github.com/yourusername/frame-zero/issues
- 邮箱: support@framezero.com

## 🙏 致谢

感谢以下开源项目：

- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**Made with ❤️ by Frame Zero Team**

⭐ 如果这个项目对你有帮助，请给我们一个 Star！

</div>
