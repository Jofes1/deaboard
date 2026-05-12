import { useState, useEffect, useCallback } from 'react'
import { getDeals } from '../lib/supabase'
import DealCard from '../components/DealCard'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'

export default function Home() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('Alla')
  const [search, setSearch] = useState('')

  const fetchDeals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getDeals({ category, search })
      setDeals(data)
    } catch (err) {
      setError('Kunde inte hämta deals. Kontrollera din anslutning.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [category, search])

  useEffect(() => {
    const timer = setTimeout(fetchDeals, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [fetchDeals, search])

  return (
    <main className="main">
      <div className="hero">
        <h1>Bästa deals just nu</h1>
        <p>Aktuella kampanjer &amp; rabatter från svenska butiker</p>
      </div>

      <div className="controls">
        <SearchBar onSearch={setSearch} />
        <FilterBar active={category} onChange={setCategory} />
      </div>

      {loading && (
        <div className="state-container">
          <div className="spinner" />
          <p>Hämtar deals...</p>
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
          <p className="empty-text">Inga deals hittades{search ? ` för "${search}"` : ''}.</p>
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
