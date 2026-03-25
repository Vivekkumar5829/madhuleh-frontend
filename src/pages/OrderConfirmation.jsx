import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Package, Truck, MapPin, ArrowRight, Clock } from 'lucide-react'
import { ordersAPI, unwrap } from '../services/api'
import Spinner from '../components/ui/Spinner'

const STATUS_STEPS = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED']
const STATUS_LABELS = { PENDING:'Order Placed', CONFIRMED:'Confirmed', PROCESSING:'Processing', SHIPPED:'Shipped', DELIVERED:'Delivered' }
const STATUS_ICONS  = { PENDING: Clock, CONFIRMED: CheckCircle, PROCESSING: Package, SHIPPED: Truck, DELIVERED: CheckCircle }

export default function OrderConfirmation() {
  const { orderNumber } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn:  () => ordersAPI.getByNumber(orderNumber).then(unwrap),
    enabled:  !!orderNumber,
  })

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>
  if (!order)    return <div className="text-center py-24"><p>Order not found.</p><Link to="/" className="btn-primary mt-4">Home</Link></div>

  const stepIdx = STATUS_STEPS.indexOf(order.status)
  const items   = order.items || []

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="font-display text-3xl font-bold text-bark-900 mb-2">Order Confirmed! 🍯</h1>
          <p className="text-gray-500">Thank you for your order. We'll get it to you soon.</p>
          <p className="font-bold text-honey-600 mt-2 text-sm">Order #{order.orderNumber}</p>
        </div>

        {/* Status tracker */}
        <div className="card p-6 mb-6">
          <h2 className="font-display font-bold text-bark-900 mb-6">Order Status</h2>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 -z-0" />
            <div className="absolute top-5 left-5 h-0.5 bg-honey-500 transition-all duration-1000"
              style={{ width: `${stepIdx > 0 ? (stepIdx / (STATUS_STEPS.length - 1)) * 100 : 0}%` }} />

            <div className="flex justify-between relative">
              {STATUS_STEPS.map((s, i) => {
                const Icon = STATUS_ICONS[s] || CheckCircle
                const done = i <= stepIdx
                return (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                      done ? 'bg-honey-500 text-bark-900' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon size={16} strokeWidth={done ? 2.5 : 1.5} />
                    </div>
                    <span className={`text-[10px] font-bold text-center hidden sm:block ${done ? 'text-honey-600' : 'text-gray-400'}`}>
                      {STATUS_LABELS[s]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Order details */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {/* Items */}
          <div className="card p-5">
            <h3 className="font-bold text-bark-900 mb-4 text-sm">Items Ordered</h3>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cream-100 overflow-hidden flex-shrink-0">
                    {item.productImageUrl
                      ? <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-lg">🍯</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-bark-900 line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-gray-400">×{item.quantity} · ₹{parseFloat(item.unitPrice).toFixed(0)}/ea</p>
                  </div>
                  <p className="text-xs font-bold text-bark-900">₹{parseFloat(item.subtotal).toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="card p-5">
            <h3 className="font-bold text-bark-900 mb-4 text-sm">Price Breakdown</h3>
            <div className="space-y-2.5 text-sm">
              {[
                ['Subtotal',     `₹${parseFloat(order.subtotal).toFixed(0)}`],
                ['Shipping',     parseFloat(order.shippingCost) === 0 ? 'FREE' : `₹${parseFloat(order.shippingCost).toFixed(0)}`],
                ['GST',          `₹${parseFloat(order.taxAmount).toFixed(0)}`],
                order.discountAmount > 0 ? ['Discount', `-₹${parseFloat(order.discountAmount).toFixed(0)}`] : null,
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
              <div className="border-t pt-2.5 flex justify-between font-bold">
                <span>Total Paid</span>
                <span className="font-display text-lg text-bark-900">₹{parseFloat(order.totalAmount).toFixed(0)}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t text-xs space-y-1">
              <div className="flex justify-between text-gray-500">
                <span>Payment</span><span className="font-medium">{order.paymentMethod?.replace(/_/g,' ')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Status</span>
                <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div className="card p-5 mb-8">
          <h3 className="font-bold text-bark-900 mb-3 text-sm flex items-center gap-1.5">
            <MapPin size={14} className="text-honey-500" /> Delivery To
          </h3>
          <p className="text-sm text-bark-700 font-semibold">{order.shippingFirstName} {order.shippingLastName}</p>
          <p className="text-sm text-gray-500">{order.shippingAddressLine1}{order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ''}</p>
          <p className="text-sm text-gray-500">{order.shippingCity}, {order.shippingState} — {order.shippingPincode}</p>
          <p className="text-sm text-gray-500">{order.shippingPhone}</p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="btn-dark">
            View All Orders
          </Link>
          <Link to="/products" className="btn-primary">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
