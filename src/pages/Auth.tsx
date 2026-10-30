import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { UserRole } from '../types'
import logo1 from '../imports/1.png'
import logoText from '../imports/4-1.png'

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const { login, register, navigate } = useApp()
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    address: '', role: 'farmer' as UserRole, farmName: '', yearsOfFarming: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const demoAccounts = [
    { label: 'Farmer Demo', email: 'farmer@sakalink.test' },
    { label: 'Buyer Demo', email: 'buyer@sakalink.test' },
    { label: 'Lender Demo', email: 'lender@sakalink.test' },
    { label: 'Admin Demo', email: 'admin@sakalink.test' },
  ]

  const fillDemo = (email: string) => {
    setForm(f => ({ ...f, email, password: 'password123' }))
    setError('')
  }

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 300)) // small delay for UX

    if (isLogin) {
      const result = login(form.email, form.password)
      if (!result.ok) setError(result.error ?? 'Login failed')
    } else {
      if (!form.name.trim()) return setError('Full name is required'), setLoading(false)
      if (!form.email.includes('@')) return setError('Enter a valid email'), setLoading(false)
      if (form.password.length < 6) return setError('Password must be at least 6 characters'), setLoading(false)
      if (form.password !== form.confirmPassword) return setError('Passwords do not match'), setLoading(false)
      if (!form.phone.trim()) return setError('Phone number is required'), setLoading(false)
      if (!form.address.trim()) return setError('Address is required'), setLoading(false)

      const result = register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        address: form.address.trim(),
        role: form.role,
        farmName: form.role === 'farmer' ? form.farmName || form.name + "'s Farm" : undefined,
        yearsOfFarming: form.role === 'farmer' ? parseInt(form.yearsOfFarming) || 1 : undefined,
      })
      if (!result.ok) setError(result.error ?? 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <button onClick={() => navigate('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
              <img src={logo1} alt="SAKALINK" style={{ width: 52, height: 52, objectFit: 'contain' }} />
              <img src={logoText} alt="SAKALINK" style={{ height: 42, objectFit: 'contain', marginLeft: -8 }} />
            </div>
          </button>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Connecting Farmers, Buyers, and Lenders</p>
        </div>

        <div className="card" style={{ padding: '32px 28px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg)', borderRadius: 10, padding: 4 }}>
            {['Login', 'Register'].map((tab, i) => (
              <button key={tab} onClick={() => { setIsLogin(i === 0); setError('') }}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: (isLogin ? i === 0 : i === 1) ? 'white' : 'transparent',
                  fontWeight: 700, fontSize: 14, color: (isLogin ? i === 0 : i === 1) ? 'var(--forest)' : 'var(--muted)',
                  boxShadow: (isLogin ? i === 0 : i === 1) ? 'var(--shadow)' : 'none',
                  transition: 'all 0.2s'
                }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Demo accounts (login only) */}
          {isLogin && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Quick Demo Login:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {demoAccounts.map(d => (
                  <button key={d.email} onClick={() => fillDemo(d.email)}
                    style={{
                      padding: '7px 10px', background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--dark)',
                      transition: 'background 0.15s'
                    }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="input-field" placeholder="e.g. Juan dela Cruz" value={form.name} onChange={e => update('name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">I am a... *</label>
                  <select className="input-field" value={form.role} onChange={e => update('role', e.target.value)}>
                    <option value="farmer">Farmer — I grow and sell crops</option>
                    <option value="buyer">Buyer — I want to buy fresh produce</option>
                    <option value="lender">Lender — I want to fund agricultural projects</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="input-field" type="email" placeholder="you@email.com" value={form.email} onChange={e => update('email', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)} required />
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input className="input-field" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input className="input-field" placeholder="09XXXXXXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Province/City *</label>
                    <input className="input-field" placeholder="e.g. Cotabato City" value={form.address} onChange={e => update('address', e.target.value)} required />
                  </div>
                </div>
                {form.role === 'farmer' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Farm Name</label>
                      <input className="input-field" placeholder="e.g. Dela Cruz Farm" value={form.farmName} onChange={e => update('farmName', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Years of Farming</label>
                      <input className="input-field" type="number" placeholder="5" value={form.yearsOfFarming} onChange={e => update('yearsOfFarming', e.target.value)} />
                    </div>
                  </div>
                )}
              </>
            )}

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 8, justifyContent: 'center' }}>
              {loading ? 'Please wait...' : isLogin ? 'Login to SAKALINK' : 'Create Account'}
            </button>
          </form>

          {isLogin && (
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>
              Don't have an account?{' '}
              <button onClick={() => { setIsLogin(false); setError('') }}
                style={{ background: 'none', border: 'none', color: 'var(--leaf)', fontWeight: 700, cursor: 'pointer' }}>
                Register here
              </button>
            </p>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>
          <button onClick={() => navigate('landing')} style={{ background: 'none', border: 'none', color: 'var(--leaf)', cursor: 'pointer', fontSize: 12 }}>
            ← Back to Homepage
          </button>
        </p>
      </div>
    </div>
  )
}
