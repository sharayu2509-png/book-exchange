import { LoaderCircle } from 'lucide-react';

export const LoadingState = ({ label = 'Loading...' }: { label?: string }) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="flex items-center gap-3 rounded-3xl border border-border bg-white px-6 py-4 shadow-soft">
        <LoaderCircle className="animate-spin text-primary" size={18} />
        <span className="text-sm font-medium text-subtext">{label}</span>
      </div>
    </div>
  );
};
