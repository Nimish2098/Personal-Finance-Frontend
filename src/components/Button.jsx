export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  const baseClasses = "font-bold uppercase tracking-wider rounded-sm transition-all duration-300 cursor-pointer relative overflow-hidden"

  const variants = {
    primary: "bg-[var(--color-primary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-primary-dark)] hover:shadow-[0_0_15px_var(--color-primary)]",
    secondary: "bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white hover:shadow-[0_0_15px_var(--color-secondary)]",
    outline: "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-primary)]",
    danger: "bg-[var(--color-error)]/10 border border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white hover:shadow-[0_0_15px_var(--color-error)]",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
