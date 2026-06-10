"use client";

import React from "react";
import { ShieldCheck, MoreHorizontal, X, ArrowLeft, Wifi, Battery, Signal } from "lucide-react";

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: string;
  onBack: () => void;
  showBack: boolean;
  projectName: string;
}

export default function MobileFrame({
  children,
  activeTab,
  onBack,
  showBack,
  projectName,
}: MobileFrameProps) {
  // Format current local time (e.g. 15:53)
  const [timeStr, setTimeStr] = React.useState("16:06");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto max-w-[390px] w-full h-[812px] bg-[#0c0a18] rounded-[52px] shadow-2xl border-[10px] border-[#221f3b] overflow-hidden flex flex-col scale-[0.98] sm:scale-100 transition-all duration-300">
      {/* Top Notch / Dynamic Island */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
        <div className="w-32 h-[18px] bg-black rounded-b-xl flex items-center justify-between px-3">
          <div className="w-3 h-3 rounded-full bg-[#100e21]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#1a1733]" />
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-11 bg-[#09080f] px-6 pt-3 flex justify-between items-center text-xs font-semibold text-white/90 select-none z-40">
        <div>{timeStr}</div>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5 text-white/80" />
          <span className="text-[10px] tracking-wide text-white/60">Safaricom ET</span>
          <Wifi className="w-3.5 h-3.5 text-white/80" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] text-white/70">92%</span>
            <Battery className="w-4 h-4 text-white/90" />
          </div>
        </div>
      </div>

      {/* M-PESA App Mini-App Header Wrapper */}
      <div className="h-[56px] bg-[#00a859] px-4 flex justify-between items-center text-white z-40 shadow-md">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <div className="w-7 h-7 flex items-center justify-center bg-white/20 rounded-full font-bold text-xs select-none">
              M
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[15px] tracking-wide uppercase">M-PESA</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded-full font-medium">Mini-App</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-white/80 font-medium">
              <span>{projectName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300/20" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
          <div className="w-px h-5 bg-white/20 mx-0.5" />
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Screen Frame Content Area */}
      <div className="flex-1 w-full bg-[#0c0a18] overflow-y-auto no-scrollbar relative flex flex-col">
        {children}
      </div>

      {/* Home Indicator bar at the bottom */}
      <div className="h-6 bg-[#0c0a18] flex justify-center items-center select-none z-40">
        <div className="w-32 h-[5px] bg-white/20 rounded-full" />
      </div>
    </div>
  );
}
