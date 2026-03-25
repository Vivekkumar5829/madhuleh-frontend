import React, { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import Spinner from '../components/ui/Spinner'

export default function ResetPassword() {
  const [searchParams]              = useSearchParams()
  const navigate                    = useNavigate()
  const [password,    setPassword]  = useState('')
  const [confirm,     setConfirm]   = useState('')
  const [showPw,      setShowPw]    = useState(false)
  const [showConfirm, setShowCf]    = useState(false)
  const [busy,        setBusy]      = useState(false)

  const token = searchParams.get('token')

  const handleSubmit = async e => {
    e.preventDefault()

    if (!token) {
      toast.error('Invalid reset link. Please request a new one.')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    setBusy(true)
    try {
      await authAPI.reset({ token, newPassword: password })
      toast.success('Password reset successfully!')
      navigate('/auth')
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed. Link may have expired.'
      toast.error(msg)
    } finally { setBusy(false) }
  }

  if (!token) return (
    <div className="min-h-[calc(100vh-64px)] bg-cream-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-card p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="font-display text-2xl font-bold text-bark-900 mb-2">Invalid Link</h1>
        <p className="text-gray-500 text-sm mb-8">
          This reset link is invalid. Please request a new one.
        </p>
        <Link to="/auth" className="btn-primary w-full justify-center">
          Back to Sign In
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-64px)] bg-cream-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-card p-10 max-w-md w-full">

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-display text-2xl font-bold text-bark-900 mb-1">
            Set New Password
          </h1>
          <p className="text-gray-500 text-sm">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">New Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 chars, uppercase + number"
                className="input pr-11"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bark-900">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                className="input pr-11"
                required
              />
              <button type="button" onClick={() => setShowCf(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bark-900">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Password match indicator */}
          {confirm && (
            <p className={`text-xs font-medium ${password === confirm ? 'text-green-600' : 'text-red-500'}`}>
              {password === confirm ? '✅ Passwords match' : '❌ Passwords do not match'}
            </p>
          )}

          <button type="submit" disabled={busy}
            className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 mt-2">
            {busy
              ? <Spinner size="sm" className="border-bark-900/30 border-t-bark-900" />
              : <>Reset Password <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/auth" className="text-sm text-gray-500 hover:text-bark-900 transition-colors">
            ← Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  )
}