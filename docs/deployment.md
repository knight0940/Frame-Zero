# Frame Zero - 部署文档

## 1. 部署概述

### 1.1 部署架构

```
┌─────────────┐
│   Nginx     │  反向代理 + SSL + 静态资源
│  (Port 80)  │
│  (Port 443) │
└──────┬──────┘
       │
   ┌───┴──────────────────────────┐
   │                              │
┌──▼──────┐                  ┌────▼──────┐
│ Frontend │                  │  Backend  │
│ Next.js  │                  │  NestJS   │
│ (Port 3000)│                │ (Port 3000)│
└──────────┘                  └────┬──────┘
                                    │
                              ┌─────┴────────────────┐
                              │                      │
                         ┌────▼────┐          ┌─────▼────┐
                         │PostgreSQL│         │  Redis   │
                         │ (Port 5432)│        │(Port 6379)│
                         └──────────┘         └──────────┘
```

### 1.2 技术栈版本

| 组件 | 版本 | 说明 |
|------|------|------|
| Node.js | 18.x LTS | 运行环境 |
| PostgreSQL | 14+ | 数据库 |
| Redis | 7+ | 缓存 |
| Nginx | 1.24+ | 反向代理 |
| Docker | 24+ | 容器化 |
| Docker Compose | 2.20+ | 容器编排 |

---

## 2. 开发环境搭建

### 2.1 前置要求

