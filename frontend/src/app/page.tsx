'use client';

import { VSCodeLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export default function HomePage() {
  // 模拟帖子数据
  const posts = [
    {
      id: '1',
      title: '每日打卡-学习Python 10小时',
      author: 'python_lover',
      createdAt: '2小时前',
    },
    {
      id: '2',
      title: '数据结构与算法学习心得',
      author: 'algo_master',
      createdAt: '5小时前',
    },
    {
      id: '3',
      title: '面试准备：前端工程师岗位',
      author: 'frontend_dev',
      createdAt: '1天前',
    },
    {
      id: '4',
      title: '我的第一个React项目',
      author: 'react_fan',
      createdAt: '2天前',
    },
  ];

  const boards = [
    { id: '1', slug: 'check-in', name: '打卡板块', icon: '📅', postsCount: 125 },
    { id: '2', slug: 'learning', name: '学习分享', icon: '📚', postsCount: 89 },
    { id: '3', slug: 'career', name: '就业分享', icon: '💼', postsCount: 56 },
    { id: '4', slug: 'blog', name: '博客广场', icon: '✍️', postsCount: 234 },
  ];

  return (
    <VSCodeLayout
      user={{
        username: 'admin',
        role: 'FOUNDER',
      }}
      boards={boards}
      unreadCount={3}
    >
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
          <Button>今日打卡</Button>
          <Button variant="secondary">发布文章</Button>
          <Button variant="secondary">浏览帖子</Button>
        </div>

        {/* Recent Posts */}
        <div>
          <h2 className="text-lg font-semibold text-vscode-text-primary mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            最新帖子
          </h2>
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-3 p-3 rounded hover:bg-vscode-bg-hover cursor-pointer transition-colors group"
              >
                <span className="text-vscode-text-tertiary text-lg">📄</span>
                <span className="flex-1 text-sm text-vscode-text-primary">
                  {post.title}
                </span>
                <span className="text-xs text-vscode-text-tertiary">
                  {post.author}
                </span>
                <span className="text-xs text-vscode-text-tertiary">
                  {post.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 p-4 bg-vscode-bg-secondary rounded border border-vscode-border">
          <h3 className="text-sm font-semibold text-vscode-text-primary mb-2">
            🚀 快速开始
          </h3>
          <ul className="text-xs text-vscode-text-secondary space-y-1">
            <li>• 点击左侧板块图标浏览不同内容</li>
            <li>• 使用顶部标签页同时打开多个帖子</li>
            <li>• 在状态栏查看通知和账户信息</li>
            <li>• 尝试今日打卡，记录学习进度</li>
          </ul>
        </div>
      </div>
    </VSCodeLayout>
  );
}
