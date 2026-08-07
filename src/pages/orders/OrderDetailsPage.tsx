import { motion } from 'framer-motion';
import { CalendarDays, Download, Phone, Route, Send, ShieldCheck, User2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import type { Order } from '../../types';

interface OrderDetailsPageProps {
  order?: Order;
}

const timeline = ['Ordered', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'] as const;

export const OrderDetailsPage = ({ order }: OrderDetailsPageProps) => {
  const navigate = useNavigate();
  const { cancelOrderById } = useMarketplace();

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
        <EmptyState
          title="Order not found"
          description="The order you are looking for does not exist or is no longer available."
          actionLabel="View Orders"
          actionTo="/orders"
          illustration={
            <div className="rounded-full bg-primary/10 p-6 text-primary shadow-soft">
              <Route size={38} />
            </div>
          }
        />
      </div>
    );
  }

  const activeIndex = timeline.findIndex((step) => {
    if (order.status === 'Cancelled') {
      return false;
    }

    if (order.status === 'Pending') {
      return step === 'Ordered';
    }

    if (order.status === 'Confirmed') {
      return ['Ordered', 'Confirmed'].includes(step);
    }

    if (order.status === 'Packed') {
      return ['Ordered', 'Confirmed', 'Packed'].includes(step);
    }

    if (order.status === 'Shipped') {
      return ['Ordered', 'Confirmed', 'Packed', 'Shipped'].includes(step);
    }

    if (order.status === 'Out For Delivery') {
      return ['Ordered', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery'].includes(step);
    }

    return true;
  });

  const downloadInvoice = () => {
    const content = [
      `Order ID: ${order.transactionId}`,
      `Payment Method: ${order.paymentMethod}`,
      `Status: ${order.status}`,
      `Total: Rs. ${order.price}`,
      `Delivery Address: ${order.deliveryAddress.name}, ${order.deliveryAddress.line1}, ${order.deliveryAddress.city}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.transactionId}-invoice.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[28px] border border-border bg-white shadow-soft"
      >
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-bg p-4 sm:p-6">
            <img
              src={order.books[0]?.image}
              alt={order.books[0]?.title ?? 'Order book'}
              className="aspect-[4/4.2] w-full rounded-[24px] object-cover shadow-soft"
            />
            <div className="mt-4 rounded-[24px] bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Order</p>
                  <h1 className="mt-1 text-2xl font-semibold text-text">{order.books[0]?.title ?? 'Book order'}</h1>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-2 text-sm text-subtext">
                {order.books[0]?.author ?? 'Unknown'} · {order.books.length} book(s) in this order
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Order details</p>
                <h1 className="mt-2 text-3xl font-semibold text-text">Order {order.transactionId}</h1>
                <p className="mt-2 text-sm text-subtext">Placed on {new Date(order.orderedDate).toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center">
                <div className="text-3xl font-semibold text-primary">Rs. {order.price}</div>
                <div className="text-xs text-subtext">{order.paymentMethod}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <StatCard icon={<User2 size={18} />} title="Seller" value={order.books[0]?.seller ?? 'Unknown'} />
              <StatCard
                icon={<CalendarDays size={18} />}
                title="Expected delivery"
                value={order.deliveredDate ? new Date(order.deliveredDate).toLocaleDateString() : '5-7 days'}
              />
              <StatCard icon={<Route size={18} />} title="Transaction ID" value={order.transactionId} />
              <StatCard icon={<ShieldCheck size={18} />} title="Status" value={order.status} />
            </div>

            <div className="mt-6 rounded-[24px] border border-border bg-bg p-5">
              <h2 className="text-lg font-semibold text-text">Shipping address</h2>
              <p className="mt-2 text-sm leading-7 text-subtext">
                {order.deliveryAddress.name}, {order.deliveryAddress.line1}
                {order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ''}
                , {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                {order.deliveryAddress.college ? ` · ${order.deliveryAddress.college}` : ''}
              </p>
              <p className="mt-2 text-sm text-subtext">Phone: {order.deliveryAddress.phone}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-text">Timeline</h2>
              <div className="mt-4 space-y-3">
                {timeline.map((step, index) => {
                  const isActive = order.status === 'Cancelled' ? step === 'Ordered' : index <= activeIndex;
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                        isActive ? 'border-primary/30 bg-primary/10' : 'border-border bg-white'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isActive ? 'bg-primary text-white' : 'bg-bg text-subtext'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text">{step}</p>
                        <p className="text-sm text-subtext">
                          {isActive ? `Status milestone reached: ${step}` : 'Pending update'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-4 rounded-[24px] border border-border bg-white p-5 sm:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-text">Payment summary</h2>
                <p className="mt-2 text-sm text-subtext">Method: {order.paymentMethod}</p>
                <p className="mt-2 text-sm text-subtext">Books: {order.books.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-subtext">Total paid</p>
                <p className="text-3xl font-semibold text-primary">Rs. {order.price}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/chat"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]"
              >
                <Send size={16} />
                Chat Seller
              </Link>
              <Link
                to="/chat"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-bg"
              >
                <Phone size={16} />
                Call Seller
              </Link>
              <button
                type="button"
                onClick={downloadInvoice}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-bg"
              >
                <Download size={16} />
                Download Invoice
              </button>
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-bg"
              >
                <Route size={16} />
                Track Order
              </button>
            </div>

            {order.status !== 'Cancelled' ? (
              <button
                type="button"
                onClick={() => cancelOrderById(order.id)}
                className="mt-3 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Cancel Order
              </button>
            ) : null}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) => (
  <div className="rounded-[22px] border border-border bg-bg p-4">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-subtext">
      {icon}
      <span>{title}</span>
    </div>
    <div className="mt-2 text-sm font-medium text-text">{value}</div>
  </div>
);
