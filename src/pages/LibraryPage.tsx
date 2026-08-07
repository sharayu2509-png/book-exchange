import { motion } from 'framer-motion';
import { Bookmark, BookOpen, Filter, Search, ShoppingCart } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { useMarketplace } from '../contexts/MarketplaceContext';
import type { Book } from '../types';
import { useNavigate } from 'react-router-dom';

interface LibraryPageProps {
  books: Book[];
}

const filters = ['All', 'Purchased', 'Downloaded', 'Wishlist', 'Saved'];

export const LibraryPage = ({ books }: LibraryPageProps) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useMarketplace();
  const handleAddToCart = async (book: Book) => {
    try {
      await addToCart(book);
    } catch {
      navigate('/login');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <section className="rounded-[28px] border border-border bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">My library</p>
            <h1 className="text-3xl font-semibold text-text">Saved books and notes</h1>
            <p className="max-w-2xl text-sm leading-7 text-subtext">
              Search your saved content, filter by status, and quickly jump back into any book you have bookmarked.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <BookOpen size={20} />
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-bg px-4 py-3">
            <Search size={18} className="text-subtext" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-subtext/70"
              placeholder="Search your library"
            />
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-bg">
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((item, index) => (
            <button
              key={item}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                index === 0
                  ? 'bg-primary text-white'
                  : 'border border-border bg-white text-subtext hover:border-primary hover:text-primary'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {books.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Your library is empty"
            description="Saved books, downloads, and notes will appear here once you start collecting them."
            actionLabel="Browse books"
            actionTo="/home"
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
                  <p className="text-sm text-subtext">{book.author}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Bookmark size={16} />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-subtext">
                <span className="rounded-full bg-bg px-2 py-1">{book.subject}</span>
                <span className="rounded-full bg-bg px-2 py-1">Sem {book.semester}</span>
                <span className="rounded-full bg-bg px-2 py-1">{book.condition}</span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                <div className="text-subtext">Condition: {book.condition}</div>
                <div className="font-semibold text-primary">Rs. {book.price}</div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => toggleWishlist(book)}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                    isInWishlist(book.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-white text-text hover:bg-bg'
                  }`}
                >
                  <Bookmark size={16} />
                  Wishlist
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToCart(book)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:scale-[1.01]"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <button className="rounded-2xl border border-border px-3 py-2 text-sm font-semibold text-text transition hover:bg-bg">
                  Open
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};
