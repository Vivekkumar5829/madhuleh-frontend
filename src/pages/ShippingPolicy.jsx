import React from 'react'
import { Link } from 'react-router-dom'
import { Truck, Package, RefreshCw, Phone } from 'lucide-react'

export default function ShippingPolicy() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-bark-900 py-10">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-white">Shipping Policy</h1>
          <p className="text-cream-200/60 text-sm mt-1">Last updated: April 2025</p>
        </div>
      </div>

      <div className="container py-12 max-w-3xl">

        {/* Quick info cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Truck,     title: 'Free Shipping',   desc: 'On orders above ₹499' },
            { icon: Package,   title: '5-7 Days',        desc: 'Estimated delivery time' },
            { icon: RefreshCw, title: '7 Day Returns',   desc: 'Easy return policy' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 text-center">
              <Icon size={24} className="text-honey-500 mx-auto mb-2" />
              <p className="font-bold text-bark-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 space-y-8 text-bark-700 leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">1. Shipping Coverage</h2>
            <p>We ship pan India to all major cities and towns across India. At this time we do not offer international shipping. If you are unsure whether we deliver to your location, please contact us at <a href="mailto:support@madhuleh.com" className="text-honey-600 hover:underline">support@madhuleh.com</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">2. Shipping Charges</h2>
            <div className="bg-honey-50 rounded-xl p-4 mb-3">
              <div className="flex justify-between items-center text-sm font-semibold text-bark-900 mb-2">
                <span>Order Value</span>
                <span>Shipping Charge</span>
              </div>
              <div className="flex justify-between items-center text-sm text-bark-600 border-t pt-2">
                <span>Below ₹499</span>
                <span className="font-bold">₹49</span>
              </div>
              <div className="flex justify-between items-center text-sm text-bark-600 border-t pt-2 mt-2">
                <span>₹499 and above</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">All product prices are inclusive of GST. No additional taxes are charged at checkout.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">3. Delivery Timeline</h2>
            <ul className="list-disc list-inside space-y-2 text-bark-600">
              <li>Orders are processed within 1-2 business days of confirmation</li>
              <li>Estimated delivery time is 5-7 business days after dispatch</li>
              <li>Metro cities (Mumbai, Delhi, Bangalore, Chennai) may receive orders in 3-5 days</li>
              <li>Remote areas may take up to 10 business days</li>
              <li>Delivery times may vary during festivals and peak seasons</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">4. Order Tracking</h2>
            <p>Once your order is shipped, you will receive an email with your tracking number and shipping provider details. You can track your order from your <Link to="/orders" className="text-honey-600 hover:underline">My Orders</Link> page on our website.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">5. Cash on Delivery (COD)</h2>
            <ul className="list-disc list-inside space-y-2 text-bark-600">
              <li>COD is available on orders across India</li>
              <li>Please keep exact change ready at the time of delivery</li>
              <li>COD orders are confirmed immediately after placing the order</li>
              <li>Payment is collected by our delivery partner at the time of delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">6. Returns & Refunds</h2>
            <ul className="list-disc list-inside space-y-2 text-bark-600">
              <li>We accept returns within 7 days of delivery</li>
              <li>Products must be unused, unopened and in original packaging</li>
              <li>If you receive a damaged or incorrect product, contact us within 48 hours with photos</li>
              <li>Refunds are processed within 5-7 business days to the original payment method</li>
              <li>COD orders will receive refunds via bank transfer</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">7. Damaged or Lost Packages</h2>
            <p>If your package arrives damaged or is lost in transit, please contact us immediately at <a href="mailto:support@madhuleh.com" className="text-honey-600 hover:underline">support@madhuleh.com</a> with your order number and photos of the damage. We will arrange a replacement or full refund at no extra cost.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">8. Contact Us</h2>
            <p>For any shipping related queries:</p>
            <div className="mt-3 bg-cream-200 rounded-xl p-4 text-sm space-y-1">
              <p><strong>Madhuleh</strong></p>
              <p>Pimpalgaon Baswant, Maharashtra, India</p>
              <p>Email: <a href="mailto:support@madhuleh.com" className="text-honey-600 hover:underline">support@madhuleh.com</a></p>
              <p>Website: <Link to="/" className="text-honey-600 hover:underline">madhuleh.com</Link></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}