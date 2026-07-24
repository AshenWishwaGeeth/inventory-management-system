import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import StockHistory from '../components/stock/StockHistory';

const StockPage = () => {
  const { stockHistory, products } = useProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Stock Management</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <StockHistory history={stockHistory} products={products} />
        </div>
      </div>
    </div>
  );
};

export default StockPage;