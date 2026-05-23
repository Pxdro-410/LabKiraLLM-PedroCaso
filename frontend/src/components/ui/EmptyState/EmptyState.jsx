import PropTypes from 'prop-types'
import styles from './EmptyState.module.css'

/**
 * Generic empty state with icon, title and optional description.
 */
export default function EmptyState({
  icon = '🍽️',
  title,
  description,
  children,
}) {
  return (
    <div className={styles.container} role="status">
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
}
