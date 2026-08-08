import { motion } from 'framer-motion';
import { CalendarDays, CreditCard, Download, RotateCcw, Route, MessageSquare, PackageOpen, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../../types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
  onCancel: () => void;
  onReorder: () => void;
  onDownloadInvoice: () => void;
}

export const OrderCard = ({ order, onCancel, onReorder, onDownloadInvoice }: OrderCardProps) => {
  const firstBook = order.books[0];
  const displayDate = new Date(order.orderedDate).toLocaleDateString();
  const deliveryDate = order.deliveredDate ? new Date(order.deliveredDate).toLocaleDateString() : 'Within 5-7 days';
  const canCancel = ['Pending', 'Confirmed', 'Packed'].includes(order.status);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[24px] border border-border bg-white shadow-soft"
    >
      <div className="grid gap-0 lg:grid-cols-[180px_1fr]">
        <img src={firstBook?.image} alt={firstBook?.title ?? 'Order book'} className="h-full w-full object-cover" />

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold text-text">{firstBook?.title ?? 'Book order'}</h3>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-sm text-subtext">
                {firstBook?.author ?? 'Unknown author'} - Seller: {firstBook?.seller ?? 'Unknown'}
              </p>
              <p className="mt-2 text-sm text-subtext">
                Order ID: <span className="font-medium text-text">{order.transactionId}</span>
              </p>
            </div>

            <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center">
              <div className="text-2xl font-semibold text-primary">Rs. {order.price}</div>
              <div className="text-xs text-subtext">{order.paymentMethod}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetaItem icon={<CalendarDays size={15} />} label="Order date" value={displayDate} />
            <MetaItem icon={<PackageOpen size={15} />} label="Expected delivery" value={deliveryDate} />
            <MetaItem icon={<Route size={15} />} label="Books" value={order.books.length.toString()} />
            <MetaItem icon={<CreditCard size={15} />} label="Payment" value={order.paymentMethod} />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/orders/${order.id}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]"
            >
              View Details
            </Link>
            <button
              type="button"
              onClick={onDownloadInvoice}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-bg"
            >
              <Download size={16} />
              Download Invoice
            </button>
            <button
              type="button"
              onClick={onReorder}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-bg"
            >
              <RotateCcw size={16} />
              Reorder
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {canCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <XCircle size={15} />
                Cancel Order
              </button>
            ) : null}
            {!canCancel ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-2 text-sm font-semibold text-subtext"
              >
                <XCircle size={15} />
                Cancel Disabled
              </button>
            ) : null}
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm font-semibold text-text transition hover:bg-bg"
            >
              <MessageSquare size={15} />
              Contact Seller
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const MetaItem = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl bg-bg p-4">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-subtext">
      {icon}
      <span>{label}</span>
    </div>
    <div className="mt-2 text-sm font-medium text-text">{value}</div>
  </div>
);
