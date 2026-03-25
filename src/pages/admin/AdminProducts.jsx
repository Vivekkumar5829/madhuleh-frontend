import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Search, X, Check } from 'lucide-react'
import { productsAPI, unwrap } from '../../services/api'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import toast from 'react-hot-toast'

const IMG_FALLBACK = 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=80&q=60'

const EMPTY_FORM = {
  name:'', shortDescription:'', description:'', imageUrl:'', price:'', compareAtPrice:'',
  stockQuantity:'', lowStockThreshold:'10', sku:'', weight:'', netWeight:'',
  status:'ACTIVE', featured:false, bestseller:false, categoryId:'', metaTitle:'', metaDescription:''
}

function ProductForm({ initial = EMPTY_FORM, onSave, onCancel, busy }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = e => {
    e.preventDefault()
    onSave({
      ...form,
      price:             parseFloat(form.price)             || undefined,
      compareAtPrice:    parseFloat(form.compareAtPrice)    || undefined,
      stockQuantity:     parseInt(form.stockQuantity)       || 0,
      lowStockThreshold: parseInt(form.lowStockThreshold)   || 10,
      categoryId:        form.categoryId                    || undefined,
      imageUrl:          form.imageUrl?.trim()              || undefined,
    })
  }

  const inp = (key, label, type='text', props={}) => (
    <div>
      <label className="label">{label}</label>
      <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} className="input" {...props} />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {inp('name', 'Product Name *', 'text', { required: true, placeholder: 'Wild Forest Honey' })}
      {inp('shortDescription', 'Short Description', 'text', { placeholder: '1–2 sentence summary' })}

      <div>
        <label className="label">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          className="input resize-none" rows={3} placeholder="Full product description…" />
      </div>

      {/* Image URL */}
      <div>
        <label className="label">Image URL</label>
        <input
          type="url"
          value={form.imageUrl}
          onChange={e => set('imageUrl', e.target.value)}
          className="input"
          placeholder="https://images.unsplash.com/photo-..."
        />
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="mt-2 h-24 w-24 object-cover rounded-xl border border-gray-200"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {inp('price',             'Price (₹) *',   'number', { required: true, min: 0.01, step: '0.01' })}
        {inp('compareAtPrice',    'Compare At (₹)', 'number', { min: 0, step: '0.01' })}
        {inp('stockQuantity',     'Stock Qty *',    'number', { required: true, min: 0 })}
        {inp('lowStockThreshold', 'Low Stock At',   'number', { min: 1 })}
        {inp('sku',               'SKU')}
        {inp('weight',            'Weight',   'text', { placeholder: '500g' })}
        {inp('netWeight',         'Net Weight','text', { placeholder: '450g' })}
      </div>

      <div>
        <label className="label">Status</label>
        <select value={form.status} onChange={e => set('status', e.target.value)} className="input">
          {['DRAFT','ACTIVE','OUT_OF_STOCK','DISCONTINUED'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex gap-6">
        {[['featured','Featured'],['bestseller','Bestseller']].map(([k, l]) => (
          <label key={k} className="flex items-center gap-2 cursor-pointer select-none">
            <div onClick={() => set(k, !form[k])}
              className={`w-10 h-5 rounded-full transition-colors ${form[k] ? 'bg-honey-500' : 'bg-gray-200'} relative cursor-pointer`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[k] ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-bark-700">{l}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={busy} className="btn-primary btn-sm disabled:opacity-60">
          {busy ? <Spinner size="sm" className="border-bark-900/30 border-t-bark-900" /> : <Check size={14} />}
          Save Product
        </button>
        <button type="button" onClick={onCancel} className="btn-outline btn-sm">Cancel</button>
      </div>
    </form>
  )
}

export default function AdminProducts() {
  const qc = useQueryClient()
  const [page,   setPage]  = useState(0)
  const [search, setSearch] = useState('')
  const [modal,  setModal]  = useState(null)
  const [delId,  setDelId]  = useState(null)
  const [busy,   setBusy]   = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn:  () => search
      ? productsAPI.search(search, { page, size: 15 }).then(unwrap)
      : productsAPI.getAll({ page, size: 15 }).then(unwrap),
    keepPreviousData: true,
  })

  const products   = data?.content    || []
  const totalPages = data?.totalPages || 0

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-products'] })

  const handleCreate = async form => {
    setBusy(true)
    try {
      await productsAPI.create(form)
      toast.success('Product created!')
      setModal(null); invalidate()
    } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
    finally { setBusy(false) }
  }

  const handleUpdate = async form => {
    setBusy(true)
    try {
      await productsAPI.update(modal.id, form)
      toast.success('Product updated!')
      setModal(null); invalidate()
    } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
    finally { setBusy(false) }
  }

  const handleDelete = async () => {
    try {
      await productsAPI.delete(delId)
      toast.success('Product deleted')
      setDelId(null); invalidate()
    } catch { toast.error('Failed to delete') }
  }

  // Get image url from product — backend returns images[].imageUrl
  const getImg = p => p.images?.[0]?.imageUrl || IMG_FALLBACK

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-bark-900">Products</h1>
          <p className="text-gray-500 text-sm">{data?.totalElements || 0} total products</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary btn-sm">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
          placeholder="Search products…" className="input pl-9 pr-8" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : products.length === 0 ? (
          <p className="text-center py-16 text-gray-400">No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Product','Price','Stock','Status','Featured',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                          <img src={getImg(p)} alt={p.name} className="w-full h-full object-cover"
                            onError={e => { e.currentTarget.src = IMG_FALLBACK }} />
                        </div>
                        <div>
                          <p className="font-semibold text-bark-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.sku || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-bark-900">₹{parseFloat(p.price).toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {p.stockQuantity} {p.lowStock ? '⚠️' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-gray-100 text-gray-600">{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {p.featured   && <span className="badge bg-honey-100 text-honey-700">Featured</span>}
                        {p.bestseller && <span className="badge bg-bark-100 text-bark-700">Best</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal(p)}
                          className="p-1.5 rounded-lg hover:bg-honey-50 text-gray-400 hover:text-honey-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDelId(p.id)}
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
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Create / Edit Modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} size="lg"
        title={modal === 'create' ? 'Add New Product' : `Edit: ${modal?.name}`}>
        <ProductForm
          initial={modal === 'create' ? EMPTY_FORM : {
            ...EMPTY_FORM,
            name:              modal?.name                        || '',
            shortDescription:  modal?.shortDescription            || '',
            description:       modal?.description                 || '',
            imageUrl:          modal?.images?.[0]?.imageUrl       || '',
            price:             modal?.price                       || '',
            compareAtPrice:    modal?.compareAtPrice              || '',
            stockQuantity:     modal?.stockQuantity               || '',
            sku:               modal?.sku                         || '',
            weight:            modal?.weight                      || '',
            netWeight:         modal?.netWeight                   || '',
            status:            modal?.status                      || 'ACTIVE',
            featured:          modal?.featured                    || false,
            bestseller:        modal?.bestseller                  || false,
          }}
          onSave={modal === 'create' ? handleCreate : handleUpdate}
          onCancel={() => setModal(null)}
          busy={busy}
        />
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete Product" size="sm">
        <div className="p-6 text-center">
          <p className="text-4xl mb-3">🗑️</p>
          <p className="text-bark-700 mb-5 text-sm">This action cannot be undone. The product will be permanently removed.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleDelete} className="btn bg-red-500 text-white rounded-full px-5 py-2.5 text-sm font-bold hover:bg-red-600">Delete</button>
            <button onClick={() => setDelId(null)} className="btn-outline btn-sm">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
