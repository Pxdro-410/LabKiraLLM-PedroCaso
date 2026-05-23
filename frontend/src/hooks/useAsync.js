import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Generic hook for managing async operations.
 *
 * @param {Function} asyncFn - The async function to execute.
 * @param {boolean} [immediate=false] - Whether to run on mount automatically.
 * @returns {{ data, loading, error, execute, reset }}
 *
 * @example
 * const { data, loading, error, execute } = useAsync(menuService.getProducts)
 * useEffect(() => { execute() }, [execute])
 */
export function useAsync(asyncFn, immediate = false) {
  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null,
  })

  // Keep a ref to avoid stale-closure issues with the latest asyncFn
  const fnRef = useRef(asyncFn)
  useEffect(() => {
    fnRef.current = asyncFn
  }, [asyncFn])

  // Track whether the component is still mounted to avoid state updates on unmounted components
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const execute = useCallback(async (...args) => {
    if (!mountedRef.current) return

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await fnRef.current(...args)
      if (mountedRef.current) {
        setState({ data: result, loading: false, error: null })
      }
      return result
    } catch (err) {
      if (mountedRef.current) {
        setState({ data: null, loading: false, error: err })
      }
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  // Run immediately on mount if requested
  useEffect(() => {
    if (immediate) {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ...state, execute, reset }
}
