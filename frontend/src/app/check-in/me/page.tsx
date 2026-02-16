'use client';

import { useState, useEffect } from 'react';
import { VSCodeLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Calendar, TrendingUp, Award, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import * as checkInApi from '@/lib/api/check-in.service';
import * as usersApi from '@/lib/api/users.service';
import type { CheckIn } from '@/lib/api/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyCheckInPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [content, setContent] = useState('');
  const [studyHours, setStudyHours] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [todayCheckIn, setTodayCheckIn] = useState<CheckIn | null>(null);
  const [stats, setStats] = useState({
    consecutiveDays: 0,
    totalDays: 0,
  });

  // 加载打卡数据
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    loadCheckInData();
  }, [isAuthenticated]);

  const loadCheckInData = async () => {
    try {
      const today = await checkInApi.getTodayCheckIn();
      setTodayCheckIn(today);

      // 获取用户统计数据
      const userStats = await usersApi.getMyStats();
      setStats({
        consecutiveDays: userStats.consecutiveCheckInDays,
        totalDays: userStats.checkInDays,
      });
    } catch (error) {
      console.error('加载打卡数据失败', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await checkInApi.createCheckIn({
        content: content || undefined,
        studyHours: parseFloat(studyHours) || 0,
      });

      setMessage('打卡成功！');
      setContent('');
      setStudyHours('');
      await loadCheckInData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || '打卡失败';
      if (errorMsg.includes('Already checked in')) {
        setMessage('今天已经打过卡了！');
      } else {
        setMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <VSCodeLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/check-in" className="inline-flex items-center text-sm text-vscode-text-secondary hover:text-vscode-text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回打卡广场
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📅</span>
            <h1 className="text-2xl font-semibold text-vscode-text-primary">
              我的打卡
            </h1>
          </div>
          <p className="text-vscode-text-secondary text-sm">
            每日学习打卡，记录成长足迹
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-vscode-bg-secondary border-vscode-border">
            <div className="flex items-center gap-2 text-vscode-text-secondary text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>连续打卡</span>
            </div>
            <div className="text-3xl font-bold text-vscode-accent">
              {stats.consecutiveDays} 天
            </div>
          </Card>

          <Card className="p-4 bg-vscode-bg-secondary border-vscode-border">
            <div className="flex items-center gap-2 text-vscode-text-secondary text-sm mb-2">
              <Award className="w-4 h-4" />
              <span>累计打卡</span>
            </div>
            <div className="text-3xl font-bold text-vscode-text-primary">
              {stats.totalDays} 天
            </div>
          </Card>
        </div>

        {/* Check In Form */}
        {!todayCheckIn && (
          <Card className="mb-6 p-4 bg-vscode-bg-secondary border-vscode-border">
            <h2 className="text-lg font-semibold text-vscode-text-primary mb-4">
              今日打卡
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="content" className="text-vscode-text-primary">
                  学习内容
                </Label>
                <textarea
                  id="content"
                  className="w-full h-24 bg-vscode-bg-primary border border-vscode-border rounded px-3 py-2 text-sm text-vscode-text-primary placeholder:text-vscode-text-secondary focus:outline-none focus:border-vscode-accent"
                  placeholder="今天学了什么？"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="hours" className="text-vscode-text-primary">
                  学习时长（小时）
                </Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="例如：3.5"
                  value={studyHours}
                  onChange={(e) => setStudyHours(e.target.value)}
                  className="bg-vscode-bg-primary border-vscode-border text-vscode-text-primary"
                />
              </div>

              {message && (
                <div
                  className={`p-3 rounded text-sm ${
                    message.includes('成功')
                      ? 'bg-green-900/20 border border-green-900/50 text-green-400'
                      : 'bg-red-900/20 border border-red-900/50 text-red-400'
                  }`}
                >
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-vscode-accent hover:bg-vscode-accent/90"
              >
                {isLoading ? '提交中...' : '提交打卡'}
              </Button>
            </form>
          </Card>
        )}

        {/* Today's Check In Display */}
        {todayCheckIn && (
          <Card className="mb-6 p-4 bg-vscode-bg-secondary border-vscode-border">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-vscode-text-primary">
                今日已打卡
              </h2>
            </div>
            <div className="text-sm text-vscode-text-secondary space-y-1">
              <p>学习时长：{todayCheckIn.studyHours} 小时</p>
              {todayCheckIn.content && <p>内容：{todayCheckIn.content}</p>}
              <p className="text-xs">
                打卡时间：{new Date(todayCheckIn.createdAt).toLocaleString('zh-CN')}
              </p>
            </div>
          </Card>
        )}
      </div>
    </VSCodeLayout>
  );
}
