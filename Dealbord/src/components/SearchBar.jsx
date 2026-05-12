import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('')

  function handleChange(e) {
    setValue(e.target.value)
    onSearch(e.target.value)
  }

  function handleClear() {
    setValue('')
    onSearch('')
  }

  return (
    <div className="search-bar">
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        placeholder="Sök deals, butiker..."
        value={value}
        onChange={handleChange}
        className="search-input"
      />
      {value && (
        <button className="search-clear" onClick={handleClear} aria-label="Rensa">✕</button>
      )}
    </div>
  )
}
