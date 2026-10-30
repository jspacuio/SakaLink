import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconBox = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l6 3.46a2 2 0 0 0 2 0l6-3.46A2 2 0 0 0 21 16z"/>
  </svg>
)
const IconPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
import Layout from '../../components/Layout'
import type { Product, ProductCategory } from '../../types'
import { getProductImage } from '../../store'

const CATEGORIES: ProductCategory[] = ['Vegetables', 'Fruits', 'Rice', 'Corn', 'Root Crops', 'Livestock', 'Poultry', 'Other']
const UNITS = ['kg', 'piece', 'bundle', 'sack', 'box', 'tray', 'liter', 'dozen']

interface ProductForm {
  name: string; category: ProductCategory; description: string
  price: string; quantity: string; unit: string
  harvestDate: string; location: string; image: string; active: boolean
}

const emptyForm: ProductForm = {
  name: '', category: 'Vegetables', description: '', price: '', quantity: '',
  unit: 'kg', harvestDate: '', location: '', image: '', active: true
}

export default function FarmerProducts() {
  const { currentUser, data, addProduct, updateProduct, deleteProduct } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [search, setSearch] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (!currentUser) return null
  const myProducts = data.products.filter(p => p.farmerId === currentUser.id)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...emptyForm, location: currentUser.address })
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditingId(p.id)
    setForm({
      name: p.name, category: p.category, description: p.description,
      price: String(p.price), quantity: String(p.quantity), unit: p.unit,
      harvestDate: p.harvestDate, location: p.location, image: p.image, active: p.active
    })
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditingId(null); setForm(emptyForm) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price || !form.quantity) return
    const image = form.image.trim() || getProductImage(form.name)

    if (editingId) {
      updateProduct(editingId, {
        name: form.name.trim(), category: form.category, description: form.description.trim(),
        price: Number(form.price), quantity: Number(form.quantity), unit: form.unit,
        harvestDate: form.harvestDate, location: form.location.trim(), image, active: form.active
      })
      setSuccess('Product updated successfully!')
    } else {
      addProduct({
        farmerId: currentUser.id, farmerName: currentUser.name,
        name: form.name.trim(), category: form.category, description: form.description.trim(),
        price: Number(form.price), quantity: Number(form.quantity), unit: form.unit,
        harvestDate: form.harvestDate, location: form.location.trim() || currentUser.address,
        image, active: form.active
      })
      setSuccess('Product added successfully!')
    }
    closeModal()
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleDelete = (id: string) => {
    deleteProduct(id)
    setConfirmDelete(null)
    setSuccess('Product deleted.')
    setTimeout(() => setSuccess(''), 3000)
  }

  const upd = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <Layout title="My Products">
      <div style={{ maxWidth: 1100 }}>
        <div className="page-header">
          <div>
            <h2 className="page-title">My Products</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>{data.products.filter(p => p.farmerId === currentUser.id).length} product(s) listed</p>
          </div>
          <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input className="input-field" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        </div>

        {myProducts.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2a10 10 0 0 0 0 20"/><path d="M2 12h20"/><path d="M12 2c-2.5 3-4 6.5-4 10s1.5 7 4 10"/><path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10"/></svg>
            </div>
            <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, color: 'var(--forest)', marginBottom: 8 }}>No products yet</h3>
            <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Add your first product to start selling!</p>
            <button className="btn-primary" onClick={openAdd}>+ Add First Product</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {myProducts.map(p => (
              <div key={p.id} className="product-card">
                <div style={{ position: 'relative' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} onError={e => (e.currentTarget.src = getProductImage('default'))} />
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <span className={`badge ${p.active ? 'badge-active' : 'badge-cancelled'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>
                    {p.category}
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <h4 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: 'var(--dark)', marginBottom: 6 }}>{p.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--forest)' }}>₱{p.price}/{p.unit}</span>
                    <span style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}><IconBox />{p.quantity} {p.unit}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IconPin />{p.location} · ★ {p.rating > 0 ? p.rating.toFixed(1) : 'New'} · {p.sold} sold
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-outline btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => openEdit(p)}><IconEdit /> Edit</button>
                    <button className="btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setConfirmDelete(p.id)}><IconTrash /></button>
                    <button
                      className="btn-sm"
                      style={{ background: p.active ? '#FEF3C7' : '#D1FAE5', border: 'none', borderRadius: 8, cursor: 'pointer', padding: '6px 10px', fontSize: 12, fontWeight: 600 }}
                      onClick={() => updateProduct(p.id, { active: !p.active })}
                    >
                      {p.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="modal">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 20, color: 'var(--forest)' }}>
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted)' }}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input className="input-field" placeholder="e.g. Fresh Tomatoes" value={form.name} onChange={e => upd('name', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="input-field" value={form.category} onChange={e => upd('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="input-field" rows={3} placeholder="Describe your product..." value={form.description} onChange={e => upd('description', e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price per Unit *</label>
                    <input className="input-field" type="number" placeholder="80" min="1" value={form.price} onChange={e => upd('price', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select className="input-field" value={form.unit} onChange={e => upd('unit', e.target.value)}>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Available Quantity *</label>
                    <input className="input-field" type="number" placeholder="100" min="1" value={form.quantity} onChange={e => upd('quantity', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Harvest Date</label>
                    <input className="input-field" type="date" value={form.harvestDate} onChange={e => upd('harvestDate', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Farm Location</label>
                  <input className="input-field" placeholder="e.g. Kabacan, Cotabato" value={form.location} onChange={e => upd('location', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL (optional)</label>
                  <input className="input-field" placeholder="Leave blank for auto-selected image" value={form.image} onChange={e => upd('image', e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <input type="checkbox" id="active" checked={form.active} onChange={e => upd('active', e.target.checked)} />
                  <label htmlFor="active" style={{ fontSize: 14, fontWeight: 600 }}>Active listing (visible in marketplace)</label>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {editingId ? <><IconCheck /> Update Product</> : '+ Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 380 }}>
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </div>
                <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, marginTop: 12, marginBottom: 8 }}>Delete Product?</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDelete(null)}>Cancel</button>
                  <button className="btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(confirmDelete)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
