import { ReactNode } from 'react';
import Link from 'next/link';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-vscode-bg-primary px-4">
      <div className="w-full max-w-md">
        {/* Logo/标题 */}
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-4xl font-bold text-vscode-text-primary">
            Frame Zero
          </h1>
          <p className="text-vscode-text-secondary mt-2">
            计算机学习社区
          </p>
        </Link>

        {children}
      </div>
    </div>
  );
}
