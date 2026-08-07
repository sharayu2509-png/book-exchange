import { motion } from 'framer-motion';
import { Bookmark, Minus, Plus, Trash2 } from 'lucide-react';
import type { Book, CartItem } from '../../types';

interface CartItemCardProps {
  item: CartItem;
  book?: Book;
  onRemove: () => void;
  onMoveToWishlist: () => void;
  onQuantityChange: (quantity: number) => void;
}

export const CartItemCard = ({ item, book, onRemove, onMoveToWishlist, onQuantityChange }: CartItemCardProps) => {
  const source = book ?? item.book;
  if (!source) {
    return null;
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[24px] border border-border bg-white shadow-soft"
    >
      <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
        <div className="relative">
          <img src={source.image} alt={source.title} className="h-full w-full object-cover lg:min-h-[260px]" />
          <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
            {source.exchangeAvailable ? 'Exchange available' : 'Sale only'}
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Cart item</p>
              <h3 className="mt-1 truncate text-2xl font-semibold text-text">{source.title}</h3>
              <p className="mt-1 text-sm text-subtext">by {source.author}</p>
            </div>
            <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center">
              <div className="text-2xl font-semibold text-primary">Rs. {source.price}</div>
              <div className="text-xs text-subtext">per book</div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <InfoPill label="Subject" value={source.subject} />
            <InfoPill label="Semester" value={source.semester} />
            <InfoPill label="Condition" value={source.condition} />
            <InfoPill label="Seller" value={source.seller} />
            <InfoPill label="College" value={source.college} />
            <InfoPill label="Location" value={source.location} />
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-subtext">Quantity</label>
              <div className="inline-flex items-center rounded-2xl border border-border bg-bg">
                <button
                  type="button"
                  onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
                  className="rounded-l-2xl px-3 py-2 text-subtext transition hover:bg-white hover:text-text"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-12 px-4 py-2 text-center text-sm font-semibold text-text">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(item.quantity + 1)}
                  className="rounded-r-2xl px-3 py-2 text-subtext transition hover:bg-white hover:text-text"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                Available now
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={onMoveToWishlist}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-bg"
              >
                <Bookmark size={16} />
                Move to Wishlist
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const InfoPill = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-bg px-4 py-3">
    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-subtext">{label}</div>
    <div className="mt-1 text-sm font-medium text-text">{value}</div>
  </div>
);

