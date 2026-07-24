import React, { useState, useMemo } from 'react';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import ProductCard from './ProductCard';
import StockManagement from '../stock/StockManagement';
import CategoryFilter from '../categories/CategoryFilter';
import { filterProducts, exportToCSV } from '../../utils/helpers';
import { FiGrid, FiList, FiSearch, FiDownload, FiPackage } from 'react-icons/fi';
import { useProducts } from '../../context/ProductContext';

const ProductList = ({ products, onAddProduct, onEditProduct, onDeleteProduct, onUpdateStock }) => {
  const { categories } = useProducts();
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stockManagementProduct, setStockManagementProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const filteredProducts = useMemo(() => {
    return filterProducts(products, searchTerm, selectedCategory, stockStatusFilter);
  }, [products, searchTerm, selectedCategory, stockStatusFilter]);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleEditSubmit = (values) => {
    onEditProduct(editingProduct.sku, values);
    setEditingProduct(null);
  };

  const handleAddSubmit = (values) => {
    onAddProduct(values);
    setShowAddForm(false);
  };

  const handleStockUpdate = (sku, quantity, type) => {
    return onUpdateStock(sku, quantity, type);
  };

  const handleRestock = (sku) => {
    const product = products.find(p => p.sku === sku);
    if (product) {
      setStockManagementProduct(product);
    }
  };

  const handleSale = (sku) => {
    const product = products.find(p => p.sku === sku);
    if (product) {
      setStockManagementProduct(product);
    }
  };

  const handleSelectProduct = (sku) => {
    setSelectedProducts(prev => 
      prev.includes(sku) 
        ? prev.filter(id => id !== sku)
        : [...prev, sku]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.sku));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      selectedProducts.forEach(sku => onDeleteProduct(sku));
      setSelectedProducts([]);
    }
  };

  const handleBulkExport = () => {
    const selectedProductsData = products.filter(p => selectedProducts.includes(p.sku));
    exportToCSV(selectedProductsData);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPackage />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
        <select
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiList className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'card'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <span className="font-medium">{selectedProducts.length} products selected</span>
          <button
            onClick={handleBulkDelete}
            className="btn-danger text-sm"
          >
            Delete Selected
          </button>
          <button
            onClick={handleBulkExport}
            className="btn-secondary text-sm flex items-center space-x-1"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export Selected</span>
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {viewMode === 'table' ? (
          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={onDeleteProduct}
            onRestock={handleRestock}
            onSale={handleSale}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            showBulkActions={true}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.sku}
                product={product}
                onEdit={handleEdit}
                onDelete={onDeleteProduct}
                onRestock={handleRestock}
                onSale={handleSale}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <ProductForm
              onSubmit={handleAddSubmit}
              onCancel={() => setShowAddForm(false)}
              isEditing={false}
            />
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <ProductForm
              initialValues={editingProduct}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingProduct(null)}
              isEditing={true}
            />
          </div>
        </div>
      )}

      {/* Stock Management Modal */}
      {stockManagementProduct && (
        <StockManagement
          product={stockManagementProduct}
          onUpdate={handleStockUpdate}
          onClose={() => setStockManagementProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductList;