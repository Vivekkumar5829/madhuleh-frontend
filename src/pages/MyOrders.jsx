import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, RefreshCw } from 'lucide-react'
import { ordersAPI, unwrap } from '../services/api'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'

const STATUS_CONFIG = {
  PENDING:    { label: 'Order Placed',  color: 'bg-amber-100 text-amber-700',  icon: Clock         },
  CONFIRMED:  { label: 'Confirmed',     color: 'bg-blue-100 text-blue-700',    icon: CheckCircle   },
  PROCESSING: { label: 'Processing',    color: 'bg-purple-100 text-purple-700', icon: RefreshCw    },
  SHIPPED:    { label: 'Shipped',       color: 'bg-indigo-100 text-indigo-700', icon: Truck        },
  DELIVERED:  { label: 'Delivered',     color: 'bg-green-100 text-green-700',  icon: CheckCircle   },
  CANCELLED:  { label: 'Cancelled',     color: 'bg-red-100 text-red-700',      icon: XCircle       },
  REFUNDED:   { label: 'Refunded',      color: 'bg-gray-100 text-gray-600',    icon: RefreshCw     },
}

export default function MyOrders() {
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', page],
    queryFn:  () => ordersAPI.getMyOrders({ page, size: 10 }).then(unwrap),
  })

  const orders     = data?.content || []
  const totalPages = data?.totalPages || 0

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-bark-900 py-10">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-white">My Orders</h1>
          <p className="text-cream-200/60 text-sm mt-1">{data?.totalElements || 0} orders placed</p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {orders.length === 0 ? (
          <EmptyState icon="📦" title="No orders yet" message="You haven't placed any orders. Start shopping!"
            action={<Link to="/products" className="btn-primary">Shop Now</Link>} />
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const cfg   = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
              const Icon  = cfg.icon
              const items = order.items || []
              const total = parseFloat(order.totalAmount || 0)
              const date  = new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })

              return (
                <div key={order.id} className="card p-5 hover:shadow-card-hover transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Order Number</p>
                      <p className="font-bold text-bark-900 font-mono">#{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0.5">{date}</p>
                      <span className={`badge ${cfg.color} flex items-center gap-1`}>
                        <Icon size={10} /> {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1">
                    {items.slice(0, 4).map(item => (
                      <div key={item.id} className="flex-shrink-0 text-center">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-100 mb-1">
                          {item.productImageUrl
                            ? <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-xl">🍯</div>}
                        </div>
                        <p className="text-[10px] text-gray-500 w-14 truncate">×{item.quantity}</p>
                      </div>
                    ))}
                    {items.length > 4 && (
                      <div className="w-14 h-14 rounded-xl bg-honey-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-honey-600">+{items.length - 4}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''} · {order.paymentMethod?.replace(/_/g,' ')}</p>
                      <p className="font-display font-bold text-bark-900">₹{total.toFixed(0)}</p>
                    </div>
                    <Link to={`/order-confirmation/${order.orderNumber}`}
                      className="flex items-center gap-1 text-sm font-bold text-honey-600 hover:text-honey-700 transition-colors">
                      View Details <ChevronRight size={14} />
                    </Link>
                  </div>

                  {/* Tracking number */}
                  {order.trackingNumber && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                      <Truck size={12} className="text-honey-500" />
                      Tracking: <span className="font-bold font-mono text-bark-900">{order.trackingNumber}</span>
                      {order.shippingProvider && <span className="text-gray-400">via {order.shippingProvider}</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  )
}
