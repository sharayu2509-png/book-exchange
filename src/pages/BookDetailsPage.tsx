import { motion } from 'framer-motion';
import { Heart, Share2, Bookmark, MapPin } from 'lucide-react';
import type { Book } from '../types';

interface BookDetailsPageProps {
  book?: Book;
}

export const BookDetailsPage = ({ book }: BookDetailsPageProps) => {
  if (!book) {
    return <div className="p-10 text-center">Book not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[28px] border border-border bg-white shadow-soft">
        <img src={book.image} alt={book.title} className="h-72 w-full object-cover" />
        <div className="p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Featured book</p>
              <h1 className="text-3xl font-semibold">{book.title}</h1>
              <p className="mt-1 text-subtext">by {book.author}</p>
            </div>
            <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center">
              <div className="text-2xl font-semibold text-primary">₹{book.price}</div>
              <div className="text-sm text-subtext">{book.exchangeAvailable ? 'Exchange available' : 'Buy only'}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-lg font-semibold">Description</p>
              <p className="mt-2 text-sm leading-7 text-subtext">{book.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-bg px-3 py-2">Condition: {book.condition}</span>
                <span className="rounded-full bg-bg px-3 py-2">Subject: {book.subject}</span>
                <span className="rounded-full bg-bg px-3 py-2">Semester: {book.semester}</span>
              </div>
            </div>
            <div className="rounded-[24px] border border-border bg-bg p-5">
              <p className="font-semibold">Seller details</p>
              <p className="mt-2 text-sm text-subtext">{book.seller}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-subtext"><MapPin size={14} /> {book.college}, {book.location}</div>
              <div className="mt-6 grid gap-2">
                <button className="rounded-2xl bg-primary px-4 py-3 font-semibold text-white">Chat Seller</button>
                <button className="rounded-2xl border border-border bg-white px-4 py-3 font-semibold">Call Seller</button>
                <button className="rounded-2xl border border-border bg-white px-4 py-3 font-semibold">Exchange Request</button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3"><Bookmark size={16} /> Bookmark</button>
            <button className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3"><Share2 size={16} /> Share</button>
            <button className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3"><Heart size={16} /> Save</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
