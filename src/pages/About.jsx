import React from 'react'
import { Link } from 'react-router-dom'
import { Award, Leaf, Shield, Heart, ArrowRight } from 'lucide-react'

const TEAM = [
  { name: 'Arjun Nair',   role: 'Founder & CEO',       emoji: '👨‍💼', bio: '20 years of experience in sustainable agriculture and beekeeping.' },
  { name: 'Meera Reddy',  role: 'Head of Quality',      emoji: '👩‍🔬', bio: 'Food scientist ensuring every batch meets our purity standards.' },
  { name: 'Ravi Kumar',   role: 'Chief Beekeeper',      emoji: '🧑‍🌾', bio: 'Third-generation beekeeper with over 300 hives across Karnataka.' },
]

const MILESTONES = [
  { year: '2015', event: 'Founded in a small farm in Coorg, Karnataka' },
  { year: '2017', event: 'First FSSAI certification and national distribution' },
  { year: '2019', event: 'Expanded to 12 varietals from 8 states' },
  { year: '2021', event: 'Crossed 25,000 happy customers nationwide' },
  { year: '2023', event: 'Launched direct-to-consumer platform Madhuleh.com' },
  { year: '2025', event: '50,000+ customers and growing! 🍯' },
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
            Nature's Liquid Gold,<br />From Our Hive to Your Table.
          </h1>
          <p className="text-cream-200/60 text-base max-w-xl mx-auto leading-relaxed">
            Madhuleh was born from a simple belief: that everyone deserves honey the way nature intended — pure, raw, and alive.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-3">A Legacy of Golden Goodness</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-bark-900 mb-5">
                From the Forests of Coorg to Your Doorstep
              </h2>
              <div className="space-y-4 text-bark-600 text-sm leading-relaxed">
                <p>Madhuleh began in 2015 when our founder Arjun Nair wanted to share the honey he'd been gifting friends and family for years — honey harvested from his family's farm in the Western Ghats.</p>
                <p>What started as a passion project became a mission: to bring truly unadulterated honey to Indian households who'd forgotten what real honey tastes like.</p>
                <p>Today, we partner with 40+ beekeeping families across 8 Indian states, ensuring every jar of Madhuleh is a testament to their craft and nature's perfection.</p>
              </div>
              <div className="honey-divider" />
              <Link to="/products" className="btn-primary mt-2">
                Shop Our Collection <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-honey-lg">
                <img src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=700&q=80" alt="Beekeeper at work"
                  className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-card-hover p-5">
                <p className="font-display text-3xl font-bold text-bark-900">40+</p>
                <p className="text-xs text-gray-500 mt-0.5">Beekeeping Partners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-honey-50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">What We Stand For</p>
            <h2 className="section-title">Purity Without <span className="text-gradient">Compromise</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf,   title: 'Sustainably Sourced', desc: 'We work only with beekeepers who follow ethical and eco-friendly practices.' },
              { icon: Shield, title: 'Lab Certified',       desc: 'Every batch tested by FSSAI-approved labs for purity and authenticity.' },
              { icon: Award,  title: 'Award-Winning',       desc: 'Recognised by India\'s top organic food bodies three years running.' },
              { icon: Heart,  title: 'Community First',     desc: 'We pay fair prices to beekeepers, supporting rural livelihoods.' },
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
      <section className="section bg-cream-100">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">Our Journey</p>
            <h2 className="section-title">How We Got Here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-honey-200" />
            <div className="space-y-8">
              {MILESTONES.map(({ year, event }) => (
                <div key={year} className="flex gap-8 items-start">
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

      {/* Team */}
      <section className="section bg-honey-50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-honey-600 mb-2">The Hive Mind</p>
            <h2 className="section-title">Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {TEAM.map(({ name, role, emoji, bio }) => (
              <div key={name} className="card p-6 text-center card-hover">
                <div className="text-5xl mb-4">{emoji}</div>
                <h3 className="font-display font-bold text-bark-900 mb-0.5">{name}</h3>
                <p className="text-xs font-bold text-honey-600 uppercase tracking-wider mb-3">{role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-honey-500 to-amber-500">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-bark-900 mb-3">Taste the Difference</h2>
          <p className="text-bark-700 mb-6 max-w-sm mx-auto text-sm">Experience what pure honey is supposed to taste like.</p>
          <Link to="/products" className="btn bg-bark-900 text-white rounded-full px-10 py-4 font-bold hover:bg-bark-700 transition-all shadow-lg">
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
