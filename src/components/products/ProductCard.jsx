import React from 'react';
import { FiEdit, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { formatCurrency, getStockStatus, STOCK_STATUS_LABELS } from '../../utils/helpers';

const ProductCard = ({ product, onEdit, onDelete, onRestock, onSale }) => {
  const stockStatus = getStockStatus(product.stockQuantity);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'bg-green-500';
      case 'low-stock': return 'bg-yellow-500';
      case 'out-of-stock': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(stockStatus)}`}>
          {STOCK_STATUS_LABELS[stockStatus]}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Category:</span>
          <span className="font-medium">{product.category}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Price:</span>
          <span className="font-medium">{formatCurrency(product.price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Stock:</span>
          <span className={`font-medium ${product.stockQuantity === 0 ? 'text-red-600' : ''}`}>
            {product.stockQuantity} units
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Total Value:</span>
          <span className="font-medium">{formatCurrency(product.price * product.stockQuantity)}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onRestock(product.sku)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
        >
          <FiPlus className="w-4 h-4" />
          <span>Restock</span>
        </button>
        <button
          onClick={() => onSale(product.sku)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          disabled={product.stockQuantity === 0}
        >
          <FiMinus className="w-4 h-4" />
          <span>Sell</span>
        </button>
      </div>

      <div className="flex space-x-2 mt-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <FiEdit className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
              onDelete(product.sku);
            }
          }}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
        >
          <FiTrash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;