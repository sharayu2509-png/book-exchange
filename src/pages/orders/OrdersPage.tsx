import { FileDown, Search, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { OrderCard } from '../../components/orders/OrderCard';
import { LoadingButton } from '../../components/ui/LoadingButton';
import { Modal } from '../../components/ui/Modal';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useToast } from '../../contexts/ToastContext';
import type { Order } from '../../types';

const tabs = ['All Orders', 'Pending', 'Confirmed', 'Delivered', 'Cancelled', 'Completed'] as const;

export const OrdersPage = () => {
  const { orders, cancelOrderById, reorderOrder, isLoading } = useMarketplace();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('All Orders');
  const [query, setQuery] = useState('');
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const filteredOrders = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim();
    return orders.filter((order) => {
      const matchesTab =
        activeTab === 'All Orders' ? true : order.status === activeTab;

      const searchable = [
        order.transactionId,
        order.paymentMethod,
        order.status,
        order.books.map((book) => book.title).join(' '),
        order.books.map((book) => book.author).join(' '),
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = lowerQuery.length === 0 ? true : searchable.includes(lowerQuery);
      return matchesTab && matchesQuery;
    });
  }, [activeTab, orders, query]);

  const downloadInvoice = (order: Order) => {
    const content = [
      `Order ID: ${order.transactionId}`,
      `Status: ${order.status}`,
      `Payment Method: ${order.paymentMethod}`,
      `Total: Rs. ${order.price}`,
      `Books: ${order.books.map((book) => `${book.title} x${book.quantity}`).join(', ')}`,
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

  const confirmCancel = async () => {
    if (!cancelTarget) {
      return;
    }

    setCancelLoading(true);
    try {
      await cancelOrderById(cancelTarget.id);
      showToast({
        title: 'Order cancelled successfully.',
        description: 'Your order has been cancelled successfully.',
        variant: 'success',
      });
      setCancelTarget(null);
    } catch (error) {
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'error',
      });
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <section className="rounded-[28px] border border-border bg-white p-4 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Orders</p>
            <h1 className="mt-1 text-3xl font-semibold text-text">Track every purchase in one place</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-subtext">
              Review pending deliveries, completed purchases, and order history with quick actions for students.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center text-primary">
            <div className="text-2xl font-semibold">{orders.length}</div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em]">Orders</div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-bg px-4 py-3">
            <Search size={18} className="text-subtext" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-subtext/70"
              placeholder="Search orders, books, or IDs"
            />
          </label>
          <Link
            to="/cart"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-bg"
          >
            <ShoppingCart size={16} />
            Go to Cart
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'border border-border bg-white text-subtext hover:border-primary hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {isLoading ? (
        <div className="mt-6 space-y-4">
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No orders found"
            description="Try a different tab or search term to find a specific order."
            actionLabel="Browse Books"
            actionTo="/library"
            illustration={
              <div className="rounded-full bg-primary/10 p-6 text-primary shadow-soft">
                <FileDown size={38} />
              </div>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={() => setCancelTarget(order)}
              onReorder={() => reorderOrder(order.id)}
              onDownloadInvoice={() => downloadInvoice(order)}
            />
          ))}
        </div>
      )}

      <Modal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title="Cancel this order?"
        description="Are you sure you want to cancel this order? This action cannot be undone."
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <LoadingButton
              type="button"
              onClick={() => setCancelTarget(null)}
              className="w-full border border-border bg-white px-4 py-3 font-semibold text-text"
            >
              Keep Order
            </LoadingButton>
            <LoadingButton
              type="button"
              onClick={confirmCancel}
              isLoading={cancelLoading}
              className="w-full bg-error px-4 py-3 font-semibold text-white"
            >
              Cancel Order
            </LoadingButton>
          </div>
        }
      >
        <p className="text-sm text-subtext">This will mark the order as cancelled in your account and order history.</p>
      </Modal>
    </div>
  );
};

const OrderSkeleton = () => (
  <div className="rounded-[24px] border border-border bg-white p-4 shadow-soft">
    <div className="animate-pulse grid gap-4 lg:grid-cols-[180px_1fr]">
      <div className="h-48 rounded-2xl bg-bg lg:h-full" />
      <div className="space-y-4">
        <div className="h-5 w-48 rounded-full bg-bg" />
        <div className="h-4 w-72 rounded-full bg-bg" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-20 rounded-2xl bg-bg" />
          <div className="h-20 rounded-2xl bg-bg" />
          <div className="h-20 rounded-2xl bg-bg" />
          <div className="h-20 rounded-2xl bg-bg" />
        </div>
        <div className="h-12 rounded-2xl bg-bg" />
      </div>
    </div>
  </div>
);
