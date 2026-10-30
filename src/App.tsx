import { AppProvider, useApp } from './context/AppContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import FarmerProducts from './pages/farmer/FarmerProducts'
import FarmerOrders from './pages/farmer/FarmerOrders'
import FarmerMessages from './pages/farmer/FarmerMessages'
import FarmerLoans from './pages/farmer/FarmerLoans'
import BuyerMarketplace from './pages/buyer/BuyerMarketplace'
import BuyerCart from './pages/buyer/BuyerCart'
import BuyerCheckout from './pages/buyer/BuyerCheckout'
import BuyerOrders from './pages/buyer/BuyerOrders'
import BuyerMessages from './pages/buyer/BuyerMessages'
import BuyerFavorites from './pages/buyer/BuyerFavorites'
import LenderDashboard from './pages/lender/LenderDashboard'
import LenderLoans from './pages/lender/LenderLoans'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProfilePage from './pages/shared/ProfilePage'

function Router() {
  const { currentPage, currentUser } = useApp()


  // Public pages
  if (currentPage === 'landing') return <Landing />
  if (currentPage === 'login') return <Auth mode="login" />
  if (currentPage === 'register') return <Auth mode="register" />

  // Protected pages - redirect to landing if not authenticated
  if (!currentUser) return <Landing />

  // Farmer pages
  if (currentPage === 'farmer-dashboard') return <FarmerDashboard />
  if (currentPage === 'farmer-products') return <FarmerProducts />
  if (currentPage === 'farmer-orders') return <FarmerOrders />
  if (currentPage === 'farmer-messages') return <FarmerMessages />
  if (currentPage === 'farmer-loans') return <FarmerLoans />
  if (currentPage === 'farmer-profile') return <ProfilePage />

  // Buyer pages
  if (currentPage === 'buyer-marketplace') return <BuyerMarketplace />
  if (currentPage === 'buyer-cart') return <BuyerCart />
  if (currentPage === 'buyer-checkout') return <BuyerCheckout />
  if (currentPage === 'buyer-orders') return <BuyerOrders />
  if (currentPage === 'buyer-messages') return <BuyerMessages />
  if (currentPage === 'buyer-favorites') return <BuyerFavorites />
  if (currentPage === 'buyer-profile') return <ProfilePage />

  // Lender pages
  if (currentPage === 'lender-dashboard') return <LenderDashboard />
  if (currentPage === 'lender-loans') return <LenderLoans />
  if (currentPage === 'lender-loan-detail') return <LenderLoans />

  // Admin pages
  if (currentPage === 'admin-dashboard' || currentPage === 'admin-users' || currentPage === 'admin-products' || currentPage === 'admin-orders' || currentPage === 'admin-loans') return <AdminDashboard />

  // Default fallback
  return <Landing />
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}
