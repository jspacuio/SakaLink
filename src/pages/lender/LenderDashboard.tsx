import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'

export default function LenderDashboard() {
  const { currentUser, data, navigate, setSelectedLoanId, updateLoanStatus, getNotificationsForUser } = useApp()
  if (!currentUser) return null

  const allLoans = data.loans
  const pendingLoans = allLoans.filter(l => l.status === 'pending')
  const underReviewLoans = allLoans.filter(l => l.status === 'under_review')
  const approvedLoans = allLoans.filter(l => l.status === 'approved' && l.lenderId === currentUser.id)
  const totalFunded = approvedLoans.reduce((sum, l) => sum + l.amount, 0)
  const notifications = getNotificationsForUser(currentUser.id)
  const unread = notifications.filter(n => !n.isRead)

  const stats = [
    { label: 'Pending Applications', value: pendingLoans.length, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, color: '#D97706' },
    { label: 'Under Review', value: underReviewLoans.length, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, color: '#1D4ED8' },
    { label: 'My Approved Loans', value: approvedLoans.length, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M7 12l4 4 6-7"/></svg>, color: '#065F46' },
    { label: 'Total Amount Funded', value: `₱${totalFunded.toLocaleString()}`, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#234F1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, color: '#234F1E' },
  ]

  const recentApps = [...pendingLoans, ...underReviewLoans]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <Layout title="Lender Dashboard">
      <div style={{ maxWidth: 1100 }}>
        {/* Welcome */}
        <div style={{
          background: 'linear-gradient(135deg, #92400E, #D97706)',
          borderRadius: 16, padding: '24px 28px', marginBottom: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
        }}>
          <div>
            <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 24, color: 'white', marginBottom: 4 }}>
              Welcome, {currentUser.name.split(' ')[0]}!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              Review loan applications and support Philippine farmers
            </p>
          </div>
          <button className="btn-gold btn-sm" onClick={() => navigate('lender-loans')}>
            Review Applications
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
              </div>
              <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Recent Applications */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)' }}>
                Pending Loan Applications
              </h3>
              <button className="btn-outline btn-sm" onClick={() => navigate('lender-loans')}>View All</button>
            </div>

            {recentApps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M7 12l4 4 6-7"/>
                  </svg>
                </div>
                <p style={{ marginTop: 8 }}>No pending applications</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentApps.map(loan => (
                  <div key={loan.id} style={{
                    padding: 16, background: 'var(--bg)', borderRadius: 10,
                    borderLeft: `4px solid ${loan.status === 'pending' ? '#D97706' : '#1D4ED8'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{loan.farmerName}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            {loan.farmerLocation}
                          </span>
                          <span>·</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 8C8 10 5.9 16.17 3.82 19.11M8 10V5m0 5-2-2m2 2 2-2M17 8l2-2M17 8l-2-2"/>
                            </svg>
                            {loan.cropType}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                          {loan.purpose.slice(0, 60)}{loan.purpose.length > 60 ? '...' : ''}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 20, color: 'var(--forest)' }}>
                          ₱{loan.amount.toLocaleString()}
                        </div>
                        <span className={`badge badge-${loan.status}`}>{loan.status.replace('_', ' ')}</span>
                        <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button className="btn-primary btn-sm" onClick={() => {
                            setSelectedLoanId(loan.id)
                            navigate('lender-loan-detail')
                          }}>
                            Review
                          </button>
                          {loan.status === 'pending' && (
                            <button className="btn-sm" style={{ background: '#DBEAFE', border: 'none', borderRadius: 8, cursor: 'pointer', padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#1E40AF' }}
                              onClick={() => updateLoanStatus(loan.id, 'under_review')}>
                              Start Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 16 }}>
              Notifications {unread.length > 0 && <span className="badge badge-pending" style={{ marginLeft: 8 }}>{unread.length}</span>}
            </h3>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--muted)', fontSize: 13 }}>No notifications</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {notifications.slice(0, 6).map(n => (
                  <div key={n.id} style={{
                    padding: 10, borderRadius: 8,
                    background: n.isRead ? 'var(--bg)' : '#FFFBEB',
                    borderLeft: `3px solid ${n.isRead ? 'var(--border)' : '#D97706'}`
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{n.message}</div>
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
