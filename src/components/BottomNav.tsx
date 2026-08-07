import { Home, Library, PlusCircle, BookOpen, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/sell', label: 'Sell Book', icon: PlusCircle },
  { to: '/my-books', label: 'My Books', icon: BookOpen },
  { to: '/account', label: 'Account', icon: User },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-around px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-medium transition ${isActive ? 'text-primary' : 'text-subtext'}`
            }
          >
            <Icon size={18} />
            <span className="mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
