import { motion } from 'framer-motion';
import { Bell, FileText, HelpCircle, Info, LogOut, Shield, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const stats = [
  { label: 'Books Sold', value: '24' },
  { label: 'Books Exchanged', value: '8' },
  { label: 'Wishlist', value: '12' },
];

const menuItems = [
  { label: 'Edit Profile', icon: <UserCircle2 size={16} /> },
  { label: 'Notifications', icon: <Bell size={16} /> },
  { label: 'Privacy', icon: <Shield size={16} /> },
  { label: 'Help Center', icon: <HelpCircle size={16} /> },
  { label: 'About', icon: <Info size={16} /> },
  { label: 'Terms', icon: <FileText size={16} /> },
];

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] border border-border bg-white p-4 shadow-soft sm:p-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserCircle2 size={34} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-text">{user?.name ?? 'Aditi Rao'}</h1>
              <p className="text-sm text-subtext">
                {user?.college ?? 'IIT Delhi'} · {user?.branch ?? 'Computer Science'} · {user?.semester ?? '3rd Semester'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-bg"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-border bg-bg p-4 text-center">
              <div className="text-2xl font-semibold text-primary">{value}</div>
              <div className="text-sm text-subtext">{label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {menuItems.map(({ label, icon }) => (
          <button
            key={label}
            className="flex items-center justify-between rounded-[22px] border border-border bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="flex items-center gap-3 font-medium text-text">
              {icon}
              {label}
            </span>
            <span className="text-subtext">→</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button className="flex-1 rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-text transition hover:bg-bg">
          Account settings
        </button>
        <button className="flex-1 rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:scale-[1.01]">
          View profile
        </button>
      </div>
    </div>
  );
};
