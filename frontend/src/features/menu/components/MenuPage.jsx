import { useState } from 'react'
import PropTypes from 'prop-types'
import { useMenu } from '../hooks/useMenu'
import CategoryFilter from './CategoryFilter'
import ProductGrid from './ProductGrid'
import ProductDetailModal from './ProductDetailModal'
import Spinner from '../../../components/ui/Spinner/Spinner'
import EmptyState from '../../../components/ui/EmptyState/EmptyState'
import styles from './MenuPage.module.css'

/**
 * Main menu page — composes category filter, product grid and detail modal.
 *
 * @param {Function} onAddToCart - Called with a product when user adds it to cart
 */
export default function MenuPage({ onAddToCart }) {
  const {
    categories,
    products,
    activeCategoryId,
    setActiveCategoryId,
    loadingCategories,
    loadingProducts,
    errorProducts,
  } = useMenu()

  const [selectedProduct, setSelectedProduct] = useState(null)

  function handleAddToCart(product) {
    onAddToCart(product)
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Nuestro <span className={styles.heroAccent}>Menú</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Ingredientes frescos, sabores auténticos. Elige tu plato favorito.
          </p>
        </section>

        {/* Category filter */}
        {!loadingCategories && (
          <CategoryFilter
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        )}

        {/* Products */}
        {loadingProducts ? (
          <div className={styles.spinnerWrapper}>
            <Spinner size="lg" />
          </div>
        ) : errorProducts ? (
          <p className={styles.errorMsg} role="alert">
            No se pudieron cargar los productos. Por favor intenta de nuevo.
          </p>
        ) : products.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="Sin productos disponibles"
            description="No hay productos en esta categoría por el momento."
          />
        ) : (
          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            onViewDetail={setSelectedProduct}
          />
        )}
      </div>

      {/* Product detail modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </main>
  )
}

MenuPage.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
}
