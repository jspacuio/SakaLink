import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type {
  User, Product, CartItem, Order, OrderItem, Message, Conversation,
  Loan, Notification, Favorite, Page, LoanStatus, OrderStatus, ProductCategory
} from '../types'
import {
  getData, saveData, getSession, setSession, clearSession,
  generateId, generateOrderNumber, makeConversationId, type AppData
} from '../store'

interface AppContextType {
  // State
  currentUser: User | null
  data: AppData
  currentPage: Page
  selectedProductId: string | null
  selectedLoanId: string | null
  selectedConversationUserId: string | null
  checkoutItems: CartItem[]

  // Auth
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  register: (u: Omit<User, 'id' | 'rating' | 'completedOrders' | 'createdAt'>) => { ok: boolean; error?: string }
  updateProfile: (updates: Partial<User>) => void

  // Navigation
  navigate: (page: Page) => void

  // Products
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'sold' | 'rating'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Cart
  addToCart: (productId: string, qty: number) => void
  removeFromCart: (cartItemId: string) => void
  updateCartQty: (cartItemId: string, qty: number) => void
  clearCart: () => void

  // Orders
  createOrder: (deliveryAddress: string, contactNumber: string, paymentMethod: string) => Order | null
  updateOrderStatus: (orderId: string, status: OrderStatus) => void

  // Messages
  sendMessage: (receiverId: string, text: string) => void
  markConversationRead: (conversationId: string) => void

  // Loans
  applyForLoan: (l: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'farmerName' | 'farmerLocation'>) => void
  updateLoanStatus: (loanId: string, status: LoanStatus, reason?: string) => void

  // Notifications
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void

  // Favorites
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean

  // Setters
  setSelectedProductId: (id: string | null) => void
  setSelectedLoanId: (id: string | null) => void
  setSelectedConversationUserId: (id: string | null) => void

  // Admin
  deleteUser: (id: string) => void

