export const generateSKU = () => {
  const prefix = 'PRD';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const calculateTotalValue = (products) => {
  return products.reduce((total, product) => {
    return total + (product.price * product.stockQuantity);
  }, 0);
};

export const getStockStatus = (quantity) => {
  if (quantity === 0) return 'out-of-stock';
  if (quantity < 10) return 'low-stock';
  return 'in-stock';
};

export const filterProducts = (products, searchTerm, category, stockStatus) => {
  return products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === '' || product.category === category;
    
    const matchesStock = stockStatus === '' || 
      (stockStatus === 'in-stock' && product.stockQuantity > 10) ||
      (stockStatus === 'low-stock' && product.stockQuantity > 0 && product.stockQuantity <= 10) ||
      (stockStatus === 'out-of-stock' && product.stockQuantity === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });
};

export const exportToCSV = (products) => {
  const headers = ['Name', 'SKU', 'Category', 'Price', 'Stock Quantity', 'Total Value'];
  const rows = products.map(product => [
    product.name,
    product.sku,
    product.category,
    product.price,
    product.stockQuantity,
    product.price * product.stockQuantity
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventory_export.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};