import PropTypes from 'prop-types'
import { formatCurrency } from '../../../utils/formatCurrency'
import Button from '../../../components/ui/Button/Button'
import styles from './OrderConfirmation.module.css'

/**
 * Order confirmation screen shown after a successful order placement.
 *
 * @param {object}   order      - The created order returned by the API
 * @param {Function} onBackToMenu - Called when user wants to return to the menu
 */
export default function OrderConfirmation({ order, onBackToMenu }) {
  if (!order) return null

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.icon} aria-hidden="true">🎉</div>

        <h1 className={styles.title}>¡Pedido confirmado!</h1>
        <p className={styles.subtitle}>
          Tu pedido ha sido recibido y está siendo preparado.
        </p>

        <div className={styles.orderCard}>
          {/* Order number */}
          <div className={styles.orderNumber}>
            <span className={styles.orderLabel}>Número de pedido</span>
            <span className={styles.orderValue}>#{order.id}</span>
          </div>

          {/* Status */}
          <div className={styles.statusBadge}>
            <span aria-hidden="true">●</span>
            {order.status}
          </div>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <ul className={styles.itemList} aria-label="Productos del pedido">
              {order.items.map((item) => (
                <li key={item.id} className={styles.itemRow}>
                  <span>
                    {item.product_id
                      ? `Producto #${item.product_id}`
                      : 'Producto'}{' '}
                    ×{item.quantity}
                  </span>
                  <span className={styles.itemPrice}>
                    {formatCurrency(Number(item.unit_price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Total */}
          <div className={styles.total}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <Button variant="primary" fullWidth onClick={onBackToMenu}>
          Volver al menú
        </Button>
      </div>
    </main>
  )
}

OrderConfirmation.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    items: PropTypes.array,
  }),
  onBackToMenu: PropTypes.func.isRequired,
}
