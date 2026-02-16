'use client';

import { useState, useEffect } from 'react';
import { VSCodeLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import * as boardsApi from '@/lib/api/boards.service';
import type { Board } from '@/lib/api/types';

export default function HomePage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await boardsApi.getBoards();
      setBoards(data);
    } catch (error) {
      console.error('加载板块失败', error);
      // 使用默认板块
      setBoards([
        { id: '1', slug: 'check-in', name: '打卡板块', icon: '📅', postsCount: 0, isActive: true, order: 1, createdAt: '', updatedAt: '', description: null },
        { id: '2', slug: 'learning', name: '学习分享', icon: '📚', postsCount: 0, isActive: true, order: 2, createdAt: '', updatedAt: '', description: null },
        { id: '3', slug: 'career', name: '就业分享', icon: '💼', postsCount: 0, isActive: true, order: 3, createdAt: '', updatedAt: '', description: null },
        { id: '4', slug: 'blog', name: '博客广场', icon: '✍️', postsCount: 0, isActive: true, order: 4, createdAt: '', updatedAt: '', description: null },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VSCodeLayout boards={boards} unreadCount={3}>
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-vscode-text-primary mb-2">
            欢迎使用 Frame Zero
          </h1>
          <p className="text-vscode-text-secondary text-sm">
            计算机学习社区 - 记录你的编程成长之路
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Link href="/check-in">
            <Button>今日打卡</Button>
          </Link>
          <Link href="/check-in">
            <Button variant="secondary">发布文章</Button>
          </Link>
          <Link href="/learning">
            <Button variant="secondary">浏览帖子</Button>
          </Link>
        </div>

        {/* Boards */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-vscode-text-primary mb-4">
            探索板块
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-vscode-text-secondary">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              加载中...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {boards.map((board) => (
                <Link
                  key={board.id}
                  href={`/${board.slug}`}
                  className="p-4 bg-vscode-bg-secondary rounded border border-vscode-border hover:border-vscode-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{board.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-vscode-text-primary">
                        {board.name}
                      </h3>
                      <p className="text-xs text-vscode-text-secondary">
                        {board.postsCount || 0} 篇帖子
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Posts Placeholder */}
        <div>
          <h2 className="text-lg font-semibold text-vscode-text-primary mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            最新帖子
          </h2>
          <div className="p-4 bg-vscode-bg-secondary rounded border border-vscode-border text-sm text-vscode-text-secondary">
            帖子列表功能开发中...
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 p-4 bg-vscode-bg-secondary rounded border border-vscode-border">
          <h3 className="text-sm font-semibold text-vscode-text-primary mb-2">
            🚀 快速开始
          </h3>
          <ul className="text-xs text-vscode-text-secondary space-y-1">
            <li>• 点击左侧板块图标浏览不同内容</li>
            <li>• 每日打卡记录学习进度</li>
            <li>• 在状态栏查看通知和账户信息</li>
            <li>• 分享你的学习经验和心得</li>
          </ul>
        </div>
      </div>
    </VSCodeLayout>
  );
}
