import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail, ChevronDown } from 'lucide-react'
import { contactAPI, unwrap } from '../../services/api'
import Spinner from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['OPEN','IN_PROGRESS','RESOLVED','CLOSED']
const STATUS_COLOR   = {
  OPEN:        'bg-red-100 text-red-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  RESOLVED:    'bg-green-100 text-green-700',
  CLOSED:      'bg-gray-100 text-gray-500',
}

export default function AdminInquiries() {
  const qc = useQueryClient()
  const [detail, setDetail] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn:  () => contactAPI.getAll().then(unwrap),
  })
  const inquiries = Array.isArray(data) ? data : (data?.content || [])

  const updateStatus = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status)
      toast.success('Status updated!')
      qc.invalidateQueries({ queryKey: ['admin-inquiries'] })
      if (detail?.id === id) setDetail(d => ({ ...d, status }))
    } catch { toast.error('Failed') }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-bark-900">Contact Inquiries</h1>
        <p className="text-gray-500 text-sm">{inquiries.length} total inquiries</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-card">
          <Mail size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No inquiries yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['From','Subject','Date','Status',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inquiries.map(inq => (
                  <tr key={inq.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setDetail(inq)}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-bark-900">{inq.name}</p>
                      <p className="text-xs text-gray-400">{inq.email}</p>
                    </td>
                    <td className="px-4 py-3 text-bark-600 max-w-xs">
                      <p className="line-clamp-1">{inq.subject}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLOR[inq.status] || 'bg-gray-100 text-gray-500'}`}>{inq.status}</span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="relative">
                        <select
                          value={inq.status}
                          onChange={e => updateStatus(inq.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 pr-6 appearance-none cursor-pointer bg-white text-bark-700 focus:border-honey-500 outline-none">
                          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Inquiry Details" size="md">
        {detail && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Name',    detail.name],
                ['Email',   detail.email],
                ['Phone',   detail.phone || '—'],
                ['Subject', detail.subject],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{k}</p>
                  <p className="text-bark-900 font-medium">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Message</p>
              <p className="text-sm text-bark-700 bg-gray-50 rounded-xl p-4 leading-relaxed">{detail.message}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="label mb-0">Update Status:</label>
              <select value={detail.status}
                onChange={e => updateStatus(detail.id, e.target.value)}
                className="input py-2 text-sm flex-1">
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <a href={`mailto:${detail.email}?subject=Re: ${detail.subject}`}
              className="btn-primary btn-sm w-full justify-center">
              Reply via Email
            </a>
          </div>
        )}
      </Modal>
    </div>
  )
}
