import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, X, MessageSquare } from 'lucide-react'
import { reviewsAPI, unwrap } from '../../services/api'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import toast from 'react-hot-toast'

export default function AdminReviews() {
  const qc      = useQueryClient()
  const [page, setPage] = useState(0)
  const [notes, setNotes] = useState({})

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', page],
    queryFn:  () => reviewsAPI.getPending({ page, size: 20 }).then(unwrap),
    keepPreviousData: true,
  })

  const reviews    = data?.content    || []
  const totalPages = data?.totalPages || 0

  const moderate = async (id, status) => {
    try {
      await reviewsAPI.moderate(id, { status, adminNotes: notes[id] || undefined })
      toast.success(`Review ${status.toLowerCase()}!`)
      qc.invalidateQueries({ queryKey: ['admin-reviews'] })
    } catch { toast.error('Failed') }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-bark-900">Review Moderation</h1>
        <p className="text-gray-500 text-sm">{data?.totalElements || 0} pending reviews</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-card">
          <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">All caught up! No pending reviews.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-bark-900 text-sm">{r.user?.firstName} {r.user?.lastName}</p>
                    {r.verifiedPurchase && <span className="badge bg-green-100 text-green-700">Verified Purchase</span>}
                  </div>
                  <div className="flex gap-0.5">
                    {Array(5).fill(0).map((_,i) => (
                      <span key={i} className={`text-sm ${i < r.rating ? 'text-honey-500' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
              </div>

              <p className="font-semibold text-bark-900 text-sm mb-1">{r.title}</p>
              <p className="text-sm text-bark-600 mb-4 leading-relaxed">{r.body}</p>

              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <input
                  value={notes[r.id] || ''}
                  onChange={e => setNotes(n => ({ ...n, [r.id]: e.target.value }))}
                  placeholder="Admin note (optional)…"
                  className="input flex-1 text-xs py-2"
                />
                <div className="flex gap-2">
                  <button onClick={() => moderate(r.id, 'APPROVED')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-full text-xs font-bold hover:bg-green-600 transition-colors">
                    <Check size={12} /> Approve
                  </button>
                  <button onClick={() => moderate(r.id, 'REJECTED')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors">
                    <X size={12} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
