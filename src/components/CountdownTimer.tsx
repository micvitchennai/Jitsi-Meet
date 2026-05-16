"use client";

import * as React from "react";

function getTimeLeft(target: string) {
  const total = Math.max(0, new Date(target).getTime() - Date.now());
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  return { total, days, hours, minutes, seconds };
}

export function CountdownTimer({ target, compact = false }: { target: string; compact?: boolean }) {
  const [timeLeft, setTimeLeft] = React.useState<ReturnType<typeof getTimeLeft> | null>(null);

  React.useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  if (!timeLeft) return null;
  if (timeLeft.total <= 0) return <span className="animate-pulse text-primary">LIVE NOW</span>;

  if (compact) {
    return (
      <div className="flex gap-2 text-sm font-black tracking-tighter">
        <span className="text-white">{timeLeft.days}d</span>
        <span className="text-white">{timeLeft.hours}h</span>
        <span className="text-white">{timeLeft.minutes}m</span>
      </div>
    );
  }

  const timeUnits = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex flex-col items-center group">
          <div className="relative">
            {/* Outer Glow */}
            <div className="absolute -inset-1.5 bg-[#79f2a1]/20 blur-xl rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex flex-col items-center justify-center min-w-[90px] sm:min-w-[120px] h-[100px] sm:h-[130px] bg-black/80 border-2 border-[#79f2a1]/30 rounded-2xl backdrop-blur-2xl shadow-[inset_0_0_20px_rgba(121,242,161,0.05)] overflow-hidden">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#79f2a1]/60 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#79f2a1]/60 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#79f2a1]/60 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#79f2a1]/60 rounded-br-lg" />

              {/* Digital Grid Pattern */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#79f2a1_1px,transparent_1px)] bg-[size:10px_10px]" />
              
              {/* Glass Reflection */}
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
              
              <span className="text-5xl sm:text-6xl font-black text-[#79f2a1] tracking-tighter z-10 drop-shadow-[0_0_12px_rgba(121,242,161,0.6)] font-mono">
                {String(unit.value).padStart(2, '0')}
              </span>
              
              {/* Scanline */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[11px] font-black tracking-[0.4em] text-[#79f2a1]/70 uppercase">
              {unit.label}
            </span>
            <div className="mt-1 h-0.5 w-4 bg-[#79f2a1]/30 rounded-full group-hover:w-8 transition-all duration-300" />
          </div>
        </div>
      ))}
    </div>
  );
}
