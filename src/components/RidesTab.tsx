"use client";

import React from "react";
import { MapPin, Navigation, Car, Users, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

interface RideType {
  id: string;
  name: string;
  price: number;
  time: string;
  capacity: number;
  iconColor: string;
}

const RIDE_TYPES: RideType[] = [
  { id: "bajaj", name: "City Bajaj (Trike)", price: 90, time: "2 min away", capacity: 3, iconColor: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { id: "economy", name: "Economy Cab (Standard)", price: 190, time: "4 min away", capacity: 4, iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "comfort", name: "Comfort VIP (Premium)", price: 380, time: "3 min away", capacity: 4, iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20" }
];

interface RidesTabProps {
  onTriggerCheckout: (amount: number, name: string, category: string) => void;
  activeRidePaymentState: { item: string; paid: boolean } | null;
  onCancelRide: () => void;
  location: string;
}

export default function RidesTab({
  onTriggerCheckout,
  activeRidePaymentState,
  onCancelRide,
  location,
}: RidesTabProps) {
  const [pickup, setPickup] = React.useState(`${location}, Addis`);
  const [destination, setDestination] = React.useState("Sheraton Addis, Addis");
  const [selectedRideIdx, setSelectedRideIdx] = React.useState<number>(1);
  const [rideState, setRideState] = React.useState<"idle" | "matching" | "enroute" | "arrived">("idle");
  const [eta, setEta] = React.useState(3);

  // Automatically update pickup point when active location changes
  React.useEffect(() => {
    setPickup(`${location}, Addis`);
  }, [location]);

  // Sync ride matching state with payment completion
  React.useEffect(() => {
    if (activeRidePaymentState && activeRidePaymentState.paid && rideState === "idle") {
      setRideState("matching");
      const matchTimer = setTimeout(() => {
        setRideState("enroute");
      }, 3000);
      return () => clearTimeout(matchTimer);
    }
  }, [activeRidePaymentState, rideState]);

  // Countdown timer for Driver Arrival
  React.useEffect(() => {
    if (rideState === "enroute") {
      const interval = setInterval(() => {
        setEta((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setRideState("arrived");
            return 0;
          }
          return prev - 1;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [rideState]);

  const handleBookRide = () => {
    const ride = RIDE_TYPES[selectedRideIdx];
    onTriggerCheckout(ride.price, `Ride: ${pickup.split(",")[0]} to ${destination.split(",")[0]}`, "Transport");
  };

  const handleCancelClick = () => {
    setRideState("idle");
    setEta(3);
    onCancelRide();
  };

  if (rideState === "matching") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-mpesa-green/10 rounded-full animate-pulse-ring" />
          <div className="absolute inset-4 bg-mpesa-green/20 rounded-full animate-ping" />
          <div className="w-16 h-16 rounded-full bg-mpesa-green flex items-center justify-center shadow-lg shadow-mpesa-green/20 z-10">
            <Car className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-lg font-bold mb-1">Finding Nearby Drivers...</h3>
        <p className="text-xs text-white/55 px-6 leading-relaxed">
          Broadcasting request to verified M-PESA cab drivers in {location} area. Handshaking secure transit channel...
        </p>
      </div>
    );
  }

  if (rideState === "enroute" || rideState === "arrived") {
    return (
      <div className="flex-1 flex flex-col p-4 justify-between">
        {/* Simple Map View */}
        <div className="h-[220px] bg-[#100e23] border border-white/5 rounded-3xl relative overflow-hidden flex items-center justify-center">
          {/* Custom Stylized Grid Roads */}
          <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50" x2="390" y2="50" stroke="white" strokeWidth="2" />
            <line x1="0" y1="120" x2="390" y2="120" stroke="white" strokeWidth="3" />
            <line x1="0" y1="180" x2="390" y2="180" stroke="white" strokeWidth="1" />
            <line x1="120" y1="0" x2="120" y2="220" stroke="white" strokeWidth="3" />
            <line x1="270" y1="0" x2="270" y2="220" stroke="white" strokeWidth="2" />
          </svg>

          {/* Passenger Pin */}
          <div className="absolute left-[120px] top-[120px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-accent-gold border border-black flex items-center justify-center shadow-md animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span className="text-[8px] bg-black/80 px-1 py-0.5 rounded text-white border border-white/10 mt-1 font-semibold">You</span>
          </div>

          {/* Car Locator Pin */}
          {rideState === "enroute" ? (
            <div className="absolute left-[270px] top-[40px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-taxi">
              <div className="w-7 h-7 rounded-full bg-mpesa-green border border-black flex items-center justify-center shadow-lg shadow-mpesa-green/20">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="text-[8px] bg-black/80 px-1 py-0.5 rounded text-mpesa-green border border-mpesa-green/20 mt-1 font-bold">Dawit</span>
            </div>
          ) : (
            <div className="absolute left-[120px] top-[95px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
              <div className="w-7 h-7 rounded-full bg-mpesa-green border border-black flex items-center justify-center shadow-lg shadow-mpesa-green/20">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="text-[8px] bg-black/80 px-1.5 py-0.5 rounded text-mpesa-green border border-mpesa-green/30 mt-1 font-black animate-pulse">ARRIVED</span>
            </div>
          )}
        </div>

        {/* Ride Status Card */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <div>
              <p className="text-[10px] text-white/55 uppercase font-bold tracking-wider">Ride Status</p>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                {rideState === "enroute" ? `Driver arriving in ${eta}m...` : "Driver is waiting outside!"}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-mpesa-green/10 flex items-center justify-center text-mpesa-green border border-mpesa-green/20">
              {rideState === "enroute" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
          </div>

          {/* Driver details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center font-bold text-white border border-white/5">
                DA
              </div>
              <div>
                <h5 className="text-sm font-extrabold text-white">Dawit Abera</h5>
                <p className="text-[10px] text-white/55 mt-0.5">Toyota Corolla • <strong className="text-accent-gold">4.9 ★</strong></p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-white font-mono font-bold">ET 3-A0123</span>
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-xs space-y-1 text-white/75">
            <div className="flex justify-between">
              <span>Pickup:</span>
              <span className="font-semibold text-white/90">{pickup.split(",")[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>Destination:</span>
              <span className="font-semibold text-white/90">{destination.split(",")[0]}</span>
            </div>
          </div>

          {/* Cancel buttons */}
          <button
            onClick={handleCancelClick}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/15 border border-red-500/25 rounded-xl font-bold text-xs text-red-400 transition-colors"
          >
            Cancel Ride & Refund
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 justify-between">
      {/* Search Input Box */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-bold uppercase text-white/55 tracking-wider px-1">Book a Ride</h2>
          <p className="text-[11px] text-white/55 px-1 mt-0.5">Select route and choose M-PESA transport ride</p>
        </div>

        {/* Input Card */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-4 space-y-3 relative">
          <div className="absolute left-7 top-[48px] bottom-[48px] w-0.5 bg-white/10 border-dashed border-l" />

          {/* Pickup */}
          <div className="flex gap-3 items-center">
            <div className="w-6 h-6 rounded-lg bg-accent-gold/15 border border-accent-gold/25 flex items-center justify-center text-accent-gold flex-shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <label className="text-[9px] text-white/45 font-bold uppercase tracking-wider block">Pickup Point</label>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-white/95 placeholder-white/20 mt-0.5 focus:outline-none"
              />
            </div>
          </div>

          {/* Dest */}
          <div className="flex gap-3 items-center pt-2 border-t border-white/5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <label className="text-[9px] text-white/45 font-bold uppercase tracking-wider block">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-white/95 placeholder-white/20 mt-0.5 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ride Tiers Selector */}
      <div className="space-y-2.5 my-4">
        <h3 className="text-xs text-white/55 font-bold uppercase tracking-wider px-1">Available Ride Tiers</h3>
        <div className="space-y-2">
          {RIDE_TYPES.map((ride, idx) => (
            <div
              key={ride.id}
              onClick={() => setSelectedRideIdx(idx)}
              className={`border rounded-2xl p-3.5 cursor-pointer flex justify-between items-center transition-all ${
                selectedRideIdx === idx
                  ? "bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/5"
                  : "bg-white/5 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ride.iconColor}`}>
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">{ride.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-white/55">
                    <span className="flex items-center gap-0.5">
                      <Users className="w-3 h-3 text-white/40" />
                      <span>{ride.capacity} seats</span>
                    </span>
                    <span>•</span>
                    <span>{ride.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-[15px] text-accent-gold block">{ride.price} ETB</span>
                <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">10% cashback</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Action */}
      <button
        onClick={handleBookRide}
        className="w-full py-4 bg-mpesa-green hover:bg-mpesa-green-hover text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-mpesa-green/20 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
      >
        <span>Confirm Ride & Pay (1-Tap M-PESA)</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
