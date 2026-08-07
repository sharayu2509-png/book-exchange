import type { Order, OrderAddress, PaymentMethod } from '../types';
import { requestApiJson } from './api';

export const fetchOrders = async (token: string): Promise<Order[]> => {
  return requestApiJson<Order[]>('/api/orders', {
    token,
    fallbackMessage: 'Failed to load orders',
  });
};

export const fetchOrderById = async (token: string, id: number | string): Promise<Order> => {
  return requestApiJson<Order>(`/api/orders/${id}`, {
    token,
    fallbackMessage: 'Failed to load order details',
  });
};

export const createOrder = async (
  token: string,
  payload: {
    books: Array<{
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
    }>;
    price: number;
    paymentMethod: PaymentMethod;
    deliveryAddress: OrderAddress;
    sellerId?: number | string;
    selectedCartItemIds?: Array<number | string>;
  },
) => {
  return requestApiJson<Order>('/api/orders/create', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
    fallbackMessage: 'Failed to create order',
  });
};

export const cancelOrder = async (token: string, id: number | string) => {
  return requestApiJson<Order>(`/api/orders/cancel/${id}`, {
    method: 'PUT',
    token,
    fallbackMessage: 'Failed to cancel order',
  });
};

export const updateOrderStatus = async (token: string, id: number | string, status: string) => {
  return requestApiJson<Order>(`/api/orders/status/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ status }),
    fallbackMessage: 'Failed to update order status',
  });
};

