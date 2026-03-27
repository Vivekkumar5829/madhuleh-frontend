import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { contactAPI } from '../services/api'
import toast from 'react-hot-toast'
import Spinner from '../components/ui/Spinner'

const SUBJECTS = ['Order Related','Product Inquiry','Bulk Order / Wholesale','Feedback & Suggestions','Other']

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'Order Related', message:'' })
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setBusy(true)
    try {
      await contactAPI.send(form)
      setSent(true)
      toast.success("Message sent! We'll get back to you soon 🍯")
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't send message. Please try again.")
    } finally { setBusy(false) }
  }

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-bark-900 py-14">
        <div className="container text-center">
          <p className="text-xs font-black uppercase tracking-widest text-honey-400 mb-3">Get in Touch</p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">We'd Love to Hear from You</h1>
          <p className="text-cream-200/60 text-sm max-w-md mx-auto">Questions, feedback, bulk orders — we're here for it all.</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* Left: Info */}
          <div>
            <div className="space-y-6 mb-10">
              {[
                { icon: Phone,  title: 'Call Us',       sub: 'Mon–Sat, 9am–6pm',   val: '+91 98765 43210',          href: 'tel:+919834343705' },
                { icon: Mail,   title: 'Email Us',      sub: 'We reply within 24h', val: 'madhulehapairy@gmail.com', href: 'mailto:madhulehapairy@gmail.com' },
                { icon: MapPin, title: 'Visit Us',      sub: 'By appointment only', val: 'Madhule Apiary, At- Kadus Road, Madhuleh Apairy, Post -Donde, Tal -Khed, Dist -Pune Pin Code -410505' },
                { icon: Clock,  title: 'Working Hours', sub: '',                    val: 'Mon–Sat: 9am – 6pm IST' },
              ].map(({ icon: Icon, title, sub, val, href }) => (
                <div key={title} className="card p-5 flex items-start gap-4">
                  <div className="w-11 h-11 bg-honey-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-honey-500" />
                  </div>
                  <div>
                    <p className="font-bold text-bark-900 text-sm">{title}</p>
                    {sub && <p className="text-xs text-gray-400 mb-0.5">{sub}</p>}
                    {href
                      ? <a href={href} className="text-sm text-honey-600 hover:underline font-medium">{val}</a>
                      : <p className="text-sm text-bark-600">{val}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <div className="card overflow-hidden h-48">
              <iframe
                title="Madhuleh Location"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3588.410355074914!2d73.84592677520037!3d18.878014882286223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTjCsDUyJzQwLjkiTiA3M8KwNTAnNTQuNiJF!5e1!3m2!1sen!2sin!4v1774631827168!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="card p-8">
            {sent ? (
              <div className="text-center py-10">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-bark-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm mb-6">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name:'', email:'', phone:'', subject:'Order Related', message:'' }) }}
                  className="btn-outline btn-sm">Send Another</button>
              </div>
            ) : (
              <>
                <h2 className="font-display font-bold text-xl text-bark-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Your Name *</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)}
                        className="input" placeholder="Your Name" required />
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)}
                        className="input" placeholder="9876543210" type="tel" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input value={form.email} onChange={e => set('email', e.target.value)}
                      className="input" placeholder="you@example.com" type="email" required />
                  </div>
                  <div>
                    <label className="label">Subject *</label>
                    <select value={form.subject} onChange={e => set('subject', e.target.value)} className="input">
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Message * <span className="text-gray-400 normal-case">(min 10 characters)</span></label>
                    <textarea value={form.message} onChange={e => set('message', e.target.value)}
                      className="input resize-none" rows={5} required minLength={10}
                      placeholder="Tell us how we can help…" />
                  </div>
                  <button type="submit" disabled={busy}
                    className="btn-primary w-full justify-center disabled:opacity-60">
                    {busy ? <Spinner size="sm" className="border-bark-900/30 border-t-bark-900" /> : <Send size={16} />}
                    {busy ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
