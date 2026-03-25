import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Clock, ChefHat, Users, Flame } from 'lucide-react'
import { recipesAPI, unwrap } from '../services/api'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

const DIFF_COLOR = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-amber-100 text-amber-700', Hard: 'bg-red-100 text-red-700' }
const IMG_FALLBACK = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'

function RecipeCard({ recipe }) {
  const img = recipe.imageUrl || IMG_FALLBACK
  return (
    <Link to={`/blog/${recipe.slug}`} className="card card-hover overflow-hidden group flex flex-col">
      <div className="aspect-video overflow-hidden bg-cream-100">
        <img src={img} alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.currentTarget.src = IMG_FALLBACK }} loading="lazy" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        {recipe.category && (
          <span className="text-[10px] font-black uppercase tracking-widest text-honey-600 mb-2">{recipe.category}</span>
        )}
        <h3 className="font-display font-bold text-bark-900 text-lg mb-2 line-clamp-2 group-hover:text-honey-600 transition-colors">{recipe.title}</h3>
        {recipe.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{recipe.description}</p>
        )}
        <div className="mt-auto flex items-center gap-4 text-xs text-gray-400 flex-wrap">
          {recipe.prepTime && (
            <span className="flex items-center gap-1"><Clock size={11} /> {recipe.prepTime} prep</span>
          )}
          {recipe.cookTime && (
            <span className="flex items-center gap-1"><Flame size={11} /> {recipe.cookTime} cook</span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1"><Users size={11} /> {recipe.servings}</span>
          )}
          {recipe.difficulty && (
            <span className={`badge ${DIFF_COLOR[recipe.difficulty] || 'bg-gray-100 text-gray-600'}`}>{recipe.difficulty}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function Blog() {
  const { data, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn:  () => recipesAPI.getAll({ page: 0, size: 24 }).then(unwrap),
  })

  const recipes = data?.content || []

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-bark-900 py-14 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=60" alt="" className="w-full h-full object-cover opacity-15" />
        </div>
        <div className="container relative z-10 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-honey-400 mb-3">Honey Recipes & Stories</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">Madhuleh Honey Recipes</h1>
          <p className="text-cream-200/60 max-w-md mx-auto text-sm">
            Discover the golden possibilities — from morning tonics to decadent desserts, all made better with Madhuleh honey.
          </p>
        </div>
      </div>

      <div className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : recipes.length === 0 ? (
          <EmptyState icon="🍽️" title="No recipes yet" message="Our recipe team is cooking up something special. Check back soon!" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}
