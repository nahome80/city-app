"use client";

import React from "react";
import { MapPin, Navigation, Car, Users, CheckCircle2, Loader2, ArrowRight, Bus, Clock, Ticket } from "lucide-react";

interface RouteData {
  id: string;
  from: string;
  to: string;
  price: number;
  time: string;
  category: string;
}

const TAXI_ROUTES: RouteData[] = [
  { id: "tx-1", from: "Arat Kilo", to: "Stadium", price: 25, time: "12 mins", category: "Taxi" },
  { id: "tx-2", from: "Saris", to: "Lebu", price: 20, time: "15 mins", category: "Taxi" },
  { id: "tx-3", from: "Kazanchis", to: "Bole Airport", price: 18, time: "10 mins", category: "Taxi" },
  { id: "tx-4", from: "Piazza", to: "Megenagna", price: 30, time: "22 mins", category: "Taxi" },
  { id: "tx-5", from: "Mexiko", to: "Kera", price: 15, time: "8 mins", category: "Taxi" },
];

const BUS_ROUTES: RouteData[] = [
  { id: "bs-1", from: "Arat Kilo", to: "Piazza", price: 3, time: "10 mins", category: "City Bus" },
  { id: "bs-2", from: "Mexiko", to: "Stadium", price: 2, time: "14 mins", category: "City Bus" },
  { id: "bs-3", from: "Megenagna", to: "Bole", price: 4, time: "18 mins", category: "City Bus" },
  { id: "bs-4", from: "Kotebe", to: "Shola", price: 2, time: "8 mins", category: "City Bus" },
  { id: "bs-5", from: "Tor Hailoch", to: "Kolfe", price: 3, time: "12 mins", category: "City Bus" },
];

const MINIBUS_ROUTES: RouteData[] = [
  { id: "mb-1", from: "Megenagna", to: "Kazanchis", price: 7, time: "12 mins", category: "Minibus" },
  { id: "mb-2", from: "Piazza", to: "Arat Kilo", price: 5, time: "8 mins", category: "Minibus" },
  { id: "mb-3", from: "Bole Medhanialem", to: "Stadium", price: 12, time: "16 mins", category: "Minibus" },
  { id: "mb-4", from: "Mexiko", to: "Saris", price: 15, time: "25 mins", category: "Minibus" },
  { id: "mb-5", from: "Tor Hailoch", to: "Mexiko", price: 8, time: "10 mins", category: "Minibus" },
];

const EXPRESS_ROUTES: RouteData[] = [
  { id: "ex-1", from: "Megenagna", to: "Mexiko Express", price: 20, time: "20 mins", category: "Express Bus" },
  { id: "ex-2", from: "Piazza", to: "Bole Express", price: 25, time: "25 mins", category: "Express Bus" },
  { id: "ex-3", from: "Tor Hailoch", to: "Stadium Express", price: 15, time: "15 mins", category: "Express Bus" },
  { id: "ex-4", from: "Arat Kilo", to: "Sarbet Express", price: 22, time: "18 mins", category: "Express Bus" },
];

interface RideType {
  id: string;
  name: string;
  price: number;
  time: string;
  capacity: number;
  iconColor: string;
}

