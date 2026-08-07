import { motion } from 'framer-motion';
import { UserCircle2, Bell, Shield, HelpCircle, Info, FileText } from 'lucide-react';

export const AccountPage = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-border bg-white p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4 text-primary"><UserCircle2 size={32} /></div>
          <div>
            <h1 className="text-2xl font-semibold">Aditi Rao</h1>
            <p className="text-sm text-subtext">IIT Delhi • Computer Science • 3rd Semester</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ['Books Sold', '24'],
            ['Books Exchanged', '8'],
            ['Wishlist', '12'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-bg p-4 text-center">
              <div className="text-lg font-semibold text-primary">{value}</div>
              <div className="text-sm text-subtext">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          ['Edit Profile', <UserCircle2 size={16} />],
          ['Notifications', <Bell size={16} />],
          ['Privacy', <Shield size={16} />],
          ['Help Center', <HelpCircle size={16} />],
          ['About', <Info size={16} />],
          ['Terms', <FileText size={16} />],
        ].map(([label, icon]) => (
          <button key={label} className="flex items-center justify-between rounded-[20px] border border-border bg-white p-4 text-left shadow-soft">
            <span className="flex items-center gap-3 font-medium">{icon} {label}</span>
            <span className="text-subtext">→</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-text">Logout</button>
        <button className="flex-1 rounded-2xl bg-primary px-4 py-3 font-semibold text-white">Settings</button>
      </div>
    </div>
  );
};
