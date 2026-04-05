import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, Star, Shield, Truck, ArrowLeft, Plus, Minus, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { productsAPI, reviewsAPI, unwrap } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'
import StarRating from '../components/ui/StarRating'
import toast from 'react-hot-toast'

const IMG_FALLBACK = 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80'

export default function ProductDetail() {
  const { slug }            = useParams()
  const { addToCart }       = useCart()
  const { user }            = useAuth()
  const [qty,      setQty]  = useState(1)
  const [imgIdx,   setImg]  = useState(0)
  const [tabIdx,   setTab]  = useState(0)
  const [added,    setAdded] = useState(false)
  const [revForm,  setRevForm] = useState({ rating: 5, title: '', body: '' })
  const [submitting, setSub]  = useState(false)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn:  () => productsAPI.getBySlug(slug).then(unwrap),
    enabled:  !!slug,
  })

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn:  () => reviewsAPI.getByProduct(product.id, { page: 0, size: 20 }).then(unwrap),
    enabled:  !!product?.id,
  })
  const reviews = reviewsData?.content || []

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  if (!product) return (
    <div className="container py-24 text-center">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="font-display text-2xl font-bold mb-3">Product not found</h2>
      <Link to="/products" className="btn-primary">Back to Products</Link>
    </div>
  )

  const images   = product.images?.length ? product.images : [{ imageUrl: IMG_FALLBACK }]
  const price    = parseFloat(product.price || 0)
  const compare  = parseFloat(product.compareAtPrice || 0)
  const hasDisc  = compare > price
  const discount = product.discountPercentage || (hasDisc ? Math.round((1 - price / compare) * 100) : 0)
  const rating   = parseFloat(product.averageRating || 0)
  const attrs    = product.attributes || []

  const handleAddToCart = async () => {
    const ok = await addToCart(product.id, qty)
    if (ok) { setAdded(true); setTimeout(() => setAdded(false), 2500) }
  }

  const handleReviewSubmit = async e => {
    e.preventDefault()
    if (!user) { toast.error('Please login to review'); return }
    setSub(true)
    try {
      await reviewsAPI.create({ productId: product.id, ...revForm })
      toast.success('Review submitted successfully! 🍯')
      setRevForm({ rating: 5, title: '', body: '' })
      refetchReviews()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally { setSub(false) }
  }

  const TABS = ['Description', `Reviews (${reviews.length})`, 'Details']

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-honey-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-honey-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-bark-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Images ── */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-card">
              <img src={images[imgIdx]?.imageUrl || IMG_FALLBACK} alt={product.name}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.src = IMG_FALLBACK }} />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${i === imgIdx ? 'border-honey-500' : 'border-transparent'}`}>
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.src = IMG_FALLBACK }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div>
            {product.category && (
              <span className="text-xs font-black uppercase tracking-widest text-honey-600">{product.category.name}</span>
            )}

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-bark-900 mt-2 mb-3">{product.name}</h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <StarRating value={Math.round(rating)} />
                <span className="text-sm text-gray-500">{rating.toFixed(1)} ({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-5">
              <p className="font-display text-4xl font-bold text-bark-900">₹{price.toFixed(0)}</p>
              {hasDisc && <>
                <p className="text-lg text-gray-400 line-through">₹{compare.toFixed(0)}</p>
                <span className="badge bg-honey-500 text-bark-900 text-sm">Save {discount}%</span>
              </>}
            </div>

            <p className="text-bark-600 leading-relaxed mb-6">{product.shortDescription}</p>

            {/* Attributes */}
            {attrs.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {attrs.map(a => (
                  <div key={a.name} className="bg-white rounded-xl px-4 py-3 border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold">{a.name}</p>
                    <p className="text-sm font-bold text-bark-900">{a.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Weight / Net Weight */}
            {(product.weight || product.netWeight) && (
              <div className="flex gap-3 mb-6">
                {product.weight && (
                  <div className="bg-white rounded-xl px-4 py-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Weight</p>
                    <p className="text-sm font-bold text-bark-900">{product.weight}</p>
                  </div>
                )}
                {product.netWeight && (
                  <div className="bg-white rounded-xl px-4 py-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Net Weight</p>
                    <p className="text-sm font-bold text-bark-900">{product.netWeight}</p>
                  </div>
                )}
              </div>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className={`text-sm font-semibold ${product.inStock ? 'text-green-700' : 'text-red-600'}`}>
                {product.inStock ? product.lowStock ? `Only ${product.stockQuantity} left!` : 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            {product.inStock && (
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden h-12">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 h-full flex items-center text-bark-700 hover:bg-honey-50 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="px-5 font-bold text-bark-900 min-w-[40px] text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stockQuantity || 99, q + 1))}
                    className="px-4 h-full flex items-center text-bark-700 hover:bg-honey-50 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>

                <button onClick={handleAddToCart}
                  className={`flex-1 btn rounded-full h-12 text-sm font-bold transition-all ${
                    added ? 'bg-green-500 text-white' : 'bg-honey-500 text-bark-900 hover:bg-honey-600 hover:shadow-honey'
                  }`}>
                  {added ? <><Check size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart — ₹{(price * qty).toFixed(0)}</>}
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, text: '100% Pure Guarantee' },
                { icon: Truck,  text: 'Free delivery above ₹499' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100">
                  <Icon size={15} className="text-honey-500" />
                  <span className="text-xs text-gray-600 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-gray-200 mb-8">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                className={`px-6 py-3 text-sm font-bold transition-all border-b-2 -mb-px ${
                  tabIdx === i
                    ? 'border-honey-500 text-honey-600'
                    : 'border-transparent text-gray-500 hover:text-bark-900'
                }`}>{t}</button>
            ))}
          </div>

          {/* Description */}
          {tabIdx === 0 && (
            <div className="prose max-w-none">
              <p className="text-bark-700 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Reviews */}
          {tabIdx === 1 && (
            <div className="space-y-6">
              {product.reviewCount > 0 && (
                <div className="card p-6 flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-display text-5xl font-bold text-bark-900">{rating.toFixed(1)}</p>
                    <StarRating value={Math.round(rating)} />
                    <p className="text-xs text-gray-400 mt-1">{product.reviewCount} reviews</p>
                  </div>
                </div>
              )}

              {reviews.map(r => (
                <div key={r.id} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {/* ✅ Fixed: use userFirstName and userLastName from ReviewResponse DTO */}
                        <p className="font-bold text-sm text-bark-900">
                          {r.userFirstName} {r.userLastName?.charAt(0)}.
                        </p>
                        {r.verifiedPurchase && (
                          <span className="badge bg-green-100 text-green-700">Verified</span>
                        )}
                      </div>
                      <StarRating value={r.rating} size={12} />
                    </div>
                    <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                  </div>
                  <p className="font-semibold text-sm text-bark-900 mt-2 mb-1">{r.title}</p>
                  <p className="text-sm text-bark-600 leading-relaxed">{r.body}</p>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-4xl mb-3">💬</p>
                  <p className="font-medium">No reviews yet. Be the first!</p>
                </div>
              )}

              {user && (
                <div className="card p-6">
                  <h3 className="font-display font-bold text-lg text-bark-900 mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="label">Your Rating</label>
                      <StarRating value={revForm.rating} size={24} onChange={r => setRevForm(f => ({ ...f, rating: r }))} />
                    </div>
                    <div>
                      <label className="label">Review Title</label>
                      <input value={revForm.title} onChange={e => setRevForm(f => ({ ...f, title: e.target.value }))}
                        className="input" placeholder="Summarise your experience" required />
                    </div>
                    <div>
                      <label className="label">Your Review</label>
                      <textarea value={revForm.body} onChange={e => setRevForm(f => ({ ...f, body: e.target.value }))}
                        className="input resize-none" rows={4} placeholder="Tell others what you think…" required />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                      {submitting ? 'Submitting…' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Details */}
          {tabIdx === 2 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ['SKU',        product.sku           || '—'],
                ['Weight',     product.weight         || '—'],
                ['Net Weight', product.netWeight      || '—'],
                ['Status',     product.status         || '—'],
                ['Category',   product.category?.name || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-500 min-w-[120px]">{k}</span>
                  <span className="text-sm text-bark-900">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}