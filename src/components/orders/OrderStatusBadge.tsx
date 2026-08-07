import type { OrderStatus } from '../../types';

const styles: Record<OrderStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700',
  Confirmed: 'bg-blue-50 text-blue-700',
  Packed: 'bg-indigo-50 text-indigo-700',
  Shipped: 'bg-cyan-50 text-cyan-700',
  'Out For Delivery': 'bg-orange-50 text-orange-700',
  Delivered: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-red-50 text-red-700',
  Completed: 'bg-green-50 text-green-700',
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>
);

