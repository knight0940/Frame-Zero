'use client';

import { useState } from 'react';
import { VSCodeLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import * as postsApi from '@/lib/api/posts.service';
import type { Post } from '@/lib/api/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await postsApi.getPosts({ search: query });
      setResults(response.data);
    } catch (error) {
      console.error('搜索失败', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VSCodeLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-vscode-text-primary mb-2">
            搜索
          </h1>
          <p className="text-vscode-text-secondary text-sm">
            搜索帖子、用户和内容
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-vscode-text-tertiary" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索关键词..."
                className="pl-10 bg-vscode-bg-secondary border-vscode-border text-vscode-text-primary"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-vscode-accent hover:bg-vscode-accent/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  搜索中...
                </>
              ) : (
                '搜索'
              )}
            </Button>
          </div>
        </form>

        {/* Results */}
        {hasSearched && (
          <div>
            <h2 className="text-lg font-semibold text-vscode-text-primary mb-4">
              搜索结果 ({results.length})
            </h2>
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-vscode-bg-secondary rounded border border-vscode-border hover:border-vscode-accent cursor-pointer transition-colors"
                  >
                    <h3 className="text-base font-semibold text-vscode-text-primary mb-2 hover:text-vscode-accent">
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
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-vscode-text-secondary">
                  未找到相关结果
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Tips (show when not searched) */}
        {!hasSearched && (
          <div className="p-4 bg-vscode-bg-secondary rounded border border-vscode-border">
            <h3 className="text-sm font-semibold text-vscode-text-primary mb-2">
              💡 搜索提示
            </h3>
            <ul className="text-xs text-vscode-text-secondary space-y-1">
              <li>• 输入关键词搜索帖子标题和内容</li>
              <li>• 搜索支持模糊匹配</li>
              <li>• 可以搜索用户名、标签等</li>
            </ul>
          </div>
        )}
      </div>
    </VSCodeLayout>
  );
}
