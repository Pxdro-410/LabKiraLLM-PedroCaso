/**
 * Formats a numeric price value as a localized currency string.
 *
 * @param {number} price - The numeric price to format.
 * @param {string} [locale='es-PE'] - BCP 47 locale tag (e.g. 'es-PE', 'en-US').
 * @param {string} [currency='PEN'] - ISO 4217 currency code (e.g. 'PEN', 'USD').
 * @returns {string} Formatted price string with exactly two decimal places and currency symbol.
 *
 * @example
 * formatCurrency(12.9)        // 'S/ 12.90'
 * formatCurrency(8, 'en-US', 'USD') // '$8.00'
 */
export function formatCurrency(price, locale = 'es-PE', currency = 'PEN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}
