"use client";

import React from "react";
import { Calendar, MapPin, Ticket, Award, ArrowLeft, Plus, Minus, ShieldCheck } from "lucide-react";

interface TicketTier {
  name: string;
  price: number;
  benefits: string[];
}

interface EventData {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  tiers: TicketTier[];
}

const EVENTS: EventData[] = [
  {
    id: "addis-fusion",
    title: "Addis Fusion Music Festival",
    category: "Music Concert",
    date: "Saturday, June 20, 2026",
    time: "4:00 PM - 12:00 AM",
    location: "Bole Fana Park, Addis Ababa",
    organizer: "Habesha Sound Events",
    description: "The biggest gathering of Ethiopian traditional and modern fusion artists. Live performances, gourmet street food stalls, and immersive cultural showcases.",
    tiers: [
      { name: "Regular Admission", price: 450, benefits: ["General access to festival grounds", "Food & beverage stalls access", "Standard viewing area"] },
      { name: "VIP Experience", price: 1200, benefits: ["Express gate entrance", "Access to VIP tent & private bar", "Premium front-stage viewing", "1 free drink coupon"] },
      { name: "VVIP Backstage", price: 3500, benefits: ["All VIP benefits", "Exclusive backstage lounge", "Meet & greet with headline artists", "Buffet dinner & open bar"] }
    ]
  },
  {
    id: "art-expo",
    title: "National Art & Photography Expo",
    category: "Exhibition",
    date: "June 25 - 27, 2026",
    time: "10:00 AM - 7:00 PM",
    location: "Sheraton Addis Lounge",
    organizer: "Creative Ethiopia Union",
    description: "Discover stunning visual storytelling from 50+ emerging and established Ethiopian painters and photographers. Guided tours and panel discussions available.",
    tiers: [
      { name: "Day Pass", price: 200, benefits: ["Single-day access to art gallery", "Digital exhibition catalog"] },
      { name: "Full Access Pass", price: 500, benefits: ["Unlimited 3-day access", "Printed catalog signed by curators", "Invitation to Opening Night Gala"] }
    ]
  },
  {
    id: "innovate-tech",
    title: "Ethiopia Tech Pitch & Summit",
    category: "Conference",
    date: "Thursday, July 2, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "ICT Park Innovation Hub",
    organizer: "Fintech Ethiopia & M-PESA Catalyst",
    description: "Connecting startups, tech innovators, and venture capital. Keynotes on super apps, financial inclusion, and the digital economy in Ethiopia.",
    tiers: [
      { name: "General Seat", price: 300, benefits: ["Access to keynote halls & exhibitions", "Standard networking areas", "Certificate of attendance"] },
      { name: "Corporate VIP", price: 1500, benefits: ["Premium seating at main stage", "Access to investor matchmaking lounge", "Catered networking lunch & coffee"] }
    ]
  }
];

interface EventsTabProps {
  onTriggerCheckout: (amount: number, name: string, category: string) => void;
}

export default function EventsTab({ onTriggerCheckout }: EventsTabProps) {
  const [selectedEvent, setSelectedEvent] = React.useState<EventData | null>(null);
  const [selectedTierIdx, setSelectedTierIdx] = React.useState<number>(0);
  const [quantity, setQuantity] = React.useState<number>(1);

  const handleBookTickets = () => {
    if (!selectedEvent) return;
    const tier = selectedEvent.tiers[selectedTierIdx];
    const total = tier.price * quantity;
    onTriggerCheckout(total, `${selectedEvent.title} (${quantity}x ${tier.name})`, "Tickets");
  };

  if (selectedEvent) {
    const tier = selectedEvent.tiers[selectedTierIdx];
    const totalCost = tier.price * quantity;

    return (
      <div className="flex-1 flex flex-col p-4">
        {/* Back Button */}
        <button
          onClick={() => {
            setSelectedEvent(null);
            setSelectedTierIdx(0);
            setQuantity(1);
          }}
          className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-semibold mb-4 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>

        {/* Details Wrapper */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {/* Header Card */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
            <span className="text-[9px] px-2.5 py-0.5 bg-purple-500/15 text-purple-300 border border-purple-500/20 rounded-full font-bold uppercase">
              {selectedEvent.category}
            </span>
            <h3 className="text-xl font-extrabold mt-2 text-white/95 leading-tight">{selectedEvent.title}</h3>
            <p className="text-xs text-purple-300 mt-1">Organized by {selectedEvent.organizer}</p>

            <div className="space-y-2.5 mt-4 pt-3 border-t border-white/5 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="font-semibold">{selectedEvent.date}</span>
                <span className="text-white/40">({selectedEvent.time})</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>{selectedEvent.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-1 text-xs leading-relaxed text-white/60">
            <h4 className="font-bold text-white/80 uppercase tracking-wider mb-1">About Event</h4>
            <p>{selectedEvent.description}</p>
          </div>

          {/* Ticket Tier Selector */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-white/55 uppercase tracking-wider px-1">Select Ticket Tier</h4>
            <div className="grid grid-cols-1 gap-2.5">
              {selectedEvent.tiers.map((t, idx) => (
                <div
                  key={t.name}
                  onClick={() => setSelectedTierIdx(idx)}
                  className={`border rounded-2xl p-4 cursor-pointer transition-all flex justify-between items-center ${
                    selectedTierIdx === idx
                      ? "bg-purple-500/10 border-purple-500/50 shadow-md shadow-purple-500/5"
                      : "bg-white/5 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div>
                    <h5 className="font-bold text-[14px] text-white/95">{t.name}</h5>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                      {t.benefits.slice(0, 2).map((b) => (
                        <span key={b} className="text-[9px] text-white/55 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-purple-400" />
                          <span>{b}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[15px] text-accent-gold block">{t.price} ETB</span>
                    <span className="text-[9px] text-white/45 block mt-0.5">per ticket</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl p-4">
            <div>
              <h4 className="font-bold text-xs text-white/80">Ticket Quantity</h4>
              <p className="text-[10px] text-white/45 mt-0.5">Maximum 5 tickets per user</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 hover:bg-white/10 rounded-lg text-white/75"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-white min-w-[16px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                className="p-1 hover:bg-white/10 rounded-lg text-white/75"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <div className="mt-4 p-4 glass-panel rounded-2xl border border-white/10 flex justify-between items-center shadow-lg shadow-black/40">
          <div>
            <p className="text-[10px] text-white/55 font-bold uppercase tracking-wider">Total Booking Price</p>
            <p className="text-base font-extrabold text-white">ETB {totalCost.toLocaleString()}</p>
          </div>
          <button
            onClick={handleBookTickets}
            className="px-5 py-3 bg-mpesa-green hover:bg-mpesa-green-hover text-white font-bold text-xs rounded-xl shadow-lg shadow-mpesa-green/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Ticket className="w-4 h-4" />
            <span>M-PESA 1-Tap Pay</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4">
      <div>
        <h2 className="text-sm font-bold uppercase text-white/55 tracking-wider px-1">Upcoming Events</h2>
        <p className="text-[11px] text-white/55 px-1 mt-0.5">Buy verified tickets instantly via M-PESA wallet</p>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {EVENTS.map((event) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-4 cursor-pointer hover:translate-y-[-1px] transition-all flex items-center justify-between group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-sm text-white group-hover:text-accent-gold transition-colors">{event.title}</h3>
                <p className="text-[11px] text-white/50 mt-0.5">{event.category}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-white/55">
                  <Calendar className="w-3.5 h-3.5 text-purple-400/80" />
                  <span>{event.date.replace(", 2026", "")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
