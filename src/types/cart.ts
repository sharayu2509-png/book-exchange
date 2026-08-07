export interface CartBookSnapshot {
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
}

export interface CartItem {
  id: number | string;
  userId: number | string;
  bookId: number | string;
  quantity: number;
  book?: CartBookSnapshot;
  createdAt?: string;
  updatedAt?: string;
}

