"use client";

import React from "react";
import MobileFrame from "@/components/MobileFrame";
import WalletModal from "@/components/WalletModal";
import HomeTab from "@/components/HomeTab";
import DiningTab from "@/components/DiningTab";
import EventsTab from "@/components/EventsTab";
import RidesTab from "@/components/RidesTab";
import CinemaTab from "@/components/CinemaTab";

import GemHuntTab from "@/components/GemHuntTab";
import { Compass, Heart, Car, Film, TrendingUp } from "lucide-react";

export interface Booking {
  id: string;
  category: "Dining" | "Tickets" | "Transport" | "Cinema";
  itemName: string;
  amount: number;
  time: string;
  code: string;
  status: string;
}

export interface PhoneAppProps {
  standalone?: boolean;
  
  // Linked states from parent (if standalone is false)
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  balance?: number;
  setBalance?: React.Dispatch<React.SetStateAction<number>>;
  location?: string;
  setLocation?: (loc: string) => void;
  loyaltyPoints?: number;
  setLoyaltyPoints?: React.Dispatch<React.SetStateAction<number>>;
  bookings?: Booking[];
  setBookings?: React.Dispatch<React.SetStateAction<Booking[]>>;
  
  // Custom reset demo action (if dashboard wants to clear all)
  onResetAll?: () => void;
}

export default function PhoneApp(props: PhoneAppProps) {
  const isStandalone = props.standalone ?? true;

  // Local States (used if standalone)
  const [localActiveTab, setLocalActiveTab] = React.useState<string>("home");
  const [localBalance, setLocalBalance] = React.useState<number>(3450);
  const [localLocation, setLocalLocation] = React.useState<string>("Bole");
  const [localLoyaltyPoints, setLocalLoyaltyPoints] = React.useState<number>(185);
  const [localBookings, setLocalBookings] = React.useState<Booking[]>([
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
  const [localToast, setLocalToast] = React.useState<{ message: string; type: "success" | "info" } | null>(null);
  const [localCheckoutItem, setLocalCheckoutItem] = React.useState<{ amount: number; name: string; category: string } | null>(null);
  const [localActiveRide, setLocalActiveRide] = React.useState<{ item: string; paid: boolean } | null>(null);

  // Shared Toast State
  const [linkedToast, setLinkedToast] = React.useState<{ message: string; type: "success" | "info" } | null>(null);
  const [linkedCheckoutItem, setLinkedCheckoutItem] = React.useState<{ amount: number; name: string; category: string } | null>(null);
  const [linkedActiveRide, setLinkedActiveRide] = React.useState<{ item: string; paid: boolean } | null>(null);

  // Resolved States (either local or props)
  const activeTab = isStandalone ? localActiveTab : (props.activeTab ?? "home");
  const setActiveTab = isStandalone ? setLocalActiveTab : (props.setActiveTab ?? (() => {}));

  const balance = isStandalone ? localBalance : (props.balance ?? 3450);
  const setBalance = isStandalone ? setLocalBalance : (props.setBalance ?? (() => {}));

  const location = isStandalone ? localLocation : (props.location ?? "Bole");
  const setLocation = isStandalone ? setLocalLocation : (props.setLocation ?? (() => {}));

  const loyaltyPoints = isStandalone ? localLoyaltyPoints : (props.loyaltyPoints ?? 185);
  const setLoyaltyPoints = isStandalone ? setLocalLoyaltyPoints : (props.setLoyaltyPoints ?? (() => {}));

  const bookings = isStandalone ? localBookings : (props.bookings ?? []);
  const setBookings = isStandalone ? setLocalBookings : (props.setBookings ?? (() => {}));

  const toast = isStandalone ? localToast : linkedToast;
  const setToast = isStandalone ? setLocalToast : setLinkedToast;

  const checkoutItem = isStandalone ? localCheckoutItem : linkedCheckoutItem;
  const setCheckoutItem = isStandalone ? setLocalCheckoutItem : setLinkedCheckoutItem;

  const activeRide = isStandalone ? localActiveRide : linkedActiveRide;
  const setActiveRide = isStandalone ? setLocalActiveRide : setLinkedActiveRide;

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

  // Handles adding scanned QR points
  const handleAddLoyaltyPoints = (points: number, reason: string) => {
    setLoyaltyPoints((prev) => prev + points);
    triggerToast(reason, "success");
  };

  return (
    <div className={`w-full flex-1 flex flex-col ${isStandalone ? "h-screen max-w-[420px] mx-auto overflow-hidden bg-[#0c0a18] shadow-2xl relative" : "h-full"}`}>
      {/* Global Toast Alert */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#17142b] to-[#252047] border border-[#dfa839]/30 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-[999] animate-slide-up text-xs font-bold max-w-[90vw] text-center">
          <span className="w-2 h-2 rounded-full bg-[#dfa839] animate-pulse shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

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
        standalone={isStandalone}
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
        
        {activeTab === "gemhunt" && (
          <GemHuntTab
            onBack={() => setActiveTab("home")}
            loyaltyPoints={loyaltyPoints}
            onAddPoints={handleAddLoyaltyPoints}
          />
        )}

        {/* Bottom Navigation Bar */}
        <div className="h-[56px] border-t border-white/5 bg-[#09080f] px-2.5 flex justify-between items-center text-[9px] text-white/55 select-none shrink-0">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-0.5 flex-1 transition-colors ${
              activeTab === "home" ? "text-[#00a859] font-bold" : "hover:text-white"
            }`}
          >
            <Compass className="w-4.5 h-4.5" />
            <span>Explore</span>
          </button>
          <button
            onClick={() => setActiveTab("dining")}
            className={`flex flex-col items-center gap-0.5 flex-1 transition-colors ${
              activeTab === "dining" ? "text-[#00a859] font-bold" : "hover:text-white"
            }`}
          >
            <Heart className="w-4.5 h-4.5" />
            <span>Dine &amp; Stay</span>
          </button>
          <button
            onClick={() => setActiveTab("rides")}
            className={`flex flex-col items-center gap-0.5 flex-1 transition-colors ${
              activeTab === "rides" ? "text-[#00a859] font-bold" : "hover:text-white"
            }`}
          >
            <Car className="w-4.5 h-4.5" />
            <span>Taxi</span>
          </button>
          <button
            onClick={() => setActiveTab("cinema")}
            className={`flex flex-col items-center gap-0.5 flex-1 transition-colors ${
              activeTab === "cinema" ? "text-[#00a859] font-bold" : "hover:text-white"
            }`}
          >
            <Film className="w-4.5 h-4.5" />
            <span>Cinema</span>
          </button>

        </div>
      </MobileFrame>
    </div>
  );
}
