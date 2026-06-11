"use client";

import React, { useState } from "react";
import PhoneApp, { Booking } from "@/components/PhoneApp";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import { Play, TrendingUp, Award, DollarSign, RotateCcw, ShieldCheck, Ticket, Gift, Trash2, ShieldAlert, Key, User, ArrowRight, LayoutDashboard, BarChart3, Presentation, Smartphone } from "lucide-react";

type DashboardView = "analytics" | "pitch" | "bookings";

export default function Dashboard() {
  // Authentication Gate States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [dashboardView, setDashboardView] = useState<DashboardView>("analytics");

  // Global States (shared with PhoneApp in Linked Mode)
  const [activeTab, setActiveTab] = React.useState<string>("home");
  const [balance, setBalance] = React.useState<number>(3450);
  const [location, setLocation] = React.useState<string>("Bole");
  const [loyaltyPoints, setLoyaltyPoints] = React.useState<number>(185);
  const [bookings, setBookings] = React.useState<Booking[]>([
    {
      id: "b-prev-1",
      category: "Transport",
      itemName: "Economy Ride to Piazza",
      amount: 190,
      time: "Today, 11:20 AM",
      code: "CL-TX-420A",
      status: "Completed"
    }
  ]);
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "info" } | null>(null);

  // Show Toast helper
  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid admin credentials! Please check and try again.");
    }
  };

  // Handles unlocking reward item with points from outer dashboard panel
  const handleUnlockReward = (cost: number, rewardName: string) => {
    if (loyaltyPoints < cost) {
      triggerToast(`Insufficient points! You need ${cost} pts.`, "info");
      return;
    }
    setLoyaltyPoints((prev) => prev - cost);
    triggerToast(`Unlocked: ${rewardName}! Check coupon SMS.`, "success");
  };

  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    triggerToast("Ticket removed from active profile.", "info");
  };

  const resetAll = () => {
    setBalance(3450);
    setLoyaltyPoints(185);
    setLocation("Bole");
    setActiveTab("home");
    setBookings([
      {
        id: "b-prev-1",
        category: "Transport",
        itemName: "Economy Ride to Piazza",
        amount: 190,
        time: "Today, 11:20 AM",
        code: "CL-TX-420A",
        status: "Completed"
      }
    ]);
    triggerToast("Demo environment reset successful!", "info");
  };

  // Determine loyalty level
  const loyaltyLevel = loyaltyPoints >= 600 ? "Gold Member" : loyaltyPoints >= 300 ? "Silver Member" : "Bronze Member";
  const loyaltyProgress = loyaltyPoints >= 600 ? (loyaltyPoints/1000)*100 : loyaltyPoints >= 300 ? (loyaltyPoints/600)*100 : (loyaltyPoints/300)*100;

  // Calculate total spent from bookings
  const totalSpent = bookings.reduce((sum, b) => sum + b.amount, 0);

  const DASHBOARD_TABS: { key: DashboardView; label: string; icon: React.ElementType }[] = [
    { key: "analytics", label: "AI Analytics", icon: BarChart3 },
    { key: "pitch", label: "Pitch Deck", icon: Presentation },
    { key: "bookings", label: "Live Activity", icon: Ticket },
  ];

  // ── RENDER LOGIN GATE ──────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07050d] text-[#f4f4f7] font-sans flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Dynamic Starry Backing */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00a859]/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-md w-full relative z-10 space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#dfa839] to-yellow-500 flex items-center justify-center font-black text-black text-2xl shadow-xl shadow-[#dfa839]/20">
              CL
            </div>
            <h1 className="text-2xl font-black tracking-wide text-white mt-2">CityLife Admin Portal</h1>
            <p className="text-xs text-white/55">Unlock Pitch Analytics &amp; Live Super-App Dashboard</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="bg-[#121021] border border-white/10 rounded-[32px] p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#00a859]/5 rounded-full blur-2xl pointer-events-none" />

            {loginError && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-400 p-3 rounded-2xl text-[11px] font-bold text-center animate-shake">
                ⚠️ {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-white/45 font-bold uppercase tracking-wider block mb-1.5 px-1">Admin Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm placeholder-white/35 focus:outline-none focus:border-[#dfa839]/50 focus:bg-white/10 transition-all text-white/90"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-white/45 font-bold uppercase tracking-wider block mb-1.5 px-1">Passkey</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm placeholder-white/35 focus:outline-none focus:border-[#dfa839]/50 focus:bg-white/10 transition-all text-white/90"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 bg-gradient-to-r from-[#00a859] to-[#00c869] hover:from-[#00c869] hover:to-[#00a859] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#00a859]/15 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Unlock Admin Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="bg-[#00a859]/10 border border-[#00a859]/20 rounded-2xl p-3 flex items-start gap-2.5 text-[10.5px] text-[#00c869] max-w-sm mx-auto">
            <ShieldAlert className="w-4 h-4 text-[#00c869] mt-0.5 shrink-0" />
            <p className="leading-normal font-medium">
              Demo Credentials: Enter username <strong className="text-white">admin</strong> and password <strong className="text-white">admin</strong> to unlock page access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER FULL DESKTOP DASHBOARD WORKSPACE ───────────────
  return (
    <div className="flex-1 min-h-screen bg-[#07050d] text-[#f4f4f7] font-sans flex flex-col relative overflow-hidden">
      {/* Dynamic Starry Backing */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-950/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-6 py-6 lg:py-8 flex-1 flex flex-col">
        
        {/* Navigation & Brand Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#dfa839] to-yellow-500 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-[#dfa839]/15">
              CL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-wide text-white">CityLife</h1>
                <span className="text-[10px] px-2 py-0.5 bg-[#00a859]/20 text-[#00a859] rounded-full font-bold border border-[#00a859]/30">
                  M-PESA Super-App Admin Panel
                </span>
              </div>
              <p className="text-xs text-white/55 mt-0.5">Ethiopia&apos;s Lifestyle Hub Analytics Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-xs flex items-center gap-2.5">
              <span className="text-white/55 font-medium">M-PESA Wallet:</span>
              <strong className="text-[#dfa839] font-bold">ETB {balance.toLocaleString()}</strong>
            </div>
            <button
              onClick={resetAll}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-2xl text-white/60 hover:text-white transition-all active:scale-95 border border-white/5 flex items-center gap-1.5 text-xs font-semibold"
              title="Reset simulator"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </header>

        {/* Dashboard Tab Navigation */}
        <div className="flex items-center gap-1.5 mb-6 bg-[#121021] border border-white/8 rounded-2xl p-1.5 self-start">
          {DASHBOARD_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setDashboardView(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                dashboardView === key
                  ? "bg-gradient-to-r from-[#00a859] to-emerald-600 text-white shadow-lg shadow-[#00a859]/20"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Global Toast Alert */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#17142b] to-[#252047] border border-[#dfa839]/30 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-slide-up text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#dfa839] animate-pulse" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Main Grid: Content (Left) & Mobile Simulator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          
          {/* Left Column: Dynamic Content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">

            {/* ── ANALYTICS VIEW ──────────────────────────────── */}
            {dashboardView === "analytics" && (
              <DashboardAnalytics
                loyaltyPoints={loyaltyPoints}
                balance={balance}
                bookingsCount={bookings.length}
                totalSpent={totalSpent}
              />
            )}

            {/* ── PITCH DECK VIEW ────────────────────────────── */}
            {dashboardView === "pitch" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Presentation className="w-5 h-5 text-[#dfa839]" />
                  <h2 className="text-sm font-bold uppercase text-white/80 tracking-wider">CityLife — Investor Pitch Narrative</h2>
                </div>

                {/* Card 1: Lunchtime / Restaurants */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1530] to-[#100e22] border border-white/8 rounded-3xl p-5 group hover:border-amber-500/25 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full" />
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-400/80">Restaurants &amp; Hotels</span>
                      <p className="text-sm text-white/85 mt-1.5 leading-relaxed font-medium">
                        It&apos;s lunchtime. Browse nearby restaurants — see menus, ratings, photos. Found one you like?{" "}
                        <strong className="text-amber-300">Book a table right here.</strong> No calling. No busy signals. No frustration.
                        And when the bill comes? Pay with M-PESA.
                      </p>
                      <p className="text-xs text-white/50 mt-2 leading-relaxed">
                        Planning a trip? Hotels are right here too. Compare options, check availability, book and pay — all without leaving M-PESA.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Weekend Plans / Events + Cinema */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1530] to-[#100e22] border border-white/8 rounded-3xl p-5 group hover:border-purple-500/25 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full" />
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                      <Play className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-purple-400/80">Events &amp; Cinema</span>
                      <p className="text-sm text-white/85 mt-1.5 leading-relaxed font-medium">
                        Weekend plans? Browse events happening in your city — concerts, cultural nights, sports.{" "}
                        <strong className="text-purple-300">Buy your ticket instantly.</strong> Book cinema seats before they sell out.
                        No switching apps. No re-entering payment details.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3: Transport */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1a1a] to-[#0a1210] border border-emerald-500/15 rounded-3xl p-5 group hover:border-emerald-500/30 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full" />
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400/80">Ride & QR City Gems</span>
                      <p className="text-sm text-white/85 mt-1.5 leading-relaxed font-medium">
                        Need to get there? Hail a taxi, track it in real-time, and pay — all from M-PESA.{" "}
                        While waiting at the stop, scan QR codes on shelters to <strong className="text-emerald-300">collect City Gems</strong> — 
                        earning loyalty points that unlock real rewards. A gamified experience that makes everyday transit fun.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 4: Ecosystem magic */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1f1a] to-[#0a1510] border border-[#00a859]/15 rounded-3xl p-5 group hover:border-[#00a859]/30 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#00a859]/5 rounded-bl-full" />
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#00a859]/10 border border-[#00a859]/20 flex items-center justify-center text-[#00a859] flex-shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#00a859]/80">The Ecosystem Magic</span>
                      <p className="text-sm text-white/85 mt-1.5 leading-relaxed font-medium">
                        Every interaction stays in your ecosystem. Your history, your preferences, your rewards.{" "}
                        <strong className="text-[#00a859]">CityLife learns what you love</strong> and surfaces more of it.
                        This isn&apos;t just a feature — this is a daily relationship between M-PESA and the customer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── BOOKINGS / LIVE ACTIVITY VIEW ───────────────── */}
            {dashboardView === "bookings" && (
              <div className="space-y-6">
                {/* Loyalty Rewards Hub Dashboard */}
                <div className="bg-[#121021] border border-white/10 rounded-3xl p-5 space-y-5 shadow-xl">
                  <div className="flex justify-between items-center pb-3.5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#dfa839] fill-[#dfa839]/15" />
                      <h2 className="text-base font-extrabold uppercase text-white tracking-wide">Loyalty Rewards Club</h2>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 bg-[#dfa839]/15 text-[#dfa839] rounded-full font-bold uppercase border border-[#dfa839]/30 animate-pulse">
                      {loyaltyLevel}
                    </span>
                  </div>

                  {/* Progress Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/70 font-semibold">
                      <span>Current Points Balance</span>
                      <span className="text-[#dfa839] font-extrabold">{loyaltyPoints} PTS</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#dfa839] to-yellow-500 h-full rounded-full transition-all duration-750" style={{ width: `${Math.min(100, loyaltyProgress)}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-white/45 font-bold uppercase tracking-wider">
                      <span>0 pts</span>
                      <span>Goal: {loyaltyPoints >= 600 ? "1000 pts (Platinum)" : loyaltyPoints >= 300 ? "600 pts (Gold)" : "300 pts (Silver)"}</span>
                    </div>
                  </div>

                  {/* Unlockable Rewards */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-emerald-400" />
                      <span>Redeem Available Coupons</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Reward 1 */}
                      <div className="p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl flex justify-between items-center transition-colors">
                        <div>
                          <strong className="text-white block font-extrabold">50 ETB Cab Voucher</strong>
                          <span className="text-[10px] text-white/45 block mt-0.5">Discount on next taxi ride</span>
                        </div>
                        <button
                          onClick={() => handleUnlockReward(100, "50 ETB Cab Voucher")}
                          className="px-2.5 py-1.5 bg-[#dfa839]/10 hover:bg-[#dfa839] text-[#dfa839] hover:text-black font-extrabold text-[10px] rounded-xl transition-all"
                        >
                          100 PTS
                        </button>
                      </div>

                      {/* Reward 2 */}
                      <div className="p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl flex justify-between items-center transition-colors">
                        <div>
                          <strong className="text-white block font-extrabold">Free Cinema Popcorn</strong>
                          <span className="text-[10px] text-white/45 block mt-0.5">At Century or Edna Mall</span>
                        </div>
                        <button
                          onClick={() => handleUnlockReward(150, "Free Cinema Popcorn Coupon")}
                          className="px-2.5 py-1.5 bg-[#dfa839]/10 hover:bg-[#dfa839] text-[#dfa839] hover:text-black font-extrabold text-[10px] rounded-xl transition-all"
                        >
                          150 PTS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Bookings Sidebar Panel */}
                <div className="bg-[#121021] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                    <Ticket className="w-5 h-5 text-purple-400" />
                    <h2 className="text-base font-extrabold uppercase text-white tracking-wide">Active Bookings & Passes</h2>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="py-8 text-center text-white/45 text-xs">
                      No active reservations or tickets. Book a restaurant, event, movie, or ride inside the M-PESA frame to generate passes.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1 thin-scrollbar">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-[#1a172e] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-md group relative hover:border-purple-500/30 transition-all"
                        >
                          {/* Ticket top indicator */}
                          <div className={`h-1.5 w-full ${
                            booking.category === "Dining" ? "bg-amber-500" :
                            booking.category === "Tickets" ? "bg-purple-500" :
                            booking.category === "Cinema" ? "bg-rose-500" :
                            "bg-emerald-500"
                          }`} />

                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="absolute top-2.5 right-2.5 p-1 bg-black/40 hover:bg-red-500/20 text-white/50 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Remove ticket stub"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[8px] font-extrabold uppercase tracking-widest text-white/45">
                                  {booking.category} Pass
                                </span>
                                <h4 className="font-extrabold text-xs text-white leading-tight mt-0.5 truncate max-w-[170px]">
                                  {booking.itemName}
                                </h4>
                              </div>
                            </div>

                            <div className="flex justify-between text-[9px] text-white/55">
                              <span>Date/Time:</span>
                              <span className="font-bold text-white/80">{booking.time}</span>
                            </div>

                            {/* Barcode representation */}
                            <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col items-center gap-1.5 select-none">
                              <div className="w-full h-7 bg-white/20 relative flex items-center justify-between overflow-hidden opacity-85 px-2">
                                {/* Visual Lines barcode */}
                                <div className="w-[1.5px] h-full bg-white/70" />
                                <div className="w-[3px] h-full bg-white/70" />
                                <div className="w-[1px] h-full bg-white/50" />
                                <div className="w-[4px] h-full bg-white/70" />
                                <div className="w-[2px] h-full bg-white/70" />
                                <div className="w-[1px] h-full bg-white/30" />
                                <div className="w-[3px] h-full bg-white/70" />
                                <div className="w-[1px] h-full bg-white/70" />
                                <div className="w-[2.5px] h-full bg-white/70" />
                                <div className="w-[1px] h-full bg-white/30" />
                                <div className="w-[4px] h-full bg-white/70" />
                                <div className="w-[1.5px] h-full bg-white/70" />
                                <div className="w-[2px] h-full bg-white/70" />
                              </div>
                              <span className="text-[8px] font-mono text-white/45 tracking-widest">{booking.code}</span>
                            </div>
                          </div>

                          {/* Ticket footer details */}
                          <div className="px-4 py-2 bg-white/5 border-t border-white/5 flex justify-between items-center text-[10px]">
                            <span className="text-[#dfa839] font-bold">ETB {booking.amount}</span>
                            <span className={`font-bold uppercase tracking-wider text-[8px] px-1.5 py-0.5 rounded ${
                              booking.status.includes("Route") || booking.status === "Active Pass"
                                ? "bg-[#00a859]/15 text-[#00a859] border border-[#00a859]/20 animate-pulse"
                                : "bg-white/10 text-white/55"
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Simulated Phone Simulator Frame */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center w-full sticky top-8">
            <PhoneApp
              standalone={false}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              balance={balance}
              setBalance={setBalance}
              location={location}
              setLocation={setLocation}
              loyaltyPoints={loyaltyPoints}
              setLoyaltyPoints={setLoyaltyPoints}
              bookings={bookings}
              setBookings={setBookings}
            />
          </div>
        </div>

        {/* Footer info */}
        <footer className="text-center text-[10px] text-white/30 pt-6 mt-6 border-t border-white/5">
          CityLife Super App Demo • Safe payment channel secured by M-PESA Ethiopia • Built with NextJS &amp; Tailwind
        </footer>
      </div>
    </div>
  );
}
