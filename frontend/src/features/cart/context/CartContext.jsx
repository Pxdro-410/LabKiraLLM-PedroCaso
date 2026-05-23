import { createContext, useContext, useReducer, useMemo } from 'react'
import PropTypes from 'prop-types'

// ─── Reducer ──────────────────────────────────────────────────────────────────

/**
 * Pure cart reducer — exported for property-based testing.
 *
 * @param {{ items: Array }} state
 * @param {{ type: string, payload: any }} action
 * @returns {{ items: Array }}
 */
export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] }
    }

    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.id !== action.payload) }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== id) }
      }
      return {
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity } : i,
        ),
      }
    }

    case 'CLEAR_CART':
      return { items: [] }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const value = useMemo(() => {
    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = state.items.reduce(
      (sum, i) => sum + Number(i.price) * i.quantity,
      0,
    )

    return {
      items: state.items,
      totalItems,
      subtotal,
      addItem: (product) => dispatch({ type: 'ADD_ITEM', payload: product }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
      updateQuantity: (id, quantity) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }
  }, [state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
