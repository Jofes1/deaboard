export const CATEGORIES = ['Alla', 'Mode', 'Elektronik', 'Sport', 'Hem', 'Skönhet', 'Mat', 'Resor', 'Övrigt']

function daysLeft(expiresAt) {
  const diff = new Date(expiresAt) - new Date()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days <= 0) return null
  if (days === 1) return '1 dag kvar'
  return `${days} dagar kvar`
}

export default function DealCard({ deal }) {
  const remaining = daysLeft(deal.expires_at)
  const urgent = remaining && parseInt(remaining) <= 3

  return (
    <a
      href={deal.affiliate_link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="deal-card"
    >
      <div className="deal-image-wrap">
        {deal.image_url ? (
          <img
            src={deal.image_url}
            alt={deal.title}
            loading="lazy"
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="deal-image-placeholder">{deal.store?.[0] ?? '?'}</div>
        )}
        {deal.discount && (
          <span className="deal-badge">{deal.discount}</span>
        )}
      </div>
      <div className="deal-body">
        <p className="deal-store">{deal.store}</p>
        <h3 className="deal-title">{deal.title}</h3>
        {deal.price && (
          <p className="deal-price">{deal.price}</p>
        )}
        <div className="deal-footer">
          <span className="deal-category">{deal.category}</span>
          {remaining && (
            <span className={`deal-expiry${urgent ? ' urgent' : ''}`}>
              {remaining}
            </span>
          )}
        </div>
      </div>
    </a>
  )
}
