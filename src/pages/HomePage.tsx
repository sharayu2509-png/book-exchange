import { motion } from 'framer-motion';
import { Search, Heart, Sparkles, MapPin, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Book } from '../types';

interface HomePageProps {
  books: Book[];
}

const categories = ['Engineering', 'Diploma', 'Medical', 'Commerce', 'Arts', 'UPSC', 'JEE', 'NEET'];

export const HomePage = ({ books }: HomePageProps) => {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-border bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Student marketplace</p>
            <h1 className="text-2xl font-semibold">Book Exchange</h1>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <BookOpen size={20} />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-bg px-4 py-3">
          <Search size={18} className="text-subtext" />
          <input className="w-full bg-transparent outline-none" placeholder="Search by title, subject, semester..." />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button key={category} className="rounded-full border border-border bg-white px-3 py-2 text-sm text-subtext transition hover:border-primary hover:text-primary">{category}</button>
          ))}
        </div>
      </motion.header>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-[24px] border border-border bg-gradient-to-r from-primary/10 to-accent/10 p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-primary"><Sparkles size={16} /> Featured for students</div>
            <h2 className="mt-3 text-2xl font-semibold">Exchange your old books and help another student.</h2>
            <p className="mt-2 max-w-xl text-sm text-subtext">Browse affordable second-hand academic resources and connect directly with other learners.</p>
          </div>
          <button className="rounded-2xl bg-primary px-4 py-3 font-semibold text-white">Explore books</button>
        </div>
      </motion.section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recently Added</h3>
          <Link to="/library" className="text-sm font-semibold text-primary">View all</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <motion.article whileHover={{ y: -4 }} key={book.id} className="overflow-hidden rounded-[22px] border border-border bg-white shadow-soft">
              <Link to={`/book/${book.id}`}>
                <img src={book.image} alt={book.title} className="h-40 w-full object-cover" />
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">{book.title}</h4>
                    <p className="text-sm text-subtext">{book.author}</p>
                  </div>
                  <button aria-label="favorite" className="rounded-full bg-bg p-2 text-subtext"><Heart size={16} /></button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-subtext">
                  <span className="rounded-full bg-primary/10 px-2 py-1">{book.subject}</span>
                  <span className="rounded-full bg-accent/10 px-2 py-1">Sem {book.semester}</span>
                  <span className="rounded-full bg-secondary/10 px-2 py-1">{book.condition}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-primary">₹{book.price}</p>
                    <p className="text-xs text-subtext">{book.exchangeAvailable ? 'Exchange available' : 'Buy only'}</p>
                  </div>
                  <Link to={`/book/${book.id}`} className="flex items-center gap-1 text-sm font-semibold text-primary">View <ArrowRight size={16} /></Link>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-subtext">
                  <MapPin size={14} /> {book.seller} • {book.college}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
};
