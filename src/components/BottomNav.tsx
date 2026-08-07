import { BookOpen, Home, Library, Package, PlusCircle, ShoppingCart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useMarketplace } from '../contexts/MarketplaceContext';

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/sell', label: 'Sell', icon: PlusCircle },
  { to: '/my-books', label: 'My Books', icon: BookOpen },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/account', label: 'Account', icon: User },
];

export const BottomNav = () => {
  const { cartCount, orderCount } = useMarketplace();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-7 items-center px-1 py-2">
        {items.map(({ to, label, icon: Icon }) => {
          const badgeValue = to === '/cart' ? cartCount : to === '/orders' ? orderCount : 0;
          return (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center rounded-2xl px-1 py-2 text-[10px] font-medium leading-tight transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary' : 'text-subtext'}`
            }
          >
            <span className="relative inline-flex">
              <Icon size={18} />
              {badgeValue > 0 ? (
                <span className="absolute -right-2 -top-2 inline-flex min-w-5 justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {badgeValue}
                </span>
              ) : null}
            </span>
            <span className="mt-1 text-center">{label}</span>
          </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
