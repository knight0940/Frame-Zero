'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';

interface StatusBarProps {
  unreadCount?: number;
  className?: string;
}

export function StatusBar({ unreadCount = 0, className }: StatusBarProps) {
  const { user, isAuthenticated, logout } = useAuthStore();

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'FOUNDER':
        return '👑 创始人';
      case 'ADMIN':
        return '⭐ 管理员';
      case 'USER':
        return '👤 用户';
      default:
        return '';
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div
      className={cn(
        'h-6 bg-vscode-accent flex items-center justify-between px-3 text-xs text-white',
        className
      )}
    >
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {unreadCount > 0 && (
          <span className="flex items-center gap-1.5">
            <span>🔔</span>
            <span>{unreadCount} 条通知</span>
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span>📅</span>
          <span>{dateString}</span>
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>main</span>
        </span>

        {isAuthenticated && user ? (
          <>
            <span className="flex items-center gap-1.5">
              <span>👤</span>
              <span>{user.username}</span>
            </span>
            {getRoleDisplay() && (
              <span className="flex items-center gap-1.5">
                <span>{getRoleDisplay()}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-xs hover:underline"
            >
              登出
            </button>
          </>
        ) : (
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="h-5 text-xs">
              登录
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
