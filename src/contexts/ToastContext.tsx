import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';

type ToastVariant = 'default' | 'success' | 'error' | 'info';

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const dismissToast = (id: string) => {
    toast.dismiss(id);
  };

  const showToast = (input: ToastInput) => {
    const message = input.description ? `${input.title} · ${input.description}` : input.title;

    switch (input.variant) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast(message);
        break;
      default:
        toast(message);
    }
  };

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      dismissToast,
    }),
    [],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
