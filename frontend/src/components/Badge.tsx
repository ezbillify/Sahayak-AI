interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false
}: BadgeProps) {
  const variants = {
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-cyan-100 text-cyan-700',
    gray: 'bg-gray-100 text-gray-700'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  return (
    <span
      className={`
        inline-flex items-center font-semibold
        ${variants[variant]}
        ${sizes[size]}
        ${rounded ? 'rounded-full' : 'rounded'}
      `}
    >
      {children}
    </span>
  )
}
