export const Input = ({ label, type = 'text', value, onChange, placeholder, min, max }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="input-field"
      />
    </div>
  )
}
