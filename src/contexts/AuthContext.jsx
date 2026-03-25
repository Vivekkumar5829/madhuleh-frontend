import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI, unwrap } from '../services/api'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('mh_token')
    const saved = localStorage.getItem('mh_user')
    if (token && saved) {
      try { setUser(JSON.parse(saved)) } catch { localStorage.clear() }
    }
    setLoading(false)
  }, [])

  // AuthResponse: { accessToken, refreshToken, userId, email, firstName, lastName, role }
  const _persist = useCallback((data) => {
    localStorage.setItem('mh_token',   data.accessToken)
    localStorage.setItem('mh_refresh', data.refreshToken || '')
    const u = {
      id:        data.userId,
      email:     data.email,
      firstName: data.firstName,
      lastName:  data.lastName,
      name:      `${data.firstName} ${data.lastName}`.trim(),
      role:      data.role,
    }
    localStorage.setItem('mh_user', JSON.stringify(u))
    setUser(u)
    return u
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password })
    return _persist(unwrap(res))
  }, [_persist])

  // RegisterRequest: { firstName, lastName, email, password, phone }
  const register = useCallback(async (form) => {
    const res = await authAPI.register(form)
    return _persist(unwrap(res))
  }, [_persist])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
