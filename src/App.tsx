import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import { Footer } from './components/common/Footer';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/movie/:id" element={<MovieDetailsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </div>
            <Footer />
          </div>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;