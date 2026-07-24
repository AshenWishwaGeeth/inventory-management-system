import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

// Validation schema for stock updates
const stockUpdateValidationSchema = Yup.object().shape({
  quantity: Yup.number()
    .required('Quantity is required')
    .integer('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(99999, 'Quantity is too large'),
});

const StockManagement = ({ product, onUpdate, onClose }) => {
  const [transactionType, setTransactionType] = useState('restock');

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const quantity = parseInt(values.quantity);
      
      // Validate stock for sale
      if (transactionType === 'sale' && quantity > product.stockQuantity) {
        toast.error(`Not enough stock! Only ${product.stockQuantity} units available`);
        setSubmitting(false);
        return;
      }

      const success = await onUpdate(product.sku, quantity, transactionType);
      setSubmitting(false);
      
      if (success) {
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">
          Update Stock - {product.name}
        </h2>
        
        <div className="mb-4 space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current Stock: <span className="font-semibold">{product.stockQuantity}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            SKU: <span className="font-semibold">{product.sku}</span>
          </p>
        </div>

        <Formik
          initialValues={{ quantity: 1 }}
          validationSchema={stockUpdateValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Transaction Type *
                </label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('restock');
                      setFieldValue('quantity', 1);
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      transactionType === 'restock'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Restock
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('sale');
                      setFieldValue('quantity', 1);
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      transactionType === 'sale'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Sale
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity *
                </label>
                <Field
                  name="quantity"
                  type="number"
                  min="1"
                  className="input-field"
                  placeholder="Enter quantity"
                />
                <ErrorMessage
                  name="quantity"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
                {transactionType === 'sale' && values.quantity > product.stockQuantity && (
                  <div className="text-red-500 text-sm mt-1">
                    Not enough stock! Only {product.stockQuantity} units available
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || (transactionType === 'sale' && values.quantity > product.stockQuantity)}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    transactionType === 'restock'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } ${
                    (isSubmitting || (transactionType === 'sale' && values.quantity > product.stockQuantity))
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isSubmitting 
                    ? 'Processing...' 
                    : transactionType === 'restock' 
                      ? 'Restock' 
                      : 'Process Sale'
                  }
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StockManagement;