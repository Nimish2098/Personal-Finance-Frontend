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
    primary: "bg-[var(--color-primary)] text-white hover:brightness-110 shadow-md shadow-blue-500/20",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900",
    tertiary: "bg-transparent text-[var(--color-secondary)] hover:text-[var(--color-primary)]",
    outline: "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-blue-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
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
