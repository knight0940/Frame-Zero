'use client';

import { VSCodeLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

export default function LearningPage() {
  const posts = [
    {
      id: '1',
      title: 'React 18新特性详解',
      excerpt: 'React 18带来了并发渲染、自动批处理等新特性...',
      author: 'react_expert',
      likes: 89,
      comments: 25,
      createdAt: '3小时前',
    },
    {
      id: '2',
      title: 'Python爬虫入门教程',
      excerpt: '从零开始学习Python爬虫，包含requests、beautifulsoup等库的使用...',
      author: 'python_master',
      likes: 156,
      comments: 42,
      createdAt: '1天前',
    },
  ];

  return (
    <VSCodeLayout
      user={{
        username: 'admin',
        role: 'FOUNDER',
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h1 className="text-2xl font-semibold text-vscode-text-primary">
                学习分享
              </h1>
              <p className="text-vscode-text-secondary text-sm">
                分享学习资源和技术文章
              </p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            发布资源
          </Button>
        </div>

        {/* Posts List */}
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-vscode-bg-secondary rounded border border-vscode-border hover:border-vscode-accent cursor-pointer transition-colors group"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">📄</span>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-vscode-text-primary mb-2 group-hover:text-vscode-accent">
                    {post.title}
                  </h3>
                  <p className="text-sm text-vscode-text-secondary mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-vscode-text-tertiary">
                    <span>{post.author}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-vscode-text-tertiary mb-4" />
            <p className="text-vscode-text-secondary mb-4">
              还没有学习资源，成为第一个分享的人吧！
            </p>
            <Button>发布第一个资源</Button>
          </div>
        )}
      </div>
    </VSCodeLayout>
  );
}
