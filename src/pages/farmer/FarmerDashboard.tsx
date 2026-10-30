import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'

export default function FarmerDashboard() {
  const { currentUser, data, navigate, getNotificationsForUser } = useApp()
  if (!currentUser) return null

  const myProducts = data.products.filter(p => p.farmerId === currentUser.id)
  const myOrders = data.orders.filter(o => o.farmerId === currentUser.id)
  const pendingOrders = myOrders.filter(o => o.status === 'pending')
  const totalSales = myOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  const activeLoan = data.loans.find(l => l.farmerId === currentUser.id && (l.status === 'pending' || l.status === 'under_review' || l.status === 'approved'))
  const notifications = getNotificationsForUser(currentUser.id)

  const stats = [
    { label: 'Total Products', value: myProducts.length, image: 'https://images.unsplash.com/photo-1437252611977-07f74518abd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', color: '#234F1E', page: 'farmer-products' as const },
    { label: 'Active Listings', value: myProducts.filter(p => p.active).length, image: 'https://images.unsplash.com/photo-1485637701894-09ad422f6de6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', color: '#5B8C2A', page: 'farmer-products' as const },
    { label: 'Pending Orders', value: pendingOrders.length, image: 'https://images.unsplash.com/photo-1656543802898-41c8c46683a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', color: '#D97706', page: 'farmer-orders' as const },
    { label: 'Total Sales', value: `₱${totalSales.toLocaleString()}`, image: 'https://images.unsplash.com/photo-1608521704450-893e5ac294fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', color: '#0369A1', page: 'farmer-orders' as const },
  ]

  const recentOrders = myOrders.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  const monthlyData = [
    { month: 'Mar', sales: 8500 },
    { month: 'Apr', sales: 12000 },
    { month: 'May', sales: 9800 },
    { month: 'Jun', sales: 15600 },
    { month: 'Jul', sales: 13200 },
    { month: 'Aug', sales: totalSales > 0 ? totalSales : 18500 },
  ]
  const maxSales = Math.max(...monthlyData.map(d => d.sales))

  return (
    <Layout title="Farmer Dashboard">
      <div style={{ maxWidth: 1100 }}>
        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--forest), var(--leaf))',
          borderRadius: 16, padding: '24px 28px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
        }}>
          <div>
            <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 24, color: 'white', marginBottom: 6 }}>
              Welcome back, {currentUser.name.split(' ')[0]}!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              {currentUser.farmName || 'Your Farm'} · {currentUser.address}
              {currentUser.yearsOfFarming ? ` · ${currentUser.yearsOfFarming} years farming` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn-gold btn-sm" onClick={() => navigate('farmer-products')}>+ Add Product</button>
            <button className="btn-outline btn-sm" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', background: 'transparent' }} onClick={() => navigate('farmer-loans')}>Apply for Loan</button>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card" onClick={() => navigate(s.page)} style={{ cursor: 'pointer', transition: 'transform 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <img src={s.image} alt={s.label} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
              </div>
              <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Sales Chart */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 20 }}>Monthly Sales (₱)</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {monthlyData.map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, color: 'var(--forest)', fontWeight: 700 }}>
                    {d.sales >= 1000 ? `${(d.sales / 1000).toFixed(0)}k` : d.sales}
                  </div>
                  <div style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    background: d.month === 'Aug' ? 'var(--gold)' : 'var(--leaf)',
                    height: `${(d.sales / maxSales) * 90}px`,
                    transition: 'height 0.5s', minHeight: 4
                  }} />
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{d.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Status */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 16 }}>Loan Status</h3>
            {activeLoan ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Amount</span>
                  <span style={{ fontWeight: 700, color: 'var(--dark)' }}>₱{activeLoan.amount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Purpose</span>
                  <span style={{ fontSize: 13, color: 'var(--dark)' }}>{activeLoan.purpose.slice(0, 30)}...</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Status</span>
                  <span className={`badge badge-${activeLoan.status}`}>{activeLoan.status.replace('_', ' ')}</span>
                </div>
                <button className="btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('farmer-loans')}>
                  View Details
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>No active loan application</p>
                <button className="btn-primary btn-sm" onClick={() => navigate('farmer-loans')} style={{ justifyContent: 'center' }}>
                  Apply for Loan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Add Product', page: 'farmer-products' as const, primary: true, img: 'https://images.unsplash.com/photo-1627989147125-a004d05946d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
              { label: 'View Orders', page: 'farmer-orders' as const, primary: false, img: 'https://images.unsplash.com/photo-1523705480679-b5d0cc17a656?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
              { label: 'Messages', page: 'farmer-messages' as const, primary: false, img: 'https://images.unsplash.com/photo-1662974770404-468fd9660389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
              { label: 'Apply for Loan', page: 'farmer-loans' as const, primary: false, img: 'https://images.unsplash.com/photo-1633158829875-e5316a358c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
            ].map(action => (
              <button key={action.label} onClick={() => navigate(action.page)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px 8px 8px', borderRadius: 10, cursor: 'pointer', border: 'none',
                  background: action.primary ? 'var(--forest)' : 'white',
                  boxShadow: action.primary ? 'none' : '0 1px 4px rgba(0,0,0,0.1)',
                  outline: action.primary ? 'none' : '1px solid var(--border)',
                  fontWeight: 700, fontSize: 14,
                  color: action.primary ? 'white' : 'var(--dark)',
                  transition: 'opacity 0.15s',
                }}>
                <img src={action.img} alt={action.label}
                  style={{ width: 32, height: 32, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Recent Orders */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)' }}>Recent Orders</h3>
              <button className="btn-outline btn-sm" onClick={() => navigate('farmer-orders')}>View All</button>
            </div>
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
                  </svg>
                </div>
                <p style={{ marginTop: 8 }}>No orders yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentOrders.map(order => (
                  <div key={order.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px', background: 'var(--bg)', borderRadius: 8
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{order.orderNumber}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{order.buyerName} · {order.items.length} item(s)</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: 14 }}>₱{order.total.toLocaleString()}</div>
                      <span className={`badge badge-${order.status}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 16 }}>Notifications</h3>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--muted)', fontSize: 13 }}>No notifications</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {notifications.slice(0, 5).map(n => (
                  <div key={n.id} style={{
                    padding: 10, background: n.isRead ? 'var(--bg)' : '#F0FDF4',
                    borderRadius: 8, borderLeft: `3px solid ${n.isRead ? 'var(--border)' : 'var(--leaf)'}`
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{n.message.slice(0, 60)}...</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
