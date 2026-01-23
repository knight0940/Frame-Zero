#!/bin/bash

# Fix MySQL permissions for framezero user

echo "🔧 修复 MySQL 用户权限"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "请提供 MySQL root 用户密码："
read -s MYSQL_ROOT_PASSWORD
echo ""

echo "正在修复权限..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
-- 授予 framezero 用户所有权限
GRANT ALL PRIVILEGES ON frame_zero.* TO 'framezero'@'localhost';
FLUSH PRIVILEGES;

-- 显示权限
SHOW GRANTS FOR 'framezero'@'localhost';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 权限修复成功！"
    echo ""
    echo "现在可以运行数据库推送："
    echo "cd backend && npx prisma db push"
else
    echo "❌ 权限修复失败"
    exit 1
fi
