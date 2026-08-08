import { LoadingButton } from '../ui/LoadingButton';

interface CartSummaryProps {
  subtotal: number;
  platformFee: number;
  deliveryCharge: number;
  total: number;
  onContinueShopping: () => void;
  onCheckout: () => void;
  checkoutLabel?: string;
  checkoutDisabled?: boolean;
  checkoutLoading?: boolean;
}

export const CartSummary = ({
  subtotal,
  platformFee,
  deliveryCharge,
  total,
  onContinueShopping,
  onCheckout,
  checkoutLabel = 'Proceed to Checkout',
  checkoutDisabled = false,
  checkoutLoading = false,
}: CartSummaryProps) => {
  return (
    <aside className="rounded-[28px] border border-border bg-white p-5 shadow-soft sm:p-6">
      <h3 className="text-xl font-semibold text-text">Order summary</h3>
      <div className="mt-5 space-y-3 text-sm">
        <SummaryRow label="Subtotal" value={subtotal} />
        <SummaryRow label="Platform fee" value={platformFee} />
        <SummaryRow label="Delivery charge" value={deliveryCharge} />
        <div className="border-t border-border pt-3">
          <SummaryRow label="Total price" value={total} highlight />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onContinueShopping}
          className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-bg"
        >
          Continue Shopping
        </button>
        <LoadingButton
          type="button"
          onClick={onCheckout}
          disabled={checkoutDisabled}
          isLoading={checkoutLoading}
          className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:bg-gray-300 disabled:text-gray-600"
        >
          {checkoutLabel}
        </LoadingButton>
      </div>
    </aside>
  );
};

const SummaryRow = ({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) => (
  <div className={`flex items-center justify-between ${highlight ? 'text-base font-semibold text-text' : 'text-subtext'}`}>
    <span>{label}</span>
    <span className={highlight ? 'text-primary' : 'text-text'}>Rs. {value}</span>
  </div>
);
