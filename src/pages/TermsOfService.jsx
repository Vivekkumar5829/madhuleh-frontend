import React from 'react'
import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-bark-900 py-10">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-white">Terms of Service</h1>
          <p className="text-cream-200/60 text-sm mt-1">Last updated: April 2025</p>
        </div>
      </div>

      <div className="container py-12 max-w-3xl">
        <div className="card p-8 space-y-8 text-bark-700 leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using madhuleh.com, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">2. Products</h2>
            <p className="mb-3">All products sold on Madhuleh are:</p>
            <ul className="list-disc list-inside space-y-2 text-bark-600">
              <li>100% pure, natural honey and bee products</li>
              <li>FSSAI certified (Lic. No. 21520190000342)</li>
              <li>Sourced directly from our apiaries in Maharashtra</li>
              <li>Subject to availability and seasonal variations</li>
            </ul>
            <p className="mt-3">Product images are for illustration purposes. Actual colour and texture may vary slightly due to the natural nature of honey.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">3. Pricing</h2>
            <p>All prices on our website are in Indian Rupees (₹) and inclusive of GST. We reserve the right to change prices at any time without prior notice. The price at the time of placing your order will be the final price charged.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">4. Orders</h2>
            <ul className="list-disc list-inside space-y-2 text-bark-600">
              <li>Orders are confirmed only after successful payment or COD confirmation</li>
              <li>We reserve the right to cancel any order due to stock unavailability</li>
              <li>In case of cancellation, a full refund will be processed within 5-7 business days</li>
              <li>Order quantities may be limited per customer for certain products</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">5. Payment</h2>
            <p>We accept the following payment methods:</p>
            <ul className="list-disc list-inside space-y-2 text-bark-600 mt-3">
              <li>Cash on Delivery (COD)</li>
              <li>UPI, Credit/Debit Cards, Net Banking via Razorpay</li>
            </ul>
            <p className="mt-3">All online payments are processed securely through Razorpay. We do not store any payment information on our servers.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">6. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 text-bark-600">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">7. Intellectual Property</h2>
            <p>All content on madhuleh.com including text, images, logos, and graphics are the property of Madhuleh and are protected by copyright laws. You may not reproduce, distribute, or use our content without prior written permission.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">8. Limitation of Liability</h2>
            <p>Madhuleh shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the value of the product purchased.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">9. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Maharashtra, India.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">10. Contact Us</h2>
            <p>For any questions regarding these Terms of Service:</p>
            <div className="mt-3 bg-cream-200 rounded-xl p-4 text-sm">
              <p><strong>Madhuleh Apairy</strong></p>
              <p>Kadus Road, Post -Donde, Tal -Khed, Dist -Pune Pin Code -410505</p>
              <p>Email: <a href="mailto:madhulehapairy@gmail.com" className="text-honey-600 hover:underline">madhulehapairy@gmail.com</a></p>
              <p>Website: <Link to="/" className="text-honey-600 hover:underline">madhuleh.com</Link></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}