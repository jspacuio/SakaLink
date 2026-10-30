import type { User, Product, CartItem, Order, Message, Conversation, Loan, Notification, Favorite } from './types'

const STORAGE_KEY = 'sakalink_data_v2'
const SESSION_KEY = 'sakalink_session'

export interface AppData {
  users: User[]
  products: Product[]
  cart: CartItem[]
  orders: Order[]
  messages: Message[]
  conversations: Conversation[]
  loans: Loan[]
  notifications: Notification[]
  favorites: Favorite[]
}

const PRODUCT_IMAGES: Record<string, string> = {
  tomatoes: 'https://images.unsplash.com/photo-1546819290-5f5ee1dc6f91?w=400&h=300&fit=crop&auto=format',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format',
  corn: 'https://images.unsplash.com/photo-1551754177-e8e9e2d86ff7?w=400&h=300&fit=crop&auto=format',
  carrots: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop&auto=format',
  eggplant: 'https://images.unsplash.com/photo-1617727553252-65863c156eb2?w=400&h=300&fit=crop&auto=format',
  bananas: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&auto=format',
  beans: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?w=400&h=300&fit=crop&auto=format',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=300&fit=crop&auto=format',
  bittermelon: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400&h=300&fit=crop&auto=format',
  sweetpotato: 'https://images.unsplash.com/photo-1587735243475-37191bcd6ff6?w=400&h=300&fit=crop&auto=format',
  default: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop&auto=format',
}

export function getProductImage(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('tomato')) return PRODUCT_IMAGES.tomatoes
  if (lower.includes('rice')) return PRODUCT_IMAGES.rice
  if (lower.includes('corn') || lower.includes('mais')) return PRODUCT_IMAGES.corn
  if (lower.includes('carrot') || lower.includes('karot')) return PRODUCT_IMAGES.carrots
  if (lower.includes('eggplant') || lower.includes('talong')) return PRODUCT_IMAGES.eggplant
  if (lower.includes('banana') || lower.includes('saging')) return PRODUCT_IMAGES.bananas
  if (lower.includes('bean') || lower.includes('sitaw')) return PRODUCT_IMAGES.beans
  if (lower.includes('cabbage') || lower.includes('petchay')) return PRODUCT_IMAGES.cabbage
  if (lower.includes('ampalaya') || lower.includes('bitter')) return PRODUCT_IMAGES.bittermelon
  if (lower.includes('kamote') || lower.includes('sweet potato')) return PRODUCT_IMAGES.sweetpotato
  return PRODUCT_IMAGES.default
}

