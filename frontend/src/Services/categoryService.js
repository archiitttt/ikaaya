import axios from '../api/axios';

/**
 * Fetch all available categories from the backend
 * @returns {Promise<Array>} Array of category objects with name and description
 */
export const getAllCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Fetch a single category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category object or null if not found
 */
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`/api/categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
};

/**
 * Create a new category (Admin only)
 * @param {Object} categoryData - Object with name and description
 * @returns {Promise<Object>} Created category object
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post('/api/categories', categoryData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Update an existing category (Admin only)
 * @param {string} id - Category ID
 * @param {Object} categoryData - Object with updated fields
 * @returns {Promise<Object>} Updated category object
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`/api/categories/${id}`, categoryData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Delete a category (Admin only)
 * @param {string} id - Category ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deleteCategory = async (id) => {
  try {
    await axios.delete(`/api/categories/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};