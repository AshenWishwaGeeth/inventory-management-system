import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiTrendingUp, FiTag } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/products', icon: FiPackage, label: 'Products' },
    { path: '/stock', icon: FiTrendingUp, label: 'Stock' },
    { path: '/categories', icon: FiTag, label: 'Categories' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              InventoryMS
            </Link>
          </div>
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link
              to="/products"
              className="btn-primary text-sm"
            >
              + Add Product
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;