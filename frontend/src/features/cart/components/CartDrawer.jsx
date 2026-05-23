import { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useCart } from '../context/CartContext'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import Button from '../../../components/ui/Button/Button'
import EmptyState from '../../../components/ui/EmptyState/EmptyState'
import styles from './CartDrawer.module.css'

/**
 * Slide-in cart drawer with item list, summary and checkout action.
 *
 * @param {boolean}  isOpen       - Whether the drawer is visible
 * @param {Function} onClose      - Called when the drawer should close
 * @param {Function} onCheckout   - Called when the user confirms the order
 */
export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, totalItems, subtotal, updateQuantity, removeItem } = useCart()

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose() },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const isEmpty = items.length === 0

  return (
    <>
      {/* Overlay */}
      <div
        className={styles.overlay}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            🛒 Carrito {totalItems > 0 && `(${totalItems})`}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {isEmpty ? (
            <EmptyState
              icon="🛒"
              title="Tu carrito está vacío"
              description="Agrega productos del menú para comenzar tu pedido."
            />
          ) : (
            <ul className={styles.itemList} aria-label="Productos en el carrito">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className={styles.footer}>
            <CartSummary totalItems={totalItems} subtotal={subtotal} />
            <Button
              variant="primary"
              fullWidth
              onClick={onCheckout}
              aria-label="Confirmar pedido"
            >
              Confirmar pedido
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}

CartDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
}
