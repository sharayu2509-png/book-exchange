import { motion } from 'framer-motion';
import { Heart, MapPin, MessageSquare, Share2, Bookmark, Star, ShoppingCart, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { useMarketplace } from '../contexts/MarketplaceContext';
import type { Book } from '../types';

interface BookDetailsPageProps {
  book?: Book;
}

export const BookDetailsPage = ({ book }: BookDetailsPageProps) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, recordRecentlyViewed } = useMarketplace();

  useEffect(() => {
    if (book) {
      recordRecentlyViewed(book);
    }
  }, [book, recordRecentlyViewed]);

  if (!book) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
        <EmptyState
          title="Book not found"
          description="We could not find the listing you were looking for. Try browsing the library for another option."
          actionLabel="Browse library"
          actionTo="/library"
        />
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(book);
    } catch {
      navigate('/login');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(book);
      navigate('/checkout');
    } catch {
      navigate('/login');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: book.title,
        text: `${book.title} by ${book.author}`,
        url,
      });
      return;
    }

    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[28px] border border-border bg-white shadow-soft"
      >
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-bg">
            <img src={book.image} alt={book.title} className="aspect-[4/3] h-full w-full object-cover" />
          </div>

          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Featured book</p>
                <h1 className="mt-2 text-3xl font-semibold text-text">{book.title}</h1>
                <p className="mt-2 text-sm text-subtext">by {book.author}</p>
              </div>

              <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center">
                <div className="text-3xl font-semibold text-primary">Rs. {book.price}</div>
                <div className="text-sm text-subtext">
                  {book.exchangeAvailable ? 'Exchange available' : 'Direct sale'}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium">
              <span className="rounded-full bg-bg px-3 py-2">Condition: {book.condition}</span>
              <span className="rounded-full bg-bg px-3 py-2">Subject: {book.subject}</span>
              <span className="rounded-full bg-bg px-3 py-2">Semester: {book.semester}</span>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-lg font-semibold text-text">Description</h2>
                <p className="mt-3 text-sm leading-7 text-subtext">{book.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[book.branch, book.category, book.college].map((item) => (
                    <span key={item} className="rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-border bg-bg p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-text">Seller details</p>
                    <p className="text-sm text-subtext">{book.seller}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-subtext">
                  <MapPin size={14} />
                  <span className="break-words">
                    {book.college}, {book.location}
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:scale-[1.01]"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary px-4 py-3 font-semibold text-white transition hover:scale-[1.01]"
                  >
                    <Zap size={16} />
                    Buy Now
                  </button>
                  <Link
                    to="/chat"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:scale-[1.01]"
                  >
                    <MessageSquare size={16} />
                    Chat Seller
                  </Link>
                  <Link
                    to="/chat"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-text transition hover:bg-white"
                  >
                    Call Seller
                  </Link>
                  <Link
                    to="/chat"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-text transition hover:bg-white"
                  >
                    Exchange Request
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => toggleWishlist(book)}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 transition ${
                  isInWishlist(book.id)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white text-text hover:bg-bg'
                }`}
              >
                <Bookmark size={16} />
                Bookmark
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 transition hover:bg-bg"
              >
                <Share2 size={16} />
                Share
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(book)}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 transition hover:bg-bg"
              >
                <Heart size={16} />
                {isInWishlist(book.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};
