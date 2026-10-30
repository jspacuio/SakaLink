import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const IcoPin = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IcoCard = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcoChat = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const IcoBox = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l6 3.46a2 2 0 0 0 2 0l6-3.46A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
import Layout from '../../components/Layout'
import type { OrderStatus } from '../../types'

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered']

const STATUS_ACTIONS: Record<OrderStatus, { next: OrderStatus; label: string } | null> = {
  pending: { next: 'confirmed', label: 'Confirm Order' },
  confirmed: { next: 'preparing', label: 'Mark Preparing' },
  preparing: { next: 'shipped', label: 'Mark Shipped' },
  shipped: { next: 'delivered', label: 'Mark Delivered' },
  delivered: null,
  cancelled: null,
}

export default function FarmerOrders() {
  const { currentUser, data, updateOrderStatus, navigate } = useApp()
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  if (!currentUser) return null
  const myOrders = data.orders
    .filter(o => o.farmerId === currentUser.id)
    .filter(o => filterStatus === 'all' || o.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const allMyOrders = data.orders.filter(o => o.farmerId === currentUser.id)
  const counts: Record<string, number> = { all: allMyOrders.length }
  STATUS_FLOW.concat(['cancelled']).forEach(s => {
    counts[s] = allMyOrders.filter(o => o.status === s).length
  })

  const selected = selectedOrder ? data.orders.find(o => o.id === selectedOrder) : null

  return (
    <Layout title="Orders">
      <div style={{ maxWidth: 1000 }}>
        <div className="page-header">
          <h2 className="page-title">Manage Orders</h2>
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
              {s === 'all' ? `All (${counts.all})` : `${s} (${counts[s] ?? 0})`}
            </button>
          ))}
        </div>

        {myOrders.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}><IcoBox /></div>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, color: 'var(--forest)', marginTop: 12 }}>No orders found</h3>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>
              {filterStatus === 'all' ? "You haven't received any orders yet." : `No ${filterStatus} orders.`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {myOrders.map(order => {
              const action = STATUS_ACTIONS[order.status]
              return (
                <div key={order.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--forest)' }}>{order.orderNumber}</span>
                        <span className={`badge badge-${order.status}`}>{order.status}</span>
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--dark)', marginBottom: 4 }}>
                        <strong>Buyer:</strong> {order.buyerName} · {order.contactNumber}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <IcoPin />{order.deliveryAddress}
                        <span style={{ opacity: 0.4 }}>·</span>
                        <IcoCard />{order.paymentMethod}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {order.items.map(item => (
                          <div key={item.productId} style={{ fontSize: 13, color: 'var(--dark)' }}>
                            • {item.productName} × {item.quantity} {item.unit} = ₱{(item.price * item.quantity).toLocaleString()}
                          </div>
                        ))}
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
                        <button className="btn-outline btn-sm" onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}>
                          {selectedOrder === order.id ? 'Hide Timeline' : 'View Timeline'}
                        </button>
                        {action && (
                          <button className="btn-primary btn-sm" onClick={() => updateOrderStatus(order.id, action.next)}>
                            {action.label}
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button className="btn-danger btn-sm" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                            Cancel
                          </button>
                        )}
                        <button className="btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }} onClick={() => navigate('farmer-messages')}>
                          <IcoChat /> Chat
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  {selectedOrder === order.id && (
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Order Timeline</h4>
                      <div className="order-timeline">
                        {STATUS_FLOW.map((step, idx) => {
                          const orderIdx = STATUS_FLOW.indexOf(order.status)
                          const isCompleted = idx < orderIdx
                          const isActive = step === order.status
                          return (
                            <div key={step} className="timeline-step">
                              <div className={`timeline-dot ${isActive ? 'active' : isCompleted ? 'completed' : ''}`} />
                              <div style={{ paddingBottom: 4 }}>
                                <div style={{ fontSize: 14, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--forest)' : isCompleted ? 'var(--leaf)' : 'var(--muted)' }}>
                                  {step.charAt(0).toUpperCase() + step.slice(1)}
                                </div>
                                {isActive && (
                                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                                    {new Date(order.updatedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                        {order.status === 'cancelled' && (
                          <div className="timeline-step">
                            <div className="timeline-dot" style={{ background: '#DC2626', boxShadow: '0 0 0 2px #DC2626' }} />
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#DC2626' }}>Cancelled</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
