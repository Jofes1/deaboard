import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">D</span>
          <span className="logo-text">Dealboard</span>
        </Link>
        <span className="navbar-tagline">Svenska deals &amp; rabatter</span>
      </div>
    </nav>
  )
}
