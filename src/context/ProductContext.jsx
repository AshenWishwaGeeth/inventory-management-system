import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateSKU } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useLocalStorage('products', []);
  const [categories, setCategories] = useLocalStorage('categories', [
    'Electronics',
    'Clothing',
    'Food & Beverage',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
    'Automotive',
    'Health & Beauty',
    'Other'
  ]);
  const [stockHistory, setStockHistory] = useLocalStorage('stockHistory', []);

  const addProduct = useCallback((productData) => {
    const newProduct = {
      ...productData,
      sku: generateSKU(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    toast.success('Product added successfully!');
    return newProduct;
  }, [setProducts]);

  const editProduct = useCallback((sku, updatedData) => {
    setProducts(prev => prev.map(product => 
      product.sku === sku 
        ? { ...product, ...updatedData, updatedAt: new Date().toISOString() }
        : product
    ));
    toast.success('Product updated successfully!');
  }, [setProducts]);

  const deleteProduct = useCallback((sku) => {
    setProducts(prev => prev.filter(product => product.sku !== sku));
    toast.success('Product deleted successfully!');
  }, [setProducts]);

  const updateStock = useCallback((sku, quantity, type) => {
    // Find the product
    const productIndex = products.findIndex(p => p.sku === sku);
    if (productIndex === -1) {
      toast.error('Product not found');
      return false;
    }

    const product = products[productIndex];
    const quantityNum = parseInt(quantity);
    
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return false;
    }

    let newQuantity;
    if (type === 'restock') {
      newQuantity = product.stockQuantity + quantityNum;
    } else if (type === 'sale') {
      if (product.stockQuantity < quantityNum) {
        toast.error(`Insufficient stock! Only ${product.stockQuantity} units available`);
        return false;
      }
      newQuantity = product.stockQuantity - quantityNum;
    } else {
      toast.error('Invalid transaction type');
      return false;
    }

    // Update the product
    const updatedProducts = [...products];
    updatedProducts[productIndex] = {
      ...product,
      stockQuantity: newQuantity,
      updatedAt: new Date().toISOString()
    };
    setProducts(updatedProducts);

    // Record in stock history
    const historyEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      productSku: product.sku,
      productName: product.name,
      type: type,
      quantity: quantityNum,
      previousQuantity: product.stockQuantity,
      newQuantity: newQuantity,
      timestamp: new Date().toISOString()
    };
    
    setStockHistory(prev => [...prev, historyEntry]);

    toast.success(
      type === 'restock' 
        ? `Added ${quantityNum} units to ${product.name}`
        : `Sold ${quantityNum} units of ${product.name}`
    );
    return true;
  }, [products, setProducts, setStockHistory]);

  const addCategory = useCallback((categoryName) => {
    if (categories.includes(categoryName)) {
      toast.error('Category already exists');
      return false;
    }
    setCategories(prev => [...prev, categoryName]);
    toast.success('Category added successfully!');
    return true;
  }, [categories, setCategories]);

  const deleteCategory = useCallback((categoryName) => {
    // Check if any products are using this category
    const productsUsingCategory = products.some(p => p.category === categoryName);
    if (productsUsingCategory) {
      toast.error('Cannot delete category that is being used by products');
      return false;
    }
    setCategories(prev => prev.filter(c => c !== categoryName));
    toast.success('Category deleted successfully!');
    return true;
  }, [products, setCategories]);

  const value = {
    products,
    categories,
    stockHistory,
    addProduct,
    editProduct,
    deleteProduct,
    updateStock,
    addCategory,
    deleteCategory
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};