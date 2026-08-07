import { motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Clock3,
  FileText,
  Heart,
  HelpCircle,
  Info,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  Shield,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useToast } from '../contexts/ToastContext';

const menuItems = [
  { label: 'Orders', to: '/orders', icon: <FileText size={16} /> },
  { label: 'Cart', to: '/cart', icon: <ShoppingCart size={16} /> },
  { label: 'Wishlist', to: '/library', icon: <Heart size={16} /> },
  { label: 'Recently Viewed', to: '/library', icon: <Clock3 size={16} /> },
  { label: 'Saved Books', to: '/my-books', icon: <BookOpen size={16} /> },
];

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    cartCount,
    wishlistCount,
    pendingOrdersCount,
    completedOrdersCount,
    purchasedCount,
    recentlyViewed,
    wishlist,
  } = useMarketplace();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await logout();
    showToast({
      title: 'Logout Successful',
      description: 'You have been signed out.',
      variant: 'success',
    });
    navigate('/login', { replace: true });
  };

  const stats = [
    { label: 'Books Sold', value: '24' },
    { label: 'Books Purchased', value: String(purchasedCount) },
    { label: 'Books Exchanged', value: '8' },
    { label: 'Wishlist Count', value: String(wishlistCount) },
    { label: 'Cart Count', value: String(cartCount) },
    { label: 'Pending Orders', value: String(pendingOrdersCount) },
    { label: 'Completed Orders', value: String(completedOrdersCount) },
  ];

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
                {user?.college ?? 'Campus College'} · {user?.branch ?? 'Computer Science'} ·{' '}
                {user?.semester ?? '3rd Semester'}
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

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-border bg-bg p-4 text-center">
              <div className="text-2xl font-semibold text-primary">{value}</div>
              <div className="text-sm text-subtext">{label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {menuItems.map(({ label, icon, to }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center justify-between rounded-[22px] border border-border bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="flex items-center gap-3 font-medium text-text">
              {icon}
              {label}
            </span>
            <span className="text-subtext">→</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-border bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">Recent activity</h2>
              <p className="text-sm text-subtext">Books you viewed and saved this session.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {(recentlyViewed.length > 0 ? recentlyViewed : wishlist).slice(0, 4).map((book) => (
              <button
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                className="flex w-full items-center gap-3 rounded-2xl bg-bg p-3 text-left transition hover:bg-primary/10"
              >
                <img src={book.image} alt={book.title} className="h-16 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-text">{book.title}</h3>
                  <p className="text-sm text-subtext">{book.author}</p>
                </div>
                <Sparkles size={16} className="text-primary" />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-border bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">Profile shortcuts</h2>
              <p className="text-sm text-subtext">Quick links for your marketplace account.</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Notifications', icon: <Bell size={16} /> },
              { label: 'Privacy', icon: <Shield size={16} /> },
              { label: 'Help Center', icon: <HelpCircle size={16} /> },
              { label: 'About', icon: <Info size={16} /> },
            ].map(({ label, icon }) => (
              <button
                key={label}
                className="flex items-center justify-between rounded-2xl border border-border bg-bg px-4 py-3 text-left font-medium text-text transition hover:border-primary hover:bg-white"
              >
                <span className="flex items-center gap-2">
                  {icon}
                  {label}
                </span>
                <span className="text-subtext">→</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
