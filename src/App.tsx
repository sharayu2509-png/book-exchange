import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { LoadingState } from './components/LoadingState';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TopNav } from './components/TopNav';
import { useAuth } from './contexts/AuthContext';
import { books as seedBooks } from './data/books';
import { createBook, fetchBooks } from './services/api';
import type { Book } from './types';
import { AccountPage } from './pages/AccountPage';
import { AuthPage } from './pages/AuthPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { ChatPage } from './pages/ChatPage';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { MyBooksPage } from './pages/MyBooksPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { SellBookPage } from './pages/SellBookPage';

const AUTH_ROUTES = ['/login', '/signup'];

const BookDetailsRoute = ({ books }: { books: Book[] }) => {
  const { id } = useParams();
  const selectedBook = books.find((book) => String(book.id) === id);
  return <BookDetailsPage book={selectedBook} />;
};

const AppRoutes = () => {
  const location = useLocation();
  const { isLoading } = useAuth();
  const [allBooks, setAllBooks] = useState<Book[]>(seedBooks);

  useEffect(() => {
    let active = true;

    const loadBooks = async () => {
      try {
        const remoteBooks = await fetchBooks();
        if (active && remoteBooks.length > 0) {
          setAllBooks(remoteBooks);
        }
      } catch {
        if (active) {
          setAllBooks(seedBooks);
        }
      }
    };

    loadBooks();

    return () => {
      active = false;
    };
  }, []);

  const handleBookSubmit = async (book: Book) => {
    try {
      const savedBook = await createBook(book);
      setAllBooks((currentBooks) => [savedBook, ...currentBooks]);
    } catch {
      setAllBooks((currentBooks) => [book, ...currentBooks]);
    }
  };

  const showAuthNav = !AUTH_ROUTES.includes(location.pathname);

  if (isLoading) {
    return <LoadingState label="Restoring your session..." />;
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {showAuthNav ? <TopNav /> : null}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<AuthPage type="login" />} />
            <Route path="/signup" element={<AuthPage type="signup" />} />
            <Route path="/home" element={<HomePage books={allBooks} />} />
            <Route path="/library" element={<LibraryPage books={allBooks} />} />
            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <SellBookPage onSubmit={handleBookSubmit} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-books"
              element={
                <ProtectedRoute>
                  <MyBooksPage books={allBooks} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route path="/book/:id" element={<BookDetailsRoute books={allBooks} />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {showAuthNav ? <BottomNav /> : null}
    </div>
  );
};

function App() {
  return <AppRoutes />;
}

export default App;