const PRIVATE_RIDE_TYPES: RideType[] = [
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
  // Navigation tabs
  const [activeMiniTab, setActiveMiniTab] = React.useState<"taxi" | "bus" | "minibus" | "express">("taxi");

  // Private cab inputs
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

  const handleBookPrivateRide = () => {
    const ride = PRIVATE_RIDE_TYPES[selectedRideIdx];
    onTriggerCheckout(ride.price, `Private Ride: ${pickup.split(",")[0]} to ${destination.split(",")[0]}`, "Transport");
  };

  const handleCancelClick = () => {
    setRideState("idle");
    setEta(3);
    onCancelRide();
  };

  // Determine lists depending on tab
  const getRoutesList = () => {
    switch (activeMiniTab) {
      case "bus":
        return BUS_ROUTES;
      case "minibus":
        return MINIBUS_ROUTES;
      case "express":
        return EXPRESS_ROUTES;
      case "taxi":
      default:
        return TAXI_ROUTES;
    }
  };

  const isBusOrExpressTicket = activeRidePaymentState && (
    activeRidePaymentState.item.includes("City Bus") ||
    activeRidePaymentState.item.includes("Minibus") ||
    activeRidePaymentState.item.includes("Express")
  );

  // 1. Searching/Matching view
  if (rideState === "matching") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-mpesa-green/10 rounded-full animate-pulse-ring" />
          <div className="absolute inset-4 bg-mpesa-green/20 rounded-full animate-ping" />
          <div className="w-16 h-16 rounded-full bg-mpesa-green flex items-center justify-center shadow-lg shadow-mpesa-green/20 z-10">
            {isBusOrExpressTicket ? (
              <Bus className="w-8 h-8 text-white" />
            ) : (
              <Car className="w-8 h-8 text-white" />
            )}
          </div>
        </div>
        <h3 className="text-lg font-bold mb-1">
          {isBusOrExpressTicket ? "Securing Transit Seat..." : "Finding Nearby Drivers..."}
        </h3>
        <p className="text-xs text-white/55 px-6 leading-relaxed">
          {isBusOrExpressTicket
            ? "Registering digital seat identifier on M-PESA transit system. Preparing boarding pass..."
            : `Broadcasting request to verified M-PESA cab drivers in ${location} area. Handshaking secure transit channel...`}
        </p>
      </div>
    );
  }

  // 2. Active booking view
  if (rideState === "enroute" || rideState === "arrived") {
    return (
      <div className="flex-1 flex flex-col p-4 justify-between">
        {isBusOrExpressTicket ? (
          /* Visual Bus Boarding Ticket Stub */
          <div className="bg-[#100e23] border border-white/10 rounded-3xl p-5 flex flex-col items-center justify-between flex-1 max-h-[420px] shadow-lg">
            <div className="w-full flex justify-between items-center pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 text-mpesa-green">
                <Ticket className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Super App Transit Pass</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-mpesa-green/10 border border-mpesa-green/30 text-mpesa-green rounded-full font-bold">
                ACTIVE
              </span>
            </div>

            <div className="w-full py-4 text-center">
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Transit Route</p>
              <h3 className="text-lg font-black text-white mt-1.5 truncate">
                {activeRidePaymentState?.item.split(" (")[0]}
              </h3>
              <span className="text-xs px-2.5 py-1 bg-white/5 rounded-xl border border-white/5 text-accent-gold font-bold inline-block mt-2.5">
                {activeRidePaymentState?.item.split("(")[1]?.replace(")", "") || "City Bus"}
              </span>
            </div>

            <div className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2.5 text-xs text-white/80">
              <div className="flex justify-between">
                <span>Gate/Station:</span>
                <span className="font-bold text-white">Nearest Line Terminal</span>
              </div>
              <div className="flex justify-between">
                <span>Boarding Status:</span>
                <span className="text-mpesa-green font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ready to Scan</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ticket Holder:</span>
                <span className="font-bold text-white">M-PESA Account holder</span>
              </div>
            </div>

            {/* Boarding Code Barcode */}
            <div className="w-full bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center gap-2 mt-4 select-none">
              <div className="w-[85%] h-8 bg-white/20 relative flex items-center justify-between overflow-hidden opacity-80 px-2">
                <div className="w-[2px] h-full bg-white" />
                <div className="w-[4px] h-full bg-white" />
                <div className="w-[1px] h-full bg-white" />
                <div className="w-[3px] h-full bg-white" />
                <div className="w-[1.5px] h-full bg-white" />
                <div className="w-[4px] h-full bg-white" />
                <div className="w-[1px] h-full bg-white" />
                <div className="w-[3px] h-full bg-white" />
                <div className="w-[2px] h-full bg-white" />
                <div className="w-[4px] h-full bg-white" />
              </div>
              <span className="text-[9px] font-mono text-white/50 tracking-widest">CL-PASS-94801</span>
            </div>
          </div>
        ) : (
          /* Simple Taxi Map View */
          <div className="h-[220px] bg-[#100e23] border border-white/5 rounded-3xl relative overflow-hidden flex items-center justify-center">
            {/* Custom Stylized Grid Roads */}
            <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="50" x2="390" y2="50" stroke="white" strokeWidth="2" />
              <line x1="0" y1="120" x2="390" y2="120" stroke="white" strokeWidth="3" />
              <line x1="0" y1="180" x2="390" y2="180" stroke="white" strokeWidth="1" />
              <line x1="120" y1="0" x2="120" y2="220" stroke="white" strokeWidth="3" />
              <line x1="270" y1="0" x2="270" y2="220" stroke="white" strokeWidth="2" />
            </svg>

            <div className="absolute left-[120px] top-[120px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-accent-gold border border-black flex items-center justify-center shadow-md animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <span className="text-[8px] bg-black/80 px-1 py-0.5 rounded text-white border border-white/10 mt-1 font-semibold">You</span>
            </div>

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
        )}

        {/* Ride Status Card */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4 mt-3">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <div>
              <p className="text-[10px] text-white/55 uppercase font-bold tracking-wider">Ride Status</p>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                {isBusOrExpressTicket
                  ? "Ticket Valid for Next Bus"
                  : rideState === "enroute"
                  ? `Driver arriving in ${eta}m...`
                  : "Driver is waiting outside!"}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-mpesa-green/10 flex items-center justify-center text-mpesa-green border border-mpesa-green/20">
              {rideState === "enroute" && !isBusOrExpressTicket ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
          </div>

          {!isBusOrExpressTicket && (
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
          )}

          <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-xs space-y-1 text-white/75">
            <div className="flex justify-between">
              <span>Transit details:</span>
              <span className="font-semibold text-white/90">
                {isBusOrExpressTicket ? activeRidePaymentState?.item.split(" (")[0] : `${pickup.split(",")[0]} ➔ ${destination.split(",")[0]}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Charge:</span>
              <span className="font-semibold text-white/90">Settled via M-PESA Wallet</span>
            </div>
          </div>

          {/* Cancel buttons */}
          <button
            onClick={handleCancelClick}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/15 border border-red-500/25 rounded-xl font-bold text-xs text-red-400 transition-colors"
          >
            Cancel {isBusOrExpressTicket ? "Ticket" : "Ride"} & Refund
          </button>
        </div>
      </div>
    );
  }

  // 3. Default Listing view with tabs
  return (
    <div className="flex-1 flex flex-col p-4 justify-between">
      {/* Header Title */}
      <div className="mb-3">
        <h2 className="text-sm font-bold uppercase text-white/55 tracking-wider px-1">Transit & Rides</h2>
        <p className="text-[11px] text-white/55 px-1 mt-0.5">Pick transit routes or order local cabs instantly</p>
      </div>

      {/* Horizontally Scrollable Mini Tab Bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 mb-4 select-none snap-x shrink-0 border-b border-white/5">
        <button
          onClick={() => setActiveMiniTab("taxi")}
          className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap snap-center transition-all flex items-center gap-1 ${
            activeMiniTab === "taxi"
              ? "bg-mpesa-green text-white shadow-md shadow-mpesa-green/10"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Taxi Routes</span>
        </button>
        <button
          onClick={() => setActiveMiniTab("bus")}
          className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap snap-center transition-all flex items-center gap-1 ${
            activeMiniTab === "bus"
              ? "bg-mpesa-green text-white shadow-md shadow-mpesa-green/10"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>City Bus</span>
        </button>
        <button
          onClick={() => setActiveMiniTab("minibus")}
          className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap snap-center transition-all flex items-center gap-1 ${
            activeMiniTab === "minibus"
              ? "bg-mpesa-green text-white shadow-md shadow-mpesa-green/10"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <Bus className="w-3.5 h-3.5 rotate-90" />
          <span>Minibus</span>
        </button>
        <button
          onClick={() => setActiveMiniTab("express")}
          className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap snap-center transition-all flex items-center gap-1 ${
            activeMiniTab === "express"
              ? "bg-mpesa-green text-white shadow-md shadow-mpesa-green/10"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Express Bus</span>
        </button>
      </div>

      {/* Tab content wrapper */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 thin-scrollbar">
        {/* Render selected tab routes */}
        {getRoutesList().map((route) => (
          <div
            key={route.id}
            className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center hover:border-white/10 transition-colors animate-fade-in"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white/95">{route.from}</span>
                <span className="text-white/40 text-xs">➔</span>
                <span className="font-extrabold text-sm text-white/95">{route.to}</span>
              </div>
              <p className="text-[10px] text-white/55 mt-1 font-semibold">
                {route.category} • {route.time} travel
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5">
              <span className="text-xs font-black text-accent-gold">{route.price} Birr</span>
              <button
                onClick={() => onTriggerCheckout(route.price, `${route.from} to ${route.to} (${route.category})`, "Transport")}
                className="px-3.5 py-1.5 bg-mpesa-green hover:bg-mpesa-green-hover text-white font-bold text-[10px] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-mpesa-green/10"
              >
                Pay Now
              </button>
            </div>
          </div>
        ))}

        {/* Private cab ordering card (only visible on Taxi tab as custom option) */}
        {activeMiniTab === "taxi" && (
          <div className="mt-6 border-t border-white/5 pt-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white/55 uppercase tracking-wider px-1">Or Order Private Ride</h3>
              <p className="text-[10px] text-white/50 px-1 mt-0.5">Specify locations and choose private cab tier</p>
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
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-white/95 mt-0.5 focus:outline-none"
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
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-white/95 mt-0.5 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Private Tiers list */}
            <div className="space-y-2">
              {PRIVATE_RIDE_TYPES.map((ride, idx) => (
                <div
                  key={ride.id}
                  onClick={() => setSelectedRideIdx(idx)}
                  className={`border rounded-2xl p-3 flex justify-between items-center transition-all cursor-pointer ${
                    selectedRideIdx === idx
                      ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
                      : "bg-white/5 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ride.iconColor}`}>
                      <Car className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{ride.name}</h4>
                      <p className="text-[9px] text-white/55 mt-0.5">{ride.capacity} seats • {ride.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-xs text-accent-gold block">{ride.price} ETB</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action button */}
            <button
              onClick={handleBookPrivateRide}
              className="w-full py-3.5 bg-mpesa-green hover:bg-mpesa-green-hover text-white font-extrabold text-xs rounded-xl shadow-md shadow-mpesa-green/20 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Book Private Cab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
