import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import type { Order } from '../../types'

export default function BuyerCheckout() {
  const { currentUser, getCartWithProducts, createOrder, navigate } = useApp()
  const cartItems = getCartWithProducts()
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)
  const [form, setForm] = useState({
    deliveryAddress: currentUser?.address ?? '',
    contactNumber: currentUser?.phone ?? '',
    paymentMethod: 'Cash on Delivery',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!currentUser) return null

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const deliveryFee = cartItems.length > 0 ? 80 + Math.floor(subtotal / 1000) * 20 : 0
  const total = subtotal + deliveryFee

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.deliveryAddress.trim()) return setError('Delivery address is required')
    if (!form.contactNumber.trim()) return setError('Contact number is required')
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 800))
    const order = createOrder(form.deliveryAddress, form.contactNumber, form.paymentMethod)
    if (order) {
      setCompletedOrder(order)
    } else {
      setError('Failed to place order. Please try again.')
    }
    setLoading(false)
  }

  // Order success screen
  if (completedOrder) {
    return (
      <Layout title="Order Placed">
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', paddingTop: 20 }}>
          <div className="card" style={{ padding: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M7 12l4 4 6-7"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: 'var(--forest)', marginTop: 12, marginBottom: 8 }}>
              Order Successfully Placed!
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 24 }}>
              Your order has been submitted to the farmer. They will confirm it shortly.
            </p>
            <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>Order Number</span>
                <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: 14 }}>{completedOrder.orderNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>Total Amount</span>
                <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 20, color: 'var(--forest)' }}>₱{completedOrder.total.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>Payment Method</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{completedOrder.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>Delivery To</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{completedOrder.deliveryAddress}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => navigate('buyer-orders')}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
                  </svg>
                  Track My Order
                </span>
              </button>
              <button className="btn-outline" onClick={() => navigate('buyer-marketplace')}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Continue Shopping
                </span>
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Layout title="Checkout">
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, color: 'var(--forest)', marginTop: 12 }}>Your cart is empty</h3>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('buyer-marketplace')}>Browse Marketplace</button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Checkout">
      <div style={{ maxWidth: 900 }}>
        <div className="page-header">
          <h2 className="page-title">Checkout</h2>
          <button className="btn-outline btn-sm" onClick={() => navigate('buyer-cart')}>← Back to Cart</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          <form onSubmit={handleSubmit}>
            {/* Delivery Info */}
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Delivery Information
              </h3>
              <div className="form-group">
                <label className="form-label">Buyer Name</label>
                <input className="input-field" value={currentUser.name} disabled style={{ opacity: 0.7 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number *</label>
                <input className="input-field" placeholder="09XXXXXXXXX" value={form.contactNumber} onChange={e => upd('contactNumber', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea className="input-field" rows={3} placeholder="Full delivery address..." value={form.deliveryAddress} onChange={e => upd('deliveryAddress', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Order Notes (optional)</label>
                <input className="input-field" placeholder="Special instructions for the farmer..." value={form.notes} onChange={e => upd('notes', e.target.value)} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Payment Method
              </h3>
              {['Cash on Delivery', 'GCash', 'Bank Transfer'].map(method => (
                <label key={method} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                  borderRadius: 10, border: `1.5px solid ${form.paymentMethod === method ? 'var(--leaf)' : 'var(--border)'}`,
                  marginBottom: 10, cursor: 'pointer',
                  background: form.paymentMethod === method ? '#F0FDF4' : 'white',
                  transition: 'all 0.15s'
                }}>
                  <input type="radio" name="payment" value={method} checked={form.paymentMethod === method} onChange={() => upd('paymentMethod', method)} />
                  {method === 'Cash on Delivery' ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/>
                      <path d="M6 12h.01M18 12h.01"/>
                    </svg>
                  ) : method === 'GCash' ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{method}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {method === 'Cash on Delivery' ? 'Pay when your order arrives' :
                       method === 'GCash' ? 'Pay via GCash digital wallet' :
                       'Pay via bank transfer'}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', padding: 16, fontSize: 16, justifyContent: 'center' }}>
              {loading ? 'Placing order...' : `Place Order · ₱${total.toLocaleString()}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="card" style={{ padding: 24, position: 'sticky', top: 80 }}>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 16 }}>
              Order Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--dark)', flex: 1 }}>{item.product.name} × {item.quantity} {item.product.unit}</span>
                  <span style={{ fontWeight: 600 }}>₱{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
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
        </div>
      </div>
    </Layout>
  )
}
