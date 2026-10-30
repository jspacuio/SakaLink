import { useApp } from '../context/AppContext'
import type { Page } from '../types'
import logo1 from '../imports/1.png'
import logoText from '../imports/4-1.png'

const SVG = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  products: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2a10 10 0 0 0 0 20"/><path d="M2 12h20"/><path d="M12 2c-2.5 3-4 6.5-4 10s1.5 7 4 10"/><path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10"/></svg>,
  orders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  messages: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  loans: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  profile: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  marketplace: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  cart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  favorites: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  loanRequests: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
}

interface NavItem { icon: React.ReactNode; label: string; page: Page }

const farmerNav: NavItem[] = [
  { icon: SVG.dashboard, label: 'Dashboard', page: 'farmer-dashboard' },
  { icon: SVG.products, label: 'My Products', page: 'farmer-products' },
  { icon: SVG.orders, label: 'Orders', page: 'farmer-orders' },
  { icon: SVG.messages, label: 'Messages', page: 'farmer-messages' },
  { icon: SVG.loans, label: 'Loans', page: 'farmer-loans' },
  { icon: SVG.profile, label: 'Profile', page: 'farmer-profile' },
]

const buyerNav: NavItem[] = [
  { icon: SVG.marketplace, label: 'Marketplace', page: 'buyer-marketplace' },
  { icon: SVG.cart, label: 'Cart', page: 'buyer-cart' },
  { icon: SVG.orders, label: 'My Orders', page: 'buyer-orders' },
  { icon: SVG.messages, label: 'Messages', page: 'buyer-messages' },
  { icon: SVG.favorites, label: 'Favorites', page: 'buyer-favorites' },
  { icon: SVG.profile, label: 'Profile', page: 'buyer-profile' },
]

const lenderNav: NavItem[] = [
  { icon: SVG.dashboard, label: 'Dashboard', page: 'lender-dashboard' },
  { icon: SVG.loanRequests, label: 'Loan Requests', page: 'lender-loans' },
  { icon: SVG.messages, label: 'Messages', page: 'farmer-messages' },
  { icon: SVG.profile, label: 'Profile', page: 'farmer-profile' },
]

const adminNav: NavItem[] = [
  { icon: SVG.dashboard, label: 'Dashboard', page: 'admin-dashboard' },
  { icon: SVG.users, label: 'Users', page: 'admin-users' },
  { icon: SVG.products, label: 'Products', page: 'admin-products' },
  { icon: SVG.orders, label: 'Orders', page: 'admin-orders' },
  { icon: SVG.loans, label: 'Loans', page: 'admin-loans' },
]

export default function Sidebar() {
  const { currentUser, currentPage, navigate, logout, getUnreadCount, getCartWithProducts, data } = useApp()
  if (!currentUser) return null

  const navItems = currentUser.role === 'farmer' ? farmerNav
    : currentUser.role === 'buyer' ? buyerNav
    : currentUser.role === 'lender' ? lenderNav
    : adminNav

  const unreadMessages = getUnreadCount(currentUser.id)
  const cartCount = currentUser.role === 'buyer' ? getCartWithProducts().length : 0

  const roleLabel = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
  const roleColor = currentUser.role === 'farmer' ? '#5B8C2A'
    : currentUser.role === 'buyer' ? '#1D4ED8'
    : currentUser.role === 'lender' ? '#92400E'
    : '#374151'

  return (
    <nav className="sidebar">
      {/* Logo area */}
      <div className="sidebar-logo" style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logo1} alt="SAKALINK" style={{ width: 58, height: 58, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <div style={{ marginLeft: -12 }}>
            <img src={logoText} alt="SAKALINK" style={{ height: 28, objectFit: 'contain' }} />
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 }}>Agricultural Marketplace</div>
          </div>
        </div>
        {/* User info */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'white'
          }}>
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div style={{ color: 'white', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{currentUser.name}</div>
            <div style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginTop: 3,
              background: roleColor, color: 'white', fontWeight: 700
            }}>{roleLabel}</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="sidebar-nav" style={{ flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column' }}>
        {navItems.map(item => {
          const isActive = currentPage === item.page || (item.page === 'buyer-cart' && currentPage === 'buyer-checkout')
          const showBadge = (item.page === 'farmer-messages' || item.page === 'buyer-messages') && unreadMessages > 0
          const showCartBadge = item.page === 'buyer-cart' && cartCount > 0
          return (
            <button
              key={item.page}
              className={`sidebar-nav-item${isActive ? ' active' : ''}`}
              onClick={() => navigate(item.page)}
              style={{ border: 'none', background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent', width: '100%', textAlign: 'left', position: 'relative' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {(showBadge || showCartBadge) && (
                <span style={{
                  marginLeft: 'auto', background: '#F4B400', color: '#333', borderRadius: 20,
                  fontSize: 11, fontWeight: 700, padding: '1px 7px', minWidth: 20, textAlign: 'center'
                }}>
                  {showBadge ? unreadMessages : cartCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="sidebar-footer" style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button className="sidebar-nav-item" onClick={logout} style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>
          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{SVG.logout}</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </nav>
  )
}
