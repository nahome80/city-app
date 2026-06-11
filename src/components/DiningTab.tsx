"use client";

import React from "react";
import {
  Utensils, Star, MapPin, ChevronRight, ArrowLeft,
  Users, Clock, CalendarDays, CheckCircle2, Building2,
  Wifi, Coffee, Dumbbell, Car, ChevronDown,
} from "lucide-react";

// ─────────────────────────── DATA ────────────────────────────

interface MenuItem {
  name: string;
  price: number;
  tag?: string;
}

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  cuisine: string;
  address: string;
  openHours: string;
  avgPrice: number;
  specialties: string[];
  menu: MenuItem[];
  features: string[];
}

interface Hotel {
  id: string;
  name: string;
  rating: number;
  stars: number;
  address: string;
  perks: string[];
  rooms: { type: string; price: number; available: boolean }[];
}

const RESTAURANTS: Restaurant[] = [
  {
    id: "kuriftu",
    name: "Kuriftu Cultural Restaurant",
    rating: 4.8,
    cuisine: "Traditional Habesha",
    address: "Bole Road, Near Airport",
    openHours: "11 AM – 11 PM",
    avgPrice: 350,
    specialties: ["Kitfo", "Tibs", "Tej"],
    features: ["Live Music", "Private Rooms", "Outdoor Terrace"],
    menu: [
      { name: "Special Shekla Tibs", price: 380, tag: "Chef's Choice" },
      { name: "Kitfo Special", price: 420, tag: "Most Loved" },
      { name: "Special Beyaynetu", price: 290 },
      { name: "Habesha Tej (Honey Wine)", price: 120 },
      { name: "Firfir Breakfast Platter", price: 180 },
    ],
  },
  {
    id: "kategna",
    name: "Kategna Restaurant",
    rating: 4.7,
    cuisine: "Ethiopian Classic",
    address: "Bole Medhanialem",
    openHours: "7 AM – 10 PM",
    avgPrice: 200,
    specialties: ["Shiro", "Derek Tibs", "Macchiato"],
    features: ["Rooftop Seating", "Fast Service", "Family Friendly"],
    menu: [
      { name: "Tegabino Shiro", price: 210, tag: "Fan Favourite" },
      { name: "Kategna Appetizer", price: 160 },
      { name: "Derek Tibs", price: 340, tag: "Chef's Choice" },
      { name: "Addis Macchiato", price: 65 },
    ],
  },
  {
    id: "sabor",
    name: "Sabor Restaurant & Lounge",
    rating: 4.6,
    cuisine: "Italian Fusion",
    address: "Sarbet, Near African Union",
    openHours: "12 PM – 12 AM",
    avgPrice: 550,
    specialties: ["Gnocchi", "Steak", "Tiramisu"],
    features: ["Wine Selection", "VIP Lounge", "Live Jazz Fri/Sat"],
    menu: [
      { name: "Truffle Gnocchi", price: 490, tag: "Signature" },
      { name: "Gorgonzola Filet Steak", price: 620, tag: "Premium Cut" },
      { name: "Tiramisu Classic", price: 220 },
      { name: "Aperol Spritz", price: 180 },
    ],
  },
  {
    id: "yod-abyssinia",
    name: "Yod Abyssinia Restaurant",
    rating: 4.9,
    cuisine: "Cultural Ethiopian",
    address: "Kazanchis, King George VI St",
    openHours: "6 PM – 12 AM",
    avgPrice: 420,
    specialties: ["Cultural Show", "Injera Feast", "Traditional Tej"],
    features: ["Cultural Dance Show", "Group Tables", "Iconic Venue"],
    menu: [
      { name: "Traditional Feast Plate", price: 480, tag: "Must Try" },
      { name: "Kitfo & Tibs Combo", price: 520, tag: "Most Loved" },
      { name: "Tej Honey Wine Jug", price: 280 },
      { name: "Firfir Starter", price: 160 },
    ],
  },
];

