import { useRef } from 'react'

export const CATEGORIES = ['Alla', 'Mode', 'Elektronik', 'Sport', 'Hem', 'Skönhet', 'Mat', 'Resor', 'Övrigt']

function daysLeft(expiresAt) {
  const diff = new Date(expiresAt) - new Date()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days <= 0) return null
  if (days === 1) return '1 dag kvar'
  return `${days} dagar kvar`
}

export default function DealCard({ deal }) {
  const cardRef = useRef(null)
  const remaining = daysLeft(deal.expires_at)
  const urgent = remaining && parseInt(remaining) <= 3

  function handleImageLoad(e) {
    const { naturalWidth, naturalHeight } = e.target
    if (cardRef.current) {
      // Cappa ratio till max 4 så breda banners kan dela rad med andra kort
      const ratio = Math.min(naturalWidth / naturalHeight, 4)
      cardRef.current.style.setProperty('--ratio', ratio)
    }
  }

  return (
    <a
      ref={cardRef}
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
            onLoad={handleImageLoad}
            onError={e => { e.target.parentElement.style.display = 'none' }}
          />
        ) : (
          <div className="deal-image-placeholder">{deal.store?.[0] ?? '?'}</div>
        )}
        {deal.discount && (
          <span className="deal-badge">{deal.discount}</span>
        )}
      </div>

      <div className="deal-overlay">
        <p className="deal-store">{deal.store}</p>
        <h3 className="deal-title">{deal.title}</h3>
        <div className="deal-footer">
          {deal.price && <span className="deal-price">{deal.price}</span>}
          {remaining && (
            <span className={`deal-expiry${urgent ? ' urgent' : ''}`}>{remaining}</span>
          )}
        </div>
      </div>
    </a>
  )
}
