"use client";

import React from "react";
import { TrendingUp, Award, AlertTriangle, Play, ChevronLeft, ChevronRight, BarChart3, HelpCircle } from "lucide-react";

interface Slide {
  title: string;
  segment: string;
  timeRange: string;
  notes: string;
  bullets: string[];
}

const PITCH_SLIDES: Slide[] = [
  {
    title: "1. CityLife Title",
    segment: "SEGMENT 1",
    timeRange: "0:00 – 0:45",
    notes: "Calm, confident storytelling. Connect emotionally. Highlight that 2.7M trust M-PESA daily, but only use a fraction of its potential. What if M-PESA was where they live?",
    bullets: ["2.7 Million active users in Ethiopia", "Already trusted and installed", "The move from money transfer to lifestyle center"]
  },
  {
    title: "2. The Everyday Struggle",
    segment: "SEGMENT 2",
    timeRange: "0:45 – 1:45",
    notes: "Highlight the daily reality of Addis Ababa residents. Scattered menus on Instagram, expired ticket links on Telegram stories, calling multiple numbers for taxis.",
    bullets: ["Information scattering across Telegram/IG", "Frustrating booking friction", "Daily inconvenience for 2.7 million M-PESA users"]
  },
  {
    title: "3. Where Did They Go?",
    segment: "SEGMENT 3",
    timeRange: "1:45 – 2:30",
    notes: "Point out that when citizens need answers, they leave M-PESA for TikTok, Instagram, or Telegram. M-PESA sits idle with no answer to give.",
    bullets: ["Social media channels capture the attention loop", "M-PESA is currently excluded from lifestyle habits", "The first platform to resolve this captures user loyalty"]
  },
  {
    title: "4. The Uncomfortable Truth",
    segment: "SEGMENT 4",
    timeRange: "2:30 – 3:15",
    notes: "M-PESA is at risk of becoming a basic utility/commodity. No daily habit loop, no emotional connection. Payment-only is a vulnerability.",
    bullets: ["Risk of commoditization", "Low customer retention triggers high replacement risk", "Super apps are redefining telephone utility"]
  },
  {
    title: "5. Competitive Threat",
    segment: "SEGMENT 5",
    timeRange: "3:15 – 4:00",
    notes: "Telebirr and CBE are active. Startups are rising. Once a customer locks loyalty to another super-app platform, they don't return.",
    bullets: ["Telebirr, CBE and fintechs building ecosystems", "First-mover advantage in habit-forming loops is absolute", "M-PESA must react now or watch from the sidelines"]
  },
  {
    title: "6. The Solution: CityLife",
    segment: "SEGMENT 6",
    timeRange: "4:00 – 5:00",
    notes: "Introduce CityLife. Built directly into the M-PESA app already on their phones. Zero download, zero subscription fee, 1-tap checkout.",
    bullets: ["In-app lifestyle mini-app dashboard", "Instant dining reservation, tickets, and ride bookings", "All flows settled in 1 tap through M-PESA wallet"]
  },
  {
    title: "7. Growth Projections",
    segment: "SEGMENT 7",
    timeRange: "5:00 – 5:40",
    notes: "Demonstrate scaling metrics. Highlighting inclusion for all income levels: transport for low-income, food/tickets for middle, premium events for high.",
    bullets: ["Year 1 target: 5% penetration (135K users)", "Year 3 target: 30% penetration (810K DAUs)", "Inclusive lifestyle options across all socio-economic tiers"]
  },
  {
    title: "8. Revenue & The Decision",
    segment: "SEGMENT 8",
    timeRange: "5:40 – 7:00",
    notes: "Provide global proof (Grab, Alipay, Paytm). Project 7x revenue growth in 3 years (ETB 588 million new revenue). Call to action.",
    bullets: ["7x Revenue Growth in 3 Years", "ETB 588 Million in new revenue", "Opportunity is ready. The infrastructure exists. Decide."]
  }
];

