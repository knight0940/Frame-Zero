'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
      router.push('/');
    } catch (error) {
      // 错误已经在 store 中设置
    }
  };

  return (
    <Card className="w-full max-w-md p-8 bg-vscode-bg-secondary border-vscode-border">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-vscode-text-primary mb-2">
          欢迎回来
        </h1>
        <p className="text-vscode-text-secondary">
          登录 Frame Zero 计算机学习社区
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
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-vscode-accent hover:bg-vscode-accent/90 text-white"
        >
          {isLoading ? '登录中...' : '登录'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-vscode-text-secondary">
        还没有账号？{' '}
        <Link
          href="/auth/register"
          className="text-vscode-accent hover:underline"
        >
          立即注册
        </Link>
      </div>
    </Card>
  );
}
