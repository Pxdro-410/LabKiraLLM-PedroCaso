import PropTypes from 'prop-types'
import { formatCurrency } from '../../../utils/formatCurrency'
import styles from './ProductCard.module.css'

const PLACEHOLDER = '/placeholder-food.webp'

/**
 * Card displaying a single menu product with add-to-cart action.
 */
export default function ProductCard({ product, onAddToCart, onViewDetail }) {
  function handleImageError(e) {
    e.currentTarget.src = PLACEHOLDER
  }

  function handleAddClick(e) {
    e.stopPropagation()
    onAddToCart(product)
  }

  return (
    <article
      className={styles.card}
      onClick={() => onViewDetail(product)}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalle de ${product.name}`}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetail(product)}
    >
      <div className={styles.imageWrapper}>
        <img
          src={product.image_url || PLACEHOLDER}
          alt={product.name}
          className={styles.image}
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}

        <div className={styles.footer}>
          <span className={styles.price} aria-label={`Precio: ${formatCurrency(product.price)}`}>
            {formatCurrency(product.price)}
          </span>
          <button
            className={styles.addBtn}
            onClick={handleAddClick}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            + Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    image_url: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onViewDetail: PropTypes.func.isRequired,
}
