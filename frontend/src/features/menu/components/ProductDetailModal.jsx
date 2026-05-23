import PropTypes from 'prop-types'
import Modal from '../../../components/ui/Modal/Modal'
import Button from '../../../components/ui/Button/Button'
import { formatCurrency } from '../../../utils/formatCurrency'
import styles from './ProductDetailModal.module.css'

const PLACEHOLDER = '/placeholder-food.webp'

/**
 * Modal showing full product details with an add-to-cart action.
 */
export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null

  function handleAdd() {
    onAddToCart(product)
    onClose()
  }

  return (
    <Modal isOpen={!!product} onClose={onClose} title={product.name}>
      <img
        src={product.image_url || PLACEHOLDER}
        alt={product.name}
        className={styles.image}
        onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
      />

      {product.description && (
        <p className={styles.description}>{product.description}</p>
      )}

      <div className={styles.footer}>
        <span className={styles.price}>{formatCurrency(product.price)}</span>
        <Button onClick={handleAdd} variant="primary">
          Agregar al carrito
        </Button>
      </div>
    </Modal>
  )
}

ProductDetailModal.propTypes = {
  product: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
}
