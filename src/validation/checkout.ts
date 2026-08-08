import { z } from 'zod';

const paymentMethodValues = ['Cash on Delivery', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'] as const;

const requiredText = (message: string, minLength = 1) =>
  z.preprocess((value) => (typeof value === 'string' ? value : ''), z.string().trim().min(minLength, message));

export const checkoutSchema = z.object({
  fullName: requiredText('Please enter your full name.', 3),
  phoneNumber: z.preprocess(
    (value) => (typeof value === 'string' ? value : ''),
    z.string().trim().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
  ),
  addressLine1: requiredText('Please enter your address.'),
  addressLine2: z.preprocess((value) => (value === '' || value == null ? undefined : value), z.string().trim().optional()),
  city: requiredText('Please enter your city.', 2),
  state: requiredText('Please enter your state.', 2),
  pincode: z.preprocess(
    (value) => (typeof value === 'string' ? value : ''),
    z.string().trim().regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode.'),
  ),
  college: requiredText('Please enter your college.', 2),
  paymentMethod: z.preprocess(
    (value) => (typeof value === 'string' ? value : ''),
    z
      .string()
      .trim()
      .min(1, 'Please select a payment method.')
      .refine((value) => paymentMethodValues.includes(value as (typeof paymentMethodValues)[number]), 'Please select a payment method.'),
  ),
});

export type CheckoutSchemaValues = z.infer<typeof checkoutSchema>;
