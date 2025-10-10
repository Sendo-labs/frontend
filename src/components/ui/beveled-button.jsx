import React from "react";

export function BeveledButton({ 
  children, 
  className = "", 
  disabled = false,
  onClick,
  type = "button",
  size = "default",
  variant = "primary"
}) {
  const baseStyles = "relative font-bold transition-all duration-300 flex items-center justify-center text-white hover:shadow-2xl hover:shadow-[#FF5C1A]/60 hover:scale-105 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C]",
    secondary: "bg-white/10 hover:bg-white/20 border border-white/20"
  };
  
  const sizeStyles = {
    sm: "h-10 px-4 text-sm",
    default: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
    icon: "h-12 w-12"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        borderRadius: 0
      }}
    >
      {children}
    </button>
  );
}