import PropTypes from 'prop-types'
import Badge from '../../ui/Badge/Badge'
import styles from './Navbar.module.css'

/**
 * Top navigation bar with brand identity and cart button.
 *
 * @param {number}   totalItems  - Number of items currently in the cart
 * @param {Function} onCartClick - Called when the cart button is pressed
 */
export default function Navbar({ totalItems = 0, onCartClick }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand} role="banner">
          <span className={styles.logo} aria-hidden="true">🍴</span>
          <span className={styles.brandName}>
            Sabor<span className={styles.brandAccent}>Haus</span>
          </span>
        </div>

        {/* Cart trigger */}
        <button
          className={styles.cartBtn}
          onClick={onCartClick}
          aria-label={`Abrir carrito, ${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`}
        >
          <span className={styles.cartIcon} aria-hidden="true">🛒</span>
          <span className={styles.cartLabel}>Carrito</span>
          <span className={styles.badgeWrapper}>
            <Badge count={totalItems} />
          </span>
        </button>
      </div>
    </header>
  )
}

Navbar.propTypes = {
  totalItems: PropTypes.number,
  onCartClick: PropTypes.func.isRequired,
}