export default function StatsTab() {
  const [slideIdx, setSlideIdx] = React.useState(0);
  const [penetration, setPenetration] = React.useState(30); // 30% default
  const [avgTicket, setAvgTicket] = React.useState(250); // 250 ETB default

  // Calculate dynamic variables
  const totalMpesaUsers = 2700000;
  const projectedDaus = Math.round(totalMpesaUsers * (penetration / 100));
  // Annualized revenue (simulated transaction commission of 3%)
  const commissionRate = 0.03;
  const annualTxCountPerUser = 24; // 2 tx per month
  const projectedAnnualRevenue = Math.round(projectedDaus * annualTxCountPerUser * avgTicket * commissionRate);

  const activeSlide = PITCH_SLIDES[slideIdx];

  return (
    <div className="flex-1 flex flex-col p-4 space-y-5">
      {/* Tab Title */}
      <div>
        <h2 className="text-sm font-bold uppercase text-white/55 tracking-wider px-1">Business Analytics</h2>
        <p className="text-[11px] text-white/55 px-1 mt-0.5">The CityLife M-PESA Super-App Opportunity</p>
      </div>

      {/* Slide Deck Presentation Player */}
      <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between min-h-[220px]">
        <div className="flex justify-between items-center pb-2 border-b border-white/5 text-[10px] font-bold text-white/45">
          <span className="text-accent-gold">{activeSlide.segment}</span>
          <span>Time range: {activeSlide.timeRange}</span>
        </div>

        <div className="my-3 flex-1 flex flex-col justify-center">
          <h4 className="font-extrabold text-sm text-white">{activeSlide.title}</h4>
          <p className="text-[11px] text-white/60 italic leading-relaxed mt-2">
            &ldquo;{activeSlide.notes}&rdquo;
          </p>
          <ul className="mt-3.5 space-y-1">
            {activeSlide.bullets.map((b, i) => (
              <li key={i} className="text-[10px] text-accent-gold flex items-center gap-1.5 font-medium">
                <span className="w-1 h-1 rounded-full bg-accent-gold" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
          <span className="text-[10px] font-bold text-white/45">Slide {slideIdx + 1} of {PITCH_SLIDES.length}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSlideIdx((prev) => Math.max(0, prev - 1))}
              disabled={slideIdx === 0}
              className="p-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded-lg text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSlideIdx((prev) => Math.min(PITCH_SLIDES.length - 1, prev + 1))}
              disabled={slideIdx === PITCH_SLIDES.length - 1}
              className="p-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded-lg text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Revenue Calculator */}
      <div className="bg-gradient-to-br from-[#120f26] to-[#1e1942] border border-white/10 rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
          <BarChart3 className="w-4 h-4 text-accent-gold" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">Interactive Opportunity Calculator</h3>
        </div>

        {/* Sliders */}
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-medium text-white/70 mb-1">
              <span>M-PESA Penetration Rate</span>
              <span className="font-extrabold text-accent-gold">{penetration}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={penetration}
              onChange={(e) => setPenetration(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-gold"
            />
            <div className="flex justify-between text-[8px] text-white/40 mt-1">
              <span>Year 1 (5%)</span>
              <span>Year 3 (30%)</span>
              <span>Max Cap (50%)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium text-white/70 mb-1">
              <span>Avg Lifestyle Spend / Month</span>
              <span className="font-extrabold text-accent-gold">ETB {avgTicket}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={avgTicket}
              onChange={(e) => setAvgTicket(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-gold"
            />
            <div className="flex justify-between text-[8px] text-white/40 mt-1">
              <span>ETB 100</span>
              <span>ETB 500</span>
              <span>ETB 1,000</span>
            </div>
          </div>
        </div>

        {/* Calculator Output Display */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
            <p className="text-[9px] text-white/45 uppercase font-bold tracking-wider">Projected DAUs</p>
            <p className="text-sm font-extrabold text-white mt-1">{projectedDaus.toLocaleString()}</p>
            <p className="text-[8px] text-white/40 mt-0.5">Ethiopians Using CityLife</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
            <p className="text-[9px] text-white/45 uppercase font-bold tracking-wider">Annual Commission</p>
            <p className="text-sm font-extrabold text-mpesa-green mt-1">ETB {(projectedAnnualRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-[8px] text-white/40 mt-0.5">At 3% Platform Fee</p>
          </div>
        </div>
      </div>

      {/* Projections Progress Tracker */}
      <div className="bg-white/5 border border-white/5 rounded-3xl p-4 space-y-3.5">
        <h4 className="text-xs font-bold uppercase text-white/55 tracking-wider px-1">Penetration Road Map</h4>
        <div className="space-y-3">
          {/* Year 1 */}
          <div>
            <div className="flex justify-between text-[11px] font-medium text-white/70 mb-1">
              <span>Year 1 (Conservative Base)</span>
              <span className="font-bold text-accent-gold">5% (135,000 users)</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="bg-accent-gold h-full rounded-full transition-all duration-1000" style={{ width: "5%" }} />
            </div>
          </div>

          {/* Year 2 */}
          <div>
            <div className="flex justify-between text-[11px] font-medium text-white/70 mb-1">
              <span>Year 2 (Organic Scaling)</span>
              <span className="font-bold text-accent-gold">15% (405,000 users)</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="bg-accent-gold h-full rounded-full transition-all duration-1000" style={{ width: "15%" }} />
            </div>
          </div>

          {/* Year 3 */}
          <div>
            <div className="flex justify-between text-[11px] font-medium text-white/70 mb-1">
              <span>Year 3 (Indispensable Hub)</span>
              <span className="font-bold text-accent-gold">30% (810,000 DAUs)</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="bg-accent-gold h-full rounded-full transition-all duration-1000" style={{ width: "30%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Competitive Table Section */}
      <div className="bg-white/5 border border-white/5 rounded-3xl p-4">
        <h4 className="text-xs font-bold uppercase text-white/55 tracking-wider px-1 mb-2.5">Super App Competitive Matrix</h4>
        <div className="overflow-x-auto text-[10px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="pb-2 font-bold uppercase">Feature</th>
                <th className="pb-2 font-bold uppercase text-center">M-PESA + CityLife</th>
                <th className="pb-2 font-bold uppercase text-center">Telebirr</th>
                <th className="pb-2 font-bold uppercase text-center">CBE Birr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              <tr>
                <td className="py-2">Payer Trust Base</td>
                <td className="py-2 text-center text-mpesa-green font-bold">2.7M (Safaricom)</td>
                <td className="py-2 text-center text-white/70">40M+ (Ethio)</td>
                <td className="py-2 text-center text-white/70">10M+ (Retail)</td>
              </tr>
              <tr>
                <td className="py-2">Dining Reservations</td>
                <td className="py-2 text-center text-mpesa-green font-bold">✓ Integrated</td>
                <td className="py-2 text-center text-white/40">✗ Listing Only</td>
                <td className="py-2 text-center text-white/40">✗ None</td>
              </tr>
              <tr>
                <td className="py-2">Event Ticketing</td>
                <td className="py-2 text-center text-mpesa-green font-bold">✓ 1-Tap Booking</td>
                <td className="py-2 text-center text-white/60">Limited Partners</td>
                <td className="py-2 text-center text-white/40">✗ None</td>
              </tr>
              <tr>
                <td className="py-2">Cab Booking</td>
                <td className="py-2 text-center text-mpesa-green font-bold">✓ Native App</td>
                <td className="py-2 text-center text-white/60">Web-link only</td>
                <td className="py-2 text-center text-white/40">✗ None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
