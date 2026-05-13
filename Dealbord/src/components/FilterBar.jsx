export default function FilterBar({ active, onChange, categories }) {
  if (!categories.length) return null

  return (
    <div className="filter-bar">
      <button
        className={`filter-btn${active === 'Alla' ? ' active' : ''}`}
        onClick={() => onChange('Alla')}
      >
        Alla
      </button>
      {categories.map(cat => (
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
