import { useState } from 'react'
import type React from 'react'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import type { UserRole } from '../../types'

type AdminTab = 'overview' | 'users' | 'products' | 'orders' | 'loans'

export default function AdminDashboard() {
  const { data, currentUser, deleteUser, updateProduct, navigate } = useApp()
  const [tab, setTab] = useState<AdminTab>('overview')
  const [success, setSuccess] = useState('')
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<string | null>(null)

  if (!currentUser) return null

  const farmers = data.users.filter(u => u.role === 'farmer')
  const buyers = data.users.filter(u => u.role === 'buyer')
  const lenders = data.users.filter(u => u.role === 'lender')
  const activeProducts = data.products.filter(p => p.active)
  const totalRevenue = data.orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0)
  const pendingLoans = data.loans.filter(l => l.status === 'pending' || l.status === 'under_review')

  const overviewStats = [
    { label: 'Total Users', value: data.users.length, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#234F1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: '#234F1E' },
    { label: 'Farmers', value: farmers.length, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B8C2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.11M8 10V5m0 5-2-2m2 2 2-2M17 8l2-2M17 8l-2-2"/></svg>, color: '#5B8C2A' },
    { label: 'Buyers', value: buyers.length, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>, color: '#1D4ED8' },
    { label: 'Lenders', value: lenders.length, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, color: '#D97706' },
    { label: 'Active Products', value: activeProducts.length, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/></svg>, color: '#065F46' },
    { label: 'Total Orders', value: data.orders.length, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B21B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, color: '#5B21B6' },
    { label: 'Pending Loans', value: pendingLoans.length, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, color: '#DC2626' },
    { label: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#234F1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>, color: '#234F1E' },
  ]

  const handleDeleteUser = (id: string) => {
    if (id === currentUser.id) return
    deleteUser(id)
    setConfirmDeleteUser(null)
    setSuccess('User deleted successfully.')
    setTimeout(() => setSuccess(''), 3000)
  }

  const roleColor: Record<UserRole, string> = {
    farmer: '#5B8C2A', buyer: '#1D4ED8', lender: '#D97706', admin: '#374151'
  }

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { key: 'users', label: 'Users', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { key: 'products', label: 'Products', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.11M8 10V5m0 5-2-2m2 2 2-2M17 8l2-2M17 8l-2-2"/></svg> },
    { key: 'orders', label: 'Orders', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/></svg> },
    { key: 'loans', label: 'Loans', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  ]

  return (
    <Layout title="Admin Dashboard">
      <div style={{ maxWidth: 1200 }}>
        <div className="page-header">
          <div>
            <h2 className="page-title">Admin Dashboard</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Manage all platform data</p>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'white', padding: 6, borderRadius: 12, border: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: tab === t.key ? 'var(--forest)' : 'transparent',
                color: tab === t.key ? 'white' : 'var(--dark)', transition: 'all 0.15s'
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {overviewStats.map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Charts summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 12 }}>User Distribution</h3>
                {[
                  { role: 'Farmers', count: farmers.length, color: '#5B8C2A' },
                  { role: 'Buyers', count: buyers.length, color: '#1D4ED8' },
                  { role: 'Lenders', count: lenders.length, color: '#D97706' },
                ].map(u => (
                  <div key={u.role} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span>{u.role}</span>
                      <span style={{ fontWeight: 700 }}>{u.count}</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4 }}>
                      <div style={{ height: '100%', borderRadius: 4, background: u.color, width: `${(u.count / (data.users.length || 1)) * 100}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 12 }}>Order Status</h3>
                {['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'].map(s => {
                  const count = data.orders.filter(o => o.status === s).length
                  return count > 0 ? (
                    <div key={s} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                      <span style={{ textTransform: 'capitalize' }}>{s}</span>
                      <span className={`badge badge-${s}`}>{count}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 12, overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: 'var(--forest)', color: 'white' }}>
                    {['Name', 'Email', 'Phone', 'Role', 'Location', 'Joined', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user, idx) => (
                    <tr key={user.id} style={{ background: idx % 2 === 0 ? 'white' : 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{user.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted)' }}>{user.email}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>{user.phone}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: roleColor[user.role] + '22', color: roleColor[user.role], padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>{user.address}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)' }}>
                        {new Date(user.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {user.id !== currentUser.id && (
                          <button className="btn-danger btn-sm" onClick={() => setConfirmDeleteUser(user.id)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 12, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: 'var(--forest)', color: 'white' }}>
                  {['Product', 'Farmer', 'Category', 'Price', 'Stock', 'Sold', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.products.map((p, idx) => (
                  <tr key={p.id} style={{ background: idx % 2 === 0 ? 'white' : 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{p.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.farmerName}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.category}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--forest)' }}>₱{p.price}/{p.unit}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.quantity}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.sold}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${p.active ? 'badge-delivered' : 'badge-cancelled'}`}>{p.active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        className="btn-sm"
                        style={{ background: p.active ? '#FEF3C7' : '#D1FAE5', border: 'none', borderRadius: 6, cursor: 'pointer', padding: '4px 10px', fontSize: 12, fontWeight: 600 }}
                        onClick={() => updateProduct(p.id, { active: !p.active })}
                      >
                        {p.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 12, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: 'var(--forest)', color: 'white' }}>
                  {['Order #', 'Buyer', 'Farmer', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...data.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((o, idx) => (
                  <tr key={o.id} style={{ background: idx % 2 === 0 ? 'white' : 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13, color: 'var(--forest)' }}>{o.orderNumber}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{o.buyerName}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{o.farmerName}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--forest)' }}>₱{o.total.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{o.paymentMethod}</td>
                    <td style={{ padding: '12px 16px' }}><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)' }}>
                      {new Date(o.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Loans */}
        {tab === 'loans' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 12, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: 'var(--forest)', color: 'white' }}>
                  {['Farmer', 'Location', 'Amount', 'Crop', 'Term', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...data.loans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((l, idx) => (
                  <tr key={l.id} style={{ background: idx % 2 === 0 ? 'white' : 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{l.farmerName}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{l.farmerLocation}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--forest)' }}>₱{l.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{l.cropType}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{l.loanTerm}mo</td>
                    <td style={{ padding: '12px 16px' }}><span className={`badge badge-${l.status}`}>{l.status.replace('_', ' ')}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)' }}>
                      {new Date(l.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete confirm */}
        {confirmDeleteUser && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 360, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, marginTop: 12, marginBottom: 8 }}>Delete User?</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>This will permanently delete the user account.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDeleteUser(null)}>Cancel</button>
                <button className="btn-danger" style={{ flex: 1 }} onClick={() => handleDeleteUser(confirmDeleteUser)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
