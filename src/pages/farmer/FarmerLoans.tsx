import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'

const IcoClock = ({ color }: { color: string }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IcoSearch = ({ color }: { color: string }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcoCheck = ({ color }: { color: string }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IcoX = ({ color }: { color: string }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoCard = () => <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcoLeaf = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
const IcoRuler = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 8.7L8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4z"/><line x1="7.5" y1="10.5" x2="9" y2="12"/><line x1="10.5" y1="7.5" x2="12" y2="9"/><line x1="13.5" y1="4.5" x2="15" y2="6"/></svg>
const IcoCal = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IcoCoin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IcoNote = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const IcoSend = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
const IcoInfo = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>

const STATUS_ICONS: Record<string, (c: string) => JSX.Element> = {
  pending: (c) => <IcoClock color={c} />,
  under_review: (c) => <IcoSearch color={c} />,
  approved: (c) => <IcoCheck color={c} />,
  rejected: (c) => <IcoX color={c} />,
}

export default function FarmerLoans() {
  const { currentUser, data, applyForLoan } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    amount: '', purpose: '', farmSize: '', cropType: '',
    estimatedHarvest: '', expectedIncome: '', loanTerm: '6'
  })

  if (!currentUser) return null
  const myLoans = data.loans.filter(l => l.farmerId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.amount || !form.purpose || !form.farmSize || !form.cropType) return
    applyForLoan({
      farmerId: currentUser.id,
      amount: Number(form.amount),
      purpose: form.purpose.trim(),
      farmSize: form.farmSize.trim(),
      cropType: form.cropType.trim(),
      estimatedHarvest: form.estimatedHarvest,
      expectedIncome: Number(form.expectedIncome) || 0,
      loanTerm: Number(form.loanTerm),
      status: 'pending'
    })
    setForm({ amount: '', purpose: '', farmSize: '', cropType: '', estimatedHarvest: '', expectedIncome: '', loanTerm: '6' })
    setShowForm(false)
    setSuccess('Loan application submitted successfully! A lender will review your application.')
    setTimeout(() => setSuccess(''), 5000)
  }

  const statusInfo: Record<string, { color: string; desc: string }> = {
    pending: { color: '#D97706', desc: 'Your application is waiting for a lender to review it.' },
    under_review: { color: '#1D4ED8', desc: 'A lender is currently reviewing your application.' },
    approved: { color: '#065F46', desc: 'Congratulations! Your loan has been approved.' },
    rejected: { color: '#991B1B', desc: 'Your loan application was not approved.' },
  }

  return (
    <Layout title="Loans">
      <div style={{ maxWidth: 800 }}>
        <div className="page-header">
          <div>
            <h2 className="page-title">Agricultural Loans</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Apply for financing to grow your farm</p>
          </div>
          {!showForm && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Apply for Loan</button>
          )}
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {/* Info banner */}
        <div className="alert alert-info" style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <IcoInfo /><span><strong>SAKALINK Loans</strong> — Connect with lenders who will review your application and provide agricultural financing based on your farm data and crop projections.</span>
        </div>

        {/* Application Form */}
        {showForm && (
          <div className="card" style={{ padding: 28, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 18, color: 'var(--forest)' }}>Loan Application</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted)' }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Loan Amount (₱) *</label>
                  <input className="input-field" type="number" min="1000" placeholder="e.g. 50000" value={form.amount} onChange={e => upd('amount', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Loan Term (months)</label>
                  <select className="input-field" value={form.loanTerm} onChange={e => upd('loanTerm', e.target.value)}>
                    {[3, 6, 12, 18, 24].map(m => <option key={m} value={m}>{m} months</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Purpose *</label>
                <textarea className="input-field" rows={3} placeholder="Describe how you will use this loan..." value={form.purpose} onChange={e => upd('purpose', e.target.value)} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Farm Size *</label>
                  <input className="input-field" placeholder="e.g. 2.5 hectares" value={form.farmSize} onChange={e => upd('farmSize', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Crop Type *</label>
                  <input className="input-field" placeholder="e.g. Rice, Corn, Vegetables" value={form.cropType} onChange={e => upd('cropType', e.target.value)} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Estimated Harvest Date</label>
                  <input className="input-field" type="date" value={form.estimatedHarvest} onChange={e => upd('estimatedHarvest', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Income (₱)</label>
                  <input className="input-field" type="number" placeholder="e.g. 120000" value={form.expectedIncome} onChange={e => upd('expectedIncome', e.target.value)} />
                </div>
              </div>

              <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 13, color: 'var(--muted)', display: 'flex', gap: 8 }}>
                <IcoNote /><span><strong>Note:</strong> Please provide accurate information. Lenders will review your farm data, crop type, and expected income before making a decision. You may be contacted for additional documents.</span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}><IcoSend /> Submit Application</button>
              </div>
            </form>
          </div>
        )}

        {/* Loan History */}
        <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 18, color: 'var(--forest)', marginBottom: 16 }}>
          My Loan Applications ({myLoans.length})
        </h3>

        {myLoans.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}><IcoCard /></div>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, color: 'var(--forest)', marginTop: 12 }}>No loan applications</h3>
            <p style={{ color: 'var(--muted)', marginTop: 8, marginBottom: 20 }}>Apply for agricultural financing to grow your farm.</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>Apply Now</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {myLoans.map(loan => {
              const info = statusInfo[loan.status]
              return (
                <div key={loan.id} className="card" style={{ padding: 24, borderLeft: `4px solid ${info.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ display: 'flex' }}>{STATUS_ICONS[loan.status]?.(info.color)}</span>
                        <div>
                          <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 24, color: info.color }}>
                            ₱{loan.amount.toLocaleString()}
                          </span>
                          <span className={`badge badge-${loan.status}`} style={{ marginLeft: 10 }}>{loan.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--dark)', marginBottom: 8 }}><strong>Purpose:</strong> {loan.purpose}</p>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IcoLeaf /> Crop: {loan.cropType}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IcoRuler /> Size: {loan.farmSize}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IcoCal /> Term: {loan.loanTerm} months</span>
                        {loan.expectedIncome > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IcoCoin /> Expected: ₱{loan.expectedIncome.toLocaleString()}</span>}
                      </div>
                      {loan.rejectionReason && (
                        <div className="alert alert-error" style={{ marginTop: 10 }}>
                          <strong>Rejection Reason:</strong> {loan.rejectionReason}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                        {info.desc}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--muted)' }}>
                      Applied: {new Date(loan.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
