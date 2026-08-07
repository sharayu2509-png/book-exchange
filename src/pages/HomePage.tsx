import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Heart, MapPin, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import type { Book } from '../types';

interface HomePageProps {
  books: Book[];
}

const categories = ['Engineering', 'Diploma', 'Medical', 'Commerce', 'Arts', 'UPSC', 'JEE', 'NEET'];

export const HomePage = ({ books }: HomePageProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <section className="rounded-[28px] border border-border bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles size={16} />
              Student marketplace
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight text-text sm:text-4xl lg:text-5xl">
                Find textbooks that fit your semester and your budget.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-subtext sm:text-base">
                Browse affordable academic books, connect with sellers, and keep your learning materials in one clean,
                responsive space.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Active listings', value: books.length.toString() },
                { label: 'Exchange ready', value: 'Fast' },
                { label: 'Student verified', value: 'Secure' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-border bg-bg p-4">
                  <p className="text-xl font-semibold text-text">{item.value}</p>
                  <p className="mt-1 text-sm text-subtext">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-white to-accent/15 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white p-3 text-primary shadow-sm">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">Smart search</p>
                <h2 className="text-lg font-semibold text-text">Discover books instantly</h2>
              </div>
            </div>
            <label className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
              <Search size={18} className="text-subtext" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-subtext/70"
                placeholder="Search by title, subject, or college"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="rounded-full border border-border bg-white px-3 py-2 text-sm text-subtext transition hover:border-primary hover:text-primary"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-border bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Featured for students</p>
            <h2 className="mt-2 text-2xl font-semibold text-text sm:text-3xl">
              Exchange your old books and help another student.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-subtext">
              Browse second-hand academic resources and connect directly with students in your campus network.
            </p>
          </div>
          <Link
            to="/library"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition hover:scale-[1.01] sm:w-auto"
          >
            Explore books
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-text sm:text-2xl">Recently added</h3>
            <p className="mt-1 text-sm text-subtext">Fresh listings from the student marketplace.</p>
          </div>
          <Link to="/library" className="text-sm font-semibold text-primary">
            View all
          </Link>
        </div>

        {books.length === 0 ? (
          <EmptyState
            title="No books yet"
            description="There are no listings available right now. Check back soon or add the first one from Sell Book."
            actionLabel="Sell a book"
            actionTo="/sell"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <motion.article
                whileHover={{ y: -4 }}
                key={book.id}
                className="overflow-hidden rounded-[24px] border border-border bg-white shadow-soft transition-shadow"
              >
                <Link to={`/book/${book.id}`} className="block">
                  <img src={book.image} alt={book.title} className="h-48 w-full object-cover" />
                </Link>
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate text-lg font-semibold text-text">{book.title}</h4>
                      <p className="text-sm text-subtext">{book.author}</p>
                    </div>
                    <button aria-label="Save book" className="rounded-full bg-bg p-2 text-subtext transition hover:text-primary">
                      <Heart size={16} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-medium text-subtext">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{book.subject}</span>
                    <span className="rounded-full bg-accent/10 px-2 py-1 text-accent">Sem {book.semester}</span>
                    <span className="rounded-full bg-secondary/10 px-2 py-1 text-secondary">{book.condition}</span>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-2xl font-semibold text-primary">Rs. {book.price}</p>
                      <p className="text-xs text-subtext">
                        {book.exchangeAvailable ? 'Exchange available' : 'Direct sale'}
                      </p>
                    </div>
                    <Link
                      to={`/book/${book.id}`}
                      className="inline-flex items-center gap-1 rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
                    >
                      View
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-subtext">
                    <MapPin size={14} />
                    <span className="truncate">
                      {book.seller} · {book.college}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
