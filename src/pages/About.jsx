import React from 'react'
import { Link } from 'react-router-dom'
import { Award, Leaf, Shield, Heart, ArrowRight, Users, TrendingUp, Star } from 'lucide-react'

const MILESTONES = [
  { year: '2016', event: 'Shweta Wayal-Gaikwad started beekeeping with just 5 hives during her MBA final year' },
  { year: '2016', event: 'Completed training from Central Bee Research and Training Institute, Pune' },
  { year: '2017', event: 'Started selling honey and conducting beekeeping training programs' },
  { year: '2020', event: 'Officially registered Madhuleh with focus on branding and packaging' },
  { year: '2022', event: 'Trained 1000+ farmers across Maharashtra through SHGs, NGOs and FPOs' },
  { year: '2024', event: '5000+ farmers trained, 20+ agri-entrepreneurs created across India 🍯' },
]

const AWARDS = [
  { title: 'Best Agri Entrepreneur', org: 'Maharashtra State Government', year: '2022', emoji: '🏆' },
  { title: 'Women Empowerment Award', org: 'NABARD', year: '2023', emoji: '🌟' },
  { title: 'Sustainable Agriculture Recognition', org: 'KVK Pune', year: '2023', emoji: '🌱' },
  { title: 'Best Honey Brand', org: 'Agri Business Summit', year: '2024', emoji: '🥇' },
]

export default function About() {
  return (
    <div className="bg-cream-100 min-h-screen">

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-bark-900 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1471943311424-646960669fbc?w=1400&q=70" alt=""
            className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="container relative z-10 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-honey-400 mb-3">Our Story</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Pure Honey | Scientific Beekeeping<br />Farmer Empowerment
          </h1>
          <p className="text-cream-200/60 text-base max-w-xl mx-auto leading-relaxed">
            Madhuleh is a trusted name in beekeeping, founded by Shweta Wayal-Gaikwad in 2016.
            What started with just 5 beehives has grown into a mission to promote sustainable
            agriculture and empower farmers through beekeeping.
          </p>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="bg-honey-500 py-10">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { number: '5000+', label: 'Farmers Trained' },
              { number: '20+',   label: 'Agri Entrepreneurs' },
              { number: '2016',  label: 'Founded' },
              { number: '100%',  label: 'Pure Natural Honey' },
            ].map(({ number, label }) => (
              <div key={label}>
                <p className="font-display text-3xl font-bold text-bark-900">{number}</p>
                <p className="text-xs text-bark-700 font-semibold uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-3">Our Journey</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-bark-900 mb-5">
                From 5 Beehives to a National Mission
              </h2>
              <div className="space-y-4 text-bark-600 text-sm leading-relaxed">
                <p>Shweta Wayal-Gaikwad, an MBA in Agri-Business Management, started her beekeeping
                journey during her final year in 2016. While exploring agri-allied business
                opportunities, she developed a deep interest in beekeeping and studied it for over
                6 months at the Central Bee Research and Training Institute, Pune.</p>
                <p>She started small, managing beehives alongside her studies, selling honey, and
                conducting training programs for local farmers.</p>
                <p>In 2020, she officially registered Madhuleh, focusing on branding, packaging,
                and expanding services across Maharashtra and India.</p>
              </div>
              <div className="honey-divider" />
              <Link to="/products" className="btn-primary mt-2">
                Shop Our Honey <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-honey-lg">
                <img src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=700&q=80"
                  alt="Madhuleh Apiary" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-card-hover p-5">
                <p className="font-display text-3xl font-bold text-bark-900">2016</p>
                <p className="text-xs text-gray-500 mt-0.5">Founded by Shweta Wayal-Gaikwad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-honey-50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">What We Do</p>
            <h2 className="section-title">Our <span className="text-gradient">Services</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🐝',
                title: 'Beekeeping Training',
                desc: 'Scientific beekeeping training for farmers, women SHGs, NGOs, FPOs and FPCs. Covers bee management, box handling, seasonal care and honey extraction.'
              },
              {
                icon: '📦',
                title: 'Beekeeping Materials',
                desc: 'We supply bee boxes, bee colonies, protective kits, tools and equipment for beekeepers across India.'
              },
              {
                icon: '🍯',
                title: 'Honey Production',
                desc: 'High-quality natural honey — Multiflora, Mono-flora and Raw/Natural honey with proper processing and packaging.'
              },
              {
                icon: '🌱',
                title: 'Agri Entrepreneurship',
                desc: 'We support individuals to start their own beekeeping business with training, setup guidance and ongoing support.'
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 text-center group hover:-translate-y-1 hover:shadow-honey transition-all duration-300">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-display font-bold text-bark-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-cream-100">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">What We Stand For</p>
            <h2 className="section-title">Purity Without <span className="text-gradient">Compromise</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf,   title: 'Sustainably Sourced', desc: 'We follow ethical and eco-friendly beekeeping practices that protect our environment.' },
              { icon: Shield, title: 'Pure & Natural',       desc: 'Every batch of our honey is pure, unprocessed and free from adulteration.' },
              { icon: Users,  title: 'Farmer First',        desc: 'We work with farmers directly, ensuring fair prices and sustainable livelihoods.' },
              { icon: Heart,  title: 'Community Impact',    desc: 'Through SHGs and NGOs, we empower women and rural communities across India.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center group hover:-translate-y-1 hover:shadow-honey transition-all duration-300">
                <div className="w-14 h-14 bg-honey-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-honey-500" />
                </div>
                <h3 className="font-display font-bold text-bark-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-honey-50">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">Our Journey</p>
            <h2 className="section-title">How We Got Here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-honey-200" />
            <div className="space-y-8">
              {MILESTONES.map(({ year, event }, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <div className="w-12 text-right flex-shrink-0">
                    <span className="font-display font-bold text-honey-500 text-sm">{year}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-honey-500 border-2 border-cream-100" />
                    <p className="text-sm text-bark-700 leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section bg-cream-100">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">Recognition</p>
            <h2 className="section-title">Awards & <span className="text-gradient">Achievements</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AWARDS.map(({ title, org, year, emoji }) => (
              <div key={title} className="card p-6 text-center hover:-translate-y-1 hover:shadow-honey transition-all duration-300">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-display font-bold text-bark-900 mb-1 text-sm">{title}</h3>
                <p className="text-xs text-honey-600 font-semibold mb-1">{org}</p>
                <p className="text-xs text-gray-400">{year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="section bg-bark-900">
        <div className="container max-w-3xl text-center">
          <div className="text-5xl mb-6">🍯</div>
          <p className="text-xs font-black uppercase tracking-widest text-honey-400 mb-4">Founder's Message</p>
          <blockquote className="font-display text-xl sm:text-2xl font-medium text-white leading-relaxed mb-6 italic">
            "Beekeeping is not just a business, it is a way to support nature and farmers together.
            Through Madhuleh, my mission is to create awareness, generate income opportunities,
            and build a sustainable future."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div>
              <p className="font-bold text-honey-400">Shweta Wayal-Gaikwad</p>
              <p className="text-xs text-cream-200/60">Founder, Madhuleh Apiary</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-honey-500 to-amber-500">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-bark-900 mb-3">Taste the Difference</h2>
          <p className="text-bark-700 mb-6 max-w-sm mx-auto text-sm">
            Experience what pure honey is supposed to taste like.
          </p>
          <Link to="/products" className="btn bg-bark-900 text-white rounded-full px-10 py-4 font-bold hover:bg-bark-700 transition-all shadow-lg">
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  )
}
