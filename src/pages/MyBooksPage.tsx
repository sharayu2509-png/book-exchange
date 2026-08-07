import { motion } from 'framer-motion';
import { Pencil, Trash2, BadgeCheck } from 'lucide-react';
import type { Book } from '../types';

interface MyBooksPageProps {
  books: Book[];
}

export const MyBooksPage = ({ books }: MyBooksPageProps) => {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-border bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Your listings</p>
            <h1 className="text-2xl font-semibold">Manage your books</h1>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary"><BadgeCheck size={20} /></div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white">Books Selling</button>
          <button className="rounded-full border border-border px-3 py-2 text-sm text-subtext">Books Available</button>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {books.map((book) => (
          <motion.article key={book.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[22px] border border-border bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-subtext">{book.subject}</p>
              </div>
              <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary">Active</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-subtext">
              <span className="rounded-full bg-bg px-2 py-1">Views: 42</span>
              <span className="rounded-full bg-bg px-2 py-1">Interested: 5</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-lg font-semibold text-primary">₹{book.price}</div>
              <div className="flex gap-2">
                <button className="rounded-2xl border border-border p-2"><Pencil size={16} /></button>
                <button className="rounded-2xl border border-border p-2"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-2xl bg-primary px-3 py-2 text-sm font-semibold text-white">Mark as Sold</button>
              <button className="flex-1 rounded-2xl border border-border px-3 py-2 text-sm font-semibold">Mark as Exchanged</button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};
