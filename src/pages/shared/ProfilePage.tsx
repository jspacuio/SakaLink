import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'

const IcoEmail = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const IcoPhone = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.7 12.5 19.79 19.79 0 0 1 1.65 3.9 2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const IcoPin = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IcoLeaf = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
const IcoCal = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IcoStar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IcoEdit = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IcoLogout = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>

const FIELD_ICONS: Record<string, JSX.Element> = {
  Email: <IcoEmail />, Phone: <IcoPhone />, Address: <IcoPin />,
  'Farm Name': <IcoLeaf />, 'Years Farming': <IcoCal />, 'Member Since': <IcoCal />,
}

export default function ProfilePage() {
  const { currentUser, updateProfile, logout } = useApp()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    phone: currentUser?.phone ?? '',
    address: currentUser?.address ?? '',
    farmName: currentUser?.farmName ?? '',
    yearsOfFarming: String(currentUser?.yearsOfFarming ?? ''),
  })
  const [success, setSuccess] = useState('')

  if (!currentUser) return null

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      farmName: form.farmName.trim() || undefined,
      yearsOfFarming: parseInt(form.yearsOfFarming) || undefined,
    })
    setEditing(false)
    setSuccess('Profile updated successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const roleColor = currentUser.role === 'farmer' ? 'var(--forest)' : currentUser.role === 'buyer' ? '#1D4ED8' : currentUser.role === 'lender' ? '#D97706' : '#374151'

  return (
    <Layout title="My Profile">
      <div style={{ maxWidth: 600 }}>
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card" style={{ padding: 32 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: 'var(--forest)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 700
            }}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, color: 'var(--dark)' }}>{currentUser.name}</h2>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                <span style={{ background: roleColor, color: 'white', padding: '2px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </span>
                {currentUser.rating > 0 && <span style={{ color: '#D97706', fontSize: 14, display: 'flex', alignItems: 'center', gap: 3 }}><IcoStar /> {currentUser.rating.toFixed(1)}</span>}
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>{currentUser.completedOrders} orders</span>
              </div>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="input-field" value={form.name} onChange={e => upd('name', e.target.value)} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="input-field" value={form.phone} onChange={e => upd('phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="input-field" value={form.address} onChange={e => upd('address', e.target.value)} />
                </div>
              </div>
              {currentUser.role === 'farmer' && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Farm Name</label>
                    <input className="input-field" value={form.farmName} onChange={e => upd('farmName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years of Farming</label>
                    <input className="input-field" type="number" value={form.yearsOfFarming} onChange={e => upd('yearsOfFarming', e.target.value)} />
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Changes</button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Email', value: currentUser.email },
                  { label: 'Phone', value: currentUser.phone },
                  { label: 'Address', value: currentUser.address },
                  ...(currentUser.farmName ? [{ label: 'Farm Name', value: currentUser.farmName }] : []),
                  ...(currentUser.yearsOfFarming ? [{ label: 'Years Farming', value: `${currentUser.yearsOfFarming} years` }] : []),
                  { label: 'Member Since', value: new Date(currentUser.createdAt).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' }) },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: 14, alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                    <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', width: 32, height: 32, justifyContent: 'center', background: '#F0FDF4', borderRadius: 8 }}>{FIELD_ICONS[item.label]}</span>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark)' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setEditing(true)}><IcoEdit /> Edit Profile</button>
                <button className="btn-danger" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 6 }} onClick={logout}><IcoLogout /> Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
