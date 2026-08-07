import { motion } from 'framer-motion';
import { BookOpen, Eye, EyeOff, Mail, Lock, User, GraduationCap, Smartphone } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthPageProps {
  type: 'login' | 'signup';
  onAuthenticate: () => void;
}

export const AuthPage = ({ type, onAuthenticate }: AuthPageProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onAuthenticate();
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-border bg-white shadow-soft">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-gradient-to-br from-primary/10 via-white to-accent/10 p-8 lg:p-12">
            <div className="flex items-center gap-3 text-primary">
              <div className="rounded-2xl bg-primary/10 p-3"><BookOpen size={24} /></div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">Student Market</p>
                <h1 className="text-2xl font-semibold">Book Exchange</h1>
              </div>
            </div>
            <div className="mt-10 space-y-4">
              <div className="rounded-3xl border border-border bg-white/80 p-6">
                <h2 className="text-xl font-semibold">Share, swap, and save on academic books</h2>
                <p className="mt-2 text-sm text-subtext">A premium, student-first marketplace for books, notes, and peer exchange.</p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="p-8 lg:p-12">
            <h2 className="text-3xl font-semibold">{type === 'login' ? 'Welcome back' : 'Create account'}</h2>
            <p className="mt-2 text-sm text-subtext">{type === 'login' ? 'Sign in to continue your study journey' : 'Join thousands of students trading books'}</p>

            <div className="mt-6 space-y-4">
              {type === 'signup' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                    <User size={16} className="text-primary" />
                    <input className="w-full bg-transparent outline-none" placeholder="Full Name" />
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                    <GraduationCap size={16} className="text-primary" />
                    <input className="w-full bg-transparent outline-none" placeholder="College" />
                  </label>
                </div>
              )}

              <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                <Mail size={16} className="text-primary" />
                <input type="email" className="w-full bg-transparent outline-none" placeholder="Email" />
              </label>

              {type === 'signup' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                    <GraduationCap size={16} className="text-primary" />
                    <input className="w-full bg-transparent outline-none" placeholder="Branch" />
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                    <BookOpen size={16} className="text-primary" />
                    <input className="w-full bg-transparent outline-none" placeholder="Semester" />
                  </label>
                </div>
              )}

              {type === 'signup' && (
                <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                  <Smartphone size={16} className="text-primary" />
                  <input className="w-full bg-transparent outline-none" placeholder="Mobile Number" />
                </label>
              )}

              <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                <Lock size={16} className="text-primary" />
                <input type={showPassword ? 'text' : 'password'} className="w-full bg-transparent outline-none" placeholder="Password" />
                <button type="button" className="text-subtext" onClick={() => setShowPassword((v) => !v)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </label>

              {type === 'signup' && (
                <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                  <Lock size={16} className="text-primary" />
                  <input type={showConfirm ? 'text' : 'password'} className="w-full bg-transparent outline-none" placeholder="Confirm Password" />
                  <button type="button" className="text-subtext" onClick={() => setShowConfirm((v) => !v)}>{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </label>
              )}
            </div>

            {type === 'login' && (
              <div className="mt-4 flex items-center justify-between text-sm text-subtext">
                <label className="flex items-center gap-2"><input type="checkbox" /> Remember me</label>
                <a href="#" className="text-primary">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90">{type === 'login' ? 'Login' : 'Create Account'}</button>
            <button type="button" className="mt-3 w-full rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-text transition hover:bg-bg">Continue with Google</button>

            <p className="mt-6 text-center text-sm text-subtext">
              {type === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button type="button" className="font-semibold text-primary" onClick={() => navigate(type === 'login' ? '/signup' : '/login')}>{type === 'login' ? 'Create Account' : 'Login'}</button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
