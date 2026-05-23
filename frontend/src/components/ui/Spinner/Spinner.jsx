import PropTypes from 'prop-types'
import styles from './Spinner.module.css'

/**
 * Animated loading spinner.
 */
export default function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      className={[styles.spinner, styles[size], className].filter(Boolean).join(' ')}
      role="status"
      aria-label="Cargando…"
    />
  )
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
}
