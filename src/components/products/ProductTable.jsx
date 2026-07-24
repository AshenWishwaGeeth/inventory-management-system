import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiMinus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { formatCurrency, getStockStatus, STOCK_STATUS_LABELS } from '../../utils/helpers';

const ProductTable = ({ 
  products, 
  onEdit, 
  onDelete, 
  onRestock, 
  onSale,
  selectedProducts = [],
  onSelectProduct,
  onSelectAll,
  showBulkActions = false
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStockBadgeColor = (status) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FiChevronDown className="w-4 h-4 opacity-50" />;
    return sortDirection === 'asc' 
      ? <FiChevronUp className="w-4 h-4" />
      : <FiChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {showBulkActions && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded"
                />
              </th>
            )}
            <th 
              className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:text-primary-600"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center space-x-1">
                <span>Product</span>
                <SortIcon field="name" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:text-primary-600"
              onClick={() => handleSort('sku')}
            >
              <div className="flex items-center space-x-1">
                <span>SKU</span>
                <SortIcon field="sku" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:text-primary-600"
              onClick={() => handleSort('category')}
            >
              <div className="flex items-center space-x-1">
                <span>Category</span>
                <SortIcon field="category" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:text-primary-600"
              onClick={() => handleSort('price')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Price</span>
                <SortIcon field="price" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:text-primary-600"
              onClick={() => handleSort('stockQuantity')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Stock</span>
                <SortIcon field="stockQuantity" />
              </div>
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedProducts.map((product) => {
            const stockStatus = getStockStatus(product.stockQuantity);
            return (
              <tr key={product.sku} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {showBulkActions && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.sku)}
                      onChange={() => onSelectProduct && onSelectProduct(product.sku)}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                  </td>
                )}
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{product.sku}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-3 text-right">{product.stockQuantity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockBadgeColor(stockStatus)}`}>
                    {STOCK_STATUS_LABELS[stockStatus]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onRestock(product.sku)}
                      className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                      title="Restock"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSale(product.sku)}
                      className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      title="Sell"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                          onDelete(product.sku);
                        }
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {sortedProducts.length === 0 && (
            <tr>
              <td colSpan={showBulkActions ? 9 : 8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;