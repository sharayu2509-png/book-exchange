import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  Lock,
  Mail,
  Smartphone,
  Sparkles,
  User,
} from 'lucide-react';
import { useEffect, useMemo, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { RegistrationPayload } from '../types';

interface AuthPageProps {
  type: 'login' | 'signup';
}

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type SignupFormValues = RegistrationPayload & {
  confirmPassword: string;
};

interface AuthPanelProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const AuthPage = ({ type }: AuthPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? '/home';
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const onSuccess = (message: string) => {
    setSubmitError(null);
    setSuccessMessage(message);
  };

  const onError = (message: string) => {
    setSuccessMessage(null);
    setSubmitError(message);
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid w-full overflow-hidden rounded-[32px] border border-border bg-white shadow-soft lg:grid-cols-[0.95fr_1.05fr]"
        >
          <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-accent/15 px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <div className="relative z-10 flex h-full flex-col justify-between gap-10">
              <div className="flex items-center gap-3 text-primary">
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  <BookOpen size={22} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.34em]">Student Market</p>
                  <h1 className="text-2xl font-semibold text-text">Book Exchange</h1>
                </div>
              </div>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm">
                  <Sparkles size={16} />
                  Premium student marketplace
                </div>
                <div className="max-w-xl space-y-4">
                  <h2 className="text-3xl font-semibold leading-tight text-text sm:text-4xl">
                    Swap books, save money, and stay ready for every semester.
                  </h2>
                  <p className="max-w-lg text-sm leading-7 text-subtext sm:text-base">
                    Create your student account or return to your library with a responsive, secure authentication flow.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {['Fast sign in', 'Validated sign up', 'Secure session handling'].map((item) => (
                    <div key={item} className="rounded-3xl border border-border bg-white/80 p-4 text-sm font-medium text-text shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-border bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-secondary/10 p-3 text-secondary">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-text">Built for students</p>
                    <p className="text-sm text-subtext">Responsive on mobile, tablet, and wide screens.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-semibold text-text">
                    {type === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-subtext">
                    {type === 'login'
                      ? 'Sign in to continue buying, selling, and chatting with other students.'
                      : 'Join the exchange and start listing or saving books in minutes.'}
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {successMessage ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="mt-6 rounded-[28px] border border-secondary/20 bg-secondary/10 p-6"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-white p-3 text-secondary shadow-sm">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-text">{successMessage}</p>
                        <p className="mt-1 text-sm text-subtext">Redirecting you now.</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    {type === 'login' ? (
                      <LoginPanel
                        onSuccess={onSuccess}
                        onError={onError}
                        error={submitError}
                      />
                    ) : (
                      <SignupPanel
                        onSuccess={onSuccess}
                        onError={onError}
                        error={submitError}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

const LoginPanel = ({ onSuccess, onError, error }: AuthPanelProps & { error: string | null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

  const { register, handleSubmit, formState, getValues } = useForm<LoginFormValues>({
    mode: 'onChange',
    defaultValues: { email: '', password: '', rememberMe: true },
  });

  const redirectTo = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? '/home';
  }, [location.state]);

  const submit = async (values: LoginFormValues) => {
    try {
      const session = await login(values);
      onSuccess(`Welcome back, ${session.user.name}.`);
      setTimeout(() => navigate(redirectTo, { replace: true }), 700);
    } catch (loginError) {
      onError(loginError instanceof Error ? loginError.message : 'Unable to sign in');
    }
  };

  const google = async () => {
    try {
      await loginWithGoogle({
        name: 'Book Exchange Student',
        email: getValues('email') || 'student@bookexchange.edu',
        college: 'Campus College',
        branch: 'Computer Science',
        semester: '4th',
        phone: '9999999999',
        avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=book-exchange',
      });
      onSuccess('Signed in with Google.');
      setTimeout(() => navigate(redirectTo, { replace: true }), 700);
    } catch (googleError) {
      onError(googleError instanceof Error ? googleError.message : 'Google sign-in failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <AuthField
        icon={<Mail size={16} />}
        placeholder="Email Address"
        type="email"
        autoComplete="email"
        error={formState.errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Enter a valid email address',
          },
        })}
      />

      <AuthPasswordField
        register={register}
        error={formState.errors.password?.message}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-3 text-sm text-subtext">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            {...register('rememberMe')}
          />
          Remember me
        </label>
        <button type="button" className="text-sm font-semibold text-primary transition hover:underline">
          Forgot password?
        </button>
      </div>

      {error ? <div className="rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">{error}</div> : null}

      <button
        type="submit"
        disabled={!formState.isValid || formState.isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {formState.isSubmitting ? <LoaderCircle className="animate-spin" size={18} /> : null}
        Login
      </button>

      <button
        type="button"
        onClick={google}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-text transition hover:bg-bg"
      >
        <Sparkles size={16} className="text-primary" />
        Continue with Google
      </button>

      <div className="flex items-center gap-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-subtext">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-subtext">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-primary transition hover:underline">
          Create Account
        </Link>
      </p>
    </form>
  );
};

const SignupPanel = ({ onSuccess, onError, error }: AuthPanelProps & { error: string | null }) => {
  const navigate = useNavigate();
  const { register: registerAccount, loginWithGoogle } = useAuth();

  const { register, handleSubmit, formState, getValues, setError } = useForm<SignupFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      college: '',
      branch: '',
      semester: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const submit = async (values: SignupFormValues) => {
    if (values.password !== values.confirmPassword) {
      setError('confirmPassword', { type: 'validate', message: 'Passwords do not match' });
      return;
    }

    try {
      const session = await registerAccount(values);
      onSuccess(`Account created for ${session.user.name}.`);
      setTimeout(() => navigate('/home', { replace: true }), 700);
    } catch (registerError) {
      onError(registerError instanceof Error ? registerError.message : 'Unable to create account');
    }
  };

  const google = async () => {
    try {
      await loginWithGoogle({
        name: getValues('name') || 'Book Exchange Student',
        email: getValues('email') || 'student@bookexchange.edu',
        college: getValues('college') || 'Campus College',
        branch: getValues('branch') || 'Computer Science',
        semester: getValues('semester') || '4th',
        phone: getValues('phone') || '9999999999',
        avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=book-exchange',
      });
      onSuccess('Account linked with Google.');
      setTimeout(() => navigate('/home', { replace: true }), 700);
    } catch (googleError) {
      onError(googleError instanceof Error ? googleError.message : 'Google sign-up failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          icon={<User size={16} />}
          placeholder="Full Name"
          autoComplete="name"
          error={formState.errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 3, message: 'Enter at least 3 characters' },
          })}
        />
        <AuthField
          icon={<Mail size={16} />}
          placeholder="Email Address"
          type="email"
          autoComplete="email"
          error={formState.errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          icon={<GraduationCap size={16} />}
          placeholder="College Name"
          error={formState.errors.college?.message}
          {...register('college', { required: 'College name is required' })}
        />
        <AuthField
          icon={<GraduationCap size={16} />}
          placeholder="Branch"
          error={formState.errors.branch?.message}
          {...register('branch', { required: 'Branch is required' })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          icon={<BookOpen size={16} />}
          placeholder="Semester"
          error={formState.errors.semester?.message}
          {...register('semester', { required: 'Semester is required' })}
        />
        <AuthField
          icon={<Smartphone size={16} />}
          placeholder="Mobile Number"
          type="tel"
          autoComplete="tel"
          error={formState.errors.phone?.message}
          {...register('phone', {
            required: 'Mobile number is required',
            pattern: {
              value: /^\d{10}$/,
              message: 'Enter a valid 10-digit mobile number',
            },
          })}
        />
      </div>

      <div className="grid gap-4">
        <AuthPasswordField register={register} error={formState.errors.password?.message} />
        <AuthPasswordField
          register={register}
          error={formState.errors.confirmPassword?.message}
          name="confirmPassword"
          placeholder="Confirm Password"
          autoComplete="new-password"
        />
      </div>

      {error ? <div className="rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">{error}</div> : null}

      <button
        type="submit"
        disabled={!formState.isValid || formState.isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {formState.isSubmitting ? <LoaderCircle className="animate-spin" size={18} /> : null}
        Create Account
      </button>

      <button
        type="button"
        onClick={google}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-text transition hover:bg-bg"
      >
        <Sparkles size={16} className="text-primary" />
        Continue with Google
      </button>

      <div className="flex items-center gap-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-subtext">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-subtext">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary transition hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode;
  error?: string;
  trailing?: ReactNode;
};

function AuthField({ icon, error, trailing, className, ...props }: AuthFieldProps) {
  return (
    <label className="space-y-2">
      <div className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${error ? 'border-error' : 'border-border focus-within:border-primary'} ${className ?? ''}`}>
        <span className="text-primary">{icon}</span>
        <input {...props} className="w-full bg-transparent text-sm outline-none placeholder:text-subtext/70" />
        {trailing}
      </div>
      {error ? <p className="text-sm text-error">{error}</p> : null}
    </label>
  );
}

type PasswordFieldProps = Omit<AuthFieldProps, 'icon' | 'type'> & {
  register: (...args: any[]) => any;
  name?: 'password' | 'confirmPassword';
  placeholder?: string;
};

function AuthPasswordField({
  register,
  name = 'password',
  placeholder = 'Password',
  error,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <AuthField
      icon={<Lock size={16} />}
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      autoComplete={name === 'password' ? 'current-password' : 'new-password'}
      error={error}
      trailing={
        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          className="rounded-full p-1 text-subtext transition hover:text-primary"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
      {...register(name)}
    />
  );
}
