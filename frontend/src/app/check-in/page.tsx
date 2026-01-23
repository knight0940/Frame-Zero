'use client';

import { VSCodeLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Award } from 'lucide-react';

export default function CheckInPage() {
  return (
    <VSCodeLayout
      user={{
        username: 'admin',
        role: 'FOUNDER',
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📅</span>
            <h1 className="text-2xl font-semibold text-vscode-text-primary">
              打卡板块
            </h1>
          </div>
          <p className="text-vscode-text-secondary text-sm">
            每日学习打卡，记录成长足迹
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-vscode-bg-secondary rounded border border-vscode-border">
            <div className="flex items-center gap-2 text-vscode-text-secondary text-sm mb-2">
              <Calendar className="w-4 h-4" />
              <span>今日打卡</span>
            </div>
            <div className="text-3xl font-bold text-vscode-text-primary">0</div>
          </div>

          <div className="p-4 bg-vscode-bg-secondary rounded border border-vscode-border">
            <div className="flex items-center gap-2 text-vscode-text-secondary text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>连续打卡</span>
            </div>
            <div className="text-3xl font-bold text-vscode-accent">0 天</div>
          </div>

          <div className="p-4 bg-vscode-bg-secondary rounded border border-vscode-border">
            <div className="flex items-center gap-2 text-vscode-text-secondary text-sm mb-2">
              <Award className="w-4 h-4" />
              <span>累计打卡</span>
            </div>
            <div className="text-3xl font-bold text-vscode-text-primary">0 天</div>
          </div>
        </div>

        {/* Check In Form */}
        <div className="mb-6 p-4 bg-vscode-bg-secondary rounded border border-vscode-border">
          <h2 className="text-lg font-semibold text-vscode-text-primary mb-4">
            今日打卡
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-vscode-text-secondary mb-2">
                学习内容
              </label>
              <textarea
                className="w-full h-24 bg-vscode-bg-tertiary border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text-primary placeholder:text-vscode-text-tertiary focus:outline-none focus:border-vscode-accent"
                placeholder="今天学了什么？"
              />
            </div>

            <div>
              <label className="block text-sm text-vscode-text-secondary mb-2">
                学习时长（小时）
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                className="w-full bg-vscode-bg-tertiary border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text-primary focus:outline-none focus:border-vscode-accent"
                placeholder="例如：3.5"
              />
            </div>

            <Button>提交打卡</Button>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="p-4 bg-vscode-bg-secondary rounded border border-vscode-border">
          <h2 className="text-lg font-semibold text-vscode-text-primary mb-4">
            打卡排行榜
          </h2>
          <div className="text-sm text-vscode-text-secondary">
            排行榜功能开发中...
          </div>
        </div>
      </div>
    </VSCodeLayout>
  );
}
