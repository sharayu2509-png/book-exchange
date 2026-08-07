import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { CartItemCard } from '../../components/cart/CartItemCard';
import { CartSummary } from '../../components/cart/CartSummary';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import type { Book } from '../../types';

interface CartPageProps {
  books: Book[];
}

export const CartPage = ({ books }: CartPageProps) => {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeFromCart, moveToWishlist, isLoading } = useMarketplace();

  const cartBooks = cartItems
    .map((item) => ({
      item,
      book: books.find((book) => String(book.id) === String(item.bookId)) ?? item.book,
    }))
    .filter((entry): entry is { item: (typeof cartItems)[number]; book: Book } => Boolean(entry.book));

  const subtotal = cartBooks.reduce((total, entry) => total + entry.book.price * entry.item.quantity, 0);
  const platformFee = subtotal > 0 ? Math.max(20, Math.round(subtotal * 0.05)) : 0;
  const deliveryCharge = subtotal > 500 ? 0 : cartBooks.length > 0 ? 40 : 0;
  const total = subtotal + platformFee + deliveryCharge;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <section className="rounded-[28px] border border-border bg-white p-4 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Cart</p>
            <h1 className="mt-1 text-3xl font-semibold text-text">Books ready for checkout</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-subtext">
              Review your selected books, update quantities, and continue to a smooth student-friendly checkout.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center text-primary">
            <div className="text-2xl font-semibold">{cartItems.length}</div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em]">Items</div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonSummary />
        </div>
      ) : cartBooks.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No books in your cart"
            description="Start adding books from the library or any book details page to create your checkout list."
            actionLabel="Browse Books"
            actionTo="/library"
            illustration={
              <div className="rounded-full bg-primary/10 p-6 text-primary shadow-soft">
                <ShoppingBag size={38} />
              </div>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4">
            {cartBooks.map(({ item, book }) => (
              <CartItemCard
                key={item.id}
                item={item}
                book={book}
                onRemove={() => removeFromCart(item.id)}
                onMoveToWishlist={() => moveToWishlist(book)}
                onQuantityChange={(quantity) => updateCartQuantity(item.id, quantity)}
              />
            ))}
          </div>

          <div className="space-y-4">
            <CartSummary
              subtotal={subtotal}
              platformFee={platformFee}
              deliveryCharge={deliveryCharge}
              total={total}
              onContinueShopping={() => navigate('/library')}
              onCheckout={() => navigate('/checkout')}
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-white to-accent/15 p-5 shadow-soft"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Why students love it</p>
              <ul className="mt-4 space-y-3 text-sm text-subtext">
                <li>• Fast checkout for books already in your cart</li>
                <li>• Safe payment summaries with delivery visibility</li>
                <li>• Keep favorite titles in wishlist with one tap</li>
              </ul>
              <button
                onClick={() => navigate('/checkout')}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]"
              >
                Proceed now
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-[24px] border border-border bg-white p-4 shadow-soft">
    <div className="animate-pulse space-y-4">
      <div className="h-48 rounded-2xl bg-bg" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-4 rounded-full bg-bg" />
        <div className="h-4 rounded-full bg-bg" />
        <div className="h-4 rounded-full bg-bg" />
        <div className="h-4 rounded-full bg-bg" />
      </div>
      <div className="h-12 rounded-2xl bg-bg" />
    </div>
  </div>
);

const SkeletonSummary = () => (
  <div className="rounded-[28px] border border-border bg-white p-5 shadow-soft">
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-40 rounded-full bg-bg" />
      <div className="space-y-3">
        <div className="h-4 rounded-full bg-bg" />
        <div className="h-4 rounded-full bg-bg" />
        <div className="h-4 rounded-full bg-bg" />
        <div className="h-4 rounded-full bg-bg" />
      </div>
      <div className="h-12 rounded-2xl bg-bg" />
    </div>
  </div>
);

