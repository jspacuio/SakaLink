import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import { getProductImage } from '../../store'

export default function BuyerFavorites() {
  const { currentUser, data, toggleFavorite, addToCart, navigate } = useApp()
  if (!currentUser) return null

  const favoriteIds = data.favorites.filter(f => f.buyerId === currentUser.id).map(f => f.productId)
  const favorites = data.products.filter(p => favoriteIds.includes(p.id))

  if (favorites.length === 0) {
    return (
      <Layout title="Favorites">
        <div style={{ maxWidth: 700 }}>
          <div className="card" style={{ padding: 64, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 24, color: 'var(--forest)', marginTop: 16, marginBottom: 8 }}>
              No favorites yet
            </h3>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
              Heart products in the marketplace to save them here.
            </p>
            <button className="btn-primary" onClick={() => navigate('buyer-marketplace')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8C8 10 5.9 16.17 3.82 19.11M8 10V5m0 5-2-2m2 2 2-2M17 8l2-2M17 8l-2-2"/>
                </svg>
                Browse Marketplace
              </span>
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Favorites">
      <div style={{ maxWidth: 1100 }}>
        <div className="page-header">
          <h2 className="page-title">My Favorites</h2>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>{favorites.length} saved product{favorites.length !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {favorites.map(p => (
            <div key={p.id} className="product-card">
              <div style={{ position: 'relative' }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: '100%', height: 160, objectFit: 'cover' }}
                  onError={e => (e.currentTarget.src = getProductImage('default'))}
                />
                <button
                  onClick={() => toggleFavorite(p.id)}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                    width: 32, height: 32, cursor: 'pointer', fontSize: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#DC2626" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
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
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{p.quantity} avail.</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => { addToCart(p.id, 1); navigate('buyer-cart') }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      Add to Cart
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
