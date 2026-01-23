#!/bin/bash

# Frame Zero 开发环境启动脚本

set -e

echo "🚀 启动 Frame Zero 开发环境..."

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Docker 是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Docker 未运行，正在启动 Docker..."
        open -a Docker
        echo "等待 Docker 启动..."
        sleep 10
    fi
}

# 启动数据库服务
start_database() {
    echo -e "${BLUE}📦 启动数据库服务 (PostgreSQL + Redis)...${NC}"
    docker-compose up -d postgres redis

    echo -e "${GREEN}✅ 数据库服务已启动${NC}"
    echo "   PostgreSQL: localhost:5432"
    echo "   Redis: localhost:6379"
}

# 检查并安装后端依赖
setup_backend() {
    echo -e "${BLUE}🔧 检查后端依赖...${NC}"
    if [ ! -d "backend/node_modules" ]; then
        echo "安装后端依赖..."
        cd backend
        npm install
        cd ..
        echo -e "${GREEN}✅ 后端依赖安装完成${NC}"
    else
        echo -e "${GREEN}✅ 后端依赖已存在${NC}"
    fi
}

# 检查并安装前端依赖
setup_frontend() {
    echo -e "${BLUE}🎨 检查前端依赖...${NC}"
    if [ ! -d "frontend/node_modules" ]; then
        echo "安装前端依赖..."
        cd frontend
        npm install
        cd ..
        echo -e "${GREEN}✅ 前端依赖安装完成${NC}"
    else
        echo -e "${GREEN}✅ 前端依赖已存在${NC}"
    fi
}

# 启动后端服务
start_backend() {
    echo -e "${BLUE}🔙 启动后端服务...${NC}"
    cd backend

    # 检查是否需要初始化数据库
    if ! npx prisma db pull --print &> /dev/null; then
        echo "初始化数据库..."
        npx prisma generate
        npx prisma db push
    fi

    # 使用 nohup 在后台启动
    nohup npm run start:dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../.backend.pid
    cd ..

    echo -e "${GREEN}✅ 后端服务已启动 (PID: $BACKEND_PID)${NC}"
    echo "   后端地址: http://localhost:3001"
    echo "   日志文件: logs/backend.log"
}

# 启动前端服务
start_frontend() {
    echo -e "${BLUE}🎨 启动前端服务...${NC}"
    cd frontend

    # 使用 nohup 在后台启动
    nohup npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../.frontend.pid
    cd ..

    echo -e "${GREEN}✅ 前端服务已启动 (PID: $FRONTEND_PID)${NC}"
    echo "   前端地址: http://localhost:3000"
    echo "   日志文件: logs/frontend.log"
}

# 创建日志目录
mkdir -p logs

# 执行启动流程
check_docker
start_database
setup_backend
setup_frontend
start_backend
start_frontend

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Frame Zero 开发环境启动成功！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📱 服务地址：${NC}"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3001"
echo "   数据库: localhost:5432"
echo ""
echo -e "${BLUE}📝 查看日志：${NC}"
echo "   后端: tail -f logs/backend.log"
echo "   前端: tail -f logs/frontend.log"
echo ""
echo -e "${BLUE}🛑 停止服务：${NC}"
echo "   ./dev-stop.sh"
echo ""
echo -e "${YELLOW}💡 提示：使用 ./dev-status.sh 查看服务状态${NC}"
echo ""
