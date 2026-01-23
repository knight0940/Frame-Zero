'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  user?: {
    username: string;
    role: 'FOUNDER' | 'ADMIN' | 'USER';
  };
  unreadCount?: number;
  className?: string;
}

export function StatusBar({ user, unreadCount = 0, className }: StatusBarProps) {
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

        {user && (
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
          </>
        )}
      </div>
    </div>
  );
}
