"use client";

import React from "react";
import MobileFrame from "@/components/MobileFrame";
import WalletModal from "@/components/WalletModal";
import HomeTab from "@/components/HomeTab";
import DiningTab from "@/components/DiningTab";
import EventsTab from "@/components/EventsTab";
import RidesTab from "@/components/RidesTab";
import CinemaTab from "@/components/CinemaTab";
import StatsTab from "@/components/StatsTab";
import { Play, TrendingUp, Award, DollarSign, RotateCcw, ShieldCheck, Heart, User, Compass, Info, MessageSquare, Car, Film, Ticket, Gift, Trash2 } from "lucide-react";

interface Booking {
  id: string;
  category: "Dining" | "Tickets" | "Transport" | "Cinema";
  itemName: string;
  amount: number;
  time: string;
  code: string;
  status: string;
}

export default function Home() {
  // Global States
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
  
  // Checkout States
  const [checkoutItem, setCheckoutItem] = React.useState<{ amount: number; name: string; category: string } | null>(null);
  
  // Transport Ride States
  const [activeRide, setActiveRide] = React.useState<{ item: string; paid: boolean } | null>(null);

  // Show Toast helper
  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Handles payments completed in the WalletModal
  const handlePaymentSuccess = (amount: number, description: string) => {
    if (balance < amount) {
      triggerToast("Insufficient wallet balance!", "info");
      return;
    }
    setBalance((prev) => prev - amount);

    // Calculate loyalty points based on payment category
    let pointsToAdd = 10;
    let paymentCategory: Booking["category"] = "Transport";
    
    if (description.includes("Dining") || description.includes("Restaurant")) {
      pointsToAdd = 30;
      paymentCategory = "Dining";
    } else if (description.includes("Tickets") || description.includes("Concert") || description.includes("Expo")) {
      pointsToAdd = 25;
      paymentCategory = "Tickets";
    } else if (description.includes("Cinema") || description.includes("Seat")) {
      pointsToAdd = 15;
      paymentCategory = "Cinema";
    }

    setLoyaltyPoints((prev) => prev + pointsToAdd);

    // Generate simulated ticket/booking stub code
    const randomCode = `CL-${paymentCategory.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      category: paymentCategory,
      itemName: description.split(" (")[0], // Clean description
      amount,
      time: "Just Now",
      code: randomCode,
      status: paymentCategory === "Transport" ? "Driver En Route" : "Active Pass"
    };

    setBookings((prev) => [newBooking, ...prev]);
    
    // Check if it's a ride-hailing purchase to start matching driver
    if (paymentCategory === "Transport") {
      setActiveRide({ item: description, paid: true });
      triggerToast(`Paid ETB ${amount} for Ride! +${pointsToAdd} Loyalty PTS!`, "success");
    } else {
      triggerToast(`Paid ETB ${amount}. +${pointsToAdd} Loyalty PTS!`, "success");
    }
  };

  // Handles triggering checkout
  const handleTriggerCheckout = (amount: number, name: string, category: string) => {
    if (balance < amount) {
      triggerToast("Payment failed: Insufficient M-PESA balance!", "info");
      return;
    }
    setCheckoutItem({ amount, name, category });
  };

  // Handles unlocking reward item with points
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
    setActiveRide(null);
    setCheckoutItem(null);
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

  return (
    <div className="flex-1 min-h-screen bg-[#07050d] text-[#f4f4f7] font-sans flex flex-col relative overflow-hidden">
      {/* Dynamic Starry Backing */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-950/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 py-8 lg:py-12 flex-1 flex flex-col justify-between">
        
        {/* Navigation & Brand Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-gold to-yellow-500 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-accent-gold/15">
              CL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-wide text-white">CityLife</h1>
                <span className="text-[10px] px-2 py-0.5 bg-mpesa-green/20 text-mpesa-green rounded-full font-bold border border-mpesa-green/30">
                  M-PESA Super-App Demo
                </span>
              </div>
              <p className="text-xs text-white/55 mt-0.5">Ethiopia&apos;s Lifestyle Hub Concept</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-xs flex items-center gap-2.5">
              <span className="text-white/55 font-medium">M-PESA Wallet:</span>
              <strong className="text-accent-gold font-bold">ETB {balance.toLocaleString()}</strong>
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

        {/* Global Toast Alert */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#17142b] to-[#252047] border border-accent-gold/30 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-slide-up text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Main Grid: Loyalty & Bookings (Left) & Mobile Simulator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 my-auto">
          
          {/* Left Column: Loyalty Profile and Active Bookings */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Loyalty Rewards Hub Dashboard */}
            <div className="bg-[#121021] border border-white/10 rounded-3xl p-5 space-y-5 shadow-xl">
              <div className="flex justify-between items-center pb-3.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent-gold fill-accent-gold/15" />
                  <h2 className="text-base font-extrabold uppercase text-white tracking-wide">Loyalty Rewards Club</h2>
                </div>
                <span className="text-[10px] px-2.5 py-1 bg-accent-gold/15 text-accent-gold rounded-full font-bold uppercase border border-accent-gold/30 animate-pulse">
                  {loyaltyLevel}
                </span>
              </div>

              {/* Progress Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/70 font-semibold">
                  <span>Current Points Balance</span>
                  <span className="text-accent-gold font-extrabold">{loyaltyPoints} PTS</span>
                </div>
                <div className="w-full h-3 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-accent-gold to-yellow-500 h-full rounded-full transition-all duration-750" style={{ width: `${Math.min(100, loyaltyProgress)}%` }} />
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
                      className="px-2.5 py-1.5 bg-accent-gold/10 hover:bg-accent-gold text-accent-gold hover:text-black font-extrabold text-[10px] rounded-xl transition-all"
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
                      className="px-2.5 py-1.5 bg-accent-gold/10 hover:bg-accent-gold text-accent-gold hover:text-black font-extrabold text-[10px] rounded-xl transition-all"
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
                        <span className="text-accent-gold font-bold">ETB {booking.amount}</span>
                        <span className={`font-bold uppercase tracking-wider text-[8px] px-1.5 py-0.5 rounded ${
                          booking.status.includes("Route") || booking.status === "Active Pass"
                            ? "bg-mpesa-green/15 text-mpesa-green border border-mpesa-green/20 animate-pulse"
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

          {/* Right Column: Simulator */}
          <div className="lg:col-span-5 flex justify-center w-full relative">
            
            {/* Wallet overlay checkout */}
            <WalletModal
              isOpen={checkoutItem !== null}
              onClose={() => setCheckoutItem(null)}
              onPaymentSuccess={handlePaymentSuccess}
              amount={checkoutItem?.amount || 0}
              itemName={checkoutItem?.name || ""}
              category={checkoutItem?.category || ""}
              balance={balance}
            />

            <MobileFrame
              activeTab={activeTab}
              onBack={() => setActiveTab("home")}
              showBack={activeTab !== "home"}
              projectName="CityLife"
            >
              {/* Content rendering based on activeTab */}
              {activeTab === "home" && (
                <HomeTab
                  onNavigate={setActiveTab}
                  balance={balance}
                  location={location}
                  onLocationChange={setLocation}
                  loyaltyPoints={loyaltyPoints}
                />
              )}
              {activeTab === "dining" && (
                <DiningTab
                  onTriggerCheckout={handleTriggerCheckout}
                  location={location}
                />
              )}
              {activeTab === "events" && (
                <EventsTab onTriggerCheckout={handleTriggerCheckout} />
              )}
              {activeTab === "rides" && (
                <RidesTab
                  onTriggerCheckout={handleTriggerCheckout}
                  activeRidePaymentState={activeRide}
                  onCancelRide={() => setActiveRide(null)}
                  location={location}
                />
              )}
              {activeTab === "cinema" && (
                <CinemaTab onTriggerCheckout={handleTriggerCheckout} />
              )}
              {activeTab === "stats" && <StatsTab />}

              {/* Bottom Navigation Bar */}
              <div className="h-[56px] border-t border-white/5 bg-[#09080f] px-2.5 flex justify-between items-center text-[9px] text-white/55 select-none shrink-0">
                <button
                  onClick={() => setActiveTab("home")}
                  className={`flex flex-col items-center gap-0.5 flex-1 transition-colors ${
                    activeTab === "home" ? "text-mpesa-green font-bold" : "hover:text-white"
                  }`}
                >
                  <Compass className="w-4.5 h-4.5" />
                  <span>Explore</span>
                </button>
                <button
                  onClick={() => setActiveTab("dining")}
                  className={`flex flex-col items-center gap-0.5 flex-1 transition-colors ${
                    activeTab === "dining" ? "text-mpesa-green font-bold" : "hover:text-white"
                  }`}
                >
                  <Heart className="w-4.5 h-4.5" />
                  <span>Dining</span>
                </button>
                <button
                  onClick={() => setActiveTab("rides")}
                  className={`flex flex-col items-center gap-0.5 flex-1 transition-colors ${
                    activeTab === "rides" ? "text-mpesa-green font-bold" : "hover:text-white"
                  }`}
                >
                  <Car className="w-4.5 h-4.5" />
                  <span>Taxi</span>
                </button>
                <button
                  onClick={() => setActiveTab("cinema")}
                  className={`flex flex-col items-center gap-0.5 flex-1 transition-colors ${
                    activeTab === "cinema" ? "text-mpesa-green font-bold" : "hover:text-white"
                  }`}
                >
                  <Film className="w-4.5 h-4.5" />
                  <span>Cinema</span>
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`flex flex-col items-center gap-0.5 flex-1 transition-colors ${
                    activeTab === "stats" ? "text-mpesa-green font-bold" : "hover:text-white"
                  }`}
                >
                  <TrendingUp className="w-4.5 h-4.5" />
                  <span>Analytics</span>
                </button>
              </div>
            </MobileFrame>
          </div>
        </div>

        {/* Footer info */}
        <footer className="text-center text-[10px] text-white/30 pt-8 mt-8 border-t border-white/5">
          CityLife Super App Demo • Safe payment channel secured by M-PESA Ethiopia • Built with NextJS & Tailwind
        </footer>
      </div>
    </div>
  );
}
