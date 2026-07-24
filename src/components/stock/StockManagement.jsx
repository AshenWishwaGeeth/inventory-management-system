import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { stockUpdateValidationSchema } from '../../utils/validations';

const StockManagement = ({ product, onUpdate, onClose }) => {
  const [transactionType, setTransactionType] = useState('restock');

  const handleSubmit = (values, { setSubmitting }) => {
    const success = onUpdate(product.sku, parseInt(values.quantity), transactionType);
    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">
          Update Stock - {product.name}
        </h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current Stock: <span className="font-semibold">{product.stockQuantity}</span>
          </p>
        </div>

        <Formik
          initialValues={{ quantity: 1 }}
          validationSchema={stockUpdateValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
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
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
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
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    transactionType === 'restock'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {transactionType === 'restock' ? 'Restock' : 'Process Sale'}
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