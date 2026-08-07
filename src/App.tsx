import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { SellBookPage } from './pages/SellBookPage';
import { MyBooksPage } from './pages/MyBooksPage';
import { AccountPage } from './pages/AccountPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { BottomNav } from './components/BottomNav';
import { useState } from 'react';
import type { Book } from './types';
import { books as seedBooks } from './data/books';

const AppRoutes = () => {
  const location = useLocation();
  const [allBooks, setAllBooks] = useState<Book[]>(seedBooks);
  const [, setIsLoggedIn] = useState(false);

  const handleBookSubmit = (book: Book) => {
    setAllBooks([book, ...allBooks]);
  };

  const bottomNavRoutes = ['/home', '/library', '/sell', '/my-books', '/account'];
  const showBottomNav = bottomNavRoutes.includes(location.pathname);

  const currentBook = allBooks[0];

  return (
    <div className="min-h-screen bg-bg text-text">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<AuthPage type="login" onAuthenticate={() => setIsLoggedIn(true)} />} />
            <Route path="/signup" element={<AuthPage type="signup" onAuthenticate={() => setIsLoggedIn(true)} />} />
            <Route path="/home" element={<HomePage books={allBooks} />} />
            <Route path="/library" element={<LibraryPage books={allBooks} />} />
            <Route path="/sell" element={<SellBookPage onSubmit={handleBookSubmit} />} />
            <Route path="/my-books" element={<MyBooksPage books={allBooks} />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/book/:id" element={<BookDetailsPage book={currentBook} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

function App() {
  return <AppRoutes />;
}

export default App;
