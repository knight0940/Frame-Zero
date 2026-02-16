'use client';

import { useState, useEffect } from 'react';
import { VSCodeLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { PenTool, Plus, Loader2 } from 'lucide-react';
import * as postsApi from '@/lib/api/posts.service';
import * as boardsApi from '@/lib/api/boards.service';
import type { Post, Board } from '@/lib/api/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 获取博客广场板块
      const boards = await boardsApi.getBoards();
      const blogBoard = boards.find((b: Board) => b.slug === 'blog');

      if (blogBoard) {
        setBoard(blogBoard);
        // 获取该板块的帖子
        const response = await postsApi.getPosts({ boardId: blogBoard.id });
        setPosts(response.data);
      }
    } catch (error) {
      console.error('加载数据失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VSCodeLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{board?.icon || '✍️'}</span>
            <div>
              <h1 className="text-2xl font-semibold text-vscode-text-primary">
                {board?.name || '博客广场'}
              </h1>
              <p className="text-vscode-text-secondary text-sm">
                {board?.description || '发布技术博客和文章'}
              </p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            写博客
          </Button>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-vscode-text-secondary">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            加载中...
          </div>
        ) : posts.length > 0 ? (
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
                    {post.excerpt && (
                      <p className="text-sm text-vscode-text-secondary mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-vscode-text-tertiary">
                      <span>{post.author?.username || '匿名'}</span>
                      <span>❤️ {post.likeCount}</span>
                      <span>💬 {post.commentCount}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <PenTool className="w-16 h-16 mx-auto text-vscode-text-tertiary mb-4" />
            <p className="text-vscode-text-secondary mb-4">
              还没有博客文章，开始写你的第一篇博客吧！
            </p>
            <Button>写第一篇博客</Button>
          </div>
        )}
      </div>
    </VSCodeLayout>
  );
}
