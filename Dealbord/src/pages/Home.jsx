import { useState, useEffect, useCallback } from 'react'
import { getDeals } from '../lib/supabase'
import DealCard from '../components/DealCard'
import FilterBar from '../components/FilterBar'

export default function Home() {
  const [deals, setDeals] = useState([])
  const [allDeals, setAllDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('Alla')

  // Hämta alla deals en gång för att bygga kategori-listan
  useEffect(() => {
    getDeals().then(data => setAllDeals(data)).catch(() => {})
  }, [])

  const categories = [...new Set(allDeals.map(d => d.category))].sort()

  const fetchDeals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getDeals({ category })
      setDeals(data)
    } catch (err) {
      setError('Kunde inte hämta deals. Kontrollera din anslutning.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  return (
    <main className="main">
      <div className="hero">
        <h1>Bästa deals just nu</h1>
        <p>
          Hitta aktuella kampanjer och rabatter från svenska butiker – uppdateras dagligen
          med erbjudanden inom mode, elektronik, sport, hem och mycket mer.
        </p>
      </div>

      <div className="controls">
        <FilterBar active={category} onChange={setCategory} categories={categories} />
      </div>

      {loading && (
        <div className="state-container">
          <div className="spinner" />
        </div>
      )}

      {error && (
        <div className="state-container error">
          <p>{error}</p>
          <button onClick={fetchDeals} className="btn-primary">Försök igen</button>
        </div>
      )}

      {!loading && !error && deals.length === 0 && (
        <div className="state-container">
          <p className="empty-text">Inga deals hittades.</p>
        </div>
      )}

      {!loading && !error && deals.length > 0 && (
        <div className="deal-grid">
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </main>
  )
}
