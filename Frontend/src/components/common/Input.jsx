import '../../styles/components.css';

function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  hint,
  error,
  icon,
  required = false,
  ...rest
}) {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div className="input-icon-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={id}
          type={type}
          className={`input-field${icon ? ' has-icon' : ''}${error ? ' input-field-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          {...rest}
        />
      </div>
      {hint && !error && <span className="input-hint">{hint}</span>}
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}

export default Input;