  // Helpers
  getUser: (id: string) => User | undefined
  getProduct: (id: string) => Product | undefined
  getCartWithProducts: () => (CartItem & { product: Product })[]
  getConversationsForUser: (userId: string) => (Conversation & { otherUser: User; unreadCount: number })[]
  getMessagesForConversation: (conversationId: string) => Message[]
  getUnreadCount: (userId: string) => number
  getNotificationsForUser: (userId: string) => Notification[]
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => getData())
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const sessionId = getSession()
    if (sessionId) {
      const d = getData()
      return d.users.find(u => u.id === sessionId) ?? null
    }
    return null
  })
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const sessionId = getSession()
    if (sessionId) {
      const d = getData()
      const u = d.users.find(x => x.id === sessionId)
      if (u) {
        if (u.role === 'farmer') return 'farmer-dashboard'
        if (u.role === 'buyer') return 'buyer-marketplace'
        if (u.role === 'lender') return 'lender-dashboard'
        if (u.role === 'admin') return 'admin-dashboard'
      }
    }
    return 'landing'
  })
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null)
  const [selectedConversationUserId, setSelectedConversationUserId] = useState<string | null>(null)
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([])

  const persist = useCallback((newData: AppData) => {
    setData(newData)
    saveData(newData)
  }, [])

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!user) return { ok: false, error: 'Invalid email or password' }
    setCurrentUser(user)
    setSession(user.id)
    if (user.role === 'farmer') navigate('farmer-dashboard')
    else if (user.role === 'buyer') navigate('buyer-marketplace')
    else if (user.role === 'lender') navigate('lender-dashboard')
    else navigate('admin-dashboard')
    return { ok: true }
  }, [data.users, navigate])

  const logout = useCallback(() => {
    setCurrentUser(null)
    clearSession()
    navigate('landing')
  }, [navigate])

  const register = useCallback((userData: Omit<User, 'id' | 'rating' | 'completedOrders' | 'createdAt'>) => {
    if (data.users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { ok: false, error: 'Email already registered' }
    }
    const newUser: User = {
      ...userData,
      id: generateId(),
      rating: 0,
      completedOrders: 0,
      createdAt: new Date().toISOString()
    }
    const newData = { ...data, users: [...data.users, newUser] }
    persist(newData)
    setCurrentUser(newUser)
    setSession(newUser.id)
    if (newUser.role === 'farmer') navigate('farmer-dashboard')
    else if (newUser.role === 'buyer') navigate('buyer-marketplace')
    else navigate('lender-dashboard')
    return { ok: true }
  }, [data, persist, navigate])

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (!currentUser) return
    const updated = { ...currentUser, ...updates }
    const newData = { ...data, users: data.users.map(u => u.id === currentUser.id ? updated : u) }
    persist(newData)
    setCurrentUser(updated)
    setSession(updated.id)
  }, [currentUser, data, persist])

  const addProduct = useCallback((p: Omit<Product, 'id' | 'createdAt' | 'sold' | 'rating'>) => {
    const newProduct: Product = { ...p, id: generateId(), createdAt: new Date().toISOString(), sold: 0, rating: 0 }
    persist({ ...data, products: [...data.products, newProduct] })
  }, [data, persist])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    persist({ ...data, products: data.products.map(p => p.id === id ? { ...p, ...updates } : p) })
  }, [data, persist])

  const deleteProduct = useCallback((id: string) => {
    persist({ ...data, products: data.products.filter(p => p.id !== id) })
  }, [data, persist])

  const addToCart = useCallback((productId: string, qty: number) => {
    if (!currentUser) return
    const existing = data.cart.find(c => c.buyerId === currentUser.id && c.productId === productId)
    let newCart: CartItem[]
    if (existing) {
      newCart = data.cart.map(c => c.id === existing.id ? { ...c, quantity: c.quantity + qty } : c)
    } else {
      newCart = [...data.cart, { id: generateId(), buyerId: currentUser.id, productId, quantity: qty }]
    }
    persist({ ...data, cart: newCart })
  }, [currentUser, data, persist])

  const removeFromCart = useCallback((cartItemId: string) => {
    persist({ ...data, cart: data.cart.filter(c => c.id !== cartItemId) })
  }, [data, persist])

  const updateCartQty = useCallback((cartItemId: string, qty: number) => {
    if (qty <= 0) {
      persist({ ...data, cart: data.cart.filter(c => c.id !== cartItemId) })
    } else {
      persist({ ...data, cart: data.cart.map(c => c.id === cartItemId ? { ...c, quantity: qty } : c) })
    }
  }, [data, persist])

  const clearCart = useCallback(() => {
    if (!currentUser) return
    persist({ ...data, cart: data.cart.filter(c => c.buyerId !== currentUser.id) })
  }, [currentUser, data, persist])

  const createOrder = useCallback((deliveryAddress: string, contactNumber: string, paymentMethod: string): Order | null => {
    if (!currentUser) return null
    const cartItems = data.cart.filter(c => c.buyerId === currentUser.id)
    if (cartItems.length === 0) return null

    // Group by farmer - for simplicity create one order per session (mixed farmer)
    const orderItems: OrderItem[] = cartItems.map(c => {
      const product = data.products.find(p => p.id === c.productId)!
      return { productId: c.productId, productName: product.name, quantity: c.quantity, price: product.price, unit: product.unit, farmerId: product.farmerId }
    })

    const firstFarmerId = orderItems[0].farmerId
    const firstFarmer = data.users.find(u => u.id === firstFarmerId)!
    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const deliveryFee = 80 + Math.floor(subtotal / 1000) * 20
    const newOrder: Order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      farmerId: firstFarmerId,
      farmerName: firstFarmer.name,
      items: orderItems,
      subtotal, deliveryFee, total: subtotal + deliveryFee,
      status: 'pending',
      deliveryAddress, contactNumber, paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add notification for farmer
    const farmerNotif: Notification = {
      id: generateId(), userId: firstFarmerId, title: 'New Order Received!',
      message: `${currentUser.name} placed an order (${newOrder.orderNumber})`,
      type: 'order', isRead: false, createdAt: new Date().toISOString()
    }

    const newData: AppData = {
      ...data,
      orders: [...data.orders, newOrder],
      cart: data.cart.filter(c => c.buyerId !== currentUser.id),
      notifications: [...data.notifications, farmerNotif],
      products: data.products.map(p => {
        const item = orderItems.find(i => i.productId === p.id)
        if (item) return { ...p, quantity: Math.max(0, p.quantity - item.quantity), sold: p.sold + item.quantity }
        return p
      })
    }
    persist(newData)
    return newOrder
  }, [currentUser, data, persist])

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    const order = data.orders.find(o => o.id === orderId)
    if (!order) return
    const newData = {
      ...data,
      orders: data.orders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o)
    }
    // Notification for buyer
    const notif: Notification = {
      id: generateId(), userId: order.buyerId,
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your order ${order.orderNumber} is now ${status}`,
      type: 'order', isRead: false, createdAt: new Date().toISOString()
    }
    persist({ ...newData, notifications: [...newData.notifications, notif] })
  }, [data, persist])

  const sendMessage = useCallback((receiverId: string, text: string) => {
    if (!currentUser || !text.trim()) return
    const convId = makeConversationId(currentUser.id, receiverId)
    const newMsg: Message = {
      id: generateId(), senderId: currentUser.id, receiverId,
      conversationId: convId, message: text.trim(),
      createdAt: new Date().toISOString(), isRead: false
    }
    const existingConv = data.conversations.find(c => c.id === convId)
    let newConvs: Conversation[]
    if (existingConv) {
      newConvs = data.conversations.map(c => c.id === convId
        ? { ...c, lastMessage: text.trim(), lastMessageAt: newMsg.createdAt }
        : c)
    } else {
      newConvs = [...data.conversations, {
        id: convId, participant1Id: currentUser.id, participant2Id: receiverId,
        lastMessage: text.trim(), lastMessageAt: newMsg.createdAt
      }]
    }
    const notif: Notification = {
      id: generateId(), userId: receiverId, title: 'New Message',
      message: `${currentUser.name}: ${text.trim().slice(0, 60)}`,
      type: 'message', isRead: false, createdAt: new Date().toISOString()
    }
    persist({ ...data, messages: [...data.messages, newMsg], conversations: newConvs, notifications: [...data.notifications, notif] })
  }, [currentUser, data, persist])

  const markConversationRead = useCallback((conversationId: string) => {
    if (!currentUser) return
    persist({
      ...data,
      messages: data.messages.map(m =>
        m.conversationId === conversationId && m.receiverId === currentUser.id
          ? { ...m, isRead: true } : m)
    })
  }, [currentUser, data, persist])

  const applyForLoan = useCallback((l: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'farmerName' | 'farmerLocation'>) => {
    if (!currentUser) return
    const newLoan: Loan = {
      ...l,
      id: generateId(),
      farmerName: currentUser.name,
      farmerLocation: currentUser.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    // Notify all lenders
    const lenderNotifs: Notification[] = data.users
      .filter(u => u.role === 'lender')
      .map(u => ({
        id: generateId(), userId: u.id, title: 'New Loan Application',
        message: `${currentUser.name} applied for a loan of ₱${l.amount.toLocaleString()}`,
        type: 'loan' as const, isRead: false, createdAt: new Date().toISOString()
      }))
    persist({ ...data, loans: [...data.loans, newLoan], notifications: [...data.notifications, ...lenderNotifs] })
  }, [currentUser, data, persist])

  const updateLoanStatus = useCallback((loanId: string, status: LoanStatus, reason?: string) => {
    if (!currentUser) return
    const loan = data.loans.find(l => l.id === loanId)
    if (!loan) return
    const updated = { ...loan, status, lenderId: currentUser.id, rejectionReason: reason, updatedAt: new Date().toISOString() }
    const notif: Notification = {
      id: generateId(), userId: loan.farmerId,
      title: status === 'approved' ? 'Loan Approved! 🎉' : status === 'rejected' ? 'Loan Application Update' : 'Loan Under Review',
      message: status === 'approved'
        ? `Your loan of ₱${loan.amount.toLocaleString()} has been approved!`
        : status === 'rejected'
          ? `Your loan application was rejected. Reason: ${reason}`
          : `Your loan application is under review.`,
      type: 'loan', isRead: false, createdAt: new Date().toISOString()
    }
    persist({ ...data, loans: data.loans.map(l => l.id === loanId ? updated : l), notifications: [...data.notifications, notif] })
  }, [currentUser, data, persist])

  const markNotificationRead = useCallback((id: string) => {
    persist({ ...data, notifications: data.notifications.map(n => n.id === id ? { ...n, isRead: true } : n) })
  }, [data, persist])

  const markAllNotificationsRead = useCallback(() => {
    if (!currentUser) return
    persist({ ...data, notifications: data.notifications.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n) })
  }, [currentUser, data, persist])

  const toggleFavorite = useCallback((productId: string) => {
    if (!currentUser) return
    const existing = data.favorites.find(f => f.buyerId === currentUser.id && f.productId === productId)
    if (existing) {
      persist({ ...data, favorites: data.favorites.filter(f => f.id !== existing.id) })
    } else {
      persist({ ...data, favorites: [...data.favorites, { id: generateId(), buyerId: currentUser.id, productId }] })
    }
  }, [currentUser, data, persist])

  const isFavorite = useCallback((productId: string) => {
    if (!currentUser) return false
    return data.favorites.some(f => f.buyerId === currentUser.id && f.productId === productId)
  }, [currentUser, data.favorites])

  const deleteUser = useCallback((id: string) => {
    persist({ ...data, users: data.users.filter(u => u.id !== id) })
  }, [data, persist])

  const getUser = useCallback((id: string) => data.users.find(u => u.id === id), [data.users])

  const getProduct = useCallback((id: string) => data.products.find(p => p.id === id), [data.products])

  const getCartWithProducts = useCallback(() => {
    if (!currentUser) return []
    return data.cart
      .filter(c => c.buyerId === currentUser.id)
      .map(c => ({ ...c, product: data.products.find(p => p.id === c.productId)! }))
      .filter(c => c.product)
  }, [currentUser, data])

  const getConversationsForUser = useCallback((userId: string) => {
    return data.conversations
      .filter(c => c.participant1Id === userId || c.participant2Id === userId)
      .map(c => {
        const otherId = c.participant1Id === userId ? c.participant2Id : c.participant1Id
        const otherUser = data.users.find(u => u.id === otherId)!
        const unreadCount = data.messages.filter(
          m => m.conversationId === c.id && m.receiverId === userId && !m.isRead
        ).length
        return { ...c, otherUser, unreadCount }
      })
      .filter(c => c.otherUser)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
  }, [data])

  const getMessagesForConversation = useCallback((conversationId: string) => {
    return data.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [data.messages])

  const getUnreadCount = useCallback((userId: string) => {
    return data.messages.filter(m => m.receiverId === userId && !m.isRead).length
  }, [data.messages])

  const getNotificationsForUser = useCallback((userId: string) => {
    return data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [data.notifications])

  const value: AppContextType = {
    currentUser, data, currentPage, selectedProductId, selectedLoanId,
    selectedConversationUserId, checkoutItems,
    login, logout, register, updateProfile, navigate,
    addProduct, updateProduct, deleteProduct,
    addToCart, removeFromCart, updateCartQty, clearCart,
    createOrder, updateOrderStatus,
    sendMessage, markConversationRead,
    applyForLoan, updateLoanStatus,
    markNotificationRead, markAllNotificationsRead,
    toggleFavorite, isFavorite,
    setSelectedProductId, setSelectedLoanId, setSelectedConversationUserId,
    deleteUser,
    getUser, getProduct, getCartWithProducts,
    getConversationsForUser, getMessagesForConversation,
    getUnreadCount, getNotificationsForUser,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
