import React from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

const IMG_FALLBACK = 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&q=70'

export default function Cart() {
  const { items, loading, count, subtotal, updateQty, removeItem, clearCart } = useCart()

  // ✅ GST included in price — no separate tax
  const shipping = subtotal >= 499 ? 0 : 49
  const total    = +(subtotal + shipping).toFixed(2)

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  if (items.length === 0) return (
    <div className="bg-cream-100 min-h-screen">
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        message="Looks like you haven't added any honey yet. Explore our collection!"
        action={<Link to="/products" className="btn-primary">Shop Now <ArrowRight size={16} /></Link>}
      />
    </div>
  )

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-bark-900 py-10">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-white">Shopping Cart</h1>
          <p className="text-cream-200/60 text-sm mt-1">{count} item{count !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear all */}
            <div className="flex justify-end">
              <button onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1.5 transition-colors">
                <Trash2 size={13} /> Clear All
              </button>
            </div>

            {items.map(item => {
              const img   = item.productImageUrl || IMG_FALLBACK
              const name  = item.productName     || 'Product'
              const price = parseFloat(item.unitPrice || 0)
              const sub   = parseFloat(item.subtotal  || 0)

              return (
                <div key={item.id} className="card p-4 sm:p-5 flex gap-4 items-start">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-cream-100 flex-shrink-0">
                    <img src={img} alt={name} className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.src = IMG_FALLBACK }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-bark-900 mb-0.5">{name}</h3>
                    <p className="text-xs text-gray-500 mb-3">₹{price.toFixed(0)} each</p>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      {/* Qty control */}
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full overflow-hidden">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-honey-50 transition-colors text-bark-700">
                          <Minus size={14} />
                        </button>
                        <span className="px-4 text-sm font-bold text-bark-900">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-honey-50 transition-colors text-bark-700">
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-display font-bold text-bark-900">₹{sub.toFixed(0)}</p>
                        <button onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24">
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-bark-900 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-bark-700">
                  <span>Subtotal ({count} items)</span>
                  <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-bark-700">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {/* ✅ GST included in price */}
                <div className="flex justify-between text-bark-700">
                  <span>GST</span>
                  <span className="font-semibold text-green-600">Included in price</span>
                </div>

                {shipping > 0 && (
                  <div className="bg-honey-50 rounded-xl px-3 py-2 text-xs text-honey-700 font-medium">
                    Add ₹{(499 - subtotal).toFixed(0)} more for FREE shipping!
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between font-bold text-bark-900">
                    <span>Total</span>
                    <span className="font-display text-xl">₹{total.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full justify-center">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <Link to="/products" className="flex items-center justify-center gap-1.5 mt-3 text-sm text-gray-500 hover:text-bark-900 transition-colors">
                <ShoppingBag size={14} /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}