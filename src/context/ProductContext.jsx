import React, { createContext, useContext, useState, useCallback } from 'react';
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
    const product = products.find(p => p.sku === sku);
    if (!product) {
      toast.error('Product not found');
      return false;
    }

    const newQuantity = type === 'restock' 
      ? product.stockQuantity + quantity
      : product.stockQuantity - quantity;

    if (newQuantity < 0) {
      toast.error('Insufficient stock for this sale');
      return false;
    }

    setProducts(prev => prev.map(p =>
      p.sku === sku
        ? { ...p, stockQuantity: newQuantity, updatedAt: new Date().toISOString() }
        : p
    ));

    // Record in stock history
    const historyEntry = {
      id: Date.now().toString(),
      productSku: sku,
      productName: product.name,
      type,
      quantity,
      previousQuantity: product.stockQuantity,
      newQuantity,
      timestamp: new Date().toISOString()
    };
    setStockHistory(prev => [...prev, historyEntry]);

    toast.success(`Stock ${type === 'restock' ? 'restocked' : 'sold'} successfully!`);
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