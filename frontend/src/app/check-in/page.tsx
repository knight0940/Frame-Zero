'use client';

import { useState, useEffect } from 'react';
import { VSCodeLayout } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import * as checkInApi from '@/lib/api/check-in.service';
import type { CheckIn } from '@/lib/api/types';
import Link from 'next/link';

interface CheckInWithAuthor extends CheckIn {
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export default function CheckInPage() {
  const { isAuthenticated } = useAuthStore();
  const [checkIns, setCheckIns] = useState<CheckInWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCheckIns();
  }, [page]);

  const loadCheckIns = async () => {
    try {
      setIsLoading(true);
      const response = await checkInApi.getCheckInHistory(page, 20);
      setCheckIns(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('加载打卡记录失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    }
  };

  return (
    <VSCodeLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📅</span>
              <h1 className="text-2xl font-semibold text-vscode-text-primary">
                打卡广场
              </h1>
            </div>
            <p className="text-vscode-text-secondary text-sm">
              查看大家的每日学习打卡记录
            </p>
          </div>
          {isAuthenticated && (
            <Link href="/check-in/me">
              <Button>我的打卡</Button>
            </Link>
          )}
        </div>

        {/* Check-in Feed */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-vscode-text-secondary">
            加载中...
          </div>
        ) : checkIns.length > 0 ? (
          <div className="space-y-4">
            {checkIns.map((checkIn) => (
              <Card
                key={checkIn.id}
                className="p-4 bg-vscode-bg-secondary border-vscode-border hover:border-vscode-accent transition-colors"
              >
                {/* Author & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-vscode-accent flex items-center justify-center text-sm font-medium">
                      {checkIn.author.avatar ? (
                        <img
                          src={checkIn.author.avatar}
                          alt={checkIn.author.username}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        checkIn.author.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-sm font-medium text-vscode-text-primary">
                      {checkIn.author.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-vscode-text-secondary">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(checkIn.checkInDate)}</span>
                  </div>
                </div>

                {/* Content */}
                {checkIn.content && (
                  <p className="text-sm text-vscode-text-primary mb-3">
                    {checkIn.content}
                  </p>
                )}

                {/* Study Hours & Tags */}
                <div className="flex items-center gap-4 text-xs text-vscode-text-secondary">
                  {checkIn.studyHours > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>学习 {checkIn.studyHours} 小时</span>
                    </div>
                  )}
                  {checkIn.learnings && checkIn.learnings.length > 0 && (
                    <div className="flex gap-1">
                      {checkIn.learnings.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-vscode-bg-active rounded text-vscode-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  上一页
                </Button>
                <span className="text-sm text-vscode-text-secondary flex items-center">
                  第 {page} / {totalPages} 页
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  下一页
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📝</span>
            <p className="text-vscode-text-secondary mb-2">
              还没有人打卡
            </p>
            {isAuthenticated ? (
              <Link href="/check-in/me">
                <Button>成为第一个打卡的人</Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button>登录后打卡</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </VSCodeLayout>
  );
}
