#!/bin/bash

# Frame Zero - 自动启动服务脚本

echo "⏳ 等待 Prisma 安装完成..."

# 等待 Prisma 进程结束
while ps aux | grep -q "npx prisma generate"; do
    sleep 5
    echo "   正在安装... (已等待 5 秒)"
done

echo ""
echo "✅ Prisma 安装完成！"

# 检查安装结果
cd backend

# 生成 Prisma Client（如果需要）
if [ ! -d "node_modules/@prisma/client" ]; then
    echo "📦 生成 Prisma Client..."
    npx prisma generate
fi

# 推送数据库结构
echo ""
echo "🗄️  创建数据库表..."
npx prisma db push

echo ""
echo "✅ 数据库初始化完成！"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 现在可以启动服务了！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 请打开 2 个新终端窗口："
echo ""
echo "🔙 终端 1 - 启动后端："
echo "   cd backend"
echo "   npm run start:dev"
echo ""
echo "🎨 终端 2 - 启动前端："
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "🌐 然后访问："
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3001"
echo ""
