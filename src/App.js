import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProductProvider } from './context/ProductContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import StockPage from './pages/StockPage';
import CategoriesPage from './pages/CategoriesPage';

function App() {
  return (
    <ThemeProvider>
      <ProductProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <Sidebar />
            <main className="pb-20 md:pb-0">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
              </Routes>
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;