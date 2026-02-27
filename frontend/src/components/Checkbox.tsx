import { InputHTMLAttributes, forwardRef } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="checkbox"
          className={`
            w-4 h-4 text-primary border-gray-300 rounded
            focus:ring-2 focus:ring-primary focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
            ${error ? 'border-danger' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3">
          <label className="text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
          {error && (
            <p className="mt-1 text-sm text-danger">{error}</p>
          )}
        </div>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