const seedData: AppData = {
  users: [
    {
      id: 'u1', name: 'Juan dela Cruz', email: 'farmer@sakalink.test', password: 'password123',
      phone: '09171234567', address: 'Kabacan, Cotabato', role: 'farmer',
      farmName: 'Dela Cruz Farm', yearsOfFarming: 12, rating: 4.8, completedOrders: 47,
      createdAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'u2', name: 'Ana Gonzales', email: 'buyer@sakalink.test', password: 'password123',
      phone: '09182345678', address: 'Cotabato City', role: 'buyer',
      rating: 4.9, completedOrders: 23,
      createdAt: '2024-01-20T09:00:00Z'
    },
    {
      id: 'u3', name: 'Michael Tan', email: 'lender@sakalink.test', password: 'password123',
      phone: '09193456789', address: 'Davao City', role: 'lender',
      rating: 4.7, completedOrders: 0,
      createdAt: '2024-01-25T10:00:00Z'
    },
    {
      id: 'u4', name: 'Admin User', email: 'admin@sakalink.test', password: 'password123',
      phone: '09204567890', address: 'General Santos City', role: 'admin',
      rating: 5.0, completedOrders: 0,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'u5', name: 'Maria Santos', email: 'maria@sakalink.test', password: 'password123',
      phone: '09215678901', address: 'Kidapawan, North Cotabato', role: 'farmer',
      farmName: 'Santos Organic Farm', yearsOfFarming: 8, rating: 4.6, completedOrders: 31,
      createdAt: '2024-02-01T08:00:00Z'
    },
    {
      id: 'u6', name: 'Pedro Reyes', email: 'pedro@sakalink.test', password: 'password123',
      phone: '09226789012', address: 'Midsayap, Cotabato', role: 'farmer',
      farmName: 'Reyes Family Farm', yearsOfFarming: 15, rating: 4.9, completedOrders: 62,
      createdAt: '2024-02-05T08:00:00Z'
    },
    {
      id: 'u7', name: 'Roberto Cruz', email: 'roberto@sakalink.test', password: 'password123',
      phone: '09237890123', address: 'Davao City', role: 'buyer',
      rating: 4.5, completedOrders: 15,
      createdAt: '2024-02-10T09:00:00Z'
    },
  ],
  products: [
    {
      id: 'p1', farmerId: 'u1', farmerName: 'Juan dela Cruz',
      name: 'Fresh Tomatoes', category: 'Vegetables', description: 'Fresh, ripe tomatoes direct from our farm. Harvested daily for maximum freshness. Great for cooking and fresh salads.',
      price: 80, quantity: 150, unit: 'kg', harvestDate: '2024-08-01', location: 'Kabacan, Cotabato',
      image: PRODUCT_IMAGES.tomatoes, rating: 4.8, sold: 230, createdAt: '2024-07-01T08:00:00Z', active: true
    },
    {
      id: 'p2', farmerId: 'u1', farmerName: 'Juan dela Cruz',
      name: 'Dinorado Rice', category: 'Rice', description: 'Premium Dinorado rice variety known for its distinct aroma and soft texture. Grown naturally without harmful chemicals.',
      price: 55, quantity: 500, unit: 'kg', harvestDate: '2024-07-20', location: 'Kabacan, Cotabato',
      image: PRODUCT_IMAGES.rice, rating: 4.9, sold: 420, createdAt: '2024-06-15T08:00:00Z', active: true
    },
    {
      id: 'p3', farmerId: 'u5', farmerName: 'Maria Santos',
      name: 'Sweet Corn (Mais)', category: 'Corn', description: 'Freshly harvested sweet corn, perfect for grilling, boiling, or roasting. Sweet and tender kernels.',
      price: 15, quantity: 200, unit: 'piece', harvestDate: '2024-08-02', location: 'Kidapawan, North Cotabato',
      image: PRODUCT_IMAGES.corn, rating: 4.7, sold: 180, createdAt: '2024-07-10T08:00:00Z', active: true
    },
    {
      id: 'p4', farmerId: 'u5', farmerName: 'Maria Santos',
      name: 'Organic Carrots', category: 'Vegetables', description: 'Organically grown carrots from the highlands of North Cotabato. Crisp, sweet, and nutrient-rich.',
      price: 90, quantity: 80, unit: 'kg', harvestDate: '2024-07-28', location: 'Kidapawan, North Cotabato',
      image: PRODUCT_IMAGES.carrots, rating: 4.6, sold: 95, createdAt: '2024-07-05T08:00:00Z', active: true
    },
    {
      id: 'p5', farmerId: 'u6', farmerName: 'Pedro Reyes',
      name: 'Eggplant (Talong)', category: 'Vegetables', description: 'Fresh eggplant varieties including long and round types. Harvested fresh daily from our field.',
      price: 60, quantity: 120, unit: 'kg', harvestDate: '2024-08-03', location: 'Midsayap, Cotabato',
      image: PRODUCT_IMAGES.eggplant, rating: 4.7, sold: 140, createdAt: '2024-07-12T08:00:00Z', active: true
    },
    {
      id: 'p6', farmerId: 'u6', farmerName: 'Pedro Reyes',
      name: 'Cavendish Bananas', category: 'Fruits', description: 'Premium Cavendish bananas from our plantation. Naturally ripened, sweet and firm. Export-quality produce.',
      price: 70, quantity: 200, unit: 'kg', harvestDate: '2024-08-01', location: 'Midsayap, Cotabato',
      image: PRODUCT_IMAGES.bananas, rating: 4.9, sold: 310, createdAt: '2024-06-20T08:00:00Z', active: true
    },
    {
      id: 'p7', farmerId: 'u1', farmerName: 'Juan dela Cruz',
      name: 'Sitaw (String Beans)', category: 'Vegetables', description: 'Tender and fresh string beans picked at the right stage. Great for stir-fry, soups, and vegetable dishes.',
      price: 65, quantity: 50, unit: 'kg', harvestDate: '2024-08-04', location: 'Kabacan, Cotabato',
      image: PRODUCT_IMAGES.beans, rating: 4.5, sold: 75, createdAt: '2024-07-20T08:00:00Z', active: true
    },
    {
      id: 'p8', farmerId: 'u5', farmerName: 'Maria Santos',
      name: 'Petchay (Bok Choy)', category: 'Vegetables', description: 'Fresh petchay harvested from our organic beds. Perfect for soups, sautéed dishes, and fresh salads.',
      price: 40, quantity: 100, unit: 'kg', harvestDate: '2024-08-05', location: 'Kidapawan, North Cotabato',
      image: PRODUCT_IMAGES.cabbage, rating: 4.4, sold: 88, createdAt: '2024-07-18T08:00:00Z', active: true
    },
    {
      id: 'p9', farmerId: 'u6', farmerName: 'Pedro Reyes',
      name: 'Ampalaya (Bitter Melon)', category: 'Vegetables', description: 'Fresh ampalaya known for its health benefits. Great for ginisang ampalaya with egg and other traditional dishes.',
      price: 55, quantity: 60, unit: 'kg', harvestDate: '2024-08-02', location: 'Midsayap, Cotabato',
      image: PRODUCT_IMAGES.bittermelon, rating: 4.3, sold: 55, createdAt: '2024-07-22T08:00:00Z', active: true
    },
    {
      id: 'p10', farmerId: 'u1', farmerName: 'Juan dela Cruz',
      name: 'Kamote (Sweet Potato)', category: 'Root Crops', description: 'Naturally sweet kamote from our upland farm. Rich in vitamins and perfect as a healthy snack or side dish.',
      price: 35, quantity: 200, unit: 'kg', harvestDate: '2024-07-25', location: 'Kabacan, Cotabato',
      image: PRODUCT_IMAGES.sweetpotato, rating: 4.6, sold: 120, createdAt: '2024-07-01T08:00:00Z', active: true
    },
  ],
  cart: [],
  orders: [
    {
      id: 'o1', orderNumber: 'SKL-20240801-001',
      buyerId: 'u2', buyerName: 'Ana Gonzales',
      farmerId: 'u1', farmerName: 'Juan dela Cruz',
      items: [
        { productId: 'p1', productName: 'Fresh Tomatoes', quantity: 5, price: 80, unit: 'kg', farmerId: 'u1' },
        { productId: 'p2', productName: 'Dinorado Rice', quantity: 10, price: 55, unit: 'kg', farmerId: 'u1' },
      ],
      subtotal: 950, deliveryFee: 100, total: 1050,
      status: 'delivered',
      deliveryAddress: 'Cotabato City', contactNumber: '09182345678', paymentMethod: 'Cash on Delivery',
      createdAt: '2024-08-01T10:00:00Z', updatedAt: '2024-08-03T14:00:00Z'
    },
    {
      id: 'o2', orderNumber: 'SKL-20240802-002',
      buyerId: 'u7', buyerName: 'Roberto Cruz',
      farmerId: 'u5', farmerName: 'Maria Santos',
      items: [
        { productId: 'p3', productName: 'Sweet Corn', quantity: 20, price: 15, unit: 'piece', farmerId: 'u5' },
        { productId: 'p4', productName: 'Organic Carrots', quantity: 3, price: 90, unit: 'kg', farmerId: 'u5' },
      ],
      subtotal: 570, deliveryFee: 80, total: 650,
      status: 'confirmed',
      deliveryAddress: 'Davao City', contactNumber: '09237890123', paymentMethod: 'GCash',
      createdAt: '2024-08-02T11:00:00Z', updatedAt: '2024-08-02T13:00:00Z'
    },
    {
      id: 'o3', orderNumber: 'SKL-20240803-003',
      buyerId: 'u2', buyerName: 'Ana Gonzales',
      farmerId: 'u6', farmerName: 'Pedro Reyes',
      items: [
        { productId: 'p5', productName: 'Eggplant', quantity: 4, price: 60, unit: 'kg', farmerId: 'u6' },
        { productId: 'p6', productName: 'Cavendish Bananas', quantity: 5, price: 70, unit: 'kg', farmerId: 'u6' },
      ],
      subtotal: 590, deliveryFee: 80, total: 670,
      status: 'pending',
      deliveryAddress: 'Cotabato City', contactNumber: '09182345678', paymentMethod: 'Bank Transfer',
      createdAt: '2024-08-03T09:00:00Z', updatedAt: '2024-08-03T09:00:00Z'
    },
  ],
  messages: [
    {
      id: 'm1', senderId: 'u2', receiverId: 'u1',
      conversationId: 'conv_u1_u2',
      message: 'Hi Juan! I\'m interested in your fresh tomatoes. Are they still available?',
      createdAt: '2024-08-03T08:00:00Z', isRead: true
    },
    {
      id: 'm2', senderId: 'u1', receiverId: 'u2',
      conversationId: 'conv_u1_u2',
      message: 'Hello Ana! Yes, we have fresh tomatoes available. Harvested just this morning! 🌱',
      createdAt: '2024-08-03T08:05:00Z', isRead: true
    },
    {
      id: 'm3', senderId: 'u2', receiverId: 'u1',
      conversationId: 'conv_u1_u2',
      message: 'Great! Can I order 10kg? Can you deliver to Cotabato City?',
      createdAt: '2024-08-03T08:10:00Z', isRead: true
    },
    {
      id: 'm4', senderId: 'u1', receiverId: 'u2',
      conversationId: 'conv_u1_u2',
      message: 'Yes, we can deliver to Cotabato City. Delivery fee is ₱100. Total would be ₱900 including delivery.',
      createdAt: '2024-08-03T08:15:00Z', isRead: false
    },
    {
      id: 'm5', senderId: 'u7', receiverId: 'u5',
      conversationId: 'conv_u5_u7',
      message: 'Hi Maria! Do you have more sweet corn available? I want to order in bulk.',
      createdAt: '2024-08-03T09:00:00Z', isRead: false
    },
  ],
  conversations: [
    {
      id: 'conv_u1_u2',
      participant1Id: 'u1', participant2Id: 'u2',
      lastMessage: 'Yes, we can deliver to Cotabato City. Delivery fee is ₱100.',
      lastMessageAt: '2024-08-03T08:15:00Z'
    },
    {
      id: 'conv_u5_u7',
      participant1Id: 'u5', participant2Id: 'u7',
      lastMessage: 'Hi Maria! Do you have more sweet corn available?',
      lastMessageAt: '2024-08-03T09:00:00Z'
    },
  ],
  loans: [
    {
      id: 'l1', farmerId: 'u1', farmerName: 'Juan dela Cruz', farmerLocation: 'Kabacan, Cotabato',
      amount: 50000, purpose: 'Expand tomato and rice production for the next growing season',
      farmSize: '2.5 hectares', cropType: 'Tomatoes, Rice', estimatedHarvest: '2024-11-15',
      expectedIncome: 120000, loanTerm: 6, status: 'pending',
      createdAt: '2024-08-01T08:00:00Z', updatedAt: '2024-08-01T08:00:00Z'
    },
    {
      id: 'l2', farmerId: 'u5', farmerName: 'Maria Santos', farmerLocation: 'Kidapawan, North Cotabato',
      amount: 80000, purpose: 'Purchase irrigation equipment and expand organic vegetable farm',
      farmSize: '3 hectares', cropType: 'Organic Vegetables (Carrots, Corn, Petchay)', estimatedHarvest: '2024-12-01',
      expectedIncome: 200000, loanTerm: 12, status: 'under_review',
      createdAt: '2024-07-28T10:00:00Z', updatedAt: '2024-07-30T10:00:00Z'
    },
    {
      id: 'l3', farmerId: 'u6', farmerName: 'Pedro Reyes', farmerLocation: 'Midsayap, Cotabato',
      amount: 30000, purpose: 'Maintain and expand banana plantation',
      farmSize: '1.5 hectares', cropType: 'Cavendish Bananas', estimatedHarvest: '2025-02-01',
      expectedIncome: 75000, loanTerm: 6, status: 'approved', lenderId: 'u3',
      createdAt: '2024-07-15T08:00:00Z', updatedAt: '2024-07-20T10:00:00Z'
    },
  ],
  notifications: [
    {
      id: 'n1', userId: 'u1', title: 'New Order Received!',
      message: 'Ana Gonzales placed an order for Eggplant and Bananas (Order #SKL-20240803-003)',
      type: 'order', isRead: false, createdAt: '2024-08-03T09:00:00Z'
    },
    {
      id: 'n2', userId: 'u2', title: 'New Message',
      message: 'Juan dela Cruz replied to your message',
      type: 'message', isRead: false, createdAt: '2024-08-03T08:15:00Z'
    },
    {
      id: 'n3', userId: 'u3', title: 'New Loan Application',
      message: 'Juan dela Cruz submitted a loan application for ₱50,000',
      type: 'loan', isRead: false, createdAt: '2024-08-01T08:05:00Z'
    },
    {
      id: 'n4', userId: 'u6', title: 'Loan Approved!',
      message: 'Your loan application for ₱30,000 has been approved by Michael Tan',
      type: 'loan', isRead: true, createdAt: '2024-07-20T10:00:00Z'
    },
  ],
  favorites: [
    { id: 'f1', buyerId: 'u2', productId: 'p1' },
    { id: 'f2', buyerId: 'u2', productId: 'p6' },
  ],
}

export function getData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  saveData(seedData)
  return seedData
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function resetData(): void {
  localStorage.removeItem(STORAGE_KEY)
  saveData(seedData)
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function setSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId)
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function generateOrderNumber(): string {
  const date = new Date()
  const dateStr = date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0')
  const seq = Math.floor(Math.random() * 999) + 1
  return `SKL-${dateStr}-${seq.toString().padStart(3, '0')}`
}

export function makeConversationId(id1: string, id2: string): string {
  const sorted = [id1, id2].sort()
  return `conv_${sorted[0]}_${sorted[1]}`
}
