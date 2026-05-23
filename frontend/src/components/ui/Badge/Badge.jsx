import PropTypes from 'prop-types'
import styles from './Badge.module.css'

/**
 * Small numeric badge, typically used to show cart item count.
 */
export default function Badge({ count, className = '' }) {
  if (!count || count <= 0) return null

  return (
    <span className={[styles.badge, className].filter(Boolean).join(' ')}>
      {count > 99 ? '99+' : count}
    </span>
  )
}

Badge.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
}
