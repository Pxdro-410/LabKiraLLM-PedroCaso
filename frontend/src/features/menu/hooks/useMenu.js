import { useState, useEffect, useCallback } from 'react'
import { getCategories, getProducts } from '../services/menuService'

/**
 * Hook that manages menu state: categories, products and active category filter.
 *
 * @returns {{
 *   categories: Array,
 *   products: Array,
 *   activeCategoryId: number|null,
 *   setActiveCategoryId: Function,
 *   loadingCategories: boolean,
 *   loadingProducts: boolean,
 *   errorCategories: object|null,
 *   errorProducts: object|null,
 *   refetchProducts: Function,
 * }}
 */
export function useMenu() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [errorCategories, setErrorCategories] = useState(null)
  const [errorProducts, setErrorProducts] = useState(null)

  // Load categories once on mount
  useEffect(() => {
    let cancelled = false
    setLoadingCategories(true)
    getCategories()
      .then((data) => { if (!cancelled) setCategories(data) })
      .catch((err) => { if (!cancelled) setErrorCategories(err) })
      .finally(() => { if (!cancelled) setLoadingCategories(false) })
    return () => { cancelled = true }
  }, [])

  // Reload products whenever the active category changes
  const fetchProducts = useCallback((categoryId) => {
    let cancelled = false
    setLoadingProducts(true)
    setErrorProducts(null)
    getProducts(categoryId)
      .then((data) => { if (!cancelled) setProducts(data) })
      .catch((err) => { if (!cancelled) setErrorProducts(err) })
      .finally(() => { if (!cancelled) setLoadingProducts(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const cancel = fetchProducts(activeCategoryId)
    return cancel
  }, [activeCategoryId, fetchProducts])

  return {
    categories,
    products,
    activeCategoryId,
    setActiveCategoryId,
    loadingCategories,
    loadingProducts,
    errorCategories,
    errorProducts,
    refetchProducts: () => fetchProducts(activeCategoryId),
  }
}
