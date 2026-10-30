import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import type { Product, ProductCategory } from '../../types'
import { getProductImage } from '../../store'

const CATEGORIES: (ProductCategory | 'All')[] = ['All', 'Vegetables', 'Fruits', 'Rice', 'Corn', 'Root Crops', 'Livestock', 'Poultry', 'Other']

export default function BuyerMarketplace() {
  const { data, addToCart, toggleFavorite, isFavorite, navigate, setSelectedProductId, currentUser, getCartWithProducts } = useApp()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'All'>('All')
  const [location, setLocation] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest')
  const [addedId, setAddedId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [qty, setQty] = useState(1)

  const cartCount = currentUser ? getCartWithProducts().length : 0

  const locations = [...new Set(data.products.filter(p => p.active).map(p => p.location))]

  let filtered = data.products.filter(p => p.active && p.quantity > 0)
  if (search) filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.farmerName.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )
  if (category !== 'All') filtered = filtered.filter(p => p.category === category)
  if (location) filtered = filtered.filter(p => p.location.toLowerCase().includes(location.toLowerCase()))

  filtered = filtered.sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price
    if (sortBy === 'price_desc') return b.price - a.price
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product.id, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const handleBuyNow = () => {
    if (!selectedProduct) return
    addToCart(selectedProduct.id, qty)
    setSelectedProduct(null)
    navigate('buyer-cart')
  }

  const openProduct = (p: Product) => {
    setSelectedProduct(p)
    setQty(1)
  }

  const farmerUser = selectedProduct ? data.users.find(u => u.id === selectedProduct.farmerId) : null

  return (
    <Layout title="Marketplace">
      <div style={{ maxWidth: 1200 }}>
        {/* Search & filter bar */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              className="input-field"
              placeholder="Search products, farmers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: '1 1 200px', maxWidth: 300 }}
            />
            <select className="input-field" value={category} onChange={e => setCategory(e.target.value as any)} style={{ flex: '0 0 160px' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input-field" value={location} onChange={e => setLocation(e.target.value)} style={{ flex: '0 0 180px' }}>
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="input-field" value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ flex: '0 0 160px' }}>
              <option value="newest">🆕 Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <button className="btn-outline btn-sm" onClick={() => { setSearch(''); setCategory('All'); setLocation(''); setSortBy('newest') }}>
              Clear
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
          {cartCount > 0 && (
            <button className="btn-primary btn-sm" onClick={() => navigate('buyer-cart')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Cart ({cartCount})
              </span>
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, color: 'var(--forest)', marginTop: 12 }}>No products found</h3>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {filtered.map(p => (
              <div key={p.id} className="product-card" style={{ cursor: 'pointer' }} onClick={() => openProduct(p)}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: '100%', height: 170, objectFit: 'cover' }}
                    onError={e => (e.currentTarget.src = getProductImage('default'))}
                  />
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavorite(p.id) }}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                      width: 32, height: 32, cursor: 'pointer', fontSize: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {isFavorite(p.id) ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#DC2626" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    )}
                  </button>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                    padding: '20px 10px 8px'
                  }}>
                    <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11, padding: '2px 8px', borderRadius: 12, backdropFilter: 'blur(4px)' }}>
                      {p.category}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '14px 16px 16px' }}>
                  <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--dark)', marginBottom: 4 }}>{p.name}</h4>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      {p.farmerName}
                    </span>
                    <span>·</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {p.location}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--forest)' }}>₱{p.price}<span style={{ fontSize: 13, fontWeight: 500 }}>/{p.unit}</span></span>
                    <span style={{ fontSize: 12, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
                      </svg>
                      {p.quantity} {p.unit} avail.
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ color: '#D97706', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      {p.rating > 0 ? p.rating.toFixed(1) : 'New'}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{p.sold} sold</span>
                  </div>
                  <button
                    className={addedId === p.id ? 'btn-gold' : 'btn-primary'}
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={e => handleAddToCart(p, e)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      {addedId === p.id ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><path d="M7 12l4 4 6-7"/>
                          </svg>
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedProduct(null)}>
            <div className="modal" style={{ maxWidth: 680 }}>
              <button onClick={() => setSelectedProduct(null)} style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%',
                width: 32, height: 32, cursor: 'pointer', fontSize: 16
              }}>×</button>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{ width: '100%', maxWidth: 280, height: 200, objectFit: 'cover', borderRadius: 12 }}
                  onError={e => (e.currentTarget.src = getProductImage('default'))}
                />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <span style={{ background: '#EFF6FF', color: '#1D4ED8', borderRadius: 6, fontSize: 12, padding: '2px 10px', fontWeight: 600 }}>
                    {selectedProduct.category}
                  </span>
                  <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, marginTop: 8, marginBottom: 4, color: 'var(--dark)' }}>{selectedProduct.name}</h2>
                  <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: 'var(--forest)' }}>
                    ₱{selectedProduct.price}<span style={{ fontSize: 16, fontWeight: 500 }}>/{selectedProduct.unit}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', margin: '6px 0 12px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#D97706' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      {selectedProduct.rating > 0 ? selectedProduct.rating.toFixed(1) : 'New'}
                    </span>
                    <span>·</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
                      </svg>
                      {selectedProduct.quantity} {selectedProduct.unit} available
                    </span>
                    <span>· {selectedProduct.sold} sold</span>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--dark)', marginBottom: 12 }}>
                    <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      <strong>{selectedProduct.farmerName}</strong>
                    </div>
                    {farmerUser && <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                      ⭐ {farmerUser.rating.toFixed(1)} rating · {farmerUser.completedOrders} completed orders
                    </div>}
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {selectedProduct.location}
                    </div>
                    {selectedProduct.harvestDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 8C8 10 5.9 16.17 3.82 19.11M8 10V5m0 5-2-2m2 2 2-2M17 8l2-2M17 8l-2-2"/>
                        </svg>
                        Harvested: {new Date(selectedProduct.harvestDate).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedProduct.description && (
                <div style={{ margin: '16px 0', padding: 14, background: 'var(--bg)', borderRadius: 8, fontSize: 14, color: 'var(--dark)', lineHeight: 1.6 }}>
                  {selectedProduct.description}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: 18 }}>−</button>
                  <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(selectedProduct.quantity, q + 1))}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: 18 }}>+</button>
                </div>
                <span style={{ fontSize: 14, color: 'var(--muted)' }}>= ₱{(selectedProduct.price * qty).toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { addToCart(selectedProduct.id, qty); setSelectedProduct(null) }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                  </span>
                </button>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleBuyNow}>
                  Buy Now
                </button>
                <button className="btn-outline btn-sm" onClick={() => {
                  setSelectedProduct(null)
                  navigate('buyer-messages')
                }}>
                  Message Farmer
                </button>
                <button onClick={() => toggleFavorite(selectedProduct.id)}
                  style={{ padding: '10px 16px', background: 'none', border: '1.5px solid var(--border)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isFavorite(selectedProduct.id) ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#DC2626" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
