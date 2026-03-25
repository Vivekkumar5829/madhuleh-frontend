import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import Spinner from '../components/ui/Spinner'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status,  setStatus]  = useState('loading')
  const [message, setMessage] = useState('')
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('No verification token found. Please check your email link.')
      return
    }

    authAPI.verify(token)
      .then(() => {
        setStatus('success')
      })
      .catch(err => {
        const msg = err.response?.data?.message || ''
        // Token already used = already verified = treat as success
        if (msg.includes('Invalid verification token')) {
          setStatus('success')
        } else {
          setStatus('error')
          setMessage(msg || 'Verification failed. The link may have expired.')
        }
      })
  }, [])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-cream-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-card p-10 max-w-md w-full text-center">

        {status === 'loading' && (
          <>
            <Spinner size="lg" className="mx-auto mb-6" />
            <h1 className="font-display text-2xl font-bold text-bark-900 mb-2">
              Verifying your email…
            </h1>
            <p className="text-gray-500 text-sm">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">✅</div>
            <h1 className="font-display text-2xl font-bold text-bark-900 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Your account is now active. You can now sign in and start shopping.
            </p>
            <Link to="/auth" className="btn-primary w-full justify-center">
              Sign In Now
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h1 className="font-display text-2xl font-bold text-bark-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-500 text-sm mb-8">{message}</p>
            <div className="flex flex-col gap-3">
              <Link to="/auth" className="btn-primary w-full justify-center">
                Back to Sign In
              </Link>
              <Link to="/" className="btn-outline w-full justify-center">
                Go to Home
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  )
}