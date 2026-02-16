'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Star,
  Search,
  Calendar,
  Bell,
  User,
  Settings,
  Home,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  href?: string;
  paths?: string[]; // 用于匹配多个路径
}

interface ActivityBarProps {
  activeItem?: string;
  onActiveChange?: (itemId: string) => void;
  unreadCount?: number; // 新增：未读通知数量
}

export function ActivityBar({
  activeItem,
  onActiveChange,
  unreadCount = 0
}: ActivityBarProps) {
  const pathname = usePathname();

  const activityItems: ActivityItem[] = [
    { id: 'home', icon: Home, label: '首页', href: '/', paths: ['/'] },
    { id: 'favorites', icon: Star, label: '收藏', href: '/favorites' },
    { id: 'search', icon: Search, label: '搜索', href: '/search' },
    { id: 'notifications', icon: Bell, label: '通知', href: '/notifications', badge: unreadCount },
    { id: 'account', icon: User, label: '账户', href: '/settings/profile' },
  ];

  // 判断当前按钮是否激活
  const isActive = (item: ActivityItem) => {
    if (item.paths) {
      return item.paths.some(path => pathname === path || pathname.startsWith(path + '/'));
    }
    return pathname === item.href;
  };

  return (
    <div className="w-12 bg-vscode-bg-secondary flex flex-col items-center py-2 border-r border-vscode-border">
      {/* Logo */}
      <div className="w-10 h-10 mb-4 flex items-center justify-center">
        <div className="text-xl font-bold text-vscode-accent">FZ</div>
      </div>

      {/* Activity Items */}
      <div className="flex flex-col gap-1 flex-1">
        {activityItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          const buttonContent = (
            <>
              <Icon className="w-5 h-5" />

              {/* Badge */}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center px-1 bg-vscode-accent text-white text-[10px] font-medium rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </>
          );

          return (
            <div key={item.id} className="relative">
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'relative w-10 h-10 flex items-center justify-center rounded-md transition-colors',
                    'group',
                    active
                      ? 'bg-vscode-bg-active text-vscode-text-primary'
                      : 'text-vscode-text-tertiary hover:bg-vscode-bg-hover hover:text-vscode-text-primary'
                  )}
                  title={item.label}
                >
                  {buttonContent}
                </Link>
              ) : (
                <button
                  onClick={() => onActiveChange?.(item.id)}
                  className={cn(
                    'relative w-10 h-10 flex items-center justify-center rounded-md transition-colors',
                    'group',
                    active
                      ? 'bg-vscode-bg-active text-vscode-text-primary'
                      : 'text-vscode-text-tertiary hover:bg-vscode-bg-hover hover:text-vscode-text-primary'
                  )}
                  title={item.label}
                >
                  {buttonContent}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Settings */}
      <div className="mt-auto">
        <Link
          href="/settings/profile"
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-md transition-colors',
            'text-vscode-text-tertiary hover:bg-vscode-bg-hover hover:text-vscode-text-primary'
          )}
          title="设置"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
