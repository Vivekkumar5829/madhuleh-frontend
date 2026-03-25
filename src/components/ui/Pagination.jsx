import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i)

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button onClick={() => onChange(page - 1)} disabled={page === 0}
        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-honey-50 disabled:opacity-40 transition-colors">
        <ChevronLeft size={16} />
      </button>
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-full text-sm font-bold transition-colors ${
            p === page ? 'bg-honey-500 text-bark-900' : 'border border-gray-200 text-gray-600 hover:bg-honey-50'
          }`}>
          {p + 1}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1}
        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-honey-50 disabled:opacity-40 transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
