import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, HelpCircle, Check } from 'lucide-react'
import { faqsAPI, unwrap } from '../../services/api'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const EMPTY = { question: '', answer: '', category: 'General', sortOrder: 0, active: true }

function FAQForm({ initial = EMPTY, onSave, onCancel, busy }) {
  const [form, setForm] = useState(initial)
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="p-6 space-y-4">
      <div>
        <label className="label">Question *</label>
        <input value={form.question} onChange={e => set('question', e.target.value)} className="input" required placeholder="What is raw honey?" />
      </div>
      <div>
        <label className="label">Answer *</label>
        <textarea value={form.answer} onChange={e => set('answer', e.target.value)} className="input resize-none" rows={4} required placeholder="Raw honey is…" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <input value={form.category} onChange={e => set('category', e.target.value)} className="input" placeholder="General" />
        </div>
        <div>
          <label className="label">Sort Order</label>
          <input type="number" value={form.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value)||0)} className="input" min={0} />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <div onClick={() => set('active', !form.active)}
          className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.active ? 'bg-honey-500' : 'bg-gray-200'}`}>
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-sm font-medium text-bark-700">Active (visible to users)</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={busy} className="btn-primary btn-sm disabled:opacity-60">
          {busy ? <Spinner size="sm" className="border-bark-900/30 border-t-bark-900" /> : <Check size={14} />}
          Save FAQ
        </button>
        <button type="button" onClick={onCancel} className="btn-outline btn-sm">Cancel</button>
      </div>
    </form>
  )
}

export default function AdminFAQs() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)
  const [busy,  setBusy]  = useState(false)

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn:  () => faqsAPI.getAll().then(unwrap),
  })
  const all = Array.isArray(faqs) ? faqs : []

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-faqs'] })

  const handleSave = async form => {
    setBusy(true)
    try {
      if (modal === 'create') { await faqsAPI.create(form); toast.success('FAQ created!') }
      else { await faqsAPI.update(modal.id, form); toast.success('FAQ updated!') }
      setModal(null); invalidate()
    } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
    finally { setBusy(false) }
  }

  const handleDelete = async () => {
    try { await faqsAPI.delete(delId); toast.success('Deleted'); setDelId(null); invalidate() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-bark-900">FAQs</h1>
          <p className="text-gray-500 text-sm">{all.length} questions</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary btn-sm"><Plus size={14} /> Add FAQ</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : all.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-card">
          <HelpCircle size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No FAQs yet. Add your first one!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Question','Category','Order','Status',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {all.map(faq => (
                  <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-bark-900 line-clamp-1 max-w-xs">{faq.question}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{faq.answer}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{faq.category || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{faq.sortOrder ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${faq.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {faq.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setModal(faq)}
                          className="p-1.5 rounded-lg hover:bg-honey-50 text-gray-400 hover:text-honey-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDelId(faq.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} size="md"
        title={modal === 'create' ? 'Add New FAQ' : 'Edit FAQ'}>
        <FAQForm initial={modal === 'create' ? EMPTY : { ...EMPTY, ...modal }} onSave={handleSave} onCancel={() => setModal(null)} busy={busy} />
      </Modal>

      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete FAQ" size="sm">
        <div className="p-6 text-center">
          <p className="text-4xl mb-3">🗑️</p>
          <p className="text-bark-700 text-sm mb-5">Delete this FAQ permanently?</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleDelete} className="btn bg-red-500 text-white rounded-full px-5 py-2.5 text-sm font-bold hover:bg-red-600">Delete</button>
            <button onClick={() => setDelId(null)} className="btn-outline btn-sm">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
