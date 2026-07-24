import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiPackage, FiTrendingUp, FiTag } from 'react-icons/fi';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/products', icon: FiPackage, label: 'Products' },
    { path: '/stock', icon: FiTrendingUp, label: 'Stock' },
    { path: '/categories', icon: FiTag, label: 'Categories' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-4 right-4 p-3 bg-primary-500 text-white rounded-full shadow-lg z-40"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;