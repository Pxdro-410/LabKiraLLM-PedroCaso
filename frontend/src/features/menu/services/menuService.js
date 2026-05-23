import api from '../../../services/api'

/**
 * Fetch all categories from the API.
 * @returns {Promise<Array>} Array of category objects
 */
export async function getCategories() {
  const response = await api.get('/categories')
  return response.data ?? []
}

/**
 * Fetch products, optionally filtered by category.
 * @param {number|null} [categoryId=null]
 * @returns {Promise<Array>} Array of product objects
 */
export async function getProducts(categoryId = null) {
  const params = categoryId != null ? { category_id: categoryId } : {}
  const response = await api.get('/products', { params })
  return response.data ?? []
}

/**
 * Fetch a single product by ID.
 * @param {number} productId
 * @returns {Promise<object>} Product object
 */
export async function getProductById(productId) {
  const response = await api.get(`/products/${productId}`)
  return response.data
}
