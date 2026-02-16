'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ActivityBar } from './ActivityBar';
import { Sidebar, type Board } from './Sidebar';
import { StatusBar } from './StatusBar';
import { EditorPanel } from './EditorPanel';
import { useAuthStore } from '@/store/auth.store';
import * as notificationsApi from '@/lib/api/notifications.service';

interface VSCodeLayoutProps {
  children: React.ReactNode;
  boards?: Board[];
  unreadCount?: number;
}

export function VSCodeLayout({
  children,
  boards,
  unreadCount: initialUnreadCount = 0,
}: VSCodeLayoutProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const { isAuthenticated } = useAuthStore();

  // 判断是否显示 Sidebar
  const showSidebar = [
    '/learning',
    '/career',
    '/blog',
    '/check-in',
  ].some(path => pathname === path || pathname.startsWith(path + '/'));

  // 获取未读通知数量
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await notificationsApi.getUnreadCount();
        setUnreadCount(response.count);
      } catch (error) {
        console.error('获取未读通知数量失败', error);
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();

    // 每30秒刷新一次未读数量
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-vscode-bg-primary text-vscode-text-primary">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-x-hidden">
        {/* Activity Bar */}
        <ActivityBar unreadCount={unreadCount} />

        {/* Sidebar - 根据路径自动显示 */}
        {showSidebar && <Sidebar boards={boards} />}

        {/* Editor Panel (Main Content) */}
        <EditorPanel>{children}</EditorPanel>
      </div>

      {/* Status Bar */}
      <StatusBar unreadCount={unreadCount} />
    </div>
  );
}
