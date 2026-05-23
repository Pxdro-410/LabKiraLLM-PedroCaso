import { useState, useCallback } from 'react'
import { createOrder } from '../services/orderService'

/**
 * Hook for managing order creation state.
 *
 * @returns {{ order, loading, error, placeOrder, reset }}
 */
export function useOrder() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const placeOrder = useCallback(async (items) => {
    setLoading(true)
    setError(null)
    try {
      const created = await createOrder(items)
      setOrder(created)
      return created
    } catch (err) {
      setError(err?.error ?? 'No se pudo crear el pedido. Intenta de nuevo.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setOrder(null)
    setError(null)
    setLoading(false)
  }, [])

  return { order, loading, error, placeOrder, reset }
}
