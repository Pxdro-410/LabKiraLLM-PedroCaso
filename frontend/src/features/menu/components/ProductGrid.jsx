import PropTypes from 'prop-types'
import ProductCard from './ProductCard'
import styles from './ProductGrid.module.css'

/**
 * Responsive grid of ProductCard components.
 */
export default function ProductGrid({ products, onAddToCart, onViewDetail }) {
  return (
    <section className={styles.grid} aria-label="Productos del menú">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetail={onViewDetail}
        />
      ))}
    </section>
  )
}

ProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onViewDetail: PropTypes.func.isRequired,
}
