import React from 'react';

// Accent colors for stat cards
const ACCENT_VARIANTS = ['bg-[#FFD84D]', 'bg-[#A8E6CF]', 'bg-[#FF9B85]', 'bg-[#B8C5FF]'];

let accentIndex = 0;

/**
 * Neo-Brutalist Stats Card Component
 * 
 * @param {Object} props
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} [props.hint]
 * @param {string} [props.accentColor] - Optional accent override
 * @param {number} [props.index] - Index for auto accent color cycling
 */
export default function StatsCard({
  label,
  value,
  hint,
  className = '',
  index = 0,
}) {
  const accent = ACCENT_VARIANTS[index % ACCENT_VARIANTS.length];

  return (
    <div className={`bg-[#FFFFFF] border-2 border-[#171717] shadow-[4px_4px_0_#171717] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0_#171717] transition-all duration-100 flex flex-col min-h-[100px] font-sans ${className}`}>
      {/* Accent top bar */}
      <div className={`${accent} h-2 border-b-2 border-[#171717]`} />
      
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-[#555555] uppercase tracking-widest">
            {label}
          </span>
          {hint && (
            <span className="text-[10px] font-bold text-[#555555] bg-[#EAE6DC] border border-[#171717]/20 px-2 py-0.5">
              {hint}
            </span>
          )}
        </div>

        <div className="mt-3">
          <span className="text-4xl font-black tracking-tight text-[#171717]">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
