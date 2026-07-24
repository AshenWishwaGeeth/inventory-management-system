import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { categoryValidationSchema } from '../../utils/validations';
import { useProducts } from '../../context/ProductContext';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const CategoryManager = () => {
  const { categories, addCategory, deleteCategory, products } = useProducts();
  const [showForm, setShowForm] = useState(false);

  const getCategoryProductCount = (categoryName) => {
    return products.filter(p => p.category === categoryName).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>{showForm ? 'Cancel' : 'Add Category'}</span>
        </button>
      </div>

      {showForm && (
        <div className="card">
          <Formik
            initialValues={{ name: '' }}
            validationSchema={categoryValidationSchema}
            onSubmit={(values, { resetForm }) => {
              const success = addCategory(values.name);
              if (success) {
                resetForm();
                setShowForm(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Field
                    name="name"
                    type="text"
                    className="input-field"
                    placeholder="Enter category name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  Add Category
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => {
          const productCount = getCategoryProductCount(category);
          const isUsed = productCount > 0;

          return (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{category}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {productCount} product{productCount !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => {
                  if (isUsed) {
                    alert('Cannot delete category that is being used by products');
                    return;
                  }
                  if (window.confirm(`Are you sure you want to delete category "${category}"?`)) {
                    deleteCategory(category);
                  }
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isUsed
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900'
                }`}
                disabled={isUsed}
                title={isUsed ? 'Category in use' : 'Delete category'}
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryManager;