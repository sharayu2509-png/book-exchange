export interface Book {
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
  description: string;
  category: string;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  college: string;
  branch: string;
  semester: string;
  phone: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegistrationPayload extends AuthCredentials {
  name: string;
  college: string;
  branch: string;
  semester: string;
  phone: string;
}

export interface GoogleAuthPayload {
  name: string;
  email: string;
  avatarUrl?: string;
  college?: string;
  branch?: string;
  semester?: string;
  phone?: string;
}

export * from './cart';
export * from './order';
