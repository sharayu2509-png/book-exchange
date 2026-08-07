import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  illustration?: ReactNode;
}

export const EmptyState = ({ title, description, actionLabel, actionTo, illustration }: EmptyStateProps) => {
  return (
    <div className="rounded-[28px] border border-dashed border-border bg-white px-6 py-10 text-center shadow-soft">
      {illustration ? <div className="mx-auto mb-5 flex justify-center">{illustration}</div> : null}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-subtext">{description}</p>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-6 inline-flex rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition hover:scale-[1.01]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};
