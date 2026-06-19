import api from '../api/axios';

/**
 * Cart Service - Handles all cart API calls
 */

const cartService = {
  /**
   * Get user's cart
   * @returns {Promise} Cart data with items and totals
   */
  getCart: async () => {
    try {
      const response = await api.get('/api/cart');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  /**
   * Add item to cart
   * @param {string} productId - Product ID to add
   * @param {number} quantity - Quantity to add (default: 1)
   * @returns {Promise} Updated cart data
   */
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/api/cart/add', {
        productId,
        quantity
      });
      return response.data.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  /**
   * Update item quantity in cart
   * @param {string} productId - Product ID to update
   * @param {number} quantity - New quantity
   * @returns {Promise} Updated cart data
   */
  updateQuantity: async (productId, quantity) => {
    try {
      const response = await api.put(`/api/cart/update/${productId}`, {
        quantity
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   * @param {string} productId - Product ID to remove
   * @returns {Promise} Updated cart data
   */
  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(`/api/cart/remove/${productId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  /**
   * Clear entire cart
   * @returns {Promise} Empty cart data
   */
  clearCart: async () => {
    try {
      const response = await api.delete('/api/cart/clear');
      return response.data.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

export default cartService;
