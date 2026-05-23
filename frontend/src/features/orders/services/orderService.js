import api from '../../../services/api'

/**
 * Create a new order from cart items.
 *
 * @param {Array<{ product_id: number, quantity: number }>} items
 * @returns {Promise<object>} Created order object
 */
export async function createOrder(items) {
  const response = await api.post('/orders', { items })
  return response.data
}

/**
 * Fetch an existing order by ID.
 *
 * @param {number} orderId
 * @returns {Promise<object>} Order object
 */
export async function getOrder(orderId) {
  const response = await api.get(`/orders/${orderId}`)
  return response.data
}
