export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-2 bg-white border border-[var(--color-bg-tertiary)] rounded-sm text-black placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all duration-300 ${className}`}
        {...props}
      />
      {error && <p className="text-[var(--color-error)] text-sm mt-1">{error}</p>}
    </div>
  )
}
