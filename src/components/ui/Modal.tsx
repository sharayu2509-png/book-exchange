import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export const Modal = ({ open, onClose, title, description, children, footer }: ModalProps) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-[28px] border border-border bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-text">{title}</h2>
                {description ? <p className="mt-2 text-sm leading-7 text-subtext">{description}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-subtext transition hover:bg-bg hover:text-text"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            {children ? <div className="mt-5">{children}</div> : null}
            {footer ? <div className="mt-6">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
