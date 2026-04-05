import React from 'react'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-bark-900 py-10">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-cream-200/60 text-sm mt-1">Last updated: April 2025</p>
        </div>
      </div>

      <div className="container py-12 max-w-3xl">
        <div className="card p-8 space-y-8 text-bark-700 leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">1. Introduction</h2>
            <p>Welcome to Madhuleh ("we", "our", "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website <strong>madhuleh.com</strong> and make purchases from us.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect information that you provide directly to us when you:</p>
            <ul className="list-disc list-inside space-y-2 text-bark-600">
              <li>Create an account on our website</li>
              <li>Place an order for our products</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us via our contact form</li>
              <li>Leave a product review</li>
            </ul>
            <p className="mt-3">This information may include your name, email address, phone number, shipping address, and payment information.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-bark-600">
              <li>To process and fulfill your orders</li>
              <li>To send order confirmations and shipping updates via email</li>
              <li>To respond to your queries and provide customer support</li>
              <li>To send promotional offers and newsletters (only if you opt in)</li>
              <li>To improve our website and product offerings</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">4. Payment Information</h2>
            <p>All payments are processed securely through Razorpay. We do not store your credit card or debit card details on our servers. Razorpay is PCI DSS compliant and uses industry-standard encryption to protect your payment information.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">5. Sharing Your Information</h2>
            <p className="mb-3">We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
            <ul className="list-disc list-inside space-y-2 text-bark-600">
              <li>Shipping and logistics partners to deliver your orders</li>
              <li>Payment processors to complete transactions</li>
              <li>Email service providers to send transactional emails</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">6. Cookies</h2>
            <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can disable cookies in your browser settings, but this may affect the functionality of our website.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">7. Data Security</h2>
            <p>We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">8. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-bark-600">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and personal data</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bark-900 mb-3">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="mt-3 bg-cream-200 rounded-xl p-4 text-sm">
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