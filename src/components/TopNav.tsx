import { useMemo } from 'react';
import { BookOpen, Home, Library, Package, PlusCircle, ShoppingCart, User } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMarketplace } from '../contexts/MarketplaceContext';

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/sell', label: 'Sell Book', icon: PlusCircle },
  { to: '/my-books', label: 'My Books', icon: BookOpen },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/orders', label: 'My Orders', icon: Package },
  { to: '/account', label: 'Account', icon: User },
];

export const TopNav = () => {
  const { isAuthenticated, user } = useAuth();
  const { cartCount, orderCount } = useMarketplace();
  const authLabel = useMemo(() => (isAuthenticated ? user?.name ?? 'Account' : 'Login'), [isAuthenticated, user]);

  return (
    <header className="sticky top-0 z-30 hidden border-b border-border bg-white/90 backdrop-blur md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/home" className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Student Market</p>
            <p className="text-sm font-semibold text-text">Book Exchange</p>
          </div>
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-2">
          {items.map(({ to, label, icon: Icon }) => {
            const badgeValue = to === '/cart' ? cartCount : to === '/orders' ? orderCount : 0;
            return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary' : 'text-subtext hover:bg-bg hover:text-text'}`
              }
            >
              <span className="relative inline-flex items-center gap-2">
                <Icon size={16} />
                {label}
                {badgeValue > 0 ? (
                  <span className="ml-1 inline-flex min-w-5 justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {badgeValue}
                  </span>
                ) : null}
              </span>
            </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-bg px-4 py-2 text-sm text-subtext lg:block">
            {isAuthenticated ? `Welcome, ${user?.name ?? 'student'}` : 'Study smart, spend less'}
          </div>
          <Link
            to={isAuthenticated ? '/account' : '/login'}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
          >
            {authLabel}
          </Link>
        </div>
      </div>
    </header>
  );
};
