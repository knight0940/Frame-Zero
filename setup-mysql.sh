#!/bin/bash

# Frame Zero 数据库初始化脚本（MySQL）

echo "🗄️  Frame Zero 数据库初始化"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}请提供 MySQL root 用户密码：${NC}"
read -s MYSQL_ROOT_PASSWORD
echo ""

# 测试连接
echo -e "${BLUE}测试 MySQL 连接...${NC}"
if mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 'Connected' as status;" &> /dev/null; then
    echo -e "${GREEN}✅ MySQL 连接成功${NC}"
else
    echo -e "${RED}❌ MySQL 连接失败，请检查密码或服务是否启动${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}创建数据库和用户...${NC}"

# 执行 SQL 命令
mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
-- 创建数据库
CREATE DATABASE IF NOT EXISTS frame_zero CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER IF NOT EXISTS 'framezero'@'localhost' IDENTIFIED BY 'framezero';

-- 授权
GRANT ALL PRIVILEGES ON frame_zero.* TO 'framezero'@'localhost;

-- 刷新权限
FLUSH PRIVILEGES;

-- 显示结果
SELECT 'Database created successfully!' as status;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ 数据库创建成功！${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}📊 数据库信息：${NC}"
    echo "   数据库名: frame_zero"
    echo "   用户名: framezero"
    echo "   密码: framezero"
    echo "   字符集: utf8mb4_unicode_ci"
    echo ""
    echo -e "${BLUE}🔗 连接字符串：${NC}"
    echo "   mysql://framezero:framezero@localhost:3306/frame_zero"
    echo ""
    echo -e "${YELLOW}💡 下一步：${NC}"
    echo "   cd backend"
    echo "   npx prisma generate"
    echo "   npx prisma db push"
    echo "   npm run start:dev"
    echo ""
else
    echo -e "${RED}❌ 数据库创建失败${NC}"
    exit 1
fi
