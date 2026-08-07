import { Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const UnauthorizedPage = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="max-w-lg rounded-[28px] border border-border bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock size={24} />
        </div>
        <h1 className="mt-4 text-3xl font-semibold">Login required</h1>
        <p className="mt-3 text-sm leading-7 text-subtext">
          You need to sign in before you can access {location.state ? 'this area' : 'this feature'}.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/login"
            state={{ from: location.state?.from ?? '/home' }}
            className="rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition hover:scale-[1.01]"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-2xl border border-border bg-white px-5 py-3 font-semibold text-text transition hover:bg-bg"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};
