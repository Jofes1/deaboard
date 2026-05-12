import { CATEGORIES } from './DealCard'

export default function FilterBar({ active, onChange }) {
  return (
    <div className="filter-bar">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={`filter-btn${active === cat ? ' active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
