import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
    red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;