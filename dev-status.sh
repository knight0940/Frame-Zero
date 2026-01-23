#!/bin/bash

# Frame Zero 开发环境状态检查脚本

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📊 Frame Zero 开发环境状态${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查数据库
check_database() {
    echo -e "${BLUE}📦 数据库服务：${NC}"
    if docker-compose ps | grep -q "Up"; then
        echo -e "  PostgreSQL: ${GREEN}✅ 运行中${NC} (localhost:5432)"
        echo -e "  Redis: ${GREEN}✅ 运行中${NC} (localhost:6379)"
    else
        echo -e "  ${RED}❌ 未运行${NC}"
    fi
    echo ""
}

# 检查后端
check_backend() {
    echo -e "${BLUE}🔙 后端服务：${NC}"
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            echo -e "  ${GREEN}✅ 运行中${NC}"
            echo "  PID: $BACKEND_PID"
            echo "  地址: http://localhost:3001"
            echo "  日志: tail -f logs/backend.log"
        else
            echo -e "  ${RED}❌ 进程不存在${NC} (PID文件存在但进程未运行)"
            rm .backend.pid
        fi
    else
        echo -e "  ${YELLOW}⚸️  未启动${NC}"
    fi
    echo ""
}

# 检查前端
check_frontend() {
    echo -e "${BLUE}🎨 前端服务：${NC}"
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            echo -e "  ${GREEN}✅ 运行中${NC}"
            echo "  PID: $FRONTEND_PID"
            echo "  地址: http://localhost:3000"
            echo "  日志: tail -f logs/frontend.log"
        else
            echo -e "  ${RED}❌ 进程不存在${NC} (PID文件存在但进程未运行)"
            rm .frontend.pid
        fi
    else
        echo -e "  ${YELLOW}⚸️  未启动${NC}"
    fi
    echo ""
}

# 检查端口占用
check_ports() {
    echo -e "${BLUE}🔌 端口占用情况：${NC}"

    # 检查 3000 端口（前端）
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        FRONTEND_PORT_PID=$(lsof -ti :3000)
        echo -e "  3000 (前端): ${GREEN}已占用${NC} (PID: $FRONTEND_PORT_PID)"
    else
        echo -e "  3000 (前端): ${YELLOW}空闲${NC}"
    fi

    # 检查 3001 端口（后端）
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        BACKEND_PORT_PID=$(lsof -ti :3001)
        echo -e "  3001 (后端): ${GREEN}已占用${NC} (PID: $BACKEND_PORT_PID)"
    else
        echo -e "  3001 (后端): ${YELLOW}空闲${NC}"
    fi

    # 检查 5432 端口（PostgreSQL）
    if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  5432 (数据库): ${GREEN}已占用${NC}"
    else
        echo -e "  5432 (数据库): ${YELLOW}空闲${NC}"
    fi

    # 检查 6379 端口（Redis）
    if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  6379 (Redis): ${GREEN}已占用${NC}"
    else
        echo -e "  6379 (Redis): ${YELLOW}空闲${NC}"
    fi

    echo ""
}

# 执行检查
check_database
check_backend
check_frontend
check_ports

echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}💡 快捷命令：${NC}"
echo "  启动环境: ./dev-start.sh"
echo "  停止环境: ./dev-stop.sh"
echo "  查看后端日志: tail -f logs/backend.log"
echo "  查看前端日志: tail -f logs/frontend.log"
echo ""
