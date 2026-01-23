'use client';

import React from 'react';
import { FileText, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Board {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  postsCount?: number;
}

interface SidebarProps {
  boards?: Board[];
  activeBoard?: string;
  onBoardChange?: (boardSlug: string) => void;
  className?: string;
}

const defaultBoards: Board[] = [
  { id: '1', slug: 'check-in', name: '打卡板块', icon: '📅', postsCount: 0 },
  { id: '2', slug: 'learning', name: '学习分享', icon: '📚', postsCount: 0 },
  { id: '3', slug: 'career', name: '就业分享', icon: '💼', postsCount: 0 },
  { id: '4', slug: 'blog', name: '博客广场', icon: '✍️', postsCount: 0 },
];

export function Sidebar({
  boards = defaultBoards,
  activeBoard,
  onBoardChange,
  className,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div
      className={cn(
        'bg-vscode-bg-secondary border-r border-vscode-border flex flex-col transition-all duration-200',
        isCollapsed ? 'w-12' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-vscode-border">
        {!isCollapsed && (
          <span className="text-xs font-semibold uppercase tracking-wider text-vscode-text-secondary">
            探索
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-1 rounded hover:bg-vscode-bg-hover transition-colors',
            'text-vscode-text-tertiary hover:text-vscode-text-primary'
          )}
          title={isCollapsed ? '展开侧边栏' : '折叠侧边栏'}
        >
          <svg
            className={cn('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Board List */}
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        <ul className="space-y-0.5">
          {boards.map((board) => (
            <li key={board.id}>
              <button
                onClick={() => onBoardChange?.(board.slug)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors',
                  'text-left',
                  activeBoard === board.slug
                    ? 'bg-vscode-bg-active text-vscode-text-primary'
                    : 'text-vscode-text-secondary hover:bg-vscode-bg-hover hover:text-vscode-text-primary'
                )}
                title={board.name}
              >
                {/* Icon */}
                <span className="text-lg flex-shrink-0">{board.icon}</span>

                {/* Name */}
                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{board.name}</span>
                    {board.postsCount !== undefined && board.postsCount > 0 && (
                      <span className="text-xs text-vscode-text-tertiary">
                        {board.postsCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-vscode-border">
          <div className="text-xs text-vscode-text-tertiary">
            <div>📦 4 个板块</div>
            <div>📝 0 篇文章</div>
          </div>
        </div>
      )}
    </div>
  );
}