**必需软件:**
- Node.js 18+ ([下载地址](https://nodejs.org/))
- Git ([下载地址](https://git-scm.com/))
- Docker Desktop ([下载地址](https://www.docker.com/products/docker-desktop))
- VSCode (推荐，[下载地址](https://code.visualstudio.com/))

**VSCode插件推荐:**
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- PostgreSQL

### 2.2 克隆项目

```bash
git clone https://github.com/yourusername/frame-zero.git
cd frame-zero
```

### 2.3 启动数据库服务

使用Docker Compose启动PostgreSQL和Redis：

```bash
docker-compose up -d postgres redis
```

验证服务状态：

```bash
docker-compose ps
```

### 2.4 后端配置

#### 2.4.1 安装依赖

```bash
cd backend
npm install
```

#### 2.4.2 环境变量配置

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/frame_zero?schema=public"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# 应用
PORT=3000
NODE_ENV=development

# 邮件服务（可选）
SMTP_HOST="smtp.resend.com"
SMTP_PORT=587
SMTP_USER="resend"
SMTP_PASSWORD="your-api-key"
SMTP_FROM="noreply@framezero.com"

# 文件上传
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=2097152
```

#### 2.4.3 数据库初始化

```bash
# 生成Prisma Client
npx prisma generate

# 推送数据库结构
npx prisma db push

# 运行种子数据
npx prisma db seed
```

#### 2.4.4 启动后端服务

```bash
# 开发模式（热重载）
npm run start:dev

# 或使用调试模式
npm run start:debug
```

后端服务将在 http://localhost:3001 启动

API文档地址: http://localhost:3001/api/docs

### 2.5 前端配置

#### 2.5.1 安装依赖

打开新终端窗口：

```bash
cd frontend
npm install
```

#### 2.5.2 环境变量配置

创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```env
# API地址
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# WebSocket地址
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# 应用配置
NEXT_PUBLIC_APP_NAME="Frame Zero"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 2.5.3 启动前端服务

```bash
npm run dev
```

前端服务将在 http://localhost:3000 启动

### 2.6 验证开发环境

1. 访问 http://localhost:3000
2. 测试用户注册功能
3. 测试发布帖子功能
4. 测试打卡功能

**测试账号:**
- 邮箱: `admin@framezero.com`
- 密码: `Admin123!`

---

## 3. 生产环境部署

### 3.1 服务器准备

#### 3.1.1 系统要求

- **操作系统:** Ubuntu 22.04 LTS (推荐) / Debian 11+
- **CPU:** 2核心以上
- **内存:** 4GB以上
- **磁盘:** 40GB以上SSD

#### 3.1.2 基础软件安装

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装Docker Compose
sudo apt install docker-compose-plugin

# 安装Nginx
sudo apt install -y nginx

# 安装PM2
sudo npm install -g pm2
```

### 3.2 数据库配置

#### 3.2.1 PostgreSQL生产配置

创建Docker Compose配置文件 `docker-compose.prod.yml`：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: frame_zero_postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: frame_zero
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: frame_zero_redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

启动生产数据库：

```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### 3.2.2 数据库备份设置

创建备份脚本 `backup.sh`：

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/frame-zero"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="frame_zero"
DB_USER="${DB_USER}"
DB_CONTAINER="frame_zero_postgres"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 数据库备份
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# 保留最近30天的备份
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_$DATE.sql.gz"
```

设置定时任务：

```bash
# 编辑crontab
crontab -e

# 添加每日凌晨2点执行备份
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### 3.3 后端部署

#### 3.3.1 构建生产版本

```bash
cd backend

# 安装生产依赖
npm ci --only=production

# 构建应用
npm run build

# 数据库迁移
npx prisma migrate deploy
```

#### 3.3.2 PM2配置

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'frame-zero-backend',
      script: 'dist/main.js',
      instances: 'max', // 根据CPU核心数自动设置
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
```

启动应用：

```bash
# 启动应用
pm2 start ecosystem.config.js

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
```

#### 3.3.3 Nginx配置（后端API）

创建 `/etc/nginx/sites-available/frame-zero-api`：

```nginx
upstream frame_zero_backend {
    server localhost:3001;
    keepalive 64;
}

server {
    listen 80;
    server_name api.framezero.com;

    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.framezero.com;

    # SSL配置
    ssl_certificate /etc/letsencrypt/live/api.framezero.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.framezero.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志
    access_log /var/log/nginx/frame-zero-api-access.log;
    error_log /var/log/nginx/frame-zero-api-error.log;

    # API代理
    location /api {
        proxy_pass http://frame_zero_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket代理
    location /ws {
        proxy_pass http://frame_zero_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket超时设置
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/frame-zero-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3.4 前端部署

#### 3.4.1 构建生产版本

```bash
cd frontend

# 安装依赖
npm ci

# 构建生产版本
npm run build
```

#### 3.4.2 静态资源服务配置

创建 `/etc/nginx/sites-available/frame-zero-frontend`：

```nginx
server {
    listen 80;
    server_name framezero.com www.framezero.com;

    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name framezero.com www.framezero.com;

    # SSL配置
    ssl_certificate /etc/letsencrypt/live/framezero.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/framezero.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志
    access_log /var/log/nginx/frame-zero-access.log;
    error_log /var/log/nginx/frame-zero-error.log;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    gzip_comp_level 6;

    # 静态资源缓存
    location /_next/static {
        alias /path/to/frontend/.next/static;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /static {
        alias /path/to/frontend/public/static;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 上传文件
    location /uploads {
        alias /path/to/backend/uploads;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Next.js页面
    location / {
        root /path/to/frontend;
        try_files $uri $uri/ /index.html;

        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;
    }
}
```

#### 3.4.3 启用配置

```bash
sudo ln -s /etc/nginx/sites-available/frame-zero-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3.5 SSL证书配置

使用Let's Encrypt免费SSL证书：

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d framezero.com -d www.framezero.com

# 获取API SSL证书
sudo certbot --nginx -d api.framezero.com

# 设置自动续期
sudo certbot renew --dry-run
```

### 3.6 防火墙配置

```bash
# 安装UFW
sudo apt install ufw

# 允许SSH
sudo ufw allow 22/tcp

# 允许HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

---

## 4. Docker部署方案

### 4.1 完整Docker Compose配置

创建 `docker-compose.prod.yml`：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: frame_zero_postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: frame_zero
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    networks:
      - frame_zero_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: frame_zero_redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - frame_zero_network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: frame_zero_backend
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/frame_zero?schema=public
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_ACCESS_EXPIRATION: ${JWT_ACCESS_EXPIRATION}
      JWT_REFRESH_EXPIRATION: ${JWT_REFRESH_EXPIRATION}
      PORT: 3001
    volumes:
      - ./backend/uploads:/app/uploads
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - frame_zero_network
    ports:
      - "3001:3001"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frame_zero_frontend
    restart: always
    environment:
      NEXT_PUBLIC_API_URL: https://api.framezero.com/api
      NEXT_PUBLIC_WS_URL: wss://api.framezero.com
    depends_on:
      - backend
    networks:
      - frame_zero_network
    ports:
      - "3000:3000"

  nginx:
    image: nginx:alpine
    container_name: frame_zero_nginx
    restart: always
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl
      - ./frontend/public:/usr/share/nginx/html
    depends_on:
      - frontend
      - backend
    networks:
      - frame_zero_network
    ports:
      - "80:80"
      - "443:443"

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  frame_zero_network:
    driver: bridge
```

### 4.2 后端Dockerfile

创建 `backend/Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 生成Prisma Client
RUN npx prisma generate

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

# 安装生产依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# 创建上传目录
RUN mkdir -p uploads

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "dist/main.js"]
```

### 4.3 前端Dockerfile

创建 `frontend/Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### 4.4 启动Docker服务

```bash
# 创建环境变量文件
cat > .env.prod << EOF
DB_USER=postgres
DB_PASSWORD=your_secure_password
REDIS_PASSWORD=your_redis_password
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
EOF

# 启动所有服务
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看状态
docker-compose -f docker-compose.prod.yml ps
```

---

## 5. CI/CD配置

### 5.1 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci

      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

      - name: Lint
        run: |
          cd backend && npm run lint
          cd ../frontend && npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/frame-zero
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml build
            docker-compose -f docker-compose.prod.yml up -d
            pm2 restart all
```

### 5.2 环境变量配置

在GitHub仓库设置中添加Secrets：

- `SERVER_HOST`: 服务器IP地址
- `SERVER_USER`: SSH用户名
- `SERVER_SSH_KEY`: SSH私钥

---

## 6. 监控与日志

### 6.1 PM2监控

```bash
# 实时监控
pm2 monit

# 查看日志
pm2 logs

# 查看状态
pm2 status
```

### 6.2 日志管理

```bash
# 安装pm2-logrotate
pm2 install pm2-logrotate

# 配置日志轮转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### 6.3 Nginx日志分析

```bash
# 访问日志
sudo tail -f /var/log/nginx/frame-zero-access.log

# 错误日志
sudo tail -f /var/log/nginx/frame-zero-error.log

# 日志分析工具
sudo apt install goaccess
goaccess /var/log/nginx/frame-zero-access.log --log-format=COMBINED
```

### 6.4 数据库监控

```bash
# 查看PostgreSQL日志
docker logs frame_zero_postgres

# 查看Redis日志
docker logs frame_zero_redis
```

---

## 7. 性能优化

### 7.1 Nginx优化

编辑 `/etc/nginx/nginx.conf`：

```nginx
user www-data;
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # 基础配置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # 缓存配置
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

    # 限制请求速率
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
}
```

### 7.2 Node.js优化

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'frame-zero-backend',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};
```

### 7.3 数据库优化

```sql
-- PostgreSQL配置优化
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
SELECT pg_reload_conf();
```

---

## 8. 安全加固

### 8.1 系统安全

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 配置自动安全更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 8.2 防火墙规则

```bash
# 限制SSH访问
sudo ufw limit 22/tcp

# 防止DDOS
sudo ufw limit 80/tcp
sudo ufw limit 443/tcp
```

### 8.3 应用安全

```bash
# 设置文件权限
chmod 600 .env
chmod 700 logs/
```

### 8.4 Fail2Ban配置

```bash
# 安装Fail2Ban
sudo apt install fail2ban

# 配置Nginx保护
sudo nano /etc/fail2ban/jail.local
```

```ini
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
```

---

## 9. 备份与恢复

### 9.1 自动备份脚本

创建 `/usr/local/bin/backup-framezero.sh`：

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/frame-zero"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR

# 数据库备份
docker exec frame_zero_postgres pg_dump -U postgres frame_zero | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Redis备份
docker exec frame_zero_redis redis-cli --rdb /data/dump_$DATE.rdb
docker cp frame_zero_redis:/data/dump_$DATE.rdb $BACKUP_DIR/redis_$DATE.rdb

# 上传文件备份
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz ./backend/uploads

# 清理旧备份
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.rdb" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
```

### 9.2 恢复流程

```bash
# 恢复数据库
gunzip < /var/backups/frame-zero/db_20260123_020000.sql.gz | docker exec -i frame_zero_postgres psql -U postgres frame_zero

# 恢复Redis
docker cp /var/backups/frame-zero/redis_20260123_020000.rdb frame_zero_redis:/data/dump.rdb
docker restart frame_zero_redis

# 恢复上传文件
tar -xzf /var/backups/frame-zero/uploads_20260123_020000.tar.gz -C ./
```

---

## 10. 故障排查

### 10.1 常见问题

**问题1: 数据库连接失败**

```bash
# 检查PostgreSQL状态
docker ps | grep postgres

# 查看日志
docker logs frame_zero_postgres

# 重启数据库
docker restart frame_zero_postgres
```

**问题2: Redis连接失败**

```bash
# 检查Redis状态
docker ps | grep redis

# 测试连接
docker exec -it frame_zero_redis redis-cli ping
```

**问题3: Nginx 502错误**

```bash
# 检查后端服务状态
pm2 status

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# 重启Nginx
sudo systemctl restart nginx
```

### 10.2 性能问题

```bash
# 查看系统资源
htop

# 查看Node.js进程
pm2 monit

# 数据库性能分析
docker exec -it frame_zero_postgres psql -U postgres frame_zero
```

### 10.3 日志查看

```bash
# 应用日志
pm2 logs

# Nginx访问日志
sudo tail -f /var/log/nginx/frame-zero-access.log

# 数据库慢查询
docker exec frame_zero_postgres psql -U postgres frame_zero -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

---

## 11. 版本更新

### 11.1 滚动更新流程

```bash
# 1. 备份当前版本
/usr/local/bin/backup-framezero.sh

# 2. 拉取最新代码
git pull origin main

# 3. 更新后端
cd backend
npm ci --only=production
npm run build
npx prisma migrate deploy
pm2 restart frame-zero-backend

# 4. 更新前端
cd ../frontend
npm ci
npm run build
pm2 restart frame-zero-frontend

# 5. 清理缓存
sudo systemctl restart nginx
```

### 11.2 回滚流程

```bash
# 1. 停止服务
pm2 stop all

# 2. 恢复数据库（如需要）
gunzip < /var/backups/frame-zero/db_YYYYMMDD_HHMMSS.sql.gz | docker exec -i frame_zero_postgres psql -U postgres frame_zero

# 3. 恢复代码
git checkout <previous-commit-hash>

# 4. 重新构建
cd backend && npm ci --only=production && npm run build
cd ../frontend && npm ci && npm run build

# 5. 重启服务
pm2 restart all
```

---

## 12. 运维清单

### 12.1 日常检查

- [ ] 检查服务器资源使用情况
- [ ] 查看应用日志
- [ ] 检查备份是否正常执行
- [ ] 查看SSL证书有效期
- [ ] 检查系统安全更新

### 12.2 每周任务

- [ ] 审查安全日志
- [ ] 清理旧日志文件
- [ ] 测试备份恢复流程
- [ ] 性能分析

### 12.3 每月任务

- [ ] 系统更新
- [ ] 数据库性能优化
- [ ] 容量规划评估
- [ ] 安全审计

---

## 附录

### A. 环境变量清单

**后端环境变量:**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/frame_zero
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
NODE_ENV=production
```

**前端环境变量:**

```env
NEXT_PUBLIC_API_URL=https://api.framezero.com/api
NEXT_PUBLIC_WS_URL=wss://api.framezero.com
NEXT_PUBLIC_APP_NAME=Frame Zero
NEXT_PUBLIC_APP_URL=https://framezero.com
```

### B. 有用的命令速查

```bash
# Docker
docker-compose up -d              # 启动服务
docker-compose logs -f           # 查看日志
docker-compose down              # 停止服务
docker exec -it <container> sh   # 进入容器

# PM2
pm2 start ecosystem.config.js    # 启动应用
pm2 restart all                  # 重启应用
pm2 logs                         # 查看日志
pm2 monit                        # 监控面板

# Nginx
sudo nginx -t                    # 测试配置
sudo systemctl reload nginx      # 重载配置
sudo systemctl restart nginx     # 重启服务

# 数据库
npx prisma studio                # 打开Prisma Studio
npx prisma migrate dev           # 开发环境迁移
npx prisma migrate deploy        # 生产环境迁移
```

### C. 联系方式

- 技术支持: support@framezero.com
- GitHub Issues: https://github.com/yourusername/frame-zero/issues

---

## 版本历史

| 版本 | 日期 | 修改内容 | 修改人 |
|------|------|----------|--------|
| v1.0 | 2026-01-23 | 初始版本，完成部署文档 | - |
