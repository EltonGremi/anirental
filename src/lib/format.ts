/**
 * Formatta un numero in modo consistente sia server che client
 * Evita hydration mismatch causato da toLocaleString()
 */
export function formatPrice(price: number | null | undefined): string {
  if (!price) return '0'
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
