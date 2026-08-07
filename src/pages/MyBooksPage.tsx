import { motion } from 'framer-motion';
import { BadgeCheck, Pencil, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import type { Book } from '../types';

interface MyBooksPageProps {
  books: Book[];
}

export const MyBooksPage = ({ books }: MyBooksPageProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <section className="rounded-[28px] border border-border bg-white p-4 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Your listings</p>
            <h1 className="mt-1 text-3xl font-semibold text-text">Manage your books</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-subtext">
              Review your live listings, track interest, and update the books you are selling or exchanging.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <BadgeCheck size={20} />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Books Selling</button>
          <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-subtext">
            Books Available
          </button>
        </div>
      </section>

      {books.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No listings yet"
            description="Once you publish your first book, it will appear here with quick actions to edit or mark it sold."
            actionLabel="List a book"
            actionTo="/sell"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <motion.article
              key={book.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[24px] border border-border bg-white p-4 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-text">{book.title}</h3>
                  <p className="text-sm text-subtext">{book.subject}</p>
                </div>
                <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary">
                  Active
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-subtext">
                <span className="rounded-full bg-bg px-2 py-1">Views: 42</span>
                <span className="rounded-full bg-bg px-2 py-1">Interested: 5</span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-2xl font-semibold text-primary">Rs. {book.price}</div>
                <div className="flex gap-2">
                  <button className="rounded-2xl border border-border p-2 transition hover:bg-bg" aria-label="Edit listing">
                    <Pencil size={16} />
                  </button>
                  <button className="rounded-2xl border border-border p-2 transition hover:bg-bg" aria-label="Delete listing">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button className="flex-1 rounded-2xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:scale-[1.01]">
                  Mark as Sold
                </button>
                <button className="flex-1 rounded-2xl border border-border px-3 py-2 text-sm font-semibold text-text transition hover:bg-bg">
                  Mark as Exchanged
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};
