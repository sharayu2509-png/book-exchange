import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  default: AlertCircle,
};

export const ToastViewport = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.variant ?? 'default'];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="pointer-events-auto overflow-hidden rounded-3xl border border-border bg-white shadow-soft"
            >
              <div className="flex gap-3 p-4">
                <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text">{toast.title}</p>
                  {toast.description ? <p className="mt-1 text-sm text-subtext">{toast.description}</p> : null}
                </div>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="rounded-full p-1 text-subtext transition hover:bg-bg hover:text-text"
                  aria-label="Dismiss toast"
                >
                  <X size={16} />
                </button>
              </div>
              <div
                className={`h-1 ${
                  toast.variant === 'error' ? 'bg-red-400' : toast.variant === 'info' ? 'bg-blue-400' : 'bg-primary'
                }`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

