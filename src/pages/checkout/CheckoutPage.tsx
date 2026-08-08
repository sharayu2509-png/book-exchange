import { motion } from 'framer-motion';
import { CheckCircle2, CreditCard, MapPinned, PackageCheck, XCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { CartSummary } from '../../components/cart/CartSummary';
import { EmptyState } from '../../components/EmptyState';
import { FormField } from '../../components/ui/FormInput';
import { LoadingButton } from '../../components/ui/LoadingButton';
import { Modal } from '../../components/ui/Modal';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useToast } from '../../contexts/ToastContext';
import type { Book, PaymentMethod } from '../../types';
import { checkoutSchema, type CheckoutSchemaValues } from '../../validation/checkout';

interface CheckoutPageProps {
  books: Book[];
}

const paymentMethods: PaymentMethod[] = ['Cash on Delivery', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'];

type ResultState =
  | { type: 'success'; title: string; description: string }
  | { type: 'error'; title: string; description: string }
  | null;

export const CheckoutPage = ({ books }: CheckoutPageProps) => {
  const navigate = useNavigate();
  const { cartItems, createOrderFromCart, clearCart, isLoading } = useMarketplace();
  const { showToast } = useToast();
  const successTimerRef = useRef<number | null>(null);
  const [result, setResult] = useState<ResultState>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = useForm<CheckoutSchemaValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(checkoutSchema) as Resolver<CheckoutSchemaValues>,
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      college: '',
      paymentMethod: '',
    },
  });

  useEffect(() => {
    reset({
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      college: '',
      paymentMethod: '',
    });
  }, [reset]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const closeResult = () => {
    setResult(null);
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  };

  const openSuccess = () => {
    setResult({
      type: 'success',
      title: 'Order placed successfully.',
      description: 'Your order has been placed successfully.',
    });
    showToast({
      title: 'Order placed successfully.',
      description: 'Your order has been placed successfully.',
      variant: 'success',
    });

    successTimerRef.current = window.setTimeout(() => {
      closeResult();
      navigate('/orders', { replace: true });
    }, 3000);
  };

  const openError = (message = 'Please try again.') => {
    setResult({
      type: 'error',
      title: 'Order Failed',
      description: message,
    });
    showToast({
      title: 'Order Failed',
      description: message,
      variant: 'error',
    });
  };

  const onSubmit = async (values: CheckoutSchemaValues) => {
    if (resolvedBooks.length === 0 || isSubmittingOrder) {
      return;
    }

    setIsSubmittingOrder(true);

    try {
      await createOrderFromCart({
        books: resolvedBooks.map(({ book, item }) => ({ book, quantity: item.quantity })),
        paymentMethod: values.paymentMethod as PaymentMethod,
        deliveryAddress: {
          name: values.fullName,
          phone: values.phoneNumber,
          line1: values.addressLine1,
          line2: values.addressLine2,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
          college: values.college,
        },
        selectedCartItemIds: resolvedBooks.map(({ item }) => item.id),
      });

      await clearCart();
      openSuccess();
    } catch (error) {
      openError(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
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

  if (resolvedBooks.length === 0) {
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <section className="rounded-[28px] border border-border bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <MapPinned size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">Shipping Details</h2>
                <p className="mt-1 text-sm text-subtext">Where should we send the books?</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <FormField
                label="Full Name"
                required
                placeholder="Enter your full name"
                aria-label="Full Name"
                error={errors.fullName?.message}
                {...register('fullName')}
              />
              <FormField
                label="Phone Number"
                required
                placeholder="10-digit mobile number"
                aria-label="Phone Number"
                error={errors.phoneNumber?.message}
                inputMode="numeric"
                {...register('phoneNumber')}
              />
              <FormField
                as="textarea"
                label="Address Line 1"
                required
                placeholder="House / hostel / room details"
                aria-label="Address Line 1"
                wrapperClassName="md:col-span-2"
                error={errors.addressLine1?.message}
                rows={3}
                {...register('addressLine1')}
              />
              <FormField
                as="textarea"
                label="Address Line 2"
                placeholder="Landmark or optional details"
                aria-label="Address Line 2"
                wrapperClassName="md:col-span-2"
                helperText="Optional"
                rows={3}
                error={errors.addressLine2?.message}
                {...register('addressLine2')}
              />
              <FormField
                label="City"
                required
                placeholder="City"
                aria-label="City"
                error={errors.city?.message}
                {...register('city')}
              />
              <FormField
                label="State"
                required
                placeholder="State"
                aria-label="State"
                error={errors.state?.message}
                {...register('state')}
              />
              <FormField
                label="Pincode"
                required
                placeholder="6-digit pincode"
                aria-label="Pincode"
                error={errors.pincode?.message}
                inputMode="numeric"
                {...register('pincode')}
              />
              <FormField
                label="College"
                required
                placeholder="College name"
                aria-label="College"
                error={errors.college?.message}
                {...register('college')}
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-border bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <CreditCard size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">Payment Method</h2>
                <p className="mt-1 text-sm text-subtext">Choose the most convenient payment option</p>
              </div>
            </div>

            <fieldset className="mt-5">
              <legend className="mb-3 block text-sm font-medium text-subtext">
                Payment Method <span className="ml-1 text-error">*</span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-bg px-4 py-3 text-sm font-medium text-text transition has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                  >
                    <input
                      value={method}
                      type="radio"
                      {...register('paymentMethod')}
                      className="accent-primary"
                      aria-label={method}
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
              {errors.paymentMethod ? <p className="mt-2 text-sm text-error">{errors.paymentMethod.message}</p> : null}
            </fieldset>
          </section>

          <LoadingButton
            type="submit"
            isLoading={isSubmittingOrder || isSubmitting}
            disabled={!isValid || resolvedBooks.length === 0 || isSubmittingOrder || isSubmitting}
            className="w-full bg-primary px-4 py-4 text-base font-semibold text-white transition hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-600"
          >
            Place Order
          </LoadingButton>
        </form>

        <div className="space-y-4">
          <CartSummary
            subtotal={subtotal}
            platformFee={platformFee}
            deliveryCharge={deliveryCharge}
            total={total}
            onContinueShopping={() => navigate('/library')}
            onCheckout={handleSubmit(onSubmit)}
            checkoutDisabled={!isValid || resolvedBooks.length === 0 || isSubmittingOrder || isSubmitting}
            checkoutLoading={isSubmittingOrder || isSubmitting}
            checkoutLabel={isSubmittingOrder || isSubmitting ? 'Placing Order...' : 'Place Order'}
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

      <Modal
        open={Boolean(result)}
        onClose={closeResult}
        title={result?.title ?? ''}
        description={result?.description}
        footer={
          result?.type === 'success' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <LoadingButton
                type="button"
                onClick={() => {
                  closeResult();
                  navigate('/orders', { replace: true });
                }}
                className="w-full bg-primary px-4 py-3 font-semibold text-white"
              >
                View Orders
              </LoadingButton>
              <LoadingButton
                type="button"
                onClick={() => {
                  closeResult();
                  navigate('/library');
                }}
                className="w-full border border-border bg-white px-4 py-3 font-semibold text-text"
              >
                Continue Shopping
              </LoadingButton>
            </div>
          ) : (
            <LoadingButton
              type="button"
              onClick={closeResult}
              className="w-full bg-primary px-4 py-3 font-semibold text-white"
            >
              Close
            </LoadingButton>
          )
        }
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              result?.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {result?.type === 'success' ? <CheckCircle2 size={34} /> : <XCircle size={34} />}
          </motion.div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-subtext">
              {result?.type === 'success' ? 'Your order is confirmed and queued for processing.' : 'Please review the details and try again.'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

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
