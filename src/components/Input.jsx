import React from 'react';

/**
 * Neo-Brutalist Input Component
 */
export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  ...rest
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left font-sans">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs font-extrabold uppercase tracking-widest text-[#171717]"
        >
          {label} {required && <span className="text-[#FF7777]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-[#555555] pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full bg-[#FFFFFF] text-[#171717] placeholder:text-[#999] text-sm
            border-2 rounded-sm
            ${error ? 'border-[#FF7777] focus:border-[#FF7777]' : 'border-[#171717] focus:border-[#171717]'}
            ${leftIcon ? 'pl-9' : 'pl-3'}
            ${rightIcon ? 'pr-9' : 'pr-3'}
            py-2.5 outline-none transition-all duration-100
            focus:shadow-[2px_2px_0_#FFD84D]
            disabled:bg-[#EAE6DC] disabled:text-[#555555] disabled:cursor-not-allowed
            ${className}
          `}
          {...rest}
        />

        {rightIcon && (
          <div className="absolute right-3 text-[#555555] flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-[#FF7777] font-bold">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#555555] font-medium">{helperText}</p>
      ) : null}
    </div>
  );
}
