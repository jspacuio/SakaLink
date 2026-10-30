import { useState } from 'react'
import type React from 'react'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import type { OrderStatus } from '../../types'

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered']

export default function BuyerOrders() {
  const { currentUser, data, navigate } = useApp()
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  if (!currentUser) return null
  const myOrders = data.orders
    .filter(o => o.buyerId === currentUser.id)
    .filter(o => filterStatus === 'all' || o.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const allMyOrders = data.orders.filter(o => o.buyerId === currentUser.id)
  const counts: Record<string, number> = { all: allMyOrders.length }
  STATUS_FLOW.concat(['cancelled']).forEach(s => {
    counts[s] = allMyOrders.filter(o => o.status === s).length
  })

  const statusIcon: Record<string, React.ReactNode> = {
    pending: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    confirmed: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M7 12l4 4 6-7"/></svg>,
    preparing: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
    shipped: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    delivered: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    cancelled: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  }

  return (
    <Layout title="My Orders">
      <div style={{ maxWidth: 900 }}>
        <div className="page-header">
          <h2 className="page-title">My Orders</h2>
          <button className="btn-outline btn-sm" onClick={() => navigate('buyer-marketplace')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Shop More
            </span>
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {(['all', ...STATUS_FLOW, 'cancelled'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: filterStatus === s ? 'var(--forest)' : 'white',
                color: filterStatus === s ? 'white' : 'var(--dark)',
                border: filterStatus === s ? 'none' : '1px solid var(--border)'
              }}>
              {s === 'all' ? `All (${counts.all})` : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{statusIcon[s]} {s} ({counts[s] ?? 0})</span>}
            </button>
          ))}
        </div>

        {myOrders.length === 0 ? (
          <div className="card" style={{ padding: 64, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
                <path d="M12 12v4M10 14h4"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, color: 'var(--forest)', marginTop: 16 }}>
              {filterStatus === 'all' ? "You don't have any orders yet." : `No ${filterStatus} orders.`}
            </h3>
            <p style={{ color: 'var(--muted)', marginTop: 8, marginBottom: 20 }}>
              {filterStatus === 'all' ? 'Start shopping to see your orders here!' : ''}
            </p>
            {filterStatus === 'all' && (
              <button className="btn-primary" onClick={() => navigate('buyer-marketplace')}>Browse Marketplace</button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {myOrders.map(order => (
              <div key={order.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>{statusIcon[order.status]}</span>
                      <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--forest)' }}>{order.orderNumber}</span>
                      <span className={`badge badge-${order.status}`}>{order.status}</span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--dark)', marginBottom: 6, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      Farmer: <strong>{order.farmerName}</strong>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 8 }}>
                      {order.items.map(item => (
                        <div key={item.productId} style={{ fontSize: 13, color: 'var(--muted)' }}>
                          • {item.productName} × {item.quantity} {item.unit}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {order.deliveryAddress}
                      </span>
                      {' · '}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, color: 'var(--forest)' }}>
                      ₱{order.total.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                      {new Date(order.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        className="btn-outline btn-sm"
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      >
                        {selectedOrder === order.id ? 'Hide Timeline' : 'Track Order'}
                      </button>
                      <button className="btn-outline btn-sm" onClick={() => navigate('buyer-messages')}>
                        Contact Farmer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Timeline */}
                {selectedOrder === order.id && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Order Status Timeline</h4>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      {STATUS_FLOW.map((step, idx) => {
                        const orderIdx = order.status === 'cancelled' ? -1 : STATUS_FLOW.indexOf(order.status)
                        const isCompleted = idx <= orderIdx
                        const isActive = step === order.status
                        return (
                          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              background: isActive ? 'var(--gold)' : isCompleted ? 'var(--forest)' : 'var(--bg)',
                              border: `2px solid ${isActive ? 'var(--gold)' : isCompleted ? 'var(--forest)' : 'var(--border)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 16
                            }}>
                              {isCompleted ? (isActive ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                </svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12l5 5L20 7"/>
                                </svg>
                              )) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="9"/>
                                </svg>
                              )}
                            </div>
                            <div style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--forest)' : isCompleted ? 'var(--leaf)' : 'var(--muted)', textAlign: 'center' }}>
                              {step}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {order.status === 'cancelled' && (
                      <div style={{ textAlign: 'center', marginTop: 12, color: '#DC2626', fontWeight: 600, fontSize: 14 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                          This order was cancelled
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
