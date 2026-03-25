export default function Spinner({ size = 'md', className = '' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-12 h-12' }[size]
  return (
    <div className={`${sz} ${className} animate-spin rounded-full border-2 border-honey-200 border-t-honey-500`} />
  )
}
