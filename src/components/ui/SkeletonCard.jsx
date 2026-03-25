export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-3 w-3/4" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton w-9 h-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}
