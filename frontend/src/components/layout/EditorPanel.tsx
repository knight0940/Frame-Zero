'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface Tab {
  id: string;
  title: string;
  isActive?: boolean;
  onClose?: () => void;
}

interface EditorPanelProps {
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function EditorPanel({
  tabs = [],
  activeTab,
  onTabChange,
  onTabClose,
  children,
  className,
}: EditorPanelProps) {
  return (
    <div className={cn('flex-1 flex flex-col bg-vscode-bg-primary overflow-hidden', className)}>
      {/* Tabs Bar */}
      {tabs.length > 0 && (
        <div className="flex items-center bg-vscode-bg-secondary border-b border-vscode-border overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 border-r border-vscode-border text-sm cursor-pointer group min-w-[120px] max-w-[200px]',
                'hover:bg-vscode-bg-hover',
                tab.isActive
                  ? 'bg-vscode-bg-primary text-vscode-text-primary'
                  : 'text-vscode-text-secondary'
              )}
              onClick={() => onTabChange?.(tab.id)}
            >
              <span className="truncate flex-1">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose?.(tab.id);
                }}
                className={cn(
                  'hover:bg-vscode-bg-active rounded p-0.5 transition-colors',
                  'opacity-0 group-hover:opacity-100'
                )}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
