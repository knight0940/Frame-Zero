# Frame Zero - 计算机学习社区

一个具有VSCode风格UI的开源计算机学习社区，包含打卡、学习资源分享、就业经验交流和技术博客等功能。

## 项目简介

Frame Zero 是一个为编程学习者打造的一站式学习社区，采用VSCode Dark+主题风格，提供：

- 📅 **打卡板块** - 每日学习打卡，记录成长足迹
- 📚 **学习分享** - 分享学习资源和技术文章
- 💼 **就业分享** - 面试经验、求职心得、薪资分享
- ✍️ **博客广场** - 发布技术博客，展示个人实力

## 技术栈

### 前端
- **框架**: Next.js 14 (App Router) + TypeScript
- **UI组件**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **状态管理**: Zustand + React Query
- **编辑器**: Monaco Editor (VSCode编辑器核心)

### 后端
- **框架**: NestJS + TypeScript
- **ORM**: Prisma
- **数据库**: PostgreSQL 14
- **缓存**: Redis 7
- **认证**: JWT + bcrypt

## 项目结构

```
frame-zero/
├── frontend/          # Next.js 前端应用
├── backend/           # NestJS 后端应用
├── shared/            # 前后端共享代码
├── docs/              # 项目文档
└── docker-compose.yml # 开发环境
```

## 快速开始

### 环境要求

- Node.js 18+
- Docker & Docker Compose
- Git

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/frame-zero.git
cd frame-zero
```

### 2. 启动数据库服务

```bash
docker-compose up -d
```

### 3. 后端设置

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 数据库迁移
npx prisma migrate dev

# 启动开发服务器
npm run start:dev
```

后端服务将在 http://localhost:3001 启动

### 4. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

前端服务将在 http://localhost:3000 启动

### 5. 访问应用

打开浏览器访问 http://localhost:3000

**默认测试账号:**
- 邮箱: `admin@framezero.com`
- 密码: `Admin123!`

## 开发文档

详细文档请查看 [docs](./docs) 目录：

- [需求文档](./docs/需求文档.md) - 产品需求和功能规格
- [API接口文档](./docs/API接口文档.md) - API接口定义
- [数据库设计](./docs/database.md) - 数据库架构
- [部署文档](./docs/deployment.md) - 部署和运维指南

## 核心功能

### 三级权限系统

- **👑 创始人** - 最高权限，系统管理和运营
- **⭐ 管理员** - 内容审核和板块管理
- **👤 用户** - 参与社区互动

### VSCode风格UI

- 熟悉的开发者界面
- 左侧活动栏
- 侧边栏板块导航
- 标签页多任务
- 底部状态栏

## 贡献指南

我们欢迎所有形式的贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 开发路线图

### v1.0 (当前版本)
- [x] 用户认证系统
- [x] 三级权限管理
- [x] 打卡功能
- [x] 帖子发布
- [x] 评论系统
- [x] VSCode风格UI

### v1.1 (计划中)
- [ ] 实时通知
- [ ] WebSocket支持
- [ ] 管理员后台
- [ ] 数据统计

### v2.0 (未来版本)
- [ ] 私信功能
- [ ] 关注系统
- [ ] 用户成就徽章
- [ ] 移动端应用

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目主页: https://github.com/yourusername/frame-zero
- 问题反馈: https://github.com/yourusername/frame-zero/issues
- 邮箱: support@framezero.com

## 致谢

感谢所有为这个项目做出贡献的开发者！

---

**Made with ❤️ by Frame Zero Team**
