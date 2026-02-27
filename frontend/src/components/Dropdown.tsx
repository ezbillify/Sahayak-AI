import { useState, useRef, useEffect } from 'react'

interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface DropdownProps {
  trigger: React.ReactNode
  options: DropdownOption[]
  onSelect: (value: string) => void
  align?: 'left' | 'right'
}

export default function Dropdown({ trigger, options, onSelect, align = 'left' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (value: string) => {
    onSelect(value)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
              >
                {option.icon && <span className="text-gray-500">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
