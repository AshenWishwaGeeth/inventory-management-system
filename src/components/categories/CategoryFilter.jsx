import React from 'react';

const CategoryFilter = ({ selectedCategory, onCategoryChange, categories }) => {
  return (
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
    >
      <option value="">All Categories</option>
      {categories.map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;