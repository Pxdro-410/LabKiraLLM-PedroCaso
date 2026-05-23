import PropTypes from 'prop-types'
import { formatCurrency } from '../../../utils/formatCurrency'
import styles from './CartItem.module.css'

/**
 * Single cart item row with quantity controls and remove button.
 */
export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <li className={styles.item}>
      <div className={styles.info}>
        <p className={styles.name}>{item.name}</p>
        <p className={styles.unitPrice}>{formatCurrency(item.price)} c/u</p>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.qtyBtn}
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          aria-label={`Reducir cantidad de ${item.name}`}
        >
          −
        </button>
        <span className={styles.qty} aria-label={`Cantidad: ${item.quantity}`}>
          {item.quantity}
        </span>
        <button
          className={styles.qtyBtn}
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          aria-label={`Aumentar cantidad de ${item.name}`}
        >
          +
        </button>
      </div>

      <span className={styles.linePrice}>
        {formatCurrency(Number(item.price) * item.quantity)}
      </span>

      <button
        className={styles.removeBtn}
        onClick={() => onRemove(item.id)}
        aria-label={`Eliminar ${item.name} del carrito`}
      >
        ✕
      </button>
    </li>
  )
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}
