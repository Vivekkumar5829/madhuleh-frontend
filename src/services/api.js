import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── JWT attach ─────────────────────────────────────────────────────────────
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('mh_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// ── Auto refresh + 401 handling ────────────────────────────────────────────
api.interceptors.response.use(
  res => res,
  async err => {
    const orig = err.config
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true
      const refresh = localStorage.getItem('mh_refresh')
      if (refresh) {
        try {
          const r = await axios.post(`${BASE}/auth/refresh`, { refreshToken: refresh })
          const d = r.data?.data || r.data
          localStorage.setItem('mh_token',   d.accessToken)
          localStorage.setItem('mh_refresh', d.refreshToken || refresh)
          orig.headers.Authorization = `Bearer ${d.accessToken}`
          return api(orig)
        } catch {
          localStorage.clear()
          window.location.href = '/auth'
        }
      } else {
        localStorage.removeItem('mh_token')
        window.location.href = '/auth'
      }
    }
    return Promise.reject(err)
  }
)

// helper: unwrap ApiResponse envelope
export const unwrap = res => res.data?.data ?? res.data

// ─────────────────────────────────────────────────────────────────────────
// AUTH
// POST /auth/register  { firstName, lastName, email, password, phone }
// POST /auth/login     { email, password }
// Response: { accessToken, refreshToken, userId, email, firstName, lastName, role }
// ─────────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: d => api.post('/auth/register', d),
  login:    d => api.post('/auth/login', d),
  forgot:   e => api.post(`/auth/forgot-password?email=${encodeURIComponent(e)}`),
  verify:   t => api.post(`/auth/verify-email?token=${t}`),
  reset: d => api.post(`/auth/reset-password?token=${d.token}&newPassword=${encodeURIComponent(d.newPassword)}`),
}

