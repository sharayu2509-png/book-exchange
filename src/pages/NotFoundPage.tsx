import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="max-w-lg rounded-[28px] border border-border bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm leading-7 text-subtext">
          The page you are looking for does not exist or may have moved.
        </p>
        <Link
          to="/home"
          className="mt-6 inline-flex rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition hover:scale-[1.01]"
        >
          Return home
        </Link>
      </div>
    </div>
  );
};
