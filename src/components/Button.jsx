import React from 'react';

/**
 * Neo-Brutalist Button Component
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  disabled = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ...rest
}) {
  const baseStyles = [
    'inline-flex items-center justify-center font-sans font-bold',
    'border-2 border-[#171717] transition-all duration-100',
    'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    'focus-visible:outline-2 focus-visible:outline-[#FFD84D] focus-visible:outline-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none',
    'select-none rounded-sm',
  ].join(' ');

  const sizeStyles = {
    sm:  'text-xs px-3 py-1.5 gap-1.5',
    md:  'text-sm px-4 py-2 gap-2',
    lg:  'text-sm px-5 py-2.5 gap-2',
  };

  const variantStyles = {
    primary:   'bg-[#FFD84D] text-[#171717] shadow-[3px_3px_0_#171717] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#171717]',
    secondary: 'bg-[#FFFFFF] text-[#171717] shadow-[3px_3px_0_#171717] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#171717]',
    outline:   'bg-transparent text-[#171717] shadow-[2px_2px_0_#171717] hover:bg-[#EAE6DC] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_#171717]',
    ghost:     'bg-transparent text-[#171717] border-transparent shadow-none hover:bg-[#EAE6DC] hover:border-[#171717]',
    danger:    'bg-[#FF7777] text-[#171717] shadow-[3px_3px_0_#171717] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#171717]',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {leftIcon && <span className="inline-flex items-center shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex items-center shrink-0">{rightIcon}</span>}
    </button>
  );
}