const HOTELS: Hotel[] = [
  {
    id: "sheraton",
    name: "Sheraton Addis",
    rating: 4.9,
    stars: 5,
    address: "Taitu St, Piazza",
    perks: ["Pool", "Spa", "Gym", "Free WiFi", "Airport Shuttle"],
    rooms: [
      { type: "Deluxe Room", price: 6500, available: true },
      { type: "Junior Suite", price: 12000, available: true },
      { type: "Grand Suite", price: 22000, available: false },
    ],
  },
  {
    id: "hilton",
    name: "Hilton Addis Ababa",
    rating: 4.8,
    stars: 5,
    address: "Menelik II Ave, City Centre",
    perks: ["Pool", "Gym", "Business Centre", "Restaurant", "Free WiFi"],
    rooms: [
      { type: "Superior Room", price: 5800, available: true },
      { type: "Executive Room", price: 9200, available: true },
      { type: "Presidential Suite", price: 35000, available: true },
    ],
  },
  {
    id: "radisson",
    name: "Radisson Blu Hotel",
    rating: 4.7,
    stars: 5,
    address: "Airport Road, Bole",
    perks: ["Rooftop Bar", "Gym", "Spa", "Free WiFi", "24hr Room Service"],
    rooms: [
      { type: "Standard Room", price: 4200, available: true },
      { type: "Superior Room", price: 6000, available: false },
      { type: "Business Suite", price: 10500, available: true },
    ],
  },
  {
    id: "boni",
    name: "Boni Hotel Addis",
    rating: 4.5,
    stars: 4,
    address: "Bole Medhanialem",
    perks: ["Restaurant", "Free WiFi", "Airport Pickup", "Parking"],
    rooms: [
      { type: "Standard Twin", price: 2200, available: true },
      { type: "Deluxe Double", price: 3100, available: true },
    ],
  },
];

const DISTANCES: Record<string, Record<string, number>> = {
  Bole: { kuriftu: 0.5, kategna: 0.9, sabor: 6.5, "yod-abyssinia": 3.2 },
  Kazanchis: { kuriftu: 3.5, kategna: 2.8, sabor: 4.0, "yod-abyssinia": 0.8 },
  Piazza: { kuriftu: 7.2, kategna: 6.0, sabor: 3.8, "yod-abyssinia": 1.5 },
  Sarbet: { kuriftu: 9.0, kategna: 8.2, sabor: 0.8, "yod-abyssinia": 7.0 },
};

interface DiningTabProps {
  onTriggerCheckout: (amount: number, name: string, category: string) => void;
  location: string;
}

// ─────────────────────────── COMPONENT ────────────────────────

