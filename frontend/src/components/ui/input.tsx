import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-vscode-border bg-vscode-bg-tertiary px-3 py-2 text-sm text-vscode-text-primary placeholder:text-vscode-text-tertiary focus-visible:outline-none focus-visible:border-vscode-accent focus-visible:ring-1 focus-visible:ring-vscode-accent disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
