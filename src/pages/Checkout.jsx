import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Truck, Check, Tag, ChevronRight } from 'lucide-react'
import { ordersAPI, addressAPI, couponsAPI, unwrap } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import Spinner from '../components/ui/Spinner'

const IMG_FALLBACK = 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=100&q=70'
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
  'Chandigarh','Puducherry',
]

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user }                       = useAuth()
  const navigate                       = useNavigate()

  const [address, setAddress]   = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    phone: '', addressLine1: '', addressLine2: '',
    city: '', state: 'Maharashtra', pincode: '',
  })
  const [payMethod,  setPayMethod] = useState('CASH_ON_DELIVERY')
  const [coupon,     setCoupon]    = useState('')
  const [discount,   setDiscount]  = useState(0)
  const [couponOk,   setCouponOk]  = useState(false)
  const [couponErr,  setCouponErr] = useState('')
  const [placing,    setPlacing]   = useState(false)
  const [valCoupon,  setValCoupon] = useState(false)

  const shipping = subtotal >= 499 ? 0 : 60
  const tax      = +(subtotal * 0.18).toFixed(2)
  const total    = +(subtotal + shipping + tax - discount).toFixed(2)

  if (!user) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-2xl">🔒</p>
      <h2 className="font-display text-xl font-bold">Please log in to checkout</h2>
      <Link to="/auth" className="btn-primary">Sign In</Link>
    </div>
  )

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-2xl">🛒</p>
      <h2 className="font-display text-xl font-bold">Your cart is empty</h2>
      <Link to="/products" className="btn-primary">Shop Now</Link>
    </div>
  )

  const handleCoupon = async () => {
    const code = coupon.trim()
    if (!code) return
    setValCoupon(true); setCouponErr('')
    try {
      const res  = await couponsAPI.validate(code, subtotal)
      const disc = parseFloat(unwrap(res) || 0)
      setDiscount(disc)
      setCouponOk(true)
      toast.success(`Coupon applied! You save ₹${disc.toFixed(0)}`)
    } catch (err) {
      setCouponErr(err.response?.data?.message || 'Invalid coupon')
      setDiscount(0); setCouponOk(false)
    } finally { setValCoupon(false) }
  }

  const validateAddress = () => {
    const required = ['firstName', 'lastName', 'phone', 'addressLine1', 'city', 'state', 'pincode']
    for (const f of required) {
      if (!address[f]?.trim()) {
        toast.error(`Please fill in ${f.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }
    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return
    setPlacing(true)

    try {
      // Step 1 — Save address
      const addrRes = await addressAPI.create({
        ...address,
        country: 'India',
        label: 'Home',
        isDefault: false,
      })
      const addressId = unwrap(addrRes)?.id
      if (!addressId) throw new Error('Failed to save address')

      // Step 2 — Create order
      const orderRes = await ordersAPI.create({
        addressId,
        paymentMethod: payMethod,
        couponCode: couponOk ? coupon.trim() : undefined,
      })
      const order = unwrap(orderRes)

      // Step 3 — COD → go to confirmation directly
      if (payMethod === 'CASH_ON_DELIVERY') {
        await clearCart()
        navigate(`/order-confirmation/${order.orderNumber}`)
        return
      }

      // Step 4 — Razorpay → check if loaded
      if (!window.Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh the page.')
        setPlacing(false)
        return
      }

      // Step 5 — Open Razorpay popup
      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'Madhuleh',
        description: 'Pure Organic Honey',
        image: 'https://res.cloudinary.com/dfh9jk0h6/image/upload/v1774464409/Madhuleh_pdf__2__page-0001-removebg-preview_mkvudm.png',
        order_id: order.razorpayOrderId,
        handler: async (response) => {
          try {
            await ordersAPI.verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            await clearCart()
            navigate(`/order-confirmation/${order.orderNumber}`)
            toast.success('Payment successful! 🍯')
          } catch {
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name:    `${address.firstName} ${address.lastName}`,
          email:   user.email,
          contact: address.phone,
        },
        theme: {
          color: '#F5A800',
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled')
            setPlacing(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to place order'
      toast.error(msg)
    } finally {
      setPlacing(false)
    }
  }

  const inp = (field, label, props = {}) => (
    <div>
      <label className="label">{label}</label>
      <input {...props} value={address[field]}
        onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))}
        className="input" />
    </div>
  )

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-bark-900 py-10">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
          <div className="flex items-center gap-2 mt-2 text-xs text-cream-200/60">
            <Link to="/cart" className="hover:text-honey-400 transition-colors">Cart</Link>
            <ChevronRight size={12} />
            <span className="text-honey-400">Checkout</span>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── Left: Address + Payment ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery address */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-bark-900 mb-5 flex items-center gap-2">
                <Truck size={18} className="text-honey-500" /> Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inp('firstName', 'First Name *', { placeholder: 'Vivek' })}
                {inp('lastName',  'Last Name *',  { placeholder: 'Sharma' })}
                {inp('phone', 'Phone Number *', { placeholder: '9876543210', type: 'tel', className: 'input sm:col-span-2' })}
                <div className="sm:col-span-2">
                  {inp('addressLine1', 'Address Line 1 *', { placeholder: 'House / Flat / Floor No.', className: 'input' })}
                </div>
                <div className="sm:col-span-2">
                  {inp('addressLine2', 'Address Line 2', { placeholder: 'Street, Locality (optional)', className: 'input' })}
                </div>
                {inp('city', 'City *', { placeholder: 'Pune' })}
                <div>
                  <label className="label">State *</label>
                  <select value={address.state}
                    onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                    className="input">
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {inp('pincode', 'Pincode *', { placeholder: '411001', maxLength: 6 })}
              </div>
            </div>

            {/* Payment method */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-bark-900 mb-5 flex items-center gap-2">
                <Shield size={18} className="text-honey-500" /> Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery',         sub: 'Pay when your order arrives', icon: '💵' },
                  { value: 'RAZORPAY',          label: 'UPI / Cards / NetBanking', sub: 'Pay securely via Razorpay',   icon: '💳' },
                ].map(({ value, label, sub, icon }) => (
                  <label key={value}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      payMethod === value ? 'border-honey-500 bg-honey-50' : 'border-gray-100 bg-white hover:border-honey-200'
                    }`}>
                    <input type="radio" value={value} checked={payMethod === value}
                      onChange={() => setPayMethod(value)} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      payMethod === value ? 'border-honey-500 bg-honey-500' : 'border-gray-300'
                    }`}>
                      {payMethod === value && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-xl">{icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-bark-900 text-sm">{label}</p>
                      <p className="text-xs text-gray-500">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="space-y-4">

            {/* Coupon */}
            <div className="card p-5">
              <h3 className="font-bold text-bark-900 text-sm mb-3 flex items-center gap-2">
                <Tag size={15} className="text-honey-500" /> Have a Coupon?
              </h3>
              <div className="flex gap-2">
                <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                  placeholder="HONEY10" disabled={couponOk}
                  className="input flex-1 text-sm uppercase font-bold tracking-widest" />
                <button onClick={handleCoupon} disabled={valCoupon || couponOk}
                  className="btn-primary btn-sm disabled:opacity-60">
                  {valCoupon ? '…' : couponOk ? <Check size={14} /> : 'Apply'}
                </button>
              </div>
              {couponErr && <p className="text-xs text-red-500 mt-2 font-medium">{couponErr}</p>}
              {couponOk  && <p className="text-xs text-green-600 mt-2 font-medium">🎉 Saving ₹{discount.toFixed(0)}!</p>}
            </div>

            {/* Summary */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-lg text-bark-900 mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map(item => {
                  const img  = item.productImageUrl || IMG_FALLBACK
                  const name = item.productName     || 'Product'
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                        <img src={img} alt={name} className="w-full h-full object-cover"
                          onError={e => { e.currentTarget.src = IMG_FALLBACK }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-bark-900 line-clamp-1">{name}</p>
                        <p className="text-xs text-gray-400">×{item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-bark-900">₹{parseFloat(item.subtotal || 0).toFixed(0)}</p>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                {[
                  ['Subtotal', `₹${subtotal.toFixed(0)}`],
                  ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`],
                  ['GST (18%)', `₹${tax.toFixed(0)}`],
                  discount > 0 ? ['Coupon Discount', `-₹${discount.toFixed(0)}`] : null,
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-500">{k}</span>
                    <span className={`font-semibold ${v.startsWith('-') ? 'text-green-600' : v === 'FREE' ? 'text-green-600' : 'text-bark-900'}`}>{v}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold">
                  <span className="text-bark-900">Total</span>
                  <span className="font-display text-xl text-bark-900">₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button onClick={handlePlaceOrder} disabled={placing}
                className="btn-primary w-full justify-center mt-5 disabled:opacity-60">
                {placing
                  ? <><Spinner size="sm" className="border-bark-900/30 border-t-bark-900" /> Placing Order…</>
                  : payMethod === 'RAZORPAY' ? 'Pay Now' : 'Place Order'}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <Shield size={11} /> Secured by 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}