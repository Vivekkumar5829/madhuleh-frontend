import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Shield, Leaf, Award, Droplets, ChevronRight, Star, Package, Truck, RefreshCw } from 'lucide-react'
import { productsAPI, unwrap } from '../services/api'
import ProductCard from '../components/ui/ProductCard'
import SkeletonCard from '../components/ui/SkeletonCard'

const HERO_IMGS = [
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=700&q=85',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=700&q=85',
  'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=700&q=85',
]

const BENEFITS = [
  { icon: Shield, title: 'Lab Tested',       desc: 'Every batch independently certified for purity and quality.' },
  { icon: Leaf,   title: '100% Raw',          desc: 'Unheated, unfiltered, straight from the hive to you.'       },
  { icon: Award,  title: 'Award Winning',     desc: 'Recognised by India\'s top organic food councils.'            },
  { icon: Droplets, title: 'No Additives',    desc: 'Absolutely no preservatives, colours or added sugar.'       },
]

const GUARANTEES = [
  { icon: Shield,  title: 'Purity Guarantee', desc: 'Return if not 100% natural' },
  { icon: Truck,   title: 'Free Delivery',    desc: 'On orders above ₹499'       },
  { icon: Package, title: 'Safe Packaging',   desc: 'Tamper-proof glass jars'    },
  { icon: RefreshCw, title: 'Easy Returns',   desc: '7-day hassle-free returns'  },
]

const TESTIMONIALS = [
  { name: 'Priya S.',  location: 'Mumbai', rating: 5, text: 'The forest honey is absolutely divine — thick, dark and complex. Nothing like the supermarket stuff.' },
  { name: 'Arjun R.',  location: 'Delhi',  rating: 5, text: 'My morning routine is incomplete without Madhuleh honey in warm water. The quality is unmatched.' },
  { name: 'Meera K.',  location: 'Pune',   rating: 5, text: 'Ordered the multi-flora honey and it arrived beautifully packed. Tastes exactly how honey should!' },
]

export default function Home() {
  const navigate = useNavigate()
  const [heroIdx, setHeroIdx] = useState(0)

  const { data: featured, isLoading: fLoad } = useQuery({
    queryKey: ['products-featured'],
    queryFn: () => productsAPI.getFeatured().then(unwrap),
  })

  const { data: bestsellers, isLoading: bLoad } = useQuery({
    queryKey: ['products-bestsellers'],
    queryFn: () => productsAPI.getBestsellers().then(unwrap),
  })

  return (
    <div>
      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-[calc(100vh-64px)] bg-cream-100 overflow-hidden flex items-center bg-honey-pattern">
        {/* Background honey blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-honey-200 rounded-full blur-3xl opacity-40 animate-spin-slow" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 bg-honey-100 rounded-full blur-3xl opacity-60" />

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 py-16 lg:py-0 items-center">
          {/* Left copy */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-honey-100 border border-honey-200 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-honey-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-honey-700 uppercase tracking-widest">Wild Harvest · 2025</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-bark-900 leading-[1.08] mb-6">
              Pure Nature<br />
              in Every<br />
              <span className="text-gradient">Single Drop.</span>
            </h1>

            <p className="text-base sm:text-lg text-bark-600 mb-8 max-w-lg leading-relaxed">
              Raw, unfiltered honey harvested by India's most trusted beekeepers.
              Zero additives. Zero compromise. Pure liquid gold.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary btn-lg text-base shadow-honey">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-outline btn-lg text-base">
                Our Story
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-10">
              <div>
                <p className="font-display text-2xl font-bold text-bark-900">4.9<span className="text-honey-500">★</span></p>
                <p className="text-xs text-gray-500">2,400+ Reviews</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="font-display text-2xl font-bold text-bark-900">50K+</p>
                <p className="text-xs text-gray-500">Happy Customers</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="font-display text-2xl font-bold text-bark-900">12+</p>
                <p className="text-xs text-gray-500">Honey Varieties</p>
              </div>
            </div>
          </div>

          {/* Right hero image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px]">
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-honey-300 animate-spin-slow opacity-60" />
              <div className="absolute inset-4 rounded-full border border-honey-200 opacity-40" />

              {/* Main image */}
              <div className="absolute inset-6 rounded-full overflow-hidden shadow-honey-lg bg-honey-100">
                <img
                  src={HERO_IMGS[heroIdx]}
                  alt="Madhuleh Pure Honey"
                  className="w-full h-full object-cover transition-opacity duration-700"
                />
              </div>

              {/* Floating badge: Rating */}
              <div className="absolute -top-3 -left-3 bg-white rounded-2xl shadow-card-hover px-4 py-3 flex items-center gap-2.5 animate-float">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-bold text-bark-900 text-sm leading-none">4.9 / 5</p>
                  <p className="text-xs text-gray-400">2,400 reviews</p>
                </div>
              </div>

              {/* Floating badge: Organic */}
              <div className="absolute -bottom-3 -right-3 bg-bark-900 text-cream-100 rounded-2xl shadow-lg px-4 py-3 animate-float" style={{ animationDelay: '1.5s' }}>
                <p className="text-xs font-bold uppercase tracking-widest text-honey-400">100%</p>
                <p className="font-display font-bold text-white">Organic</p>
              </div>

              {/* Image switcher dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {HERO_IMGS.map((_, i) => (
                  <button key={i} onClick={() => setHeroIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === heroIdx ? 'bg-honey-500 w-6' : 'bg-honey-200'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ GUARANTEES STRIP ══════════════════ */}
      <section className="bg-bark-900 py-8">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {GUARANTEES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-honey-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-honey-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="text-xs text-cream-200/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURED PRODUCTS ══════════════════ */}
      <section className="section bg-honey-pattern">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">Handpicked For You</p>
              <h2 className="section-title">Featured <span className="text-gradient">Collection</span></h2>
              <p className="section-subtitle">Our most loved honeys, sourced from the heart of India's forests.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-bark-700 hover:text-honey-600 transition-colors">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fLoad
              ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : (featured || []).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="btn-outline">View All Products <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ STORY BANNER ══════════════════ */}
      <section className="section bg-bark-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1471943311424-646960669fbc?w=1400&q=70"
            alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="container relative z-10 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-honey-400 mb-3">Our Promise</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
            Nature's Liquid Gold, From Our Hive to Your Table
          </h2>
          <p className="text-cream-200/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Every jar of Madhuleh honey tells a story of hardworking bees, pristine forests, and beekeepers who have perfected their craft across generations.
          </p>
          <Link to="/about" className="btn bg-honey-500 text-bark-900 rounded-full px-8 py-4 font-bold text-base hover:bg-honey-400 hover:shadow-honey transition-all">
            Discover Our Story <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ══════════════════ BENEFITS ══════════════════ */}
      <section className="section bg-cream-100">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">Why Choose Madhuleh</p>
            <h2 className="section-title">Purity Without <span className="text-gradient">Compromise</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center group hover:shadow-honey transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-honey-50 group-hover:bg-honey-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Icon size={24} className="text-honey-500" />
                </div>
                <h3 className="font-display font-bold text-bark-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ BESTSELLERS ══════════════════ */}
      <section className="section bg-honey-50">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">Top Picks</p>
              <h2 className="section-title">Our <span className="text-gradient">Bestsellers</span></h2>
              <p className="section-subtitle">The honeys our customers can't live without.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-bark-700 hover:text-honey-600 transition-colors">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bLoad
              ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : (bestsellers || []).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="section bg-cream-100">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">Customer Love</p>
            <h2 className="section-title">Crafted by Bees, <span className="text-gradient">Loved by People</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6 card-hover">
                <div className="flex items-center gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} className={s <= t.rating ? 'text-honey-500 fill-honey-500' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-bark-700 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-honey-100 flex items-center justify-center font-bold text-honey-700 text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-bark-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FINAL CTA ══════════════════ */}
      <section className="py-20 bg-gradient-to-br from-honey-500 via-honey-400 to-amber-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="container relative z-10 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-bark-700 mb-3">Taste the Pure Life</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-bark-900 mb-4">Ready to go pure?</h2>
          <p className="text-bark-700 mb-8 max-w-sm mx-auto">
            Join 50,000+ customers who've made the switch to pure honey. Free delivery on your first order.
          </p>
          <Link to="/products" className="btn bg-bark-900 text-cream-100 rounded-full px-10 py-4 font-bold text-base hover:bg-bark-700 hover:-translate-y-1 transition-all shadow-lg">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
