import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import Spinner from '../components/ui/Spinner'

export default function Auth() {
  const [mode,   setMode]  = useState('login')
  const [form,   setForm]  = useState({ firstName:'', lastName:'', email:'', password:'', phone:'' })
  const [showPw, setShowPw] = useState(false)
  const [busy,   setBusy]  = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from     = location.state?.from?.pathname || '/'

  useEffect(() => { if (user) navigate(from, { replace: true }) }, [user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
        toast.success('Welcome back! 🍯')
        navigate(from, { replace: true })
      } else if (mode === 'register') {
        if (!form.firstName || !form.lastName) { toast.error('Please enter your full name'); return }
        await authAPI.register({
          firstName: form.firstName,
          lastName:  form.lastName,
          email:     form.email,
          password:  form.password,
          phone:     form.phone || undefined,
        })
        toast.success('Account created! Please check your email to verify 📧')
        setMode('login')
      } else if (mode === 'forgot') {
        await authAPI.forgot(form.email)
        toast.success('Reset link sent! Check your email 🍯')
        setMode('login')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Something went wrong'
      toast.error(msg)
    } finally { setBusy(false) }
  }

  const inp = (name, label, type='text', placeholder='') => (
    <div>
      <label className="label">{label}</label>
      <input type={type} value={form[name]} onChange={e => set(name, e.target.value)}
        placeholder={placeholder} className="input" required={name !== 'phone'} autoComplete={name} />
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-64px)] bg-cream-100 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center flex-1 bg-bark-900 relative overflow-hidden px-16">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=70"
            alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-honey-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">🍯</span>
            </div>
            <div>
              <p className="font-display font-bold text-xl text-white">Madhuleh</p>
              <p className="text-[9px] text-honey-400 font-bold uppercase tracking-[0.15em]">Pure Honey</p>
            </div>
          </Link>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Pure Nature<br />in Every Drop.
          </h2>
          <p className="text-cream-200/60 text-sm max-w-xs leading-relaxed">
            Join 50,000+ customers who trust Madhuleh for pure, raw, unfiltered honey sourced from India's finest beekeepers.
          </p>
          <div className="flex gap-6 mt-10">
            {[['50K+', 'Customers'], ['4.9★', 'Rating'], ['100%', 'Pure']].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-2xl font-bold text-honey-400">{n}</p>
                <p className="text-xs text-cream-200/50">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-bark-900 mb-1">
              {mode === 'login'    ? 'Welcome back'   :
               mode === 'register' ? 'Create account' :
                                     'Reset password'}
            </h1>
            <p className="text-gray-500 text-sm">
              {mode === 'login'    ? "Don't have an account? " :
               mode === 'register' ? 'Already have an account? ' : ''}
              {mode !== 'forgot' && (
                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-honey-600 font-bold hover:underline">
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                {inp('firstName', 'First Name', 'text', 'Vivek')}
                {inp('lastName',  'Last Name',  'text', 'Sharma')}
              </div>
            )}

            {inp('email', 'Email Address', 'email', 'you@example.com')}

            {mode === 'register' && (
              <div>
                <label className="label">Phone (optional)</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="9876543210" className="input" />
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)} required
                    placeholder={mode === 'register' ? 'Min 8 chars, uppercase + number' : '••••••••'}
                    className="input pr-11" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bark-900">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" onClick={() => setMode('forgot')}
                  className="text-xs text-honey-600 hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" disabled={busy}
              className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 mt-2">
              {busy ? <Spinner size="sm" className="border-bark-900/30 border-t-bark-900" /> :
                mode === 'login'    ? 'Sign In' :
                mode === 'register' ? 'Create Account' :
                                      'Send Reset Link'}
              <ArrowRight size={16} />
            </button>
          </form>

          {mode === 'forgot' && (
            <button onClick={() => setMode('login')}
              className="mt-4 text-sm text-gray-500 hover:text-bark-900 transition-colors w-full text-center">
              ← Back to Sign In
            </button>
          )}

          <p className="text-xs text-gray-400 text-center mt-6">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-honey-600 hover:underline">Terms</Link> &{' '}
            <Link to="/privacy" className="text-honey-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}