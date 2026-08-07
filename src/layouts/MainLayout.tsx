import type { ReactNode } from 'react';
import { BottomNav } from '../components/BottomNav';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-bg">
      {children}
      <BottomNav />
    </div>
  );
};
