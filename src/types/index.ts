export interface Book {
  id: number;
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
  id: number;
  name: string;
  email: string;
  college: string;
  branch: string;
  semester: string;
  phone: string;
}
