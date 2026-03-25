import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import { recipesAPI, unwrap } from '../../services/api'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const EMPTY = { title:'', slug:'', description:'', ingredients:'', instructions:'', imageUrl:'', prepTime:'', cookTime:'', servings:'', difficulty:'Easy', published:false }

function RecipeForm({ initial = EMPTY, onSave, onCancel, busy }) {
  const [form, setForm] = useState(initial)
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} className="input" required placeholder="Honey Lemon Glazed Salmon" />
        </div>
        <div className="col-span-2">
          <label className="label">Slug *</label>
          <input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''))}
            className="input font-mono text-sm" required placeholder="honey-lemon-glazed-salmon" />
        </div>
        <div className="col-span-2">
          <label className="label">Image URL</label>
          <input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} className="input" type="url" placeholder="https://…" />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} className="input resize-none" rows={2} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label">Prep Time</label>
          <input value={form.prepTime} onChange={e => set('prepTime', e.target.value)} className="input" placeholder="10 mins" />
        </div>
        <div>
          <label className="label">Cook Time</label>
          <input value={form.cookTime} onChange={e => set('cookTime', e.target.value)} className="input" placeholder="20 mins" />
        </div>
        <div>
          <label className="label">Servings</label>
          <input value={form.servings} onChange={e => set('servings', e.target.value)} className="input" placeholder="4" />
        </div>
        <div>
          <label className="label">Difficulty</label>
          <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className="input">
            {['Easy','Medium','Hard'].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="col-span-2 flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => set('published', !form.published)}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.published ? 'bg-honey-500' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-bark-700">Published</span>
          </label>
        </div>
      </div>
      <div>
        <label className="label">Ingredients * <span className="text-gray-400 normal-case">(one per line)</span></label>
        <textarea value={form.ingredients} onChange={e => set('ingredients', e.target.value)} className="input resize-none" rows={5} required placeholder="2 tbsp Madhuleh honey&#10;1 lemon, juiced&#10;…" />
      </div>
      <div>
        <label className="label">Instructions * <span className="text-gray-400 normal-case">(one step per line)</span></label>
        <textarea value={form.instructions} onChange={e => set('instructions', e.target.value)} className="input resize-none" rows={6} required placeholder="Preheat oven to 180°C.&#10;Mix honey and lemon juice.&#10;…" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={busy} className="btn-primary btn-sm disabled:opacity-60">
          {busy ? <Spinner size="sm" className="border-bark-900/30 border-t-bark-900" /> : null}
          Save Recipe
        </button>
        <button type="button" onClick={onCancel} className="btn-outline btn-sm">Cancel</button>
      </div>
    </form>
  )
}

export default function AdminRecipes() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)
  const [busy,  setBusy]  = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-recipes'],
    queryFn:  () => recipesAPI.getAll({ page: 0, size: 50 }).then(unwrap),
  })
  const recipes = data?.content || []

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-recipes'] })

  const handleSave = async form => {
    setBusy(true)
    try {
      if (modal === 'create') { await recipesAPI.create(form); toast.success('Recipe created!') }
      else { await recipesAPI.update(modal.id, form); toast.success('Recipe updated!') }
      setModal(null); invalidate()
    } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
    finally { setBusy(false) }
  }

  const handleDelete = async () => {
    try { await recipesAPI.delete(delId); toast.success('Deleted'); setDelId(null); invalidate() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-bark-900">Recipes</h1>
          <p className="text-gray-500 text-sm">{recipes.length} recipes</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary btn-sm"><Plus size={14} /> Add Recipe</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : recipes.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-card">
          <BookOpen size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No recipes yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-card overflow-hidden group">
              {r.imageUrl && (
                <div className="h-36 overflow-hidden">
                  <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-bold text-bark-900 text-sm line-clamp-2 flex-1">{r.title}</p>
                  <span className={`badge flex-shrink-0 ${r.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {r.published ? 'Live' : 'Draft'}
                  </span>
                </div>
                {r.description && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{r.description}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setModal(r)} className="flex items-center gap-1 text-xs font-bold text-honey-600 hover:text-honey-700">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDelId(r.id)} className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} size="xl"
        title={modal === 'create' ? 'Add New Recipe' : `Edit: ${modal?.title}`}>
        <RecipeForm
          initial={modal === 'create' ? EMPTY : { ...EMPTY, ...modal }}
          onSave={handleSave} onCancel={() => setModal(null)} busy={busy}
        />
      </Modal>

      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete Recipe" size="sm">
        <div className="p-6 text-center">
          <p className="text-4xl mb-3">🗑️</p>
          <p className="text-bark-700 text-sm mb-5">Delete this recipe permanently?</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleDelete} className="btn bg-red-500 text-white rounded-full px-5 py-2.5 text-sm font-bold hover:bg-red-600">Delete</button>
            <button onClick={() => setDelId(null)} className="btn-outline btn-sm">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
