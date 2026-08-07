import { motion } from 'framer-motion';
import { Search, BookOpen, Download, Bookmark } from 'lucide-react';
import type { Book } from '../types';

interface LibraryPageProps {
  books: Book[];
}

export const LibraryPage = ({ books }: LibraryPageProps) => {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-border bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">My library</p>
            <h1 className="text-2xl font-semibold">Saved books & notes</h1>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary"><BookOpen size={20} /></div>
        </div>
        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-bg px-4 py-3">
          <Search size={18} className="text-subtext" />
          <input className="w-full bg-transparent outline-none" placeholder="Search your library" />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Purchased', 'Downloaded', 'Wishlist', 'Saved'].map((item) => (
            <button key={item} className="rounded-full border border-border bg-white px-3 py-2 text-sm text-subtext">{item}</button>
          ))}
        </div>
      </motion.div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {books.map((book) => (
          <motion.article key={book.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[22px] border border-border bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-subtext">{book.author}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary"><Bookmark size={16} /></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-subtext">
              <span className="rounded-full bg-bg px-2 py-1">{book.subject}</span>
              <span className="rounded-full bg-bg px-2 py-1">Sem {book.semester}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-subtext">Condition: {book.condition}</div>
              <div className="font-semibold text-primary">₹{book.price}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-2xl bg-primary px-3 py-2 text-sm font-semibold text-white">Open</button>
              <button className="rounded-2xl border border-border px-3 py-2 text-sm"><Download size={16} /></button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};