// ─────────────────────────────────────────────────────────────────────────
// PRODUCTS
// GET /products?page=0&size=12&sortBy=createdAt&sortDir=desc
// GET /products/search?query=&page=&size=
// GET /products/featured  → List<ProductResponse>
// GET /products/bestsellers → List<ProductResponse>
// GET /products/{slug}    → ProductResponse
// GET /products/category/{categoryId}
// ProductResponse fields: id,name,slug,shortDescription,description,
//   price,compareAtPrice,discountPercentage,stockQuantity,inStock,lowStock,
//   weight,netWeight,status,featured,bestseller,images[{url}],
//   category,averageRating,reviewCount,soldCount,createdAt
// ─────────────────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll:        p   => api.get('/products', { params: p }),
  search:        (q,p)=> api.get('/products/search', { params: { query: q, ...p } }),
  getFeatured:   ()  => api.get('/products/featured'),
  getBestsellers:()  => api.get('/products/bestsellers'),
  getBySlug:     s   => api.get(`/products/${s}`),
  getByCategory: (id,p)=> api.get(`/products/category/${id}`, { params: p }),
  // ADMIN
  create:      d     => api.post('/products', d),
  update:    (id, d) => api.put(`/products/${id}`, d),
  delete:     id     => api.delete(`/products/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────
// CART
// GET    /cart
// POST   /cart/items  { productId: UUID, quantity: int }
// PUT    /cart/items/{itemId}  { quantity: int }
// DELETE /cart/items/{itemId}
// DELETE /cart
// CartItem fields: id, product{id,name,slug,images,price}, quantity, unitPrice, subtotal
// ─────────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get:    ()           => api.get('/cart'),
  add:  (productId, quantity) => api.post('/cart/items', { productId, quantity }),
  update:(itemId, quantity)   => api.put(`/cart/items/${itemId}`, { quantity }),
  remove: itemId       => api.delete(`/cart/items/${itemId}`),
  clear:  ()           => api.delete('/cart'),
}

// ─────────────────────────────────────────────────────────────────────────
// ADDRESSES (AddressController — to be added to backend)
// GET    /addresses
// POST   /addresses  { firstName,lastName,phone,addressLine1,addressLine2,city,state,pincode,label,isDefault }
// PUT    /addresses/{id}
// DELETE /addresses/{id}
// ─────────────────────────────────────────────────────────────────────────
export const addressAPI = {
  getAll: ()       => api.get('/addresses'),
  create: d        => api.post('/addresses', d),
  update: (id, d)  => api.put(`/addresses/${id}`, d),
  delete: id       => api.delete(`/addresses/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────
// ORDERS
// POST /orders  { addressId: UUID, paymentMethod, couponCode?, notes? }
// GET  /orders?page=0&size=10  → PagedResponse<OrderResponse>
// GET  /orders/{orderNumber}
// POST /orders/verify-payment?razorpayOrderId=&razorpayPaymentId=&razorpaySignature=
// PUT  /orders/{orderId}/status?status=&trackingNumber=&shippingProvider=  (ADMIN)
// OrderResponse fields: id,orderNumber,status,items[{productId,productName,
//   productImageUrl,quantity,unitPrice,subtotal}],subtotal,shippingCost,
//   discountAmount,taxAmount,totalAmount,couponCode,
//   shippingFirstName,shippingLastName,shippingPhone,
//   shippingAddressLine1,shippingCity,shippingState,shippingPincode,
//   paymentStatus,paymentMethod,trackingNumber,createdAt
// ─────────────────────────────────────────────────────────────────────────
export const ordersAPI = {
  create:        d   => api.post('/orders', d),
  getMyOrders:   p   => api.get('/orders', { params: p }),
  getByNumber:   num => api.get(`/orders/${num}`),
  verifyPayment: p   => api.post('/orders/verify-payment', null, { params: p }),
  // ADMIN
  getAllOrders:  p   => api.get('/orders/admin/all', { params: p }),
  updateStatus: (id, p) => api.put(`/orders/${id}/status`, null, { params: p }),
}

// ─────────────────────────────────────────────────────────────────────────
// COUPONS
// GET /coupons/validate?code=&orderAmount=  → BigDecimal (discount amount)
// GET /coupons/{code}  (ADMIN)
// ─────────────────────────────────────────────────────────────────────────
export const couponsAPI = {
  validate: (code, orderAmount) => api.get('/coupons/validate', { params: { code, orderAmount } }),
}

// ─────────────────────────────────────────────────────────────────────────
// REVIEWS
// POST /reviews  { productId, rating, title, body }
// GET  /reviews/product/{productId}?page=&size=
// GET  /reviews/pending?page=&size=  (ADMIN)
// PUT  /reviews/{id}/moderate?status=&adminNotes=  (ADMIN)
// Review fields: id, rating, title, body, status, verifiedPurchase,
//               helpfulCount, user{firstName,lastName}, createdAt
// ─────────────────────────────────────────────────────────────────────────
export const reviewsAPI = {
  create:          d         => api.post('/reviews', d),
  getByProduct:    (id, p)   => api.get(`/reviews/product/${id}`, { params: p }),
  // ADMIN
  getPending:      p         => api.get('/reviews/pending', { params: p }),
  moderate:        (id, p)   => api.put(`/reviews/${id}/moderate`, null, { params: p }),
}

// ─────────────────────────────────────────────────────────────────────────
// RECIPES (Blog)
// GET /recipes?page=&size=  → PagedResponse<Recipe>
// GET /recipes/{slug}
// Recipe fields: id,title,slug,description,ingredients(text),instructions(text),
//   imageUrl,prepTime,cookTime,servings,difficulty,published,featuredProducts[]
// ─────────────────────────────────────────────────────────────────────────
export const recipesAPI = {
  getAll:    p   => api.get('/recipes', { params: p }),
  getBySlug: s   => api.get(`/recipes/${s}`),
  // ADMIN
  create:    d   => api.post('/recipes', d),
  update:  (id,d)=> api.put(`/recipes/${id}`, d),
  delete:   id   => api.delete(`/recipes/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────
// FAQS — GET /faqs returns live data from DB
// Faq fields: id, question, answer, category, sortOrder, active
// ─────────────────────────────────────────────────────────────────────────
export const faqsAPI = {
  getAll:    ()      => api.get('/faqs'),
  create:    d       => api.post('/faqs', d),
  update:    (id, d) => api.put(`/faqs/${id}`, d),
  delete:    id      => api.delete(`/faqs/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────
// CONTACT
// POST /contact  { name, email, phone?, subject, message }
// GET  /contact                (ADMIN)
// GET  /contact/status/{status} (ADMIN)
// PUT  /contact/{id}/status    (ADMIN)
// InquiryStatus: OPEN, IN_PROGRESS, RESOLVED, CLOSED
// ─────────────────────────────────────────────────────────────────────────
export const contactAPI = {
  send:          d         => api.post('/contact', d),
  getAll:        p         => api.get('/contact', { params: p }),
  getByStatus:   status    => api.get(`/contact/status/${status}`),
  updateStatus:  (id, status) => api.put(`/contact/${id}/status`, null, { params: { status } }),
}

// ─────────────────────────────────────────────────────────────────────────
// NEWSLETTER
// POST /newsletter/subscribe  { email, firstName? }
// ─────────────────────────────────────────────────────────────────────────
export const newsletterAPI = {
  subscribe: (email, firstName = '') => api.post('/newsletter/subscribe', { email, firstName }),
}

export default api
