"use client";

import React from "react";
import { Search, MapPin, Ticket, Car, UtensilsCrossed, Film, ShieldAlert, Award, ArrowUpRight, ArrowRight, ChevronDown } from "lucide-react";

interface HomeTabProps {
  onNavigate: (tab: string) => void;
  balance: number;
  location: string;
  onLocationChange: (loc: string) => void;
  loyaltyPoints: number;
}

export default function HomeTab({
  onNavigate,
  balance,
  location,
  onLocationChange,
  loyaltyPoints,
}: HomeTabProps) {
  const [showLocDropdown, setShowLocDropdown] = React.useState(false);

  const locations = ["Bole", "Kazanchis", "Piazza", "Sarbet"];

  // Determine Loyalty Tier
  let tier = "Bronze";
  let nextTier = "Silver";
  let target = 300;
  if (loyaltyPoints >= 600) {
    tier = "Gold";
    nextTier = "Platinum";
    target = 1000;
  } else if (loyaltyPoints >= 300) {
    tier = "Silver";
    nextTier = "Gold";
    target = 600;
  }

  const progressPercent = Math.min(100, Math.round((loyaltyPoints / target) * 100));

  const handleLocSelect = (loc: string) => {
    onLocationChange(loc);
    setShowLocDropdown(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-5 relative">
      {/* Selam & Location Header */}
      <div className="flex justify-between items-center z-20">
        <div className="relative">
          <h2 className="text-xs text-white/55 font-semibold uppercase tracking-wider">Selam, Ethiopian User</h2>
          <button
            onClick={() => setShowLocDropdown(!showLocDropdown)}
            className="flex items-center gap-1.5 mt-0.5 text-sm font-bold text-white hover:text-accent-gold transition-colors active:scale-95 text-left"
          >
            <MapPin className="w-3.5 h-3.5 text-accent-gold" />
            <span className="text-sm font-extrabold text-white/95">{location}, Addis</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/50" />
          </button>

          {/* Location Dropdown menu */}
          {showLocDropdown && (
            <div className="absolute top-12 left-0 w-36 bg-[#16132d] border border-white/10 rounded-2xl p-2.5 shadow-xl space-y-1 z-50">
              <p className="text-[8px] text-white/45 font-bold uppercase tracking-wider px-2 pb-1.5 border-b border-white/5">Select Location</p>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocSelect(loc)}
                  className={`w-full text-left px-2 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    location === loc
                      ? "bg-mpesa-green/10 text-mpesa-green"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-gold to-yellow-500 flex items-center justify-center font-bold text-black border border-white/20 select-none text-sm shadow-md">
          EU
        </div>
      </div>

      {/* Wallet & Loyalty Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#120f26] via-[#1b173a] to-[#25204f] border border-white/10 p-5 shadow-xl glow-card">
        {/* Glow effect helper */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-mpesa-green/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-accent-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[11px] text-white/50 font-semibold uppercase tracking-widest">M-PESA WALLET</p>
            <h3 className="text-2xl font-black text-white mt-1">
              ETB {balance.toLocaleString()}
            </h3>
          </div>
          <span className="text-[10px] px-2 py-1 bg-mpesa-green/15 border border-mpesa-green/30 text-mpesa-green rounded-full font-bold tracking-wider animate-pulse flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>10% CASHBACK</span>
          </span>
        </div>

        {/* Loyalty score details */}
        <div className="pt-3 border-t border-white/5 space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-white/60 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-accent-gold fill-accent-gold/20" />
              <span>Loyalty Rewards Club</span>
            </span>
            <span className="font-extrabold text-accent-gold">{loyaltyPoints} PTS ({tier})</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-accent-gold to-yellow-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between text-[8px] text-white/45">
              <span>0 pts</span>
              <span>Next tier: {nextTier} ({target} pts)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-10">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search restaurants, movies, taxis..."
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm placeholder-white/40 focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 transition-all text-white/95"
        />
      </div>

      {/* Grid Categories */}
      <div className="z-10">
        <h3 className="text-xs text-white/55 font-bold uppercase tracking-wider mb-3 px-1">Super App Services</h3>
        <div className="grid grid-cols-4 gap-2">
          {/* Dining */}
          <button
            onClick={() => onNavigate("dining")}
            className="flex flex-col items-center justify-center py-3 px-1 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95 text-center group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform mb-1.5">
              <UtensilsCrossed className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-white/90">Dining</span>
          </button>

          {/* Events */}
          <button
            onClick={() => onNavigate("events")}
            className="flex flex-col items-center justify-center py-3 px-1 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95 text-center group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-1.5">
              <Ticket className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-white/90">Tickets</span>
          </button>

          {/* Rides */}
          <button
            onClick={() => onNavigate("rides")}
            className="flex flex-col items-center justify-center py-3 px-1 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95 text-center group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-1.5">
              <Car className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-white/90">Taxi</span>
          </button>

          {/* Cinema */}
          <button
            onClick={() => onNavigate("cinema")}
            className="flex flex-col items-center justify-center py-3 px-1 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95 text-center group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform mb-1.5">
              <Film className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-white/90">Cinema</span>
          </button>
        </div>
      </div>

      {/* Featured Addis Promos / Slider */}
      <div className="flex-1 flex flex-col min-h-0 z-10">
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-xs text-white/55 font-bold uppercase tracking-wider">Addis Highlights</h3>
          <span className="text-[10px] text-accent-gold font-bold flex items-center gap-0.5">
            Slide right
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Scroll container */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1 snap-x">
          {/* Cinema Card */}
          <div
            onClick={() => onNavigate("cinema")}
            className="flex-shrink-0 w-[240px] snap-center rounded-2xl bg-gradient-to-br from-[#f43f5e]/20 to-[#9f1239]/10 border border-rose-500/20 p-4 flex flex-col justify-between h-[135px] cursor-pointer hover:border-rose-500/40 transition-all hover:translate-y-[-2px]"
          >
            <div>
              <span className="text-[8px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30 uppercase tracking-widest">CINEMA</span>
              <h4 className="font-extrabold text-[14px] mt-2 text-white leading-tight">Chala Between Two Worlds</h4>
              <p className="text-[10px] text-white/60 mt-1">Century Mall Cinema • 180 ETB</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-rose-300 font-bold bg-rose-500/10 px-2 py-0.5 rounded-lg">Buy Seats</span>
              <span className="text-[9px] text-accent-gold font-extrabold">+15 Loyalty PTS</span>
            </div>
          </div>

          {/* Card 1 */}
          <div
            onClick={() => onNavigate("events")}
            className="flex-shrink-0 w-[240px] snap-center rounded-2xl bg-gradient-to-br from-[#b439e5]/20 to-[#6b21a8]/10 border border-purple-500/20 p-4 flex flex-col justify-between h-[135px] cursor-pointer hover:border-purple-500/40 transition-all hover:translate-y-[-2px]"
          >
            <div>
              <span className="text-[8px] font-bold px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 uppercase tracking-widest">CONCERT</span>
              <h4 className="font-extrabold text-[14px] mt-2 text-white leading-tight">Addis Fusion Concert</h4>
              <p className="text-[10px] text-white/60 mt-1">Bole Fana Park • 450 ETB</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-lg">Buy Tickets</span>
              <span className="text-[9px] text-accent-gold font-extrabold">+25 Loyalty PTS</span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate("dining")}
            className="flex-shrink-0 w-[240px] snap-center rounded-2xl bg-gradient-to-br from-[#dfa839]/20 to-[#a16207]/10 border border-accent-gold/20 p-4 flex flex-col justify-between h-[135px] cursor-pointer hover:border-accent-gold/40 transition-all hover:translate-y-[-2px]"
          >
            <div>
              <span className="text-[8px] font-bold px-2 py-0.5 bg-accent-gold/20 text-accent-gold rounded-full border border-accent-gold/30 uppercase tracking-widest">FINE DINING</span>
              <h4 className="font-extrabold text-[14px] mt-2 text-white leading-tight">Kuriftu Restaurant</h4>
              <p className="text-[10px] text-white/60 mt-1">Traditional Habesha Gourmet</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-accent-gold font-bold bg-accent-gold/10 px-2 py-0.5 rounded-lg">Book Table</span>
              <span className="text-[9px] text-accent-gold font-extrabold">+30 Loyalty PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info notice connecting to M-PESA */}
      <div className="p-3 bg-blue-500/15 border border-blue-500/25 rounded-2xl flex items-start gap-3 mt-auto z-10">
        <ShieldAlert className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-[10.5px] text-blue-300 leading-normal font-medium">
          Earn points on every activity! Exchange points for cashback credits, cinema snacks, or taxi ride vouchers directly in M-PESA.
        </p>
      </div>
    </div>
  );
}
