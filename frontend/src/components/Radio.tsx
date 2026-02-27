import { InputHTMLAttributes, forwardRef } from 'react'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  label?: string
}

export default function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
  label
}: RadioGroupProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700 cursor-pointer">
                {option.label}
              </label>
              {option.description && (
                <p className="text-sm text-gray-500">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-danger">{error}</p>
      )}
    </div>
  )
}
