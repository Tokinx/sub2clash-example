export function Input({ label, value, onChange, placeholder, className = "", ...props }) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">{label}</span>
      <input
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="field-input"
      />
    </label>
  );
}

export function Textarea({ label, value, onChange, placeholder, rows = 6, className = "" }) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        readOnly={!onChange}
        placeholder={placeholder}
        className="field-input min-h-[8rem] resize-y"
      />
    </label>
  );
}

export function Select({ label, value, onChange, options, className = "" }) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-input"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({ label, checked, onChange, compact = false }) {
  if (compact) {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[var(--brand)]" : "bg-[var(--warm-gray)]"}`}
      >
        <span
          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition ${checked ? "left-[23px]" : "left-[3px]"}`}
        />
      </button>
    );
  }

  return (
    <label className="flex min-h-[2.875rem] items-center justify-between rounded-[0.72rem] border border-[var(--border)] bg-[rgba(255,255,255,0.4)] px-3.5 py-2.5 text-sm">
      <span className="pr-3 leading-6">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[var(--brand)]" : "bg-[var(--warm-gray)]"}`}
      >
        <span
          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition ${checked ? "left-[23px]" : "left-[3px]"}`}
        />
      </button>
    </label>
  );
}
