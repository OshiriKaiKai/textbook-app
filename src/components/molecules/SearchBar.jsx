export const SearchBar = ({ value, onChange, placeholder = '本のタイトル・著者名で検索...' }) => {
  return (
    <div className="search-bar-wrapper">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  )
}
