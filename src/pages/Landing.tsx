import { useApp } from '../context/AppContext'
import logo3 from '../imports/3.png'
import logoMark from '../imports/1-1.png'
import logoText from '../imports/4-1.png'
import agribista from '../imports/Untitled_design.png'

export default function Landing() {
  const { navigate } = useApp()

  const features = [
    { icon: '🌾', image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=56&h=56&fit=crop&auto=format', title: 'Agricultural Marketplace', desc: 'Browse and purchase fresh crops directly from local farmers.' },
    { icon: '💬', image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=56&h=56&fit=crop&auto=format', title: 'Direct Farmer Communication', desc: 'Chat with farmers to negotiate prices and arrange deliveries.' },
    { icon: '💰', image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=56&h=56&fit=crop&auto=format', title: 'Agricultural Financing', desc: 'Farmers can apply for loans to fund their next harvest.' },
    { icon: '📦', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=56&h=56&fit=crop&auto=format', title: 'Order Management', desc: 'Track your orders from farm to doorstep in real-time.' },
    { icon: '🔒', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=56&h=56&fit=crop&auto=format', title: 'Secure Transactions', desc: 'Multiple payment options with safe and transparent processes.' },
    { icon: '📍', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=56&h=56&fit=crop&auto=format', title: 'Location-Based Discovery', desc: 'Find farmers and products near your area with ease.' },
  ] as { icon: string; image?: string; title: string; desc: string }[]

  const stats = [
    { value: '500+', label: 'Registered Farmers' },
    { value: '2,000+', label: 'Products Listed' },
    { value: '₱5M+', label: 'Total Sales' },
    { value: '150+', label: 'Active Lenders' },
  ]

  const testimonials = [
    { name: 'Juan dela Cruz', role: 'Farmer, Kabacan', text: 'SAKALINK helped me sell my tomatoes directly to buyers. No more middlemen eating my profits!', avatar: 'J' },
    { name: 'Ana Gonzales', role: 'Buyer, Cotabato City', text: 'I can now buy fresh vegetables directly from farmers at fair prices. The quality is amazing!', avatar: 'A' },
    { name: 'Michael Tan', role: 'Lender, Davao', text: 'I can now invest in verified agricultural projects and help local farmers grow their business.', avatar: 'M' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'Outfit, sans-serif' }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'white', borderBottom: '1px solid var(--border)',
        padding: '0 5%', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(35,79,30,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <img src={logoMark} alt="SAKALINK logo" style={{ width: 56, height: 56, objectFit: 'contain' }} />
          <img src={logoText} alt="SAKALINK" style={{ height: 36, objectFit: 'contain', marginLeft: -6 }} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-outline btn-sm" onClick={() => navigate('login')}>Login</button>
          <button className="btn-primary btn-sm" onClick={() => navigate('register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #234F1E 0%, #5B8C2A 60%, #234F1E 100%)',
        padding: '80px 5% 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 40, flexWrap: 'wrap',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />

        <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(244,180,0,0.2)', color: '#F4B400',
            border: '1px solid rgba(244,180,0,0.4)', borderRadius: 20,
            padding: '4px 16px', fontSize: 13, fontWeight: 700, marginBottom: 20
          }}>
            Philippine Agricultural Marketplace
          </div>
          <h1 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 56px)', color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
            Connecting<br />
            <span style={{ color: '#F4B400' }}>Farmers, Buyers,</span><br />
            and Lenders.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(14px, 2vw, 18px)', lineHeight: 1.6, marginBottom: 36, maxWidth: 480 }}>
            SAKALINK is the all-in-one digital marketplace for Philippine agriculture. Sell crops, buy fresh produce, and access agricultural financing — all in one platform.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button className="btn-gold" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => navigate('register')}>
              Get Started Free
            </button>
            <button
              onClick={() => navigate('login')}
              style={{
                background: 'rgba(255,255,255,0.15)', color: 'white',
                border: '1.5px solid rgba(255,255,255,0.4)', padding: '14px 32px',
                borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              Login →
            </button>
          </div>
          {/* Demo accounts hint */}
          <div style={{
            marginTop: 24, background: 'rgba(0,0,0,0.2)', borderRadius: 10,
            padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.7)'
          }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Demo Accounts:</strong>
            &nbsp; farmer@sakalink.test · buyer@sakalink.test · lender@sakalink.test &nbsp;|&nbsp; password: password123
          </div>
        </div>

        {/* Hero image */}
        <div style={{ flex: '0 0 auto', position: 'relative' }}>
          <div style={{
            width: 'clamp(200px, 30vw, 320px)', height: 'clamp(200px, 30vw, 320px)',
            borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
            border: '2px solid rgba(255,255,255,0.15)',
            overflow: 'hidden', position: 'relative'
          }}>
            <img
              src={logo3}
              alt="SAKALINK farmer illustration"
              style={{ width: '135%', objectFit: 'contain', position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)' }}
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        background: '#F4B400', padding: '24px 5%',
        display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20
      }}>
        {stats.map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: 'var(--forest)' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--dark)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section style={{ padding: '72px 5%', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--forest)' }}>
            How SAKALINK Works
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, marginTop: 10 }}>
            One platform, three roles, endless opportunities
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            {
              image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=200&fit=crop&auto=format',
              role: 'Farmer', color: '#234F1E',
              steps: ['Create your farm profile', 'List your harvest & products', 'Receive orders from buyers', 'Chat & confirm sales', 'Apply for agricultural loans']
            },
            {
              image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop&auto=format',
              role: 'Buyer', color: '#1D4ED8',
              steps: ['Browse fresh products', 'Filter by location & category', 'View farmer profiles', 'Add to cart & checkout', 'Track your order status']
            },
            {
              image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop&auto=format',
              role: 'Lender', color: '#92400E',
              steps: ['Review loan applications', 'Check farmer profiles & farms', 'Evaluate crop data', 'Approve or reject financing', 'Track active loans']
            },
          ].map(item => (
            <div key={item.role} className="card" style={{ padding: 0, borderTop: `4px solid ${item.color}`, overflow: 'hidden' }}>
              <img src={item.image} alt={item.role} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: 28 }}>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 22, color: item.color, marginBottom: 16 }}>{item.role}</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {item.steps.map((step, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--dark)' }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: item.color, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, flexShrink: 0
                    }}>{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
              <button
                className="btn-primary btn-sm"
                style={{ marginTop: 20, background: item.color, width: '100%' }}
                onClick={() => navigate('register')}
              >
                Get Started as {item.role}
              </button>
            </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '72px 5%', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--forest)' }}>
            Platform Features
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} style={{
              display: 'flex', gap: 16, padding: 20, borderRadius: 12,
              border: '1px solid var(--border)', background: 'var(--bg)',
              transition: 'box-shadow 0.2s'
            }}>
              {f.image
                ? <img src={f.image} alt={f.title} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                : <span style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</span>
              }
              <div>
                <h4 style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 16, color: 'var(--forest)', marginBottom: 6 }}>{f.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '72px 5%', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--forest)' }}>
            What Our Users Say
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {testimonials.map(t => (
            <div key={t.name} className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 24, color: 'var(--gold)', marginBottom: 12 }}>★★★★★</div>
              <p style={{ fontSize: 14, color: 'var(--dark)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', background: 'var(--forest)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16
                }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--forest), var(--leaf))',
        padding: '72px 5%', textAlign: 'center'
      }}>
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)', color: 'white', marginBottom: 16 }}>
          Ready to Join SAKALINK?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 32 }}>
          Join thousands of farmers, buyers, and lenders in the Philippines' premier agricultural marketplace.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-gold" style={{ padding: '14px 40px', fontSize: 16 }} onClick={() => navigate('register')}>
            Create Free Account
          </button>
          <button
            onClick={() => navigate('login')}
            style={{
              background: 'transparent', color: 'white',
              border: '2px solid rgba(255,255,255,0.5)', padding: '14px 40px',
              borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer'
            }}
          >
            Login
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a3d16', color: 'rgba(255,255,255,0.6)', padding: '40px 5% 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 20, color: 'var(--gold)', marginBottom: 6 }}>SAKALINK</div>
        <div style={{ fontSize: 13, marginBottom: 24 }}>Connecting Farmers, Buyers, and Lenders across the Philippines.</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <img
            src={agribista}
            alt="Agribista Solution"
            style={{ height: 64, objectFit: 'contain', borderRadius: 10, opacity: 0.92 }}
          />
        </div>
        <div style={{ fontSize: 12, opacity: 0.5 }}>© 2026 SAKALINK · Agribista Solution. All rights reserved.</div>
      </footer>
    </div>
  )
}
