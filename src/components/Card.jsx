export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-[var(--color-bg-secondary)]/50 backdrop-blur-md rounded-sm border border-[var(--color-bg-tertiary)] p-6 shadow-lg hover:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  )
}
