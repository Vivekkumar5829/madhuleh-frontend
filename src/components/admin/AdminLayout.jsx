import React, { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Star, BookOpen, HelpCircle, Mail, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const NAV = [
  { to: '/admin',            label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/admin/products',   label: 'Products',    icon: Package },
  { to: '/admin/orders',     label: 'Orders',      icon: ShoppingBag },
  { to: '/admin/reviews',    label: 'Reviews',     icon: Star },
  { to: '/admin/recipes',    label: 'Recipes',     icon: BookOpen },
  { to: '/admin/faqs',       label: 'FAQs',        icon: HelpCircle },
  { to: '/admin/inquiries',  label: 'Inquiries',   icon: Mail },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [open, setOpen]   = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = ({ mobile = false }) => (
    <aside className={mobile
      ? 'fixed inset-y-0 left-0 z-[300] w-64 bg-bark-900 flex flex-col shadow-2xl'
      : 'hidden lg:flex w-60 bg-bark-900 flex-col flex-shrink-0'
    }>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-honey-500 rounded-xl flex items-center justify-center text-sm">🍯</div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-none">Madhuleh</p>
            <p className="text-[9px] text-honey-400 font-bold uppercase tracking-widest">Admin</p>
          </div>
        </Link>
        {mobile && (
          <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-3 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            onClick={() => mobile && setOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${isActive
                ? 'bg-honey-500 text-bark-900'
                : 'text-cream-200/60 hover:bg-white/10 hover:text-white'
              }
            `}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-honey-500 flex items-center justify-center font-black text-bark-900 text-sm">
            {user?.firstName?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-cream-200/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-semibold">
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      {/* Mobile overlay */}
      {open && (
        <>
          <div className="fixed inset-0 z-[290] bg-black/50" onClick={() => setOpen(false)} />
          <Sidebar mobile />
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-400 ml-2 lg:ml-0">
            <Link to="/" className="hover:text-honey-600 transition-colors">Madhuleh Store</Link>
            <ChevronRight size={12} />
            <span className="text-bark-900 font-medium">Admin Panel</span>
          </div>
          <Link to="/" className="text-xs text-honey-600 font-bold hover:text-honey-700 transition-colors">
            ← Back to Store
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
