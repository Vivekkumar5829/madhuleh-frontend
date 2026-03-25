const styles = {
  honey:   'bg-honey-100 text-honey-700',
  bark:    'bg-bark-900 text-cream-100',
  green:   'bg-green-100 text-green-700',
  red:     'bg-red-100 text-red-700',
  gray:    'bg-gray-100 text-gray-600',
  amber:   'bg-amber-100 text-amber-700',
  blue:    'bg-blue-100 text-blue-700',
}

export default function Badge({ children, variant = 'honey', className = '' }) {
  return (
    <span className={`badge ${styles[variant] || styles.honey} ${className}`}>{children}</span>
  )
}
