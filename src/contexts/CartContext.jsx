import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartAPI, unwrap } from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const Ctx = createContext(null)

export function CartProvider({ children }) {
  const { user }              = useAuth()
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(false)

  // CartItemResponse shape from backend:
  // { id, productId, productName, productImageUrl, unitPrice, quantity, subtotal, inStock }
  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return }
    setLoading(true)
    try {
      const res  = await cartAPI.get()
      const data = unwrap(res)
      setItems(data?.items || [])
    } catch { setItems([]) }
    finally  { setLoading(false) }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add items'); return false }
    try {
      await cartAPI.add(productId, quantity)
      await fetchCart()
      toast.success('Added to cart! 🍯')
      return true
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add item')
      return false
    }
  }, [user, fetchCart])

  const updateQty = useCallback(async (itemId, qty) => {
    try {
      if (qty < 1) await cartAPI.remove(itemId)
      else         await cartAPI.update(itemId, qty)
      await fetchCart()
    } catch { toast.error('Failed to update') }
  }, [fetchCart])

  const removeItem = useCallback(async (itemId) => {
    try {
      await cartAPI.remove(itemId)
      await fetchCart()
      toast.success('Removed from cart')
    } catch { toast.error('Failed to remove') }
  }, [fetchCart])

  const clearCart = useCallback(async () => {
    try { await cartAPI.clear(); setItems([]) } catch {}
  }, [])

  // Correct field names from CartItemResponse
  const count    = items.reduce((s, i) => s + (i.quantity || 0), 0)
  const subtotal = items.reduce((s, i) => s + parseFloat(i.subtotal || 0), 0)

  return (
    <Ctx.Provider value={{ items, loading, count, subtotal, addToCart, updateQty, removeItem, clearCart, fetchCart }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}