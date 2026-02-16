'use client';

import { useState, useEffect } from 'react';
import { VSCodeLayout } from '@/components/layout';
import { Star, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuthStore();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    // TODO: 从API获取收藏列表
    // 目前先显示空状态
    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <VSCodeLayout>
        <div className="p-6 text-center text-vscode-text-secondary">
          请先登录查看收藏
        </div>
      </VSCodeLayout>
    );
  }

  return (
    <VSCodeLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-6 h-6 text-vscode-accent" />
          <div>
            <h1 className="text-2xl font-semibold text-vscode-text-primary">
              我的收藏
            </h1>
            <p className="text-vscode-text-secondary text-sm">
              收藏的帖子和内容
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-vscode-text-secondary">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            加载中...
          </div>
        ) : favorites.length > 0 ? (
          <div className="space-y-3">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-vscode-bg-secondary rounded border border-vscode-border hover:border-vscode-accent cursor-pointer transition-colors"
              >
                {/* 收藏项内容 */}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Star className="w-16 h-16 mx-auto text-vscode-text-tertiary mb-4" />
            <p className="text-vscode-text-secondary mb-2">
              还没有收藏任何内容
            </p>
            <p className="text-xs text-vscode-text-tertiary">
              浏览帖子时点击收藏按钮即可添加到这里
            </p>
          </div>
        )}
      </div>
    </VSCodeLayout>
  );
}
