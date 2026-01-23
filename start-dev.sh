#!/bin/bash

# Frame Zero 开发环境快速启动脚本（简化版）

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Frame Zero 开发环境启动${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查并启动数据库
check_mysql() {
    echo -e "${BLUE}📦 检查 MySQL 服务...${NC}"

    # 测试 MySQL 连接
    if command -v mysql &> /dev/null; then
        if mysql -u framezero -pframezero -e "USE frame_zero;" &> /dev/null; then
            echo -e "${GREEN}✅ MySQL 数据库已就绪${NC}"
        else
            echo -e "${YELLOW}⚠️  数据库不存在，请先运行：${NC}"
            echo ""
            echo -e "   ${YELLOW}./setup-mysql.sh${NC}  # 创建数据库"
            echo ""
            exit 1
        fi
    else
        echo -e "${RED}❌ 未找到 MySQL 命令${NC}"
        exit 1
    fi
}

# 安装并启动后端
start_backend() {
    echo ""
    echo -e "${BLUE}🔙 启动后端服务...${NC}"
    cd backend

    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "安装后端依赖..."
        npm install
    fi

    # 检查数据库初始化
    if ! npx prisma db pull &> /dev/null; then
        echo "初始化数据库..."
        npx prisma generate
        npx prisma db push
    fi

    echo -e "${GREEN}✅ 后端配置完成${NC}"
    echo ""
    echo -e "${YELLOW}💡 在新终端窗口运行以下命令启动后端：${NC}"
    echo ""
    echo -e "   ${GREEN}cd backend${NC}"
    echo -e "   ${GREEN}npm run start:dev${NC}"
    echo ""

    cd ..
}

# 安装并启动前端
start_frontend() {
    echo -e "${BLUE}🎨 启动前端服务...${NC}"
    cd frontend

    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "前端依赖未安装，正在安装..."
        npm install
    fi

    echo -e "${GREEN}✅ 前端配置完成${NC}"
    echo ""
    echo -e "${YELLOW}💡 在新终端窗口运行以下命令启动前端：${NC}"
    echo ""
    echo -e "   ${GREEN}cd frontend${NC}"
    echo -e "   ${GREEN}npm run dev${NC}"
    echo ""

    cd ..
}

# 执行流程
check_mysql
start_backend
start_frontend

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 配置完成！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📱 接下来请打开 2 个新终端窗口：${NC}"
echo ""
echo -e "${YELLOW}终端 1 - 启动后端：${NC}"
echo -e "   cd backend && npm run start:dev"
echo ""
echo -e "${YELLOW}终端 2 - 启动前端：${NC}"
echo -e "   cd frontend && npm run dev"
echo ""
echo -e "${BLUE}🌐 然后访问：${NC}"
echo -e "   前端: ${GREEN}http://localhost:3000${NC}"
echo -e "   后端: ${GREEN}http://localhost:3001${NC}"
echo ""
