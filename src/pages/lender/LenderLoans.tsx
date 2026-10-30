import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'
import type { LoanStatus } from '../../types'

export default function LenderLoans() {
  const { currentUser, data, updateLoanStatus, selectedLoanId, setSelectedLoanId, navigate } = useApp()
  const [filterStatus, setFilterStatus] = useState<LoanStatus | 'all'>('all')
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectingLoanId, setRejectingLoanId] = useState<string | null>(null)
  const [success, setSuccess] = useState('')

  if (!currentUser) return null

  const loans = data.loans
    .filter(l => filterStatus === 'all' || l.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const selectedLoan = selectedLoanId ? data.loans.find(l => l.id === selectedLoanId) : null
  const selectedFarmer = selectedLoan ? data.users.find(u => u.id === selectedLoan.farmerId) : null

  const counts: Record<string, number> = { all: data.loans.length }
  const statuses: LoanStatus[] = ['pending', 'under_review', 'approved', 'rejected']
  statuses.forEach(s => { counts[s] = data.loans.filter(l => l.status === s).length })

  const handleApprove = (loanId: string) => {
    updateLoanStatus(loanId, 'approved')
    setSelectedLoanId(null)
    setSuccess('Loan approved successfully! The farmer has been notified.')
    setTimeout(() => setSuccess(''), 4000)
  }

  const handleReject = () => {
    if (!rejectingLoanId || !rejectReason.trim()) return
    updateLoanStatus(rejectingLoanId, 'rejected', rejectReason)
    setShowRejectModal(false)
    setRejectReason('')
    setRejectingLoanId(null)
    setSelectedLoanId(null)
    setSuccess('Loan application rejected. The farmer has been notified.')
    setTimeout(() => setSuccess(''), 4000)
  }

  const openReject = (loanId: string) => {
    setRejectingLoanId(loanId)
    setRejectReason('')
    setShowRejectModal(true)
  }

  if (selectedLoan) {
    return (
      <Layout title="Loan Details">
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
            <button className="btn-outline btn-sm" onClick={() => setSelectedLoanId(null)}>← Back</button>
            <h2 className="page-title">Loan Application Review</h2>
          </div>

          {success && <div className="alert alert-success">{success}</div>}

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {/* Farmer Profile */}
            <div className="card" style={{ padding: 24, flex: '0 0 280px' }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Farmer Profile
              </h3>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', background: 'var(--forest)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 700, margin: '0 auto 10px'
                }}>
                  {selectedLoan.farmerName.charAt(0)}
                </div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 18 }}>{selectedLoan.farmerName}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {selectedLoan.farmerLocation}
                </div>
                {selectedFarmer && (
                  <>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.29 2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.95-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16h.41l.11.92z"/>
                      </svg>
                      {selectedFarmer.phone}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      ⭐ {selectedFarmer.rating > 0 ? selectedFarmer.rating.toFixed(1) : 'New'} · {selectedFarmer.completedOrders} orders
                    </div>
                    {selectedFarmer.farmName && (
                      <div style={{ fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 8C8 10 5.9 16.17 3.82 19.11M8 10V5m0 5-2-2m2 2 2-2M17 8l2-2M17 8l-2-2"/>
                        </svg>
                        {selectedFarmer.farmName}
                      </div>
                    )}
                    {selectedFarmer.yearsOfFarming && (
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{selectedFarmer.yearsOfFarming} years farming</div>
                    )}
                  </>
                )}
              </div>

              {/* Farmer's products */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--forest)', marginBottom: 8 }}>Listed Products</div>
                {data.products.filter(p => p.farmerId === selectedLoan.farmerId).slice(0, 3).map(p => (
                  <div key={p.id} style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
                    • {p.name} — ₱{p.price}/{p.unit}
                  </div>
                ))}
              </div>
            </div>

            {/* Loan Details */}
            <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--forest)' }}>Loan Information</h3>
                  <span className={`badge badge-${selectedLoan.status}`}>{selectedLoan.status.replace('_', ' ')}</span>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    { label: 'Requested Amount', value: `₱${selectedLoan.amount.toLocaleString()}`, bold: true },
                    { label: 'Loan Term', value: `${selectedLoan.loanTerm} months` },
                    { label: 'Purpose', value: selectedLoan.purpose },
                    { label: 'Farm Size', value: selectedLoan.farmSize },
                    { label: 'Crop Type', value: selectedLoan.cropType },
                    { label: 'Estimated Harvest', value: selectedLoan.estimatedHarvest ? new Date(selectedLoan.estimatedHarvest).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not specified' },
                    { label: 'Expected Income', value: selectedLoan.expectedIncome > 0 ? `₱${selectedLoan.expectedIncome.toLocaleString()}` : 'Not specified' },
                    { label: 'Application Date', value: new Date(selectedLoan.createdAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 13, color: 'var(--muted)', flex: '0 0 140px' }}>{item.label}</span>
                      <span style={{ fontSize: 14, fontWeight: item.bold ? 800 : 500, color: item.bold ? 'var(--forest)' : 'var(--dark)', textAlign: 'right', flex: 1 }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {selectedLoan.rejectionReason && (
                  <div className="alert alert-error" style={{ marginTop: 12 }}>
                    <strong>Rejection Reason:</strong> {selectedLoan.rejectionReason}
                  </div>
                )}
              </div>

              {/* Income/Repayment Assessment */}
              {selectedLoan.expectedIncome > 0 && (
                <div className="card" style={{ padding: 20 }}>
                  <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, color: 'var(--forest)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    Financial Assessment
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span>Loan Amount</span>
                    <span style={{ fontWeight: 600 }}>₱{selectedLoan.amount.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span>Expected Income</span>
                    <span style={{ fontWeight: 600, color: 'var(--leaf)' }}>₱{selectedLoan.expectedIncome.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                    <span>Income/Loan Ratio</span>
                    <span style={{ fontWeight: 700, color: selectedLoan.expectedIncome / selectedLoan.amount >= 2 ? 'var(--leaf)' : '#D97706' }}>
                      {(selectedLoan.expectedIncome / selectedLoan.amount).toFixed(1)}x
                      {selectedLoan.expectedIncome / selectedLoan.amount >= 2 ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><path d="M7 12l4 4 6-7"/>
                          </svg>
                          Good
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                          Review
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              {(selectedLoan.status === 'pending' || selectedLoan.status === 'under_review') && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center', padding: 14, fontSize: 15, background: '#065F46' }}
                    onClick={() => handleApprove(selectedLoan.id)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M7 12l4 4 6-7"/>
                      </svg>
                      Approve Loan
                    </span>
                  </button>
                  <button
                    className="btn-danger"
                    style={{ flex: 1, padding: 14, fontSize: 15 }}
                    onClick={() => openReject(selectedLoan.id)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      Reject Application
                    </span>
                  </button>
                </div>
              )}
              {selectedLoan.status === 'pending' && (
                <button className="btn-outline btn-sm" style={{ justifyContent: 'center' }}
                  onClick={() => updateLoanStatus(selectedLoan.id, 'under_review')}>
                  Mark as Under Review
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 440 }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 18, color: '#DC2626', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Reject Loan Application
              </h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
                Please provide a reason for rejection. This will be sent to the farmer.
              </p>
              <div className="form-group">
                <label className="form-label">Reason for Rejection *</label>
                <textarea
                  className="input-field" rows={4}
                  placeholder="e.g., Insufficient farm data, high risk crop, documentation incomplete..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowRejectModal(false)}>Cancel</button>
                <button className="btn-danger" style={{ flex: 1 }} onClick={handleReject} disabled={!rejectReason.trim()}>Confirm Rejection</button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    )
  }

  return (
    <Layout title="Loan Requests">
      <div style={{ maxWidth: 1000 }}>
        <div className="page-header">
          <h2 className="page-title">Loan Applications</h2>
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {/* Filter */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {(['all', ...statuses] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: filterStatus === s ? '#92400E' : 'white',
                color: filterStatus === s ? 'white' : 'var(--dark)',
                border: filterStatus === s ? 'none' : '1px solid var(--border)'
              }}>
              {s === 'all' ? `All (${counts.all})` : `${s.replace('_', ' ')} (${counts[s] ?? 0})`}
            </button>
          ))}
        </div>

        {loans.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, color: 'var(--forest)', marginTop: 12 }}>No loan applications</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {loans.map(loan => (
              <div key={loan.id} className="card" style={{ padding: 20, borderLeft: `4px solid ${loan.status === 'approved' ? 'var(--leaf)' : loan.status === 'rejected' ? '#DC2626' : loan.status === 'under_review' ? '#1D4ED8' : '#D97706'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{loan.farmerName}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
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
                      <span>· {loan.farmSize}</span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--dark)', marginBottom: 8 }}>
                      {loan.purpose.slice(0, 80)}{loan.purpose.length > 80 ? '...' : ''}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      Applied: {new Date(loan.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {loan.expectedIncome > 0 && ` · Expected Income: ₱${loan.expectedIncome.toLocaleString()}`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 24, color: 'var(--forest)' }}>
                      ₱{loan.amount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{loan.loanTerm} months</div>
                    <span className={`badge badge-${loan.status}`}>{loan.status.replace('_', ' ')}</span>
                    <div style={{ marginTop: 10, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="btn-primary btn-sm" onClick={() => { setSelectedLoanId(loan.id); navigate('lender-loan-detail') }}>
                        Review →
                      </button>
                      {loan.status === 'pending' && (
                        <button className="btn-sm" style={{ background: '#065F46', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', padding: '6px 12px', fontSize: 12, fontWeight: 600 }}
                          onClick={() => handleApprove(loan.id)}>
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showRejectModal && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 440 }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 18, color: '#DC2626', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Reject Application
              </h3>
              <div className="form-group">
                <label className="form-label">Reason for Rejection *</label>
                <textarea className="input-field" rows={4} placeholder="Reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowRejectModal(false)}>Cancel</button>
                <button className="btn-danger" style={{ flex: 1 }} onClick={handleReject} disabled={!rejectReason.trim()}>Reject</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
