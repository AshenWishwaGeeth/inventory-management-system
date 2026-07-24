import * as Yup from 'yup';

export const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters'),
  category: Yup.string()
    .required('Category is required'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .min(0.01, 'Price must be at least 0.01'),
  stockQuantity: Yup.number()
    .required('Stock quantity is required')
    .integer('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative')
});

export const stockUpdateValidationSchema = Yup.object().shape({
  quantity: Yup.number()
    .required('Quantity is required')
    .integer('Quantity must be a whole number')
    .positive('Quantity must be positive')
    .max(99999, 'Quantity is too large'),
  type: Yup.string()
    .required('Transaction type is required')
    .oneOf(['restock', 'sale'], 'Invalid transaction type')
});

export const categoryValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be less than 50 characters')
});