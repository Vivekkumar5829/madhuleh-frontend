export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-6xl mb-4 animate-bounce-slow">{icon}</div>
      <h3 className="font-display text-xl font-bold text-bark-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-6">{message}</p>
      {action}
    </div>
  )
}
