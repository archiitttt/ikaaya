import api from '../api/axios';

/**
 * Order Service - Handles all order API calls
 */

const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - { items, address, paymentMethod }
   * @returns {Promise} Created order data
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Get user's orders
   * @returns {Promise} Array of orders
   */
  getMyOrders: async () => {
    try {
      const response = await api.get('/api/orders/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Get a specific order by ID
   * @param {string} orderId
   * @returns {Promise} Order data
   */
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
};

export default orderService;
