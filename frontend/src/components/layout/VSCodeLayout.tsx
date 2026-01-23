'use client';

import React, { useState } from 'react';
import { ActivityBar } from './ActivityBar';
import { Sidebar, type Board } from './Sidebar';
import { StatusBar } from './StatusBar';
import { EditorPanel } from './EditorPanel';

interface VSCodeLayoutProps {
  children: React.ReactNode;
  user?: {
    username: string;
    role: 'FOUNDER' | 'ADMIN' | 'USER';
  };
  boards?: Board[];
  unreadCount?: number;
}

export function VSCodeLayout({
  children,
  user,
  boards,
  unreadCount = 0,
}: VSCodeLayoutProps) {
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [activeBoard, setActiveBoard] = useState<string | undefined>();

  return (
    <div className="h-screen w-screen flex flex-col bg-vscode-bg-primary text-vscode-text-primary overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <ActivityBar activeItem={activeActivity} onActiveChange={setActiveActivity} />

        {/* Sidebar */}
        {activeActivity === 'explorer' && (
          <Sidebar
            boards={boards}
            activeBoard={activeBoard}
            onBoardChange={setActiveBoard}
          />
        )}

        {/* Editor Panel (Main Content) */}
        <EditorPanel>{children}</EditorPanel>
      </div>

      {/* Status Bar */}
      <StatusBar user={user} unreadCount={unreadCount} />
    </div>
  );
}
