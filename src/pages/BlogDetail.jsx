import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Clock, Flame, Users, ChefHat, ArrowLeft, ShoppingCart } from 'lucide-react'
import { recipesAPI, unwrap } from '../services/api'
import { useCart } from '../contexts/CartContext'
import Spinner from '../components/ui/Spinner'

const IMG_FALLBACK = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80'
const DIFF_COLOR = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-amber-100 text-amber-700', Hard: 'bg-red-100 text-red-700' }

export default function BlogDetail() {
  const { slug }      = useParams()
  const { addToCart } = useCart()

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', slug],
    queryFn:  () => recipesAPI.getBySlug(slug).then(unwrap),
    enabled:  !!slug,
  })

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>
  if (!recipe)   return (
    <div className="container py-24 text-center">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="font-display text-2xl font-bold mb-3">Recipe not found</h2>
      <Link to="/blog" className="btn-primary">Back to Blog</Link>
    </div>
  )

  const img         = recipe.imageUrl || IMG_FALLBACK
  const ingredients = recipe.ingredients ? recipe.ingredients.split('\n').filter(l => l.trim()) : []
  const steps       = recipe.instructions ? recipe.instructions.split('\n').filter(l => l.trim()) : []
  const featured    = recipe.featuredProducts || []

  return (
    <div className="bg-cream-100 min-h-screen">
      {/* Hero */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <img src={img} alt={recipe.title} className="w-full h-full object-cover"
          onError={e => { e.currentTarget.src = IMG_FALLBACK }} />
        <div className="absolute inset-0 bg-gradient-to-t from-bark-900/80 via-bark-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="container">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-cream-200/70 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft size={14} /> All Recipes
            </Link>
            {recipe.category && (
              <p className="text-xs font-black uppercase tracking-widest text-honey-400 mb-2">{recipe.category}</p>
            )}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{recipe.title}</h1>
          </div>
        </div>
      </div>

      <div className="container py-10 max-w-4xl">
        {/* Meta */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white rounded-2xl p-5 shadow-card">
          {[
            recipe.prepTime  && { icon: Clock,    label: 'Prep Time',  val: recipe.prepTime  },
            recipe.cookTime  && { icon: Flame,    label: 'Cook Time',  val: recipe.cookTime  },
            recipe.servings  && { icon: Users,    label: 'Servings',   val: recipe.servings  },
            recipe.difficulty && { icon: ChefHat, label: 'Difficulty', val: recipe.difficulty },
          ].filter(Boolean).map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex items-center gap-3 pr-4 border-r border-gray-100 last:border-0">
              <div className="w-9 h-9 bg-honey-50 rounded-xl flex items-center justify-center">
                <Icon size={16} className="text-honey-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                <p className="text-sm font-bold text-bark-900">{val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        {recipe.description && (
          <p className="text-bark-600 text-base leading-relaxed mb-10 italic text-lg">{recipe.description}</p>
        )}

        <div className="grid md:grid-cols-3 gap-10">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <h2 className="font-display font-bold text-xl text-bark-900 mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-honey-500 rounded-full inline-block" /> Ingredients
            </h2>
            {ingredients.length > 0 ? (
              <ul className="space-y-2.5">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-bark-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-honey-500 mt-2 flex-shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Ingredients not listed.</p>
            )}
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
            <h2 className="font-display font-bold text-xl text-bark-900 mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-honey-500 rounded-full inline-block" /> Instructions
            </h2>
            {steps.length > 0 ? (
              <ol className="space-y-5">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-honey-100 text-honey-700 font-black text-sm flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-bark-700 text-sm leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-gray-400">Instructions not available.</p>
            )}
          </div>
        </div>

        {/* Featured products */}
        {featured.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display font-bold text-xl text-bark-900 mb-5">Shop These Honeys</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {featured.map(p => {
                const img   = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&q=70'
                const price = parseFloat(p.price || 0)
                return (
                  <div key={p.id} className="card p-4 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-bark-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-500 mb-2">₹{price.toFixed(0)}</p>
                      <button onClick={() => addToCart(p.id, 1)}
                        className="flex items-center gap-1 text-[10px] font-bold text-honey-600 hover:text-honey-700">
                        <ShoppingCart size={10} /> Add
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
