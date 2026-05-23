import axios from 'axios'

/**
 * Axios instance pre-configured for the Food Business API.
 * All requests are relative to /api/v1 — the Vite dev proxy
 * forwards them to the backend, and Nginx handles it in production.
 */
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

/**
 * Response interceptor — normalises every response to the shape
 * { data, error, status } that the backend already returns.
 * On network / unexpected errors it builds the same shape so
 * consumers always deal with a consistent structure.
 */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ??
      error.message ??
      'Error de conexión. Por favor intenta de nuevo.'

    const status = error.response?.status ?? 0

    return Promise.reject({
      data: null,
      error: message,
      status,
    })
  },
)

export default api
