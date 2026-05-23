import PropTypes from 'prop-types'
import { useCart } from '../../cart/context/CartContext'
import { useOrder } from '../hooks/useOrder'
import { formatCurrency } from '../../../utils/formatCurrency'
import Button from '../../../components/ui/Button/Button'
import CartSummary from '../../cart/components/CartSummary'
import styles from './CheckoutPage.module.css'

/**
 * Checkout page — shows cart summary and confirms the order.
 *
 * @param {Function} onSuccess  - Called with the created order when confirmed
 * @param {Function} onBack     - Called when user wants to go back to menu
 */
export default function CheckoutPage({ onSuccess, onBack }) {
  const { items, totalItems, subtotal, clearCart } = useCart()
  const { loading, error, placeOrder } = useOrder()

  const isEmpty = items.length === 0

  async function handleConfirm() {
    if (isEmpty) return
    const orderItems = items.map((i) => ({
      product_id: i.id,
      quantity: i.quantity,
    }))
    const created = await placeOrder(orderItems)
    clearCart()
    onSuccess(created)
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Confirmar pedido</h1>

        {/* Items summary */}
        <div className={styles.card}>
          <p className={styles.sectionTitle}>Productos seleccionados</p>
          {isEmpty ? (
            <p style={{ color: 'var(--color-neutral-400)', fontSize: 'var(--font-size-sm)' }}>
              No hay productos en el carrito.
            </p>
          ) : (
            <ul className={styles.itemList}>
              {items.map((item) => (
                <li key={item.id} className={styles.itemRow}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQty}>×{item.quantity}</span>
                  <span className={styles.itemPrice}>
                    {formatCurrency(Number(item.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Totals */}
        {!isEmpty && (
          <div className={styles.card}>
            <CartSummary totalItems={totalItems} subtotal={subtotal} />
          </div>
        )}

        {/* Error */}
        {error && (
          <p className={styles.errorMsg} role="alert">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            fullWidth
            loading={loading}
            disabled={isEmpty}
            onClick={handleConfirm}
            aria-label={isEmpty ? 'Agrega productos antes de confirmar' : 'Confirmar pedido'}
          >
            {isEmpty ? 'Agrega productos al carrito' : 'Confirmar pedido'}
          </Button>
          <Button variant="ghost" fullWidth onClick={onBack}>
            ← Volver al menú
          </Button>
        </div>
      </div>
    </main>
  )
}

CheckoutPage.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
}
