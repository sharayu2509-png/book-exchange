import { z } from 'zod';

const paymentMethodValues = ['Cash on Delivery', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'] as const;

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Full Name must be at least 3 characters')
    .regex(/^(?!\s+$).+$/, 'Full Name is required'),
  phone: z.string().trim().regex(/^\d{10}$/, 'Phone number must contain exactly 10 digits'),
  line1: z.string().trim().min(5, 'Address Line 1 is required'),
  line2: z.string().optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City is required').regex(/^(?!\s+$).+$/, 'City is required'),
  state: z.string().trim().min(2, 'State is required').regex(/^(?!\s+$).+$/, 'State is required'),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must contain exactly 6 digits'),
  college: z.string().trim().min(2, 'College is required').regex(/^(?!\s+$).+$/, 'College is required'),
  paymentMethod: z.enum(paymentMethodValues),
});

export type CheckoutSchemaValues = z.infer<typeof checkoutSchema>;
