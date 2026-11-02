import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Neo-Brutalist Modal Component
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/60"
        onClick={onClose}
      />

      {/* Modal Dialog Body */}
      <div 
        className={`
          relative w-full ${sizeClasses[size]} bg-[#FFFFFF] p-0
          border-2 border-[#171717] shadow-[6px_6px_0_#171717] z-10 overflow-hidden
          text-left
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b-2 border-[#171717] bg-[#FFD84D]">
          <div>
            {title && (
              <h2 className="text-lg font-extrabold text-[#171717] leading-tight uppercase tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-[#555555] mt-1 font-semibold">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 border-2 border-[#171717] flex items-center justify-center text-[#171717] hover:bg-[#171717] hover:text-[#FFD84D] transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh] bg-[#F5F2EA]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-5 border-t-2 border-[#171717] bg-[#FFFFFF] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
