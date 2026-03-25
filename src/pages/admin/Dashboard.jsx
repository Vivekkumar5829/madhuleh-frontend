import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ShoppingBag, Package, Star, Mail, TrendingUp, ArrowRight, Clock, CheckCircle, Truck } from 'lucide-react'
import { ordersAPI, productsAPI, reviewsAPI, contactAPI, unwrap } from '../../services/api'
import Spinner from '../../components/ui/Spinner'

const STATUS_COLOR = {
  PENDING: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700', SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
}

function StatCard({ icon: Icon, label, value, sub, color = 'honey', to }) {
  const bg = { honey: 'bg-honey-50', green: 'bg-green-50', blue: 'bg-blue-50', purple: 'bg-purple-50' }
  const ic = { honey: 'text-honey-500', green: 'text-green-500', blue: 'text-blue-500', purple: 'text-purple-500' }
  return (
    <Link to={to} className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 block">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${bg[color]} rounded-xl flex items-center justify-center`}>
          <Icon size={18} className={ic[color]} />
        </div>
        <ArrowRight size={14} className="text-gray-300" />
      </div>
      <p className="font-display text-2xl font-bold text-bark-900">{value ?? <Spinner size="sm" />}</p>
      <p className="text-sm font-semibold text-bark-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </Link>
  )
}

export default function Dashboard() {
  const { data: orders }   = useQuery({ queryKey: ['admin-orders-dash'], queryFn: () => ordersAPI.getMyOrders({ page: 0, size: 10 }).then(unwrap) })
  const { data: products } = useQuery({ queryKey: ['products-dash'], queryFn: () => productsAPI.getAll({ page: 0, size: 1 }).then(unwrap) })
  const { data: pending }  = useQuery({ queryKey: ['reviews-pending-dash'], queryFn: () => reviewsAPI.getPending({ page: 0, size: 5 }).then(unwrap) })
  const { data: inquiries }= useQuery({ queryKey: ['inquiries-dash'], queryFn: () => contactAPI.getAll({ page: 0, size: 5 }).then(unwrap) })

  const recentOrders    = orders?.content    || []
  const recentInquiries = inquiries?.content || inquiries || []
  const pendingReviews  = pending?.content   || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-bark-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Total Orders"    value={orders?.totalElements    ?? '…'} color="honey"  to="/admin/orders"   />
        <StatCard icon={Package}     label="Total Products"  value={products?.totalElements  ?? '…'} color="blue"   to="/admin/products" />
        <StatCard icon={Star}        label="Pending Reviews" value={pending?.totalElements   ?? '…'} color="purple" to="/admin/reviews"  />
        <StatCard icon={Mail}        label="Inquiries"       value={Array.isArray(inquiries) ? inquiries.length : inquiries?.totalElements ?? '…'} color="green"  to="/admin/inquiries"/>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-bark-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-honey-600 font-bold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
            ) : recentOrders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-bark-900 font-mono">#{o.orderNumber}</p>
                  <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</p>
                </div>
                <div className="text-right">
                  <span className={`badge text-[10px] ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-500'}`}>{o.status}</span>
                  <p className="text-xs font-bold text-bark-900 mt-1">₹{parseFloat(o.totalAmount).toFixed(0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending reviews */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-bark-900">Pending Reviews</h2>
            <Link to="/admin/reviews" className="text-xs text-honey-600 font-bold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingReviews.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No pending reviews</p>
            ) : pendingReviews.slice(0, 5).map(r => (
              <div key={r.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-bark-900 line-clamp-1">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{r.body}</p>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {Array(5).fill(0).map((_,i) => (
                      <span key={i} className={`text-[10px] ${i < r.rating ? 'text-honey-500' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent inquiries */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-bark-900">Recent Inquiries</h2>
          <Link to="/admin/inquiries" className="text-xs text-honey-600 font-bold hover:underline">View All</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No inquiries yet</p>
          ) : recentInquiries.slice(0, 4).map(inq => (
            <div key={inq.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50">
              <div>
                <p className="text-xs font-bold text-bark-900">{inq.name}</p>
                <p className="text-xs text-gray-400">{inq.subject}</p>
              </div>
              <span className={`badge text-[10px] ${inq.status === 'OPEN' ? 'bg-red-100 text-red-600' : inq.status === 'RESOLVED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {inq.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
