import Sidebar from './Sidebar'
import { useApp } from '../context/AppContext'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title }: LayoutProps) {
  const { currentUser, getNotificationsForUser, markAllNotificationsRead } = useApp()
  const notifications = currentUser ? getNotificationsForUser(currentUser.id) : []
  const unreadNotifs = notifications.filter(n => !n.isRead).length

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="main-content">
        {/* Top bar */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid var(--border)',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--forest)', fontFamily: 'Nunito, sans-serif' }}>
            {title ?? 'SAKALINK'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {unreadNotifs > 0 && (
              <button
                onClick={markAllNotificationsRead}
                title="Mark all notifications as read"
                style={{
                  position: 'relative', background: '#F3F4F6', border: 'none', cursor: 'pointer',
                  width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span style={{
                  position: 'absolute', top: 4, right: 4, background: '#DC2626', color: 'white',
                  borderRadius: '50%', width: 14, height: 14, fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
                }}>
                  {unreadNotifs > 9 ? '9+' : unreadNotifs}
                </span>
              </button>
            )}
            {currentUser && (
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--forest)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 14
              }}>
                {currentUser.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
