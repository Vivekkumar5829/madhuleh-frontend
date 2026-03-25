import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { faqsAPI, unwrap } from '../services/api'
import Spinner from '../components/ui/Spinner'

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-honey-50 transition-colors">
        <p className="font-semibold text-bark-900 text-sm">{faq.question}</p>
        <ChevronDown size={18} className={`text-honey-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <p className="px-5 pb-5 text-sm text-bark-600 leading-relaxed border-t border-gray-100 pt-4">{faq.answer}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn:  () => faqsAPI.getAll().then(unwrap),
  })

  const all = Array.isArray(faqs) ? faqs : []
  const categories = [...new Set(all.map(f => f.category).filter(Boolean))]
  const grouped    = categories.length > 0
    ? categories.reduce((acc, cat) => ({ ...acc, [cat]: all.filter(f => f.category === cat) }), {})
    : { 'General': all }

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-bark-900 py-14">
        <div className="container text-center">
          <p className="text-xs font-black uppercase tracking-widest text-honey-400 mb-3">Help & Support</p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-cream-200/60 text-sm max-w-md mx-auto">Everything you need to know about Madhuleh honey, orders, and delivery.</p>
        </div>
      </div>

      <div className="container py-12 max-w-3xl">
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : all.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">❓</p>
            <p className="text-gray-500">No FAQs available yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                {categories.length > 1 && (
                  <h2 className="font-display font-bold text-lg text-bark-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-honey-500 rounded-full" /> {cat}
                  </h2>
                )}
                <div className="space-y-3">
                  {items.map(faq => <FaqItem key={faq.id} faq={faq} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
