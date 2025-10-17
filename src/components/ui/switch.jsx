import * as React from "react"

const Switch = React.forwardRef(({ className = "", checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 items-center transition-colors ${
        checked 
          ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF223B]' 
          : 'bg-[#F2EDE7]/20'
      } ${className}`}
      style={{ borderRadius: 0 }}
      ref={ref}
      {...props}
    >
      <span
        className={`block h-5 w-5 bg-white shadow-lg transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
        style={{ borderRadius: 0 }}
      />
    </button>
  )
})
Switch.displayName = "Switch"

export { Switch }