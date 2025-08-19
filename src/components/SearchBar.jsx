import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="searchbar grow">
      <input
        className="grow"
        placeholder="Search notes..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}