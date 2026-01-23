'use client';

import React from 'react';
import {
  Files,
  Search,
  Calendar,
  Bell,
  User,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

const activityItems: ActivityItem[] = [
  { id: 'explorer', icon: Files, label: '板块浏览' },
  { id: 'search', icon: Search, label: '搜索' },
  { id: 'check-in', icon: Calendar, label: '打卡' },
  { id: 'notifications', icon: Bell, label: '通知', badge: 3 },
  { id: 'account', icon: User, label: '账户' },
];

interface ActivityBarProps {
  activeItem?: string;
  onActiveChange?: (itemId: string) => void;
}

export function ActivityBar({ activeItem = 'explorer', onActiveChange }: ActivityBarProps) {
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
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onActiveChange?.(item.id)}
              className={cn(
                'relative w-10 h-10 flex items-center justify-center rounded-md transition-colors',
                'group',
                isActive
                  ? 'bg-vscode-bg-active text-vscode-text-primary'
                  : 'text-vscode-text-tertiary hover:bg-vscode-bg-hover hover:text-vscode-text-primary'
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />

              {/* Badge */}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center px-1 bg-vscode-accent text-white text-[10px] font-medium rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Settings */}
      <div className="mt-auto">
        <button
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-md transition-colors',
            'text-vscode-text-tertiary hover:bg-vscode-bg-hover hover:text-vscode-text-primary'
          )}
          title="设置"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
