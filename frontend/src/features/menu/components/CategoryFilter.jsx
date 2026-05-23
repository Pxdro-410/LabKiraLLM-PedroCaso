import PropTypes from 'prop-types'
import styles from './CategoryFilter.module.css'

/**
 * Horizontal pill-button filter for menu categories.
 */
export default function CategoryFilter({ categories, activeCategoryId, onSelect }) {
  return (
    <nav className={styles.wrapper} aria-label="Filtrar por categoría">
      <button
        className={[styles.btn, activeCategoryId === null ? styles.active : ''].join(' ')}
        onClick={() => onSelect(null)}
        aria-pressed={activeCategoryId === null}
      >
        Todos
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          className={[styles.btn, activeCategoryId === cat.id ? styles.active : ''].join(' ')}
          onClick={() => onSelect(cat.id)}
          aria-pressed={activeCategoryId === cat.id}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  )
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }),
  ).isRequired,
  activeCategoryId: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
}
