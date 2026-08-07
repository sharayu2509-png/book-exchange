export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out For Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Completed';

export type PaymentMethod = 'Cash on Delivery' | 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';

export interface OrderAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  college?: string;
}

export interface OrderBook {
  id: number | string;
  bookId: number | string;
  title: string;
  author: string;
  subject: string;
  branch: string;
  semester: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  price: number;
  quantity: number;
  seller: string;
  sellerId?: number | string;
  college: string;
  location: string;
  image: string;
}

export interface Order {
  id: number | string;
  userId: number | string;
  books: OrderBook[];
  sellerId: number | string;
  price: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  deliveryAddress: OrderAddress;
  orderedDate: string;
  deliveredDate?: string | null;
  transactionId: string;
  createdAt?: string;
  updatedAt?: string;
}

