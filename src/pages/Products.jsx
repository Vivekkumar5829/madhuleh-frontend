import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { productsAPI, unwrap } from '../services/api'
import ProductCard from '../components/ui/ProductCard'
import SkeletonCard from '../components/ui/SkeletonCard'
import Pagination from '../components/ui/Pagination'
import EmptyState from '../components/ui/EmptyState'
import { Link } from 'react-router-dom'

const SORT_OPTIONS = [
  { value: 'createdAt-desc',   label: 'Newest First'      },
  { value: 'price-asc',        label: 'Price: Low to High' },
  { value: 'price-desc',       label: 'Price: High to Low' },
  { value: 'soldCount-desc',   label: 'Most Popular'       },
  { value: 'averageRating-desc', label: 'Top Rated'        },
]

export default function Products() {
  const [sp, setSp] = useSearchParams()
  const [page,    setPage]    = useState(0)
  const [sort,    setSort]    = useState('createdAt-desc')
  const [search,  setSearch]  = useState(sp.get('q') || '')
  const [draft,   setDraft]   = useState(sp.get('q') || '')
  const [filOpen, setFilOpen] = useState(false)

  const [sortBy,  sortDir] = sort.split('-')

  useEffect(() => {
    const q = sp.get('q') || ''
    setSearch(q); setDraft(q); setPage(0)
  }, [sp])

  const isSearch = search.trim().length > 0

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', page, sortBy, sortDir, search],
    queryFn: () => isSearch
      ? productsAPI.search(search, { page, size: 12 }).then(unwrap)
      : productsAPI.getAll({ page, size: 12, sortBy, sortDir }).then(unwrap),
    keepPreviousData: true,
  })

  const products    = data?.content || []
  const totalPages  = data?.totalPages || 0
  const totalItems  = data?.totalElements || 0

  const handleSearch = e => {
    e.preventDefault()
    setSearch(draft.trim())
    setPage(0)
    if (draft.trim()) setSp({ q: draft.trim() })
    else setSp({})
  }

  const clearSearch = () => {
    setSearch(''); setDraft(''); setPage(0); setSp({})
  }

  return (
    <div className="bg-cream-100 min-h-screen">
      {/* ── Header ── */}
      <div className="bg-bark-900 py-12">
        <div className="container text-center">
          <p className="text-xs font-black uppercase tracking-widest text-honey-400 mb-3">Our Collection</p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            {isSearch ? `Results for "${search}"` : 'Experience Madhuleh Gold'}
          </h1>
          <p className="text-cream-200/60 text-sm">{totalItems > 0 ? `${totalItems} products found` : ''}</p>
        </div>
      </div>

      <div className="container py-8">
        {/* ── Controls ── */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Search honey varieties..."
                className="input pl-10 pr-10"
              />
              {draft && (
                <button type="button" onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bark-900">
                  <X size={15} />
                </button>
              )}
            </div>
          </form>

          {/* Sort */}
          <div className="relative">
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(0) }}
              className="input pr-9 appearance-none cursor-pointer min-w-[180px]">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* ── Active search chip ── */}
        {isSearch && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-bark-600">Searching:</span>
            <span className="inline-flex items-center gap-1.5 bg-honey-100 text-honey-700 rounded-full px-3 py-1 text-sm font-semibold">
              {search}
              <button onClick={clearSearch}><X size={12} /></button>
            </span>
          </div>
        )}

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No products found"
            message={isSearch ? `No results for "${search}". Try a different term.` : 'No products available right now.'}
            action={isSearch && <button onClick={clearSearch} className="btn-outline">Clear Search</button>}
          />
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
      </div>
    </div>
  )
}
