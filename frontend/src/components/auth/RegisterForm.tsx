'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      return;
    }

    try {
      await register({ email, username, password });
      router.push('/');
    } catch (error) {
      // 错误已经在 store 中设置
    }
  };

  return (
    <Card className="w-full max-w-md p-8 bg-vscode-bg-secondary border-vscode-border">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-vscode-text-primary mb-2">
          创建账号
        </h1>
        <p className="text-vscode-text-secondary">
          加入 Frame Zero 计算机学习社区
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-vscode-text-primary">
            邮箱
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-vscode-bg-primary border-vscode-border text-vscode-text-primary placeholder:text-vscode-text-secondary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-vscode-text-primary">
            用户名
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={20}
            pattern="^[a-zA-Z0-9_]+$"
            className="bg-vscode-bg-primary border-vscode-border text-vscode-text-primary placeholder:text-vscode-text-secondary"
          />
          <p className="text-xs text-vscode-text-secondary">
            3-20个字符，只能包含字母、数字和下划线
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-vscode-text-primary">
            密码
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="bg-vscode-bg-primary border-vscode-border text-vscode-text-primary placeholder:text-vscode-text-secondary pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-vscode-text-secondary hover:text-vscode-text-primary"
            >
              {showPassword ? '隐藏' : '显示'}
            </button>
          </div>
          <p className="text-xs text-vscode-text-secondary">
            至少8个字符，包含字母和数字
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-vscode-text-primary">
            确认密码
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-vscode-bg-primary border-vscode-border text-vscode-text-primary placeholder:text-vscode-text-secondary"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-400">密码不匹配</p>
          )}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded">
            {Array.isArray(error) ? error.join(', ') : error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || password !== confirmPassword}
          className="w-full bg-vscode-accent hover:bg-vscode-accent/90 text-white"
        >
          {isLoading ? '注册中...' : '注册'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-vscode-text-secondary">
        已有账号？{' '}
        <Link href="/auth/login" className="text-vscode-accent hover:underline">
          立即登录
        </Link>
      </div>
    </Card>
  );
}
