import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { RequireAuth, RequireAdmin } from './components/ui/ProtectedRoute'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import Spinner from './components/ui/Spinner'

// Pages
import Home              from './pages/Home'
import Products          from './pages/Products'
import ProductDetail     from './pages/ProductDetail'
import Cart              from './pages/Cart'
import Checkout          from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import MyOrders          from './pages/MyOrders'
import Auth              from './pages/Auth'
import Blog              from './pages/Blog'
import BlogDetail        from './pages/BlogDetail'
import FAQ               from './pages/FAQ'
import Contact           from './pages/Contact'
import About             from './pages/About'
import VerifyEmail       from './pages/VerifyEmail'
import ResetPassword     from './pages/ResetPassword'

// Admin pages
import Dashboard       from './pages/admin/Dashboard'
import AdminProducts   from './pages/admin/AdminProducts'
import AdminOrders     from './pages/admin/AdminOrders'
import AdminReviews    from './pages/admin/AdminReviews'
import AdminRecipes    from './pages/admin/AdminRecipes'
import AdminFAQs       from './pages/admin/AdminFAQs'
import AdminInquiries  from './pages/admin/AdminInquiries'

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-100">
    <div className="text-center">
      <div className="text-4xl mb-4 animate-bounce-slow">🍯</div>
      <Spinner size="md" />
    </div>
  </div>
)

function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-7xl mb-6">🍯</p>
        <h1 className="font-display text-4xl font-bold text-bark-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">Looks like this page dripped away. Let's get you back on track.</p>
        <a href="/" className="btn-primary">Back to Home</a>
      </div>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* ── Public store routes ──────────────────── */}
              <Route path="/"                element={<Layout><Home /></Layout>} />
              <Route path="/products"        element={<Layout><Products /></Layout>} />
              <Route path="/products/:slug"  element={<Layout><ProductDetail /></Layout>} />
              <Route path="/about"           element={<Layout><About /></Layout>} />
              <Route path="/blog"            element={<Layout><Blog /></Layout>} />
              <Route path="/blog/:slug"      element={<Layout><BlogDetail /></Layout>} />
              <Route path="/faq"             element={<Layout><FAQ /></Layout>} />
              <Route path="/contact"         element={<Layout><Contact /></Layout>} />
              <Route path="/auth"            element={<Auth />} />
              <Route path="/cart"            element={<Layout><Cart /></Layout>} />

              {/* ── Email auth routes ────────────────────── */}
              <Route path="/verify-email"    element={<VerifyEmail />} />
              <Route path="/reset-password"  element={<ResetPassword />} />

              {/* ── Auth-protected routes ────────────────── */}
              <Route path="/checkout" element={
                <RequireAuth><Layout><Checkout /></Layout></RequireAuth>
              } />
              <Route path="/order-confirmation/:orderNumber" element={
                <RequireAuth><Layout><OrderConfirmation /></Layout></RequireAuth>
              } />
              <Route path="/orders" element={
                <RequireAuth><Layout><MyOrders /></Layout></RequireAuth>
              } />

              {/* ── Admin routes ─────────────────────────── */}
              <Route path="/admin" element={
                <RequireAdmin><AdminLayout><Dashboard /></AdminLayout></RequireAdmin>
              } />
              <Route path="/admin/products" element={
                <RequireAdmin><AdminLayout><AdminProducts /></AdminLayout></RequireAdmin>
              } />
              <Route path="/admin/orders" element={
                <RequireAdmin><AdminLayout><AdminOrders /></AdminLayout></RequireAdmin>
              } />
              <Route path="/admin/reviews" element={
                <RequireAdmin><AdminLayout><AdminReviews /></AdminLayout></RequireAdmin>
              } />
              <Route path="/admin/recipes" element={
                <RequireAdmin><AdminLayout><AdminRecipes /></AdminLayout></RequireAdmin>
              } />
              <Route path="/admin/faqs" element={
                <RequireAdmin><AdminLayout><AdminFAQs /></AdminLayout></RequireAdmin>
              } />
              <Route path="/admin/inquiries" element={
                <RequireAdmin><AdminLayout><AdminInquiries /></AdminLayout></RequireAdmin>
              } />

              {/* ── 404 ──────────────────────────────────── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}