import type { CartItem, Order } from '../types';
import { books } from './books';

const [firstBook, secondBook, thirdBook] = books;

export const demoCartItems: CartItem[] = firstBook
  ? [
      {
        id: 'demo-cart-1',
        userId: 'demo-user',
        bookId: firstBook.id,
        quantity: 1,
        book: {
          id: firstBook.id,
          title: firstBook.title,
          author: firstBook.author,
          subject: firstBook.subject,
          branch: firstBook.branch,
          semester: firstBook.semester,
          condition: firstBook.condition,
          price: firstBook.price,
          exchangeAvailable: firstBook.exchangeAvailable,
          seller: firstBook.seller,
          college: firstBook.college,
          location: firstBook.location,
          image: firstBook.image,
        },
      },
    ]
  : [];

export const demoOrders: Order[] = firstBook
  ? [
      {
        id: 'demo-order-1',
        userId: 'demo-user',
        books: [
          {
            id: firstBook.id,
            bookId: firstBook.id,
            title: firstBook.title,
            author: firstBook.author,
            subject: firstBook.subject,
            branch: firstBook.branch,
            semester: firstBook.semester,
            condition: firstBook.condition,
            price: firstBook.price,
            quantity: 1,
            seller: firstBook.seller,
            sellerId: 'seller-demo-1',
            college: firstBook.college,
            location: firstBook.location,
            image: firstBook.image,
          },
          ...(secondBook
            ? [
                {
                  id: secondBook.id,
                  bookId: secondBook.id,
                  title: secondBook.title,
                  author: secondBook.author,
                  subject: secondBook.subject,
                  branch: secondBook.branch,
                  semester: secondBook.semester,
                  condition: secondBook.condition,
                  price: secondBook.price,
                  quantity: 1,
                  seller: secondBook.seller,
                  sellerId: 'seller-demo-2',
                  college: secondBook.college,
                  location: secondBook.location,
                  image: secondBook.image,
                },
              ]
            : []),
        ],
        sellerId: 'multiple',
        price: firstBook.price + (secondBook?.price ?? 0),
        paymentMethod: 'UPI',
        status: 'Delivered',
        deliveryAddress: {
          name: 'Demo Student',
          phone: '9999999999',
          line1: 'Block A, Campus Hostel',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          college: 'IIT Delhi',
        },
        orderedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        deliveredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        transactionId: 'TXN-DEMO-1001',
      },
      ...(thirdBook
        ? [
            {
              id: 'demo-order-2',
              userId: 'demo-user',
              books: [
                {
                  id: thirdBook.id,
                  bookId: thirdBook.id,
                  title: thirdBook.title,
                  author: thirdBook.author,
                  subject: thirdBook.subject,
                  branch: thirdBook.branch,
                  semester: thirdBook.semester,
                  condition: thirdBook.condition,
                  price: thirdBook.price,
                  quantity: 1,
                  seller: thirdBook.seller,
                  sellerId: 'seller-demo-3',
                  college: thirdBook.college,
                  location: thirdBook.location,
                  image: thirdBook.image,
                },
              ],
              sellerId: 'seller-demo-3',
              price: thirdBook.price,
              paymentMethod: 'Cash on Delivery',
              status: 'Pending',
              deliveryAddress: {
                name: 'Demo Student',
                phone: '9999999999',
                line1: 'Hostel B, Room 23',
                city: 'Noida',
                state: 'Uttar Pradesh',
                pincode: '201301',
                college: 'Delhi University',
              },
              orderedDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
              transactionId: 'TXN-DEMO-1002',
            } satisfies Order,
          ]
        : []),
    ]
  : [];

