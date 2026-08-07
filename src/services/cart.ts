import type { CartItem } from '../types';
import { requestApiJson } from './api';

export const fetchCart = async (token: string): Promise<CartItem[]> => {
  return requestApiJson<CartItem[]>('/api/cart', {
    token,
    fallbackMessage: 'Failed to load cart',
  });
};

export const addCartItem = async (
  token: string,
  payload: {
    bookId: number | string;
    quantity?: number;
    bookSnapshot?: {
      id: number | string;
      title: string;
      author: string;
      subject: string;
      branch: string;
      semester: string;
      condition: 'Excellent' | 'Good' | 'Fair';
      price: number;
      exchangeAvailable: boolean;
      seller: string;
      college: string;
      location: string;
      image: string;
    };
  },
) => {
  return requestApiJson<CartItem>('/api/cart/add', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
    fallbackMessage: 'Failed to add book to cart',
  });
};

export const updateCartItem = async (token: string, payload: { id: number | string; quantity: number }) => {
  return requestApiJson<CartItem>('/api/cart/update', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
    fallbackMessage: 'Failed to update cart item',
  });
};

export const removeCartItem = async (token: string, id: number | string) => {
  return requestApiJson<{ message: string }>(`/api/cart/remove/${id}`, {
    method: 'DELETE',
    token,
    fallbackMessage: 'Failed to remove cart item',
  });
};

export const clearCart = async (token: string) => {
  return requestApiJson<{ message: string }>('/api/cart/clear', {
    method: 'DELETE',
    token,
    fallbackMessage: 'Failed to clear cart',
  });
};
