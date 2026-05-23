import styles from './Footer.module.css'

const CURRENT_YEAR = new Date().getFullYear()

/**
 * Site footer with brand info and copyright.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.brand}>
          Sabor<span className={styles.accent}>Haus</span>
        </p>
        <p className={styles.tagline}>
          Cocina de autor · Ingredientes frescos · Experiencia única
        </p>
        <hr className={styles.divider} />
        <p className={styles.copy}>
          © {CURRENT_YEAR} SaborHaus. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
