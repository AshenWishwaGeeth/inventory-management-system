import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { calculateTotalValue, getStockStatus, formatCurrency } from '../../utils/helpers';
import StatsCard from './StatsCard';
import CategoryChart from './CategoryChart';
import { FiPackage, FiDollarSign, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const Dashboard = () => {
  const { products, categories } = useProducts();

  const totalProducts = products.length;
  const totalValue = calculateTotalValue(products);
  
  const inStock = products.filter(p => getStockStatus(p.stockQuantity) === 'in-stock').length;
  const lowStock = products.filter(p => getStockStatus(p.stockQuantity) === 'low-stock').length;
  const outOfStock = products.filter(p => getStockStatus(p.stockQuantity) === 'out-of-stock').length;

  // Get category counts
  const categoryCounts = categories.map(category => ({
    name: category,
    count: products.filter(p => p.category === category).length,
    value: products
      .filter(p => p.category === category)
      .reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)
  })).filter(c => c.count > 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={FiPackage}
          color="blue"
        />
        <StatsCard
          title="Total Value"
          value={formatCurrency(totalValue)}
          icon={FiDollarSign}
          color="green"
        />
        <StatsCard
          title="In Stock"
          value={inStock}
          subtitle={`${lowStock} low stock`}
          icon={FiTrendingUp}
          color="green"
        />
        <StatsCard
          title="Out of Stock"
          value={outOfStock}
          icon={FiAlertCircle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart categoryData={categoryCounts} />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Categories</span>
              <span className="font-semibold">{categories.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Products with low stock</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">{lowStock}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Most stocked category</span>
              <span className="font-semibold">
                {categoryCounts.length > 0 
                  ? categoryCounts.reduce((max, c) => c.count > max.count ? c : max).name
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 dark:text-gray-400">Average stock per product</span>
              <span className="font-semibold">
                {totalProducts > 0 
                  ? Math.round(products.reduce((sum, p) => sum + p.stockQuantity, 0) / totalProducts)
                  : 0
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;