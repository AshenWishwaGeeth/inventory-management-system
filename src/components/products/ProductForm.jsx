import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { productValidationSchema } from '../../utils/validations';
import { useProducts } from '../../context/ProductContext';

const ProductForm = ({ initialValues, onSubmit, onCancel, isEditing }) => {
  const { categories } = useProducts();

  const defaultValues = {
    name: '',
    category: '',
    price: '',
    stockQuantity: '',
    ...initialValues
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={productValidationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name *
            </label>
            <Field
              name="name"
              type="text"
              className="input-field"
              placeholder="Enter product name"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Category *
            </label>
            <Field
              name="category"
              as="select"
              className="input-field"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="category"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Price (USD) *
            </label>
            <Field
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              className="input-field"
              placeholder="0.00"
            />
            <ErrorMessage
              name="price"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Stock Quantity *
            </label>
            <Field
              name="stockQuantity"
              type="number"
              min="0"
              className="input-field"
              placeholder="0"
            />
            <ErrorMessage
              name="stockQuantity"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;