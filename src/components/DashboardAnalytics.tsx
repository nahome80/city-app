"use client";

import React from "react";
import { TrendingUp, Users, Smartphone, Zap, Brain, Target, ArrowUpRight, ArrowDownRight, Sparkles, QrCode, UtensilsCrossed, Car, Film, Ticket, BarChart3, PieChart, Activity, Clock, Globe, Bot, Lightbulb, ChevronRight, RefreshCw } from "lucide-react";

interface AnalyticsProps {
  loyaltyPoints: number;
  balance: number;
  bookingsCount: number;
  totalSpent: number;
}

// Simulated live data
const TRENDING_SERVICES = [
  { name: "Dining", value: 38, color: "#f59e0b", icon: UtensilsCrossed },
  { name: "Transport", value: 28, color: "#10b981", icon: Car },
  { name: "Cinema", value: 18, color: "#f43f5e", icon: Film },
  { name: "Events", value: 11, color: "#a855f7", icon: Ticket },
  { name: "Gem Hunt", value: 5, color: "#dfa839", icon: QrCode },
];

const DEVICE_BREAKDOWN = [
  { name: "Android", value: 62, color: "#10b981" },
  { name: "iOS", value: 29, color: "#3b82f6" },
  { name: "Web / PWA", value: 9, color: "#a855f7" },
];

const HOURLY_ACTIVITY = [
  { hour: "6am", value: 12 },
  { hour: "8am", value: 45 },
  { hour: "10am", value: 32 },
  { hour: "12pm", value: 78 },
  { hour: "2pm", value: 55 },
  { hour: "4pm", value: 40 },
  { hour: "6pm", value: 88 },
  { hour: "8pm", value: 72 },
  { hour: "10pm", value: 35 },
];

const AI_RECOMMENDATIONS = [
  {
    id: "r1",
    priority: "high",
    category: "Engagement",
    insight: "Users who scan 2+ City Gems per week have 4.3x higher retention. Push geo-targeted gem notifications during 6-8 PM peak transit hours.",
    metric: "+43% retention",
    confidence: 94,
  },
  {
    id: "r2",
    priority: "high",
    category: "Revenue",
    insight: "Dining reservations spike 320% on Fridays. Deploy weekend bundle offers (Dinner + Cinema) to capture cross-sell opportunity — projected +ETB 12M/quarter.",
    metric: "+320% Fri spike",
    confidence: 91,
  },
  {
    id: "r3",
    priority: "medium",
    category: "Conversion",
    insight: "67% of users browse Cinema but don't book. Seat selection abandonment at Step 2. Recommend: auto-suggest best available seats to reduce friction.",
    metric: "67% drop-off",
    confidence: 87,
  },
  {
    id: "r4",
    priority: "medium",
    category: "Loyalty",
    insight: "Only 23% of earned points are redeemed. Users forget they have rewards. Deploy push notifications when user reaches reward thresholds.",
    metric: "23% redemption",
    confidence: 89,
  },
  {
    id: "r5",
    priority: "low",
    category: "Growth",
    insight: "Android users in Kazanchis sub-city are 2.1x more active than Bole. Consider Kazanchis-first merchant onboarding for next wave.",
    metric: "2.1x activity",
    confidence: 82,
  },
];

const BEHAVIOR_SEGMENTS = [
  { segment: "Power Users", count: "12,400", pct: 9, color: "#dfa839", desc: "5+ transactions/week, high loyalty" },
  { segment: "Weekend Warriors", count: "34,200", pct: 25, color: "#a855f7", desc: "Active Fri-Sun, events & dining" },
  { segment: "Daily Commuters", count: "68,900", pct: 51, color: "#10b981", desc: "Transport-focused, weekday peaks" },
  { segment: "Casual Explorers", count: "19,500", pct: 15, color: "#3b82f6", desc: "1-2 uses/month, browsing only" },
];

export default function DashboardAnalytics({ loyaltyPoints, balance, bookingsCount, totalSpent }: AnalyticsProps) {
  const [aiThinking, setAiThinking] = React.useState(false);
  const [visibleRecs, setVisibleRecs] = React.useState(3);

  const simulateAiRefresh = () => {
    setAiThinking(true);
    setTimeout(() => setAiThinking(false), 2500);
  };

  // Compute dynamic stats
  const totalPointsEarned = 2_847_300;
  const totalPointsRedeemed = 654_900;
  const redemptionRate = Math.round((totalPointsRedeemed / totalPointsEarned) * 100);

  return (
    <div className="space-y-6">
      {/* ── TOP KPI METRIC CARDS ────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Active Users */}
        <div className="bg-[#121021] border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-emerald-500/5 rounded-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />+12.4%
            </span>
          </div>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-wider">Active Users Today</p>
          <p className="text-xl font-black text-white mt-0.5">134,892</p>
          <p className="text-[9px] text-white/40 mt-1">vs 119,987 yesterday</p>
        </div>

        {/* Transactions */}
        <div className="bg-[#121021] border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:border-[#dfa839]/30 transition-all">
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-[#dfa839]/5 rounded-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#dfa839]/10 border border-[#dfa839]/20 flex items-center justify-center text-[#dfa839]">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-[#dfa839] bg-[#dfa839]/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />+8.7%
            </span>
          </div>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-wider">Transactions Today</p>
          <p className="text-xl font-black text-white mt-0.5">48,291</p>
          <p className="text-[9px] text-white/40 mt-1">ETB 14.2M total volume</p>
        </div>

        {/* Gem Scans */}
        <div className="bg-[#121021] border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-amber-500/5 rounded-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />+34%
            </span>
          </div>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-wider">Gem Scans Today</p>
          <p className="text-xl font-black text-white mt-0.5">6,742</p>
          <p className="text-[9px] text-white/40 mt-1">312 Gold Gems claimed</p>
        </div>

        {/* Revenue */}
        <div className="bg-[#121021] border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:border-[#00a859]/30 transition-all">
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-[#00a859]/5 rounded-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#00a859]/10 border border-[#00a859]/20 flex items-center justify-center text-[#00a859]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-[#00a859] bg-[#00a859]/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />+22%
            </span>
          </div>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-wider">Platform Revenue (MTD)</p>
          <p className="text-xl font-black text-white mt-0.5">ETB 48.9M</p>
          <p className="text-[9px] text-white/40 mt-1">Commission: ETB 1.47M</p>
        </div>
      </div>

      {/* ── ROW: TRENDING SERVICES + DEVICE BREAKDOWN ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trending Services Bar Chart */}
        <div className="bg-[#121021] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-[#dfa839]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">Trending Services</h3>
            </div>
            <span className="text-[9px] text-white/40 font-bold uppercase">Last 30 Days</span>
          </div>

          <div className="space-y-3.5">
            {TRENDING_SERVICES.map((svc) => (
              <div key={svc.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${svc.color}15`, border: `1px solid ${svc.color}30` }}>
                  <svc.icon className="w-3.5 h-3.5" style={{ color: svc.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-white/85">{svc.name}</span>
                    <span className="text-[11px] font-extrabold" style={{ color: svc.color }}>{svc.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${svc.value}%`, backgroundColor: svc.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/5 text-[10px] text-white/45 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#dfa839]" />
            <span>Dining leads with <strong className="text-amber-400">38%</strong> of all CityLife transactions this month</span>
          </div>
        </div>

        {/* Device Type Breakdown */}
        <div className="bg-[#121021] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4.5 h-4.5 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">Device Breakdown</h3>
            </div>
            <span className="text-[9px] text-white/40 font-bold uppercase">Real-time</span>
          </div>

          {/* CSS Donut Chart */}
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {/* Android */}
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#10b981" strokeWidth="3.5"
                  strokeDasharray={`${62} ${100 - 62}`} strokeDashoffset="0" strokeLinecap="round" />
                {/* iOS */}
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#3b82f6" strokeWidth="3.5"
                  strokeDasharray={`${29} ${100 - 29}`} strokeDashoffset={`-${62}`} strokeLinecap="round" />
                {/* Web */}
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#a855f7" strokeWidth="3.5"
                  strokeDasharray={`${9} ${100 - 9}`} strokeDashoffset={`-${62 + 29}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-black text-white">135K</span>
                <span className="text-[8px] text-white/40 font-bold">USERS</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {DEVICE_BREAKDOWN.map((d) => (
                <div key={d.name} className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <div className="flex-1 flex justify-between items-baseline">
                    <span className="text-[11px] font-semibold text-white/80">{d.name}</span>
                    <span className="text-[11px] font-extrabold" style={{ color: d.color }}>{d.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-[10px] text-white/45 font-medium flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Android dominates at <strong className="text-emerald-400">62%</strong> — optimize for lower-end devices first</span>
          </div>
        </div>
      </div>

      {/* ── PEAK HOURS ACTIVITY CHART ──────────────────────── */}
      <div className="bg-[#121021] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">Peak Activity Hours</h3>
          </div>
          <span className="text-[9px] text-white/40 font-bold uppercase">Today&apos;s Pattern</span>
        </div>

        <div className="flex items-end gap-2 h-32 px-1">
          {HOURLY_ACTIVITY.map((h) => {
            const maxVal = Math.max(...HOURLY_ACTIVITY.map(x => x.value));
            const heightPct = (h.value / maxVal) * 100;
            const isPeak = h.value >= 70;
            return (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[8px] font-bold text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  {h.value}%
                </span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 group-hover:opacity-100 ${
                      isPeak
                        ? "bg-gradient-to-t from-[#00a859] to-emerald-400 opacity-90 shadow-lg shadow-[#00a859]/10"
                        : "bg-white/10 opacity-60 group-hover:bg-white/20"
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className={`text-[8px] font-bold ${isPeak ? "text-emerald-400" : "text-white/40"}`}>{h.hour}</span>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-white/5 flex flex-wrap gap-4 text-[10px]">
          <div className="flex items-center gap-1.5 text-white/50">
            <div className="w-3 h-3 rounded bg-gradient-to-t from-[#00a859] to-emerald-400" />
            <span>Peak Hours (70%+ load)</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/50">
            <div className="w-3 h-3 rounded bg-white/10" />
            <span>Normal Traffic</span>
          </div>
          <span className="text-white/45 font-medium ml-auto">
            🔥 Dinner rush <strong className="text-emerald-400">6 PM</strong> is the busiest hour — deploy flash deals here
          </span>
        </div>
      </div>

      {/* ── LOYALTY POINTS ANALYTICS ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Points Earned vs Redeemed */}
        <div className="bg-[#121021] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <PieChart className="w-4.5 h-4.5 text-[#dfa839]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">Points Economy</h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              redemptionRate < 30 ? "bg-red-500/15 text-red-400 border border-red-500/20" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
            }`}>
              {redemptionRate}% redemption rate
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl">
              <p className="text-[9px] text-white/45 font-bold uppercase tracking-wider">Total Earned</p>
              <p className="text-lg font-black text-[#dfa839] mt-1">{(totalPointsEarned / 1_000_000).toFixed(1)}M</p>
              <p className="text-[9px] text-white/40 mt-0.5">Points across all users</p>
            </div>
            <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl">
              <p className="text-[9px] text-white/45 font-bold uppercase tracking-wider">Total Redeemed</p>
              <p className="text-lg font-black text-emerald-400 mt-1">{(totalPointsRedeemed / 1_000_000).toFixed(1)}M</p>
              <p className="text-[9px] text-white/40 mt-0.5">Points converted to value</p>
            </div>
          </div>

          {/* Redemption funnel */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-white/60 font-semibold">
              <span>Earned → Redeemed Funnel</span>
            </div>
            <div className="w-full h-3 bg-[#dfa839]/15 border border-[#dfa839]/20 rounded-full overflow-hidden relative">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${redemptionRate}%` }} />
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-extrabold text-white/90">{redemptionRate}%</div>
            </div>
            <p className="text-[9px] text-red-400/80 font-medium">⚠ {100 - redemptionRate}% of points go unused — significant untapped engagement</p>
          </div>
        </div>

        {/* User Behavior Segments */}
        <div className="bg-[#121021] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Target className="w-4.5 h-4.5 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">User Segments</h3>
            </div>
            <span className="text-[9px] text-white/40 font-bold uppercase">ML Clustered</span>
          </div>

          <div className="space-y-3">
            {BEHAVIOR_SEGMENTS.map((seg) => (
              <div key={seg.segment} className="flex items-center gap-3 p-2.5 bg-white/[0.03] rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-white/90">{seg.segment}</span>
                    <span className="text-[10px] font-extrabold" style={{ color: seg.color }}>{seg.count}</span>
                  </div>
                  <p className="text-[9px] text-white/40 mt-0.5">{seg.desc}</p>
                </div>
                <span className="text-[10px] font-black text-white/50 bg-white/5 px-2 py-0.5 rounded-lg">{seg.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI RECOMMENDATION ENGINE ─────────────────────── */}
      <div className="bg-gradient-to-br from-[#150f2e] to-[#0d0a1f] border border-purple-500/20 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00a859]/5 rounded-tr-full pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">AI Insights Engine</h3>
                <span className="text-[8px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full font-bold uppercase tracking-wider animate-pulse">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-white/45 mt-0.5">Behavioral analysis powered by CityLife ML Pipeline</p>
            </div>
          </div>
          <button
            onClick={simulateAiRefresh}
            className="p-2 bg-white/5 hover:bg-purple-500/10 rounded-xl text-white/50 hover:text-purple-400 transition-all active:scale-95 border border-white/5"
            title="Refresh AI Insights"
          >
            <RefreshCw className={`w-4 h-4 ${aiThinking ? "animate-spin" : ""}`} />
          </button>
        </div>

        {aiThinking ? (
          <div className="py-12 flex flex-col items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center animate-pulse">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-bold text-white/70">Analyzing 134,892 user sessions...</p>
            <p className="text-[10px] text-white/40">Running behavioral pattern detection • Clustering segments • Generating recommendations</p>
            <div className="flex gap-1 mt-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 relative z-10">
            {AI_RECOMMENDATIONS.slice(0, visibleRecs).map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-2xl border transition-all hover:translate-y-[-1px] ${
                  rec.priority === "high"
                    ? "bg-gradient-to-r from-red-500/5 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40"
                    : rec.priority === "medium"
                    ? "bg-white/[0.03] border-white/8 hover:border-purple-500/30"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    rec.priority === "high"
                      ? "bg-amber-500/10 border border-amber-500/25 text-amber-400"
                      : "bg-purple-500/10 border border-purple-500/25 text-purple-400"
                  }`}>
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        rec.priority === "high"
                          ? "bg-red-500/15 text-red-400 border border-red-500/20"
                          : rec.priority === "medium"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          : "bg-white/10 text-white/60 border border-white/10"
                      }`}>
                        {rec.priority} priority
                      </span>
                      <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">{rec.category}</span>
                      <span className="text-[9px] font-bold text-[#00a859] ml-auto">{rec.confidence}% confidence</span>
                    </div>
                    <p className="text-[11px] text-white/80 leading-relaxed font-medium">
                      {rec.insight}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-extrabold text-[#dfa839] bg-[#dfa839]/10 px-2 py-0.5 rounded-lg">{rec.metric}</span>
                      <button className="text-[9px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5 ml-auto transition-colors">
                        <span>Deploy Action</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {visibleRecs < AI_RECOMMENDATIONS.length && (
              <button
                onClick={() => setVisibleRecs(AI_RECOMMENDATIONS.length)}
                className="w-full py-2.5 text-[11px] font-bold text-purple-400 hover:text-purple-300 bg-white/[0.03] hover:bg-purple-500/5 border border-white/5 hover:border-purple-500/20 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Show {AI_RECOMMENDATIONS.length - visibleRecs} More AI Insights</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
