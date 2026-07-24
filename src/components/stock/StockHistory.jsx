import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiClock, FiTrendingUp, FiTrendingDown, FiSearch } from 'react-icons/fi';

const StockHistory = ({ history, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredHistory = history.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.productSku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || entry.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    return type === 'restock' 
      ? <FiTrendingUp className="w-4 h-4 text-green-500" />
      : <FiTrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getTypeColor = (type) => {
    return type === 'restock' 
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Transactions</option>
          <option value="restock">Restock</option>
          <option value="sale">Sales</option>
        </select>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredHistory.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex-shrink-0">
                {getTypeIcon(entry.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{entry.productName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  SKU: {entry.productSku}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="text-right">
                <p className={`font-semibold ${getTypeColor(entry.type)}`}>
                  {entry.type === 'restock' ? '+' : '-'}{entry.quantity}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.previousQuantity} → {entry.newQuantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <FiClock className="w-3 h-3 mr-1" />
                  {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          </div>
        ))}
        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No stock history found
          </div>
        )}
      </div>
    </div>
  );
};

export default StockHistory;