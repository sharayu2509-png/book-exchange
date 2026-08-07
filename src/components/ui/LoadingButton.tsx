import { LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  children: ReactNode;
};

export const LoadingButton = ({ isLoading, children, className = '', disabled, ...props }: LoadingButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 ${className}`}
    >
      {isLoading ? <LoaderCircle size={18} className="animate-spin" /> : null}
      {children}
    </button>
  );
};
