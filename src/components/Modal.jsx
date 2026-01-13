"use client"

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-secondary)]/90 border border-[var(--color-primary)]/30 rounded-sm p-6 w-full max-w-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h2>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
