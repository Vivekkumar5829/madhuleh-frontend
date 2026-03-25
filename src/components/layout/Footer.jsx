import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { newsletterAPI } from '../../services/api'
import toast from 'react-hot-toast'

const LINKS = {
  Shop:    [{ to: '/products', l: 'All Products' }, { to: '/products?featured=true', l: 'Featured' }, { to: '/products?bestseller=true', l: 'Bestsellers' }],
  Company: [{ to: '/about', l: 'Our Story' }, { to: '/blog', l: 'Recipes & Blog' }, { to: '/faq', l: 'FAQs' }, { to: '/contact', l: 'Contact Us' }],
  Legal:   [{ to: '/privacy', l: 'Privacy Policy' }, { to: '/terms', l: 'Terms of Service' }, { to: '/shipping', l: 'Shipping Policy' }],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [busy,  setBusy]  = useState(false)

  const handleSubscribe = async e => {
    e.preventDefault()
    if (!email) return
    setBusy(true)
    try {
      await newsletterAPI.subscribe(email)
      toast.success("You're subscribed! 🍯")
      setEmail('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Already subscribed or try again')
    } finally { setBusy(false) }
  }

  return (
    <footer className="bg-bark-900 text-cream-100">
      <div className="border-b border-white/10">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-white mb-1">Stay in the hive 🍯</h3>
              <p className="text-cream-200/60 text-sm">Recipes, offers, and honey wisdom — delivered fresh.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="flex-1 md:w-72 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-honey-500 transition-all" />
              <button type="submit" disabled={busy}
                className="btn bg-honey-500 text-bark-900 rounded-full px-6 py-3 font-bold hover:bg-honey-400 disabled:opacity-60 flex-shrink-0">
                {busy ? '…' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-honey-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">🍯</span>
              </div>
              <div>
                <p className="font-display font-bold text-xl text-white leading-none">Madhuleh</p>
                <p className="text-[9px] text-honey-400 font-semibold uppercase tracking-[0.15em] mt-0.5">Pure Honey</p>
              </div>
            </Link>
            <p className="text-sm text-cream-200/60 leading-relaxed mb-6 max-w-xs">
              Pure nature in every single drop. We source the finest raw honey from trusted beekeepers across India.
            </p>
            <div className="space-y-2.5 text-sm text-cream-200/60">
              <a href="tel:+919876543210" className="flex items-center gap-2.5 hover:text-honey-400 transition-colors">
                <Phone size={14} className="text-honey-500" /> +91 98765 43210
              </a>
              <a href="mailto:hello@madhuleh.com" className="flex items-center gap-2.5 hover:text-honey-400 transition-colors">
                <Mail size={14} className="text-honey-500" /> hello@madhuleh.com
              </a>
              <p className="flex items-start gap-2.5">
                <MapPin size={14} className="text-honey-500 mt-0.5" /> 42, Honey Lane, Bangalore — 560001
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-honey-500 flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-black uppercase tracking-widest text-honey-500 mb-4">{group}</p>
              <ul className="space-y-2.5">
                {links.map(({ to, l }) => (
                  <li key={l}>
                    <Link to={to} className="text-sm text-cream-200/60 hover:text-honey-400 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream-200/40">© {new Date().getFullYear()} Madhuleh. All rights reserved. Made with 🍯 in India.</p>
          <div className="flex items-center gap-3">
            {['UPI', 'Razorpay', 'COD'].map(p => (
              <span key={p} className="text-[10px] font-bold text-cream-200/40 border border-white/10 rounded-md px-2 py-1">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
