#!/bin/bash

echo "🚀 Frame Zero - 自动启动所有服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查数据库
echo -e "${BLUE}📊 检查数据库...${NC}"
if mysql -u framezero -pframezero -e "USE frame_zero;" &> /dev/null; then
    echo -e "${GREEN}✅ MySQL 数据库已就绪${NC}"
else
    echo -e "${RED}❌ 数据库不存在${NC}"
    echo "请先运行: ./setup-mysql.sh"
    exit 1
fi

echo ""

# 检查 Redis
echo -e "${BLUE}📦 检查 Redis...${NC}"
if docker ps | grep -q "frame_zero_redis"; then
    echo -e "${GREEN}✅ Redis 容器运行中${NC}"
else
    echo -e "${YELLOW}⚠️  Redis 未运行，尝试启动...${NC}"
    docker-compose up -d redis
fi

echo ""

# 后端
echo -e "${BLUE}🔙 后端服务${NC}"
cd backend

# 生成 Prisma Client
if [ ! -d "node_modules/@prisma/client" ]; then
    echo "生成 Prisma Client..."
    npx prisma generate
fi

# 推送数据库结构
echo "创建数据库表..."
npx prisma db push

echo ""
echo -e "${GREEN}✅ 数据库初始化完成！${NC}"
echo ""

# 启动后端
echo -e "${YELLOW}💡 在新终端窗口运行以下命令启动后端：${NC}"
echo ""
echo -e "${GREEN}cd backend${NC}"
echo -e "${GREEN}npm run start:dev${NC}"
echo ""
echo "（或在后台运行：nohup npm run start:dev > ../logs/backend.log 2>&1 &）"

cd ..
echo ""
echo -e "${BLUE}🎨 前端服务${NC}"
cd frontend

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "前端依赖未安装，正在安装..."
    npm install
fi

echo -e "${YELLOW}💡 在另一个新终端窗口运行以下命令启动前端：${NC}"
echo ""
echo -e "${GREEN}cd frontend${NC}"
echo -e "${GREEN}npm run dev${NC}"
echo ""

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 配置完成！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📱 服务地址：${NC}"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3001"
echo ""
echo -e "${YELLOW}💡 提示：${NC}"
echo "   如果看到 'Ready' 或 '应用启动成功'，说明启动成功！"
echo ""
