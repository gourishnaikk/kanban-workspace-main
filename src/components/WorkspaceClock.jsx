import React, { useState, useEffect } from 'react';
import { Clock, Activity } from 'lucide-react';

/**
 * Neo-Brutalist Workspace Clock
 * Displays live workspace time, date, and active status with interval cleanup.
 */
export default function WorkspaceClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Start interval on mount
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Return cleanup function to clear interval on unmount
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-[#171717] border-2 border-[#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-left overflow-hidden">
      {/* Left: Active Indicator & Date */}
      <div className="flex items-center gap-4 p-4 sm:p-5 flex-1">
        <div className="w-9 h-9 bg-[#A8E6CF] border-2 border-[#A8E6CF] flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-[#171717] animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[#A8E6CF]" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A8E6CF]">
              Workspace Active
            </span>
          </div>
          <p className="text-xs text-[#EAE6DC] font-semibold mt-0.5">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Right: Live Clock Display */}
      <div className="bg-[#FFD84D] border-l-2 border-[#171717] flex items-center gap-2 px-5 py-4 self-stretch">
        <Clock className="w-4 h-4 text-[#171717]" />
        <span className="font-mono text-base font-black text-[#171717] tracking-tight whitespace-nowrap">
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