export default function DiningTab({ onTriggerCheckout, location }: DiningTabProps) {
  const [activeTab, setActiveTab] = React.useState<"restaurants" | "hotels">("restaurants");
  const [selectedRest, setSelectedRest] = React.useState<Restaurant | null>(null);
  const [selectedHotel, setSelectedHotel] = React.useState<Hotel | null>(null);

  // Restaurant booking state
  const [bookingStep, setBookingStep] = React.useState<"menu" | "book">("menu");
  const [guestCount, setGuestCount] = React.useState(2);
  const [bookingTime, setBookingTime] = React.useState("1:00 PM");
  const [bookingDate, setBookingDate] = React.useState("Today");
  const [bookingConfirmed, setBookingConfirmed] = React.useState(false);

  // Hotel booking state
  const [selectedRoomIdx, setSelectedRoomIdx] = React.useState(0);
  const [nights, setNights] = React.useState(1);

  const getDistance = (restId: string) => {
    const locMap = DISTANCES[location] || DISTANCES.Bole;
    return locMap[restId] ?? 2.0;
  };

  const handleRestBooking = () => {
    if (!selectedRest) return;
    const depositAmount = 150;
    onTriggerCheckout(depositAmount, `Table at ${selectedRest.name} — ${guestCount} guests, ${bookingDate} ${bookingTime}`, "Dining");
    setBookingConfirmed(true);
  };

  const handleHotelBooking = () => {
    if (!selectedHotel) return;
    const room = selectedHotel.rooms[selectedRoomIdx];
    const total = room.price * nights;
    onTriggerCheckout(total, `${selectedHotel.name} — ${room.type} × ${nights} night(s)`, "Dining");
  };

  // ── Restaurant Detail View ──────────────────────────────────
  if (selectedRest) {
    return (
      <div className="flex-1 flex flex-col p-4">
        <button
          onClick={() => { setSelectedRest(null); setBookingStep("menu"); setBookingConfirmed(false); }}
          className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-semibold mb-4 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurants</span>
        </button>

        {/* Hero Card */}
        <div className="relative bg-gradient-to-br from-[#1c1835] to-[#12102a] border border-white/10 rounded-3xl p-5 mb-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-bl-full" />
          <span className="text-[9px] px-2.5 py-0.5 bg-accent-gold/15 text-accent-gold border border-accent-gold/25 rounded-full font-bold uppercase">
            {selectedRest.cuisine}
          </span>
          <h3 className="text-lg font-extrabold mt-2 text-white leading-tight">{selectedRest.name}</h3>
          <p className="text-xs text-white/55 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-accent-gold" />
            <span>{selectedRest.address} • {getDistance(selectedRest.id)} km</span>
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedRest.features.map((f) => (
              <span key={f} className="text-[8px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/60 font-semibold">{f}</span>
            ))}
          </div>
          <div className="flex gap-4 mt-4 pt-3 border-t border-white/5 text-[11px] text-white/70">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" />
              <strong className="text-white">{selectedRest.rating}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span>{selectedRest.openHours}</span>
            </span>
            <span className="flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-white/40" />
              <span>~{selectedRest.avgPrice} ETB / person</span>
            </span>
          </div>
        </div>

        {/* Internal Step Tabs */}
        <div className="flex gap-2 mb-4 bg-white/5 border border-white/5 rounded-2xl p-1">
          <button
            onClick={() => setBookingStep("menu")}
            className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all ${bookingStep === "menu" ? "bg-white/10 text-white" : "text-white/50"}`}
          >
            Browse Menu
          </button>
          <button
            onClick={() => setBookingStep("book")}
            className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all ${bookingStep === "book" ? "bg-mpesa-green text-white shadow-md shadow-mpesa-green/10" : "text-white/50"}`}
          >
            Book a Table
          </button>
        </div>

        {/* Menu Browse Step */}
        {bookingStep === "menu" && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <h4 className="text-[10px] text-white/45 font-bold uppercase tracking-wider px-1">Specialties & Menu</h4>
            {selectedRest.menu.map((item) => (
              <div
                key={item.name}
                className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex justify-between items-center hover:border-white/10 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-sm text-white/95">{item.name}</h5>
                    {item.tag && (
                      <span className="text-[8px] px-2 py-0.5 bg-accent-gold/15 text-accent-gold rounded-full font-bold border border-accent-gold/20">{item.tag}</span>
                    )}
                  </div>
                </div>
                <span className="text-sm font-extrabold text-accent-gold ml-4 whitespace-nowrap">ETB {item.price}</span>
              </div>
            ))}

            <button
              onClick={() => setBookingStep("book")}
              className="w-full mt-4 py-3.5 bg-mpesa-green hover:bg-mpesa-green-hover text-white font-bold text-xs rounded-xl shadow-md shadow-mpesa-green/15 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Ready? Reserve a Table →
            </button>
          </div>
        )}

        {/* Table Booking Step */}
        {bookingStep === "book" && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {bookingConfirmed ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-mpesa-green/15 border border-mpesa-green/30 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-mpesa-green" />
                </div>
                <h3 className="text-lg font-bold text-white">Reservation Confirmed!</h3>
                <p className="text-xs text-white/55 mt-2 px-6 leading-relaxed">
                  Your table at <strong>{selectedRest.name}</strong> is secured for {guestCount} guests on {bookingDate} at {bookingTime}. Confirmation SMS sent via M-PESA.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white/5 border border-white/5 rounded-3xl p-4 space-y-4">
                  {/* Date Selector */}
                  <div>
                    <label className="text-[9px] text-white/45 font-bold uppercase tracking-wider block mb-2">Date</label>
                    <div className="flex gap-2">
                      {["Today", "Tomorrow", "Wed"].map((d) => (
                        <button
                          key={d}
                          onClick={() => setBookingDate(d)}
                          className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold border transition-all ${
                            bookingDate === d ? "bg-accent-gold/15 border-accent-gold/40 text-accent-gold" : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selector */}
                  <div>
                    <label className="text-[9px] text-white/45 font-bold uppercase tracking-wider block mb-2">Time Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["12:00 PM", "1:00 PM", "2:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setBookingTime(t)}
                          className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                            bookingTime === t ? "bg-accent-gold/15 border-accent-gold/40 text-accent-gold" : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div>
                    <label className="text-[9px] text-white/45 font-bold uppercase tracking-wider block mb-2">Guests</label>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 w-fit">
                      <button
                        onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-white transition-colors"
                      >
                        –
                      </button>
                      <span className="text-base font-extrabold text-white w-6 text-center">{guestCount}</span>
                      <button
                        onClick={() => setGuestCount((g) => Math.min(12, g + 1))}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-white transition-colors"
                      >
                        +
                      </button>
                      <span className="text-xs text-white/50 font-semibold ml-1">people</span>
                    </div>
                  </div>
                </div>

                {/* Summary + CTA */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 text-xs text-white/70">
                  <div className="flex justify-between">
                    <span>Restaurant</span>
                    <span className="font-bold text-white/90 truncate ml-2 max-w-[160px]">{selectedRest.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time</span>
                    <span className="font-bold text-white/90">{bookingDate}, {bookingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests</span>
                    <span className="font-bold text-white/90">{guestCount} people</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2">
                    <span>Reservation Deposit</span>
                    <span className="font-extrabold text-accent-gold">ETB 150</span>
                  </div>
                  <p className="text-[9px] text-white/40 leading-relaxed">
                    Deposit is redeemable on your bill. No cancellation fee if cancelled 2 hrs before.
                  </p>
                </div>

                <button
                  onClick={handleRestBooking}
                  className="w-full py-4 bg-mpesa-green hover:bg-mpesa-green-hover text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-mpesa-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirm Reservation (M-PESA)
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Hotel Detail View ──────────────────────────────────────
  if (selectedHotel) {
    const room = selectedHotel.rooms[selectedRoomIdx];
    const totalCost = room.price * nights;

    return (
      <div className="flex-1 flex flex-col p-4">
        <button
          onClick={() => setSelectedHotel(null)}
          className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-semibold mb-4 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hotels</span>
        </button>

        {/* Hotel Hero Card */}
        <div className="relative bg-gradient-to-br from-[#1c1835] to-[#12102a] border border-white/10 rounded-3xl p-5 mb-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] px-2.5 py-0.5 bg-blue-500/15 text-blue-300 border border-blue-500/25 rounded-full font-bold">
              {"⭐".repeat(selectedHotel.stars)} Star Hotel
            </span>
            <span className="font-extrabold text-accent-gold text-sm">{selectedHotel.rating} ★</span>
          </div>
          <h3 className="text-lg font-extrabold mt-2 text-white">{selectedHotel.name}</h3>
          <p className="text-xs text-white/55 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-400" />
            <span>{selectedHotel.address}</span>
          </p>
          <div className="flex flex-wrap gap-2 mt-3.5 pt-3 border-t border-white/5">
            {selectedHotel.perks.map((p) => (
              <span key={p} className="text-[8px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/60 font-semibold">{p}</span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Room Selection */}
          <div>
            <h4 className="text-[10px] text-white/45 font-bold uppercase tracking-wider px-1 mb-2">Select Room Type</h4>
            <div className="space-y-2">
              {selectedHotel.rooms.map((room, idx) => (
                <div
                  key={room.type}
                  onClick={() => room.available && setSelectedRoomIdx(idx)}
                  className={`border rounded-2xl p-4 flex justify-between items-center transition-all ${
                    !room.available
                      ? "opacity-40 cursor-not-allowed bg-white/3 border-white/5"
                      : selectedRoomIdx === idx
                      ? "bg-blue-500/10 border-blue-500/40 cursor-pointer"
                      : "bg-white/5 border-white/5 cursor-pointer hover:border-white/10"
                  }`}
                >
                  <div>
                    <h5 className="font-bold text-sm text-white">{room.type}</h5>
                    <span className={`text-[9px] font-bold mt-0.5 block ${room.available ? "text-mpesa-green" : "text-red-400"}`}>
                      {room.available ? "Available" : "Sold Out"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-accent-gold block">{room.price.toLocaleString()}</span>
                    <span className="text-[9px] text-white/45">ETB / night</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nights Selector */}
          <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-4">
            <div>
              <h4 className="font-bold text-xs text-white/80">Number of Nights</h4>
              <p className="text-[10px] text-white/45 mt-0.5">Check-in: {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
              <button onClick={() => setNights((n) => Math.max(1, n - 1))} className="p-1 hover:bg-white/10 rounded-lg text-white/75">–</button>
              <span className="text-sm font-bold text-white min-w-[20px] text-center">{nights}</span>
              <button onClick={() => setNights((n) => Math.min(14, n + 1))} className="p-1 hover:bg-white/10 rounded-lg text-white/75">+</button>
            </div>
          </div>

          {/* Total Cost Summary */}
          <div className="glass-panel rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-white/55 font-bold uppercase tracking-wider">Total Cost</p>
              <p className="text-xl font-extrabold text-white mt-0.5">ETB {totalCost.toLocaleString()}</p>
              <p className="text-[10px] text-white/45 mt-0.5">{nights} night(s) × {room.price.toLocaleString()} ETB</p>
            </div>
            <button
              onClick={handleHotelBooking}
              disabled={!room.available}
              className="px-5 py-3 bg-mpesa-green hover:bg-mpesa-green-hover disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg shadow-mpesa-green/20 hover:scale-105 active:scale-95 transition-all"
            >
              Book & Pay
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Listing View ──────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-sm font-bold uppercase text-white/55 tracking-wider px-1">Dining & Stays</h2>
        <p className="text-[11px] text-white/55 px-1 mt-0.5">Browse, book and pay — no phone calls needed</p>
      </div>

      {/* Mini Tab Pill Bar */}
      <div className="flex gap-2 mb-5 bg-white/5 border border-white/5 rounded-2xl p-1 shrink-0">
        <button
          onClick={() => setActiveTab("restaurants")}
          className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "restaurants" ? "bg-amber-500/20 text-amber-300 border border-amber-500/25" : "text-white/50 hover:text-white"
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Restaurants</span>
        </button>
        <button
          onClick={() => setActiveTab("hotels")}
          className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "hotels" ? "bg-blue-500/20 text-blue-300 border border-blue-500/25" : "text-white/50 hover:text-white"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Hotels</span>
        </button>
      </div>

      {/* Restaurant Listings */}
      {activeTab === "restaurants" && (
        <div className="flex-1 space-y-3 overflow-y-auto pr-1 thin-scrollbar">
          {RESTAURANTS.map((rest) => (
            <div
              key={rest.id}
              onClick={() => setSelectedRest(rest)}
              className="bg-white/5 border border-white/5 hover:border-amber-500/25 rounded-2xl p-4 cursor-pointer hover:translate-y-[-1px] transition-all group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform flex-shrink-0">
                  <Utensils className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-sm text-white group-hover:text-accent-gold transition-colors truncate mr-2">{rest.name}</h3>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-[11px] text-white/50 mt-0.5">{rest.cuisine}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-white/55 flex-wrap">
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-accent-gold text-accent-gold" />
                      <strong className="text-white/80">{rest.rating}</strong>
                    </span>
                    <span>•</span>
                    <span>{getDistance(rest.id)} km away</span>
                    <span>•</span>
                    <span>~{rest.avgPrice} ETB/person</span>
                  </div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {rest.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="text-[8px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/50">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hotel Listings */}
      {activeTab === "hotels" && (
        <div className="flex-1 space-y-3 overflow-y-auto pr-1 thin-scrollbar">
          {HOTELS.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => { setSelectedHotel(hotel); setSelectedRoomIdx(0); setNights(1); }}
              className="bg-white/5 border border-white/5 hover:border-blue-500/25 rounded-2xl p-4 cursor-pointer hover:translate-y-[-1px] transition-all group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform flex-shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition-colors truncate mr-2">{hotel.name}</h3>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-[11px] text-white/50 mt-0.5">{hotel.address}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-white/55">
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-accent-gold text-accent-gold" />
                      <strong className="text-white/80">{hotel.rating}</strong>
                    </span>
                    <span>•</span>
                    <span>{"⭐".repeat(hotel.stars)}</span>
                    <span>•</span>
                    <span className="text-mpesa-green font-bold">
                      from {Math.min(...hotel.rooms.filter((r) => r.available).map((r) => r.price)).toLocaleString()} ETB/night
                    </span>
                  </div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {hotel.perks.slice(0, 3).map((p) => (
                      <span key={p} className="text-[8px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/50">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
