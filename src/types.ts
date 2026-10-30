export type UserRole = 'farmer' | 'buyer' | 'lender' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  password: string
  phone: string
  address: string
  role: UserRole
  farmName?: string
  yearsOfFarming?: number
  rating: number
  completedOrders: number
  avatar?: string
  createdAt: string
}

export type ProductCategory = 'Vegetables' | 'Fruits' | 'Rice' | 'Corn' | 'Root Crops' | 'Livestock' | 'Poultry' | 'Other'

export interface Product {
  id: string
  farmerId: string
  farmerName: string
  name: string
  category: ProductCategory
  description: string
  price: number
  quantity: number
  unit: string
  harvestDate: string
  location: string
  image: string
  rating: number
  sold: number
  createdAt: string
  active: boolean
}

export interface CartItem {
  id: string
  buyerId: string
  productId: string
  quantity: number
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  unit: string
  farmerId: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  orderNumber: string
  buyerId: string
  buyerName: string
  farmerId: string
  farmerName: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  deliveryAddress: string
  contactNumber: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  conversationId: string
  message: string
  createdAt: string
  isRead: boolean
}

export interface Conversation {
  id: string
  participant1Id: string
  participant2Id: string
  lastMessage: string
  lastMessageAt: string
}

export type LoanStatus = 'pending' | 'under_review' | 'approved' | 'rejected'

export interface Loan {
  id: string
  farmerId: string
  farmerName: string
  farmerLocation: string
  amount: number
  purpose: string
  farmSize: string
  cropType: string
  estimatedHarvest: string
  expectedIncome: number
  loanTerm: number
  status: LoanStatus
  lenderId?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'order' | 'message' | 'loan' | 'product'
  isRead: boolean
  createdAt: string
}

export interface Favorite {
  id: string
  buyerId: string
  productId: string
}

export type Page =
  | 'landing'
  | 'login'
  | 'register'
  | 'farmer-dashboard'
  | 'farmer-products'
  | 'farmer-orders'
  | 'farmer-messages'
  | 'farmer-loans'
  | 'farmer-profile'
  | 'buyer-marketplace'
  | 'buyer-product'
  | 'buyer-cart'
  | 'buyer-checkout'
  | 'buyer-orders'
  | 'buyer-messages'
  | 'buyer-favorites'
  | 'buyer-profile'
  | 'lender-dashboard'
  | 'lender-loans'
  | 'lender-loan-detail'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-products'
  | 'admin-orders'
  | 'admin-loans'
