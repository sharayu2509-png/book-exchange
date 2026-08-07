import { motion } from 'framer-motion';
import { CheckCircle2, CreditCard, MapPinned, PackageCheck } from 'lucide-react';
import { useEffect, useMemo, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CartSummary } from '../../components/cart/CartSummary';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import type { Book, OrderAddress, PaymentMethod } from '../../types';

interface CheckoutPageProps {
  books: Book[];
}

interface CheckoutFormValues extends OrderAddress {
  paymentMethod: PaymentMethod;
}

const paymentMethods: PaymentMethod[] = ['Cash on Delivery', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'];

export const CheckoutPage = ({ books }: CheckoutPageProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, createOrderFromCart, isLoading } = useMarketplace();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const resolvedBooks = useMemo(
    () =>
      cartItems
        .map((item) => {
          const book = books.find((entry) => String(entry.id) === String(item.bookId)) ?? item.book;
          return book ? { item, book } : null;
        })
        .filter((entry): entry is { item: (typeof cartItems)[number]; book: Book } => Boolean(entry)),
    [books, cartItems],
  );

  const subtotal = resolvedBooks.reduce((total, entry) => total + entry.book.price * entry.item.quantity, 0);
  const platformFee = subtotal > 0 ? Math.max(20, Math.round(subtotal * 0.05)) : 0;
  const deliveryCharge = subtotal > 500 ? 0 : resolvedBooks.length > 0 ? 40 : 0;
  const total = subtotal + platformFee + deliveryCharge;

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<CheckoutFormValues>({
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      line1: '',
      line2: '',
      city: user?.college ?? '',
      state: '',
      pincode: '',
      college: user?.college ?? '',
      paymentMethod: 'UPI',
    },
  });

  useEffect(() => {
    reset({
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      line1: '',
      line2: '',
      city: user?.college ?? '',
      state: '',
      pincode: '',
      college: user?.college ?? '',
      paymentMethod: 'UPI',
    });
  }, [reset, user?.college, user?.name, user?.phone]);

  useEffect(() => {
    if (!orderPlaced) {
      return;
    }

    const timer = window.setTimeout(() => navigate('/orders', { replace: true }), 1800);
    return () => window.clearTimeout(timer);
  }, [navigate, orderPlaced]);

  const onSubmit = async (values: CheckoutFormValues) => {
    if (resolvedBooks.length === 0) {
      return;
    }

    await createOrderFromCart({
      books: resolvedBooks.map(({ book, item }) => ({ book, quantity: item.quantity })),
      paymentMethod: values.paymentMethod,
      deliveryAddress: {
        name: values.name,
        phone: values.phone,
        line1: values.line1,
        line2: values.line2,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        college: values.college,
      },
      selectedCartItemIds: resolvedBooks.map(({ item }) => item.id),
    });
    setOrderPlaced(true);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.78fr]">
          <div className="space-y-4">
            <CheckoutSkeleton />
            <CheckoutSkeleton />
          </div>
          <CheckoutSkeleton />
        </div>
      </div>
    );
  }

  if (!orderPlaced && resolvedBooks.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
        <EmptyState
          title="No books selected"
          description="Your checkout page will appear once you add books to cart."
          actionLabel="Browse Books"
          actionTo="/library"
          illustration={
            <div className="rounded-full bg-primary/10 p-6 text-primary shadow-soft">
              <PackageCheck size={38} />
            </div>
          }
        />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full rounded-[32px] border border-border bg-white p-8 text-center shadow-soft"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.04, 1] }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
          >
            <CheckCircle2 size={44} />
          </motion.div>
          <h1 className="mt-5 text-3xl font-semibold text-text">Order placed successfully</h1>
          <p className="mt-3 text-sm leading-7 text-subtext">
            Your books are now on the way. Redirecting to My Orders so you can track every update.
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-bg">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.4 }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <section className="rounded-[28px] border border-border bg-white p-4 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Checkout</p>
            <h1 className="mt-1 text-3xl font-semibold text-text">Confirm delivery and payment</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-subtext">
              Fill in the shipping details, pick a payment method, and complete your order with a student-first flow.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center text-primary">
            <div className="text-2xl font-semibold">{resolvedBooks.length}</div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em]">Selected books</div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.78fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormSection icon={<MapPinned size={18} />} title="Shipping Details" subtitle="Where should we send the books?">
            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="Full name" {...register('name', { required: true })} />
              <InputField label="Phone number" {...register('phone', { required: true })} />
              <InputField label="Address line 1" {...register('line1', { required: true })} className="md:col-span-2" />
              <InputField label="Address line 2" {...register('line2')} className="md:col-span-2" />
              <InputField label="City" {...register('city', { required: true })} />
              <InputField label="State" {...register('state', { required: true })} />
              <InputField label="Pincode" {...register('pincode', { required: true })} />
              <InputField label="College" {...register('college', { required: true })} />
            </div>
          </FormSection>

          <FormSection icon={<CreditCard size={18} />} title="Payment Method" subtitle="Choose the most convenient payment option">
            <div className="grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <label
                  key={method}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-bg px-4 py-3 text-sm font-medium text-text transition has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                >
                  <input value={method} type="radio" {...register('paymentMethod', { required: true })} className="accent-primary" />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </FormSection>

          <button
            disabled={isSubmitting || resolvedBooks.length === 0}
            className="w-full rounded-2xl bg-primary px-4 py-4 text-base font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="space-y-4">
          <CartSummary
            subtotal={subtotal}
            platformFee={platformFee}
            deliveryCharge={deliveryCharge}
            total={total}
            onContinueShopping={() => navigate('/library')}
            onCheckout={handleSubmit(onSubmit)}
            checkoutLabel="Place Order"
          />

          <section className="rounded-[28px] border border-border bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <PackageCheck size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">Selected Books</h2>
                <p className="text-sm text-subtext">A quick look at what will be placed in the order.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {resolvedBooks.map(({ item, book }) => (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-bg p-3">
                  <img src={book.image} alt={book.title} className="h-16 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-text">{book.title}</h3>
                    <p className="text-sm text-subtext">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">Rs. {book.price}</p>
                    <p className="text-xs text-subtext">Qty {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const FormSection = ({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <section className="rounded-[28px] border border-border bg-white p-5 shadow-soft sm:p-6">
    <div className="flex items-start gap-3">
      <div className="rounded-2xl bg-primary/10 p-3 text-primary">{icon}</div>
      <div>
        <h2 className="text-xl font-semibold text-text">{title}</h2>
        <p className="mt-1 text-sm text-subtext">{subtitle}</p>
      </div>
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

const InputField = ({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className={`block ${className ?? ''}`}>
    <span className="mb-2 block text-sm font-medium text-subtext">{label}</span>
    <input
      {...props}
      className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition placeholder:text-subtext/60 focus:border-primary"
    />
  </label>
);

const CheckoutSkeleton = () => (
  <div className="rounded-[28px] border border-border bg-white p-5 shadow-soft">
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-48 rounded-full bg-bg" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-12 rounded-2xl bg-bg" />
        <div className="h-12 rounded-2xl bg-bg" />
        <div className="h-12 rounded-2xl bg-bg" />
        <div className="h-12 rounded-2xl bg-bg" />
      </div>
      <div className="h-12 rounded-2xl bg-bg" />
    </div>
  </div>
);
