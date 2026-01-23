#!/bin/bash

# Frame Zero 开发环境停止脚本

echo "🛑 停止 Frame Zero 开发环境..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 停止后端服务
stop_backend() {
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            echo -e "${YELLOW}停止后端服务 (PID: $BACKEND_PID)...${NC}"
            kill $BACKEND_PID
            rm .backend.pid
            echo -e "${GREEN}✅ 后端服务已停止${NC}"
        else
            echo -e "${YELLOW}⚠️  后端服务未运行${NC}"
            rm .backend.pid
        fi
    else
        echo -e "${YELLOW}⚠️  未找到后端进程文件${NC}"
    fi
}

# 停止前端服务
stop_frontend() {
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            echo -e "${YELLOW}停止前端服务 (PID: $FRONTEND_PID)...${NC}"
            kill $FRONTEND_PID
            rm .frontend.pid
            echo -e "${GREEN}✅ 前端服务已停止${NC}"
        else
            echo -e "${YELLOW}⚠️  前端服务未运行${NC}"
            rm .frontend.pid
        fi
    else
        echo -e "${YELLOW}⚠️  未找到前端进程文件${NC}"
    fi
}

# 停止数据库服务
stop_database() {
    read -p "是否停止数据库服务 (PostgreSQL + Redis)? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}停止数据库服务...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ 数据库服务已停止${NC}"
    else
        echo -e "${YELLOW}⏸️  数据库服务继续运行${NC}"
    fi
}

# 执行停止流程
stop_frontend
stop_backend

echo ""
read -p "是否停止数据库服务？[y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    stop_database
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Frame Zero 开发环境已停止${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
