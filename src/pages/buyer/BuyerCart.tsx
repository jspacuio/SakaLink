import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import { getProductImage } from '../../store'

export default function BuyerCart() {
  const { getCartWithProducts, removeFromCart, updateCartQty, navigate } = useApp()
  const cartItems = getCartWithProducts()

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const deliveryFee = cartItems.length > 0 ? 80 + Math.floor(subtotal / 1000) * 20 : 0
  const total = subtotal + deliveryFee

  if (cartItems.length === 0) {
    return (
      <Layout title="Shopping Cart">
        <div style={{ maxWidth: 700 }}>
          <div className="card" style={{ padding: 64, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 24, color: 'var(--forest)', marginTop: 16, marginBottom: 8 }}>
              Your cart is empty
            </h3>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Browse the marketplace and add fresh products to your cart.</p>
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
    <Layout title="Shopping Cart">
      <div style={{ maxWidth: 900 }}>
        <div className="page-header">
          <h2 className="page-title">Shopping Cart</h2>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Cart items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cartItems.map(item => (
              <div key={item.id} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                  onError={e => (e.currentTarget.src = getProductImage('default'))}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, marginBottom: 4, color: 'var(--dark)' }}>
                    {item.product.name}
                  </h4>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      {item.product.farmerName}
                    </span>
                    <span>·</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {item.product.location}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--forest)' }}>
                    ₱{item.product.price}/{item.product.unit}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, color: 'var(--forest)' }}>
                    ₱{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity - 1)}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >−</button>
                    <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.quantity}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                      Remove
                    </span>
                  </button>
                </div>
              </div>
            ))}

            <button className="btn-outline btn-sm" onClick={() => navigate('buyer-marketplace')} style={{ alignSelf: 'flex-start' }}>
              ← Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="card" style={{ padding: 24, position: 'sticky', top: 80 }}>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 18, color: 'var(--forest)', marginBottom: 16 }}>
              Order Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--dark)' }}>
                  <span>{item.product.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>₱{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₱{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
                  <span>Delivery Fee</span>
                  <span style={{ fontWeight: 600 }}>₱{deliveryFee}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                    <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, color: 'var(--forest)' }}>₱{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '14px', fontSize: 15 }}
              onClick={() => navigate('buyer-checkout')}
            >
              Proceed to Checkout
            </button>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
              Secure checkout · Multiple payment options
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
