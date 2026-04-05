import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, Truck } from 'lucide-react'
import { ordersAPI, unwrap } from '../../services/api'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  PENDING:    'bg-amber-100 text-amber-700',
  CONFIRMED:  'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED:    'bg-indigo-100 text-indigo-700',
  DELIVERED:  'bg-green-100 text-green-700',
  CANCELLED:  'bg-red-100 text-red-700',
  REFUNDED:   'bg-gray-100 text-gray-600',
}
const STATUSES = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED']

export default function AdminOrders() {
  const qc = useQueryClient()
  const [page,     setPage]   = useState(0)
  const [detail,   setDetail] = useState(null)
  const [updating, setUpd]    = useState(null)
  const [form,     setForm]   = useState({ status: '', trackingNumber: '', shippingProvider: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page],
    queryFn:  () => ordersAPI.getAllOrders({ page, size: 15 }).then(unwrap),
    keepPreviousData: true,
  })

  const orders     = data?.content    || []
  const totalPages = data?.totalPages || 0

  const openUpdate = order => {
    setForm({
      status:           order.status,
      trackingNumber:   order.trackingNumber   || '',
      shippingProvider: order.shippingProvider || '',
    })
    setUpd(order)
  }

  const handleUpdate = async () => {
    try {
      await ordersAPI.updateStatus(updating.id, {
        status: form.status,
        ...(form.trackingNumber   && { trackingNumber:   form.trackingNumber   }),
        ...(form.shippingProvider && { shippingProvider: form.shippingProvider }),
      })
      toast.success('Order status updated!')
      setUpd(null)
      qc.invalidateQueries({ queryKey: ['admin-orders'] })
    } catch { toast.error('Failed to update') }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-bark-900">Orders</h1>
        <p className="text-gray-500 text-sm">{data?.totalElements || 0} total orders</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : orders.length === 0 ? (
          <p className="text-center py-16 text-gray-400">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Order #','Customer','Date','Items','Amount','Status','Payment',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-bark-900 text-xs">
                      #{o.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-bark-900">
                        {o.shippingFirstName} {o.shippingLastName}
                      </p>
                      <p className="text-[10px] text-gray-400">{o.shippingPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{o.items?.length || 0}</td>
                    <td className="px-4 py-3 font-bold text-bark-900">
                      ₹{parseFloat(o.totalAmount).toFixed(0)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_CONFIG[o.status] || 'bg-gray-100 text-gray-500'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${o.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setDetail(o)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => openUpdate(o)}
                          className="p-1.5 rounded-lg hover:bg-honey-50 text-gray-400 hover:text-honey-600 transition-colors">
                          <Truck size={14} />
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

      {/* Order Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Order #${detail?.orderNumber}`} size="lg">
        {detail && (
          <div className="p-6 space-y-5">
            {/* Customer info */}
            <div>
              <h3 className="font-bold text-bark-900 mb-2 text-sm">Customer</h3>
              <div className="bg-gray-50 rounded-xl p-3 text-sm text-bark-600">
                <p className="font-semibold text-bark-900">
                  {detail.shippingFirstName} {detail.shippingLastName}
                </p>
                <p>{detail.shippingPhone}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-bold text-bark-900 mb-3 text-sm">Items</h3>
              <div className="space-y-2.5">
                {(detail.items || []).map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="w-10 h-10 rounded-lg bg-cream-100 overflow-hidden flex-shrink-0">
                      {item.productImageUrl
                        ? <img src={item.productImageUrl} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">🍯</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-bark-900 line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-gray-400">×{item.quantity} · ₹{parseFloat(item.unitPrice).toFixed(0)}/ea</p>
                    </div>
                    <p className="text-xs font-bold">₹{parseFloat(item.subtotal).toFixed(0)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div>
              <h3 className="font-bold text-bark-900 mb-2 text-sm">Ship To</h3>
              <div className="bg-gray-50 rounded-xl p-3 text-sm text-bark-600">
                <p className="font-semibold">{detail.shippingFirstName} {detail.shippingLastName} · {detail.shippingPhone}</p>
                <p>{detail.shippingAddressLine1}</p>
                <p>{detail.shippingCity}, {detail.shippingState} — {detail.shippingPincode}</p>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
              {[
                ['Subtotal', `₹${parseFloat(detail.subtotal).toFixed(0)}`],
                ['Shipping', parseFloat(detail.shippingCost) === 0 ? 'FREE' : `₹${parseFloat(detail.shippingCost).toFixed(0)}`],
                // ✅ GST included in price
                ['GST', 'Included in price'],
                detail.discountAmount > 0 ? ['Discount', `-₹${parseFloat(detail.discountAmount).toFixed(0)}`] : null,
                ['Total', `₹${parseFloat(detail.totalAmount).toFixed(0)}`],
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} className={`flex justify-between ${
                  k === 'Total' ? 'font-bold text-bark-900 border-t pt-1.5 mt-1.5' :
                  v === 'Included in price' || v === 'FREE' ? 'text-green-600' :
                  'text-gray-500'
                }`}>
                  <span>{k}</span>
                  <span className={`${
                    v === 'Included in price' || v === 'FREE' ? 'font-semibold text-green-600' :
                    v?.startsWith('-') ? 'font-semibold text-green-600' : ''
                  }`}>{v}</span>
                </div>
              ))}
            </div>

            {/* Payment info */}
            <div className="flex items-center gap-4 text-xs">
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex-1">
                <p className="text-gray-400 mb-0.5">Payment Method</p>
                <p className="font-bold text-bark-900">{detail.paymentMethod?.replace(/_/g, ' ')}</p>
              </div>
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex-1">
                <p className="text-gray-400 mb-0.5">Payment Status</p>
                <p className={`font-bold ${detail.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                  {detail.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal open={!!updating} onClose={() => setUpd(null)} title="Update Order Status" size="sm">
        <div className="p-6 space-y-4">
          <div>
            <label className="label">New Status</label>
            <select value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="input">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {form.status === 'SHIPPED' && <>
            <div>
              <label className="label">Tracking Number</label>
              <input value={form.trackingNumber}
                onChange={e => setForm(f => ({ ...f, trackingNumber: e.target.value }))}
                className="input" placeholder="IN1234567890" />
            </div>
            <div>
              <label className="label">Shipping Provider</label>
              <input value={form.shippingProvider}
                onChange={e => setForm(f => ({ ...f, shippingProvider: e.target.value }))}
                className="input" placeholder="Delhivery, BlueDart…" />
            </div>
          </>}
          <div className="flex gap-3">
            <button onClick={handleUpdate} className="btn-primary btn-sm">Update Status</button>
            <button onClick={() => setUpd(null)} className="btn-outline btn-sm">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}