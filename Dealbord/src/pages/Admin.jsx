import { useState, useEffect } from 'react'
import { getAllDealsAdmin, createDeal, updateDeal, deleteDeal } from '../lib/supabase'
const EMPTY_FORM = {
  title: '',
  store: '',
  category: '',
  image_url: '',
  price: '',
  discount: '',
  affiliate_link: '',
  expires_at: '',
  active: true,
}

function LoginGate({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('db_admin', '1')
      onLogin()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-box">
        <h2>Admin</h2>
        <p>Ange lösenord för att fortsätta</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            className={`form-input${error ? ' input-error' : ''}`}
            autoFocus
          />
          {error && <p className="form-error">Fel lösenord</p>}
          <button type="submit" className="btn-primary full-width">Logga in</button>
        </form>
      </div>
    </div>
  )
}

function DealForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="deal-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label>Titel *</label>
          <input required className="form-input" value={form.title}
            onChange={e => set('title', e.target.value)} placeholder="T.ex. 30% på allt" />
        </div>
        <div className="form-field">
          <label>Butik *</label>
          <input required className="form-input" value={form.store}
            onChange={e => set('store', e.target.value)} placeholder="T.ex. Zalando" />
        </div>
        <div className="form-field">
          <label>Kategori *</label>
          <input required className="form-input" value={form.category}
            onChange={e => set('category', e.target.value)} placeholder="T.ex. Mode, Elektronik, Sport" />
        </div>
        <div className="form-field">
          <label>Rabatt-text</label>
          <input className="form-input" value={form.discount}
            onChange={e => set('discount', e.target.value)} placeholder="T.ex. -30% eller Fri frakt" />
        </div>
        <div className="form-field">
          <label>Pris</label>
          <input className="form-input" value={form.price}
            onChange={e => set('price', e.target.value)} placeholder="T.ex. 299 kr" />
        </div>
        <div className="form-field">
          <label>Bild-URL</label>
          <input className="form-input" type="url" value={form.image_url}
            onChange={e => set('image_url', e.target.value)} placeholder="https://..." />
        </div>
        <div className="form-field full-col">
          {/* Byt ut till Adtraction/Awin-länk här */}
          <label>Affiliate-länk *</label>
          <input required className="form-input" type="url" value={form.affiliate_link}
            onChange={e => set('affiliate_link', e.target.value)}
            placeholder="https://track.adtraction.com/..." />
        </div>
        <div className="form-field">
          <label>Utgångsdatum *</label>
          <input required className="form-input" type="datetime-local" value={form.expires_at}
            onChange={e => set('expires_at', e.target.value)} />
        </div>
        <div className="form-field checkbox-field">
          <label>
            <input type="checkbox" checked={form.active}
              onChange={e => set('active', e.target.checked)} />
            Aktiv
          </label>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Avbryt</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Sparar...' : 'Spara deal'}
        </button>
      </div>
    </form>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('db_admin') === '1')
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // deal object or 'new'
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await getAllDealsAdmin()
      setDeals(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed) load()
  }, [authed])

  async function handleSave(form) {
    const payload = {
      ...form,
      expires_at: new Date(form.expires_at).toISOString(),
    }
    if (editing === 'new') {
      await createDeal(payload)
    } else {
      await updateDeal(editing.id, payload)
    }
    setEditing(null)
    load()
  }

  async function handleDelete(id) {
    await deleteDeal(id)
    setDeleteConfirm(null)
    load()
  }

  function formatExpiry(iso) {
    return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />

  return (
    <main className="admin-main">
      <div className="admin-header">
        <h1>Admin – Dealboard</h1>
        <button className="btn-primary" onClick={() => setEditing('new')}>+ Ny deal</button>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing === 'new' ? 'Lägg till deal' : 'Redigera deal'}</h2>
            <DealForm
              initial={editing === 'new' ? null : {
                ...editing,
                expires_at: editing.expires_at
                  ? new Date(editing.expires_at).toISOString().slice(0, 16)
                  : '',
              }}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal-small" onClick={e => e.stopPropagation()}>
            <h2>Ta bort deal?</h2>
            <p>"{deleteConfirm.title}" tas bort permanent.</p>
            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Avbryt</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Ta bort</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="state-container"><div className="spinner" /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Butik</th>
                <th>Kategori</th>
                <th>Rabatt</th>
                <th>Utgår</th>
                <th>Status</th>
                <th>Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {deals.length === 0 && (
                <tr><td colSpan="7" className="empty-cell">Inga deals ännu</td></tr>
              )}
              {deals.map(deal => (
                <tr key={deal.id} className={deal.active ? '' : 'row-inactive'}>
                  <td>{deal.title}</td>
                  <td>{deal.store}</td>
                  <td>{deal.category}</td>
                  <td>{deal.discount || deal.price || '–'}</td>
                  <td>{formatExpiry(deal.expires_at)}</td>
                  <td>
                    <span className={`status-badge ${deal.active ? 'status-active' : 'status-inactive'}`}>
                      {deal.active ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button className="btn-icon" onClick={() => setEditing(deal)}>✏️</button>
                    <button className="btn-icon btn-icon-danger" onClick={() => setDeleteConfirm(deal)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
