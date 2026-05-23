import PropTypes from 'prop-types'
import { formatCurrency } from '../../../utils/formatCurrency'
import styles from './CartSummary.module.css'

/**
 * Displays cart totals — updates in real time as items change.
 */
export default function CartSummary({ totalItems, subtotal }) {
  return (
    <div className={styles.summary} aria-live="polite" aria-label="Resumen del carrito">
      <div className={styles.row}>
        <span className={styles.label}>Productos</span>
        <span className={styles.value}>{totalItems}</span>
      </div>

      <div className={[styles.row, styles.totalRow].join(' ')}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>{formatCurrency(subtotal)}</span>
      </div>
    </div>
  )
}

CartSummary.propTypes = {
  totalItems: PropTypes.number.isRequired,
  subtotal: PropTypes.number.isRequired,
}
