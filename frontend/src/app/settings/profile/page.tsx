'use client';

import { useState } from 'react';
import { VSCodeLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { User, Key } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import * as usersApi from '@/lib/api/users.service';
import { useRouter } from 'next/navigation';

export default function ProfileSettingsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await usersApi.updateMyProfile({ username, bio: bio || null });
      setMessage('资料更新成功！');
      // 更新 store 中的用户信息
    } catch (error: any) {
      setMessage(error.response?.data?.message || '更新失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }

    try {
      await usersApi.changePassword({ currentPassword, newPassword });
      setMessage('密码修改成功！');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage(error.response?.data?.message || '修改失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VSCodeLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-vscode-text-primary mb-2">
            账户设置
          </h1>
          <p className="text-vscode-text-secondary text-sm">
            管理你的个人资料和账户安全
          </p>
        </div>

        {/* Profile Section */}
        <Card className="mb-6 p-6 bg-vscode-bg-secondary border-vscode-border">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-vscode-accent" />
            <h2 className="text-lg font-semibold text-vscode-text-primary">
              个人资料
            </h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-vscode-text-primary">
                用户名
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-vscode-bg-primary border-vscode-border text-vscode-text-primary"
                minLength={3}
                maxLength={20}
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-vscode-text-primary">
                个人简介
              </Label>
              <textarea
                id="bio"
                className="w-full h-24 bg-vscode-bg-primary border-vscode-border rounded px-3 py-2 text-sm text-vscode-text-primary placeholder:text-vscode-text-secondary focus:outline-none focus:border-vscode-accent"
                placeholder="介绍一下你自己..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
              />
            </div>

            {message && (
              <div className={`p-3 rounded text-sm ${
                message.includes('成功')
                  ? 'bg-green-900/20 border border-green-900/50 text-green-400'
                  : 'bg-red-900/20 border border-red-900/50 text-red-400'
              }`}>
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-vscode-accent hover:bg-vscode-accent/90"
            >
              {isLoading ? '保存中...' : '保存更改'}
            </Button>
          </form>
        </Card>

        {/* Password Section */}
        <Card className="p-6 bg-vscode-bg-secondary border-vscode-border">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-5 h-5 text-vscode-accent" />
            <h2 className="text-lg font-semibold text-vscode-text-primary">
              修改密码
            </h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-vscode-text-primary">
                当前密码
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-vscode-bg-primary border-vscode-border text-vscode-text-primary"
                required
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-vscode-text-primary">
                新密码
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-vscode-bg-primary border-vscode-border text-vscode-text-primary"
                required
                minLength={8}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-vscode-text-primary">
                确认新密码
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-vscode-bg-primary border-vscode-border text-vscode-text-primary"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="secondary"
            >
              {isLoading ? '修改中...' : '修改密码'}
            </Button>
          </form>
        </Card>
      </div>
    </VSCodeLayout>
  );
}
