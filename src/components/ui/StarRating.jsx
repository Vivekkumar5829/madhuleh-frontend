import { Star } from 'lucide-react'

export default function StarRating({ value = 0, max = 5, size = 14, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map(s => (
        <button key={s} type={onChange ? 'button' : undefined}
          onClick={() => onChange?.(s)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${s} star`}>
          <Star size={size}
            className={s <= value
              ? 'text-honey-500 fill-honey-500'
              : 'text-gray-200 fill-gray-200'} />
        </button>
      ))}
    </div>
  )
}
