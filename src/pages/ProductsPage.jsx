import React from 'react';
import ProductList from '../components/products/ProductList';
import { useProducts } from '../context/ProductContext';

const ProductsPage = () => {
  const { products, addProduct, editProduct, deleteProduct, updateStock } = useProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductList
        products={products}
        onAddProduct={addProduct}
        onEditProduct={editProduct}
        onDeleteProduct={deleteProduct}
        onUpdateStock={updateStock}
      />
    </div>
  );
};

export default ProductsPage;