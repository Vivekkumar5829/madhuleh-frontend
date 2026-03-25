import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Zap } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'

const IMG_FALLBACK = 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80'

export default function ProductCard({ product, className = '' }) {
  const { addToCart } = useCart()
  if (!product) return null

  const img = product.images?.[0]?.imageUrl || IMG_FALLBACK
  const price   = parseFloat(product.price   || 0)
  const compare = parseFloat(product.compareAtPrice || 0)
  const hasDisc = compare > price
  const discount= product.discountPercentage || (hasDisc ? Math.round((1 - price / compare) * 100) : 0)
  const rating  = parseFloat(product.averageRating || 0)
  const reviews = product.reviewCount || 0

  return (
    <div className={`card card-hover group overflow-hidden flex flex-col ${className}`}>
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden bg-cream-100 aspect-square">
        <img src={img} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.currentTarget.src = IMG_FALLBACK }}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-honey-500 text-bark-900">-{discount}%</span>
          )}
          {product.bestseller && (
            <span className="badge bg-bark-900 text-cream-100">Bestseller</span>
          )}
          {product.featured && !product.bestseller && (
            <span className="badge bg-white text-bark-900 shadow-card">Featured</span>
          )}
          {!product.inStock && (
            <span className="badge bg-gray-800 text-white">Out of Stock</span>
          )}
        </div>

        {/* Quick add on hover */}
        {product.inStock && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={e => { e.preventDefault(); addToCart(product.id, 1) }}
              className="w-full bg-honey-500 text-bark-900 font-bold text-sm py-3 flex items-center justify-center gap-2 hover:bg-honey-600 transition-colors">
              <ShoppingCart size={15} /> Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {product.category && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-honey-600 mb-1">{product.category.name}</p>
        )}

        <Link to={`/products/${product.slug}`}>
          <h3 className="font-display font-semibold text-bark-900 text-base leading-tight mb-1.5 line-clamp-2 hover:text-honey-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{product.shortDescription}</p>
        )}

        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={10}
                  className={s <= Math.round(rating) ? 'text-honey-500 fill-honey-500' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({reviews})</span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <p className="font-display font-bold text-lg text-bark-900">₹{price.toFixed(0)}</p>
            {hasDisc && (
              <p className="text-xs text-gray-400 line-through">₹{compare.toFixed(0)}</p>
            )}
          </div>

          {product.inStock ? (
            <button
              onClick={() => addToCart(product.id, 1)}
              className="w-9 h-9 rounded-full bg-honey-50 hover:bg-honey-500 text-honey-600 hover:text-bark-900 flex items-center justify-center transition-all duration-200 hover:shadow-honey hover:scale-110">
              <ShoppingCart size={15} />
            </button>
          ) : (
            <span className="text-xs text-gray-400 font-medium">Unavailable</span>
          )}
        </div>

        {/* Low stock warning */}
        {product.lowStock && product.inStock && (
          <div className="flex items-center gap-1.5 mt-2.5 text-amber-600">
            <Zap size={10} className="fill-amber-600" />
            <span className="text-[10px] font-bold">Only {product.stockQuantity} left!</span>
          </div>
        )}
      </div>
    </div>
  )
}
