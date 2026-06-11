"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Award, Sparkles, QrCode, ShieldAlert, Zap, Compass, CheckCircle2, Navigation } from "lucide-react";

interface ShelterGem {
  id: string;
  name: string;
  location: string;
  type: "standard" | "gold";
  points: number;
  claimed: boolean;
  active: boolean;
  expiresText?: string;
  expiresSeconds?: number;
}

interface GemHuntTabProps {
  onBack: () => void;
  loyaltyPoints: number;
  onAddPoints: (points: number, reason: string) => void;
}

export default function GemHuntTab({ onBack, loyaltyPoints, onAddPoints }: GemHuntTabProps) {
  // Game state
  const [shelters, setShelters] = useState<ShelterGem[]>([
    {
      id: "sh-1",
      name: "Bole Road Shelter #1",
      location: "Near Edna Mall, Bole",
      type: "standard",
      points: 10,
      claimed: false,
      active: true,
    },
    {
      id: "sh-2",
      name: "Piazza Square Shelter #2",
      location: "Opposite Churchill Ave, Piazza",
      type: "gold",
      points: 50,
      claimed: false,
      active: true,
      expiresText: "44m 12s",
      expiresSeconds: 2652, // 44 mins
    },
    {
      id: "sh-3",
      name: "Stadium Terminus Shelter #4",
      location: "Near Addis Ababa Stadium",
      type: "standard",
      points: 10,
      claimed: true, // Started claimed to show history
      active: true,
    },
    {
      id: "sh-4",
      name: "Kazanchis Bypass Shelter #3",
      location: "Near Intercontinental Hotel",
      type: "standard",
      points: 10,
      claimed: false,
      active: true,
    }
  ]);

  const [activeScanner, setActiveScanner] = useState<ShelterGem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [cameraFlash, setCameraFlash] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(3);
  const [gemsFoundToday, setGemsFoundToday] = useState(1);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Gold gem timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setShelters((prevShelters) =>
        prevShelters.map((sh) => {
          if (sh.type === "gold" && sh.expiresSeconds && sh.expiresSeconds > 0) {
            const nextSecs = sh.expiresSeconds - 1;
            const mins = Math.floor(nextSecs / 60);
            const secs = nextSecs % 60;
            return {
              ...sh,
              expiresSeconds: nextSecs,
              expiresText: `${mins}m ${secs.toString().padStart(2, "0")}s`,
            };
          }
          return sh;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scanning simulation progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            triggerScanSuccess();
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  // Real Camera stream hook
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (isScanning && activeScanner) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          activeStream = s;
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Camera failed or denied, using mock shelter poster:", err);
          setStream(null);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScanning, activeScanner]);

  const playScanBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Success Tone: double beep
      const playTone = (freq: number, start: number, duration: number) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
        
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime + start);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + start + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(audioCtx.currentTime + start);
        oscillator.stop(audioCtx.currentTime + start + duration);
      };

      playTone(1000, 0, 0.15); // first beep
      playTone(1300, 0.18, 0.25); // second higher beep
    } catch (e) {
      console.warn("AudioContext not allowed or not supported in this frame:", e);
    }
  };

  const handleStartScan = (shelter: ShelterGem) => {
    setActiveScanner(shelter);
    setIsScanning(true);
  };

  const triggerScanSuccess = () => {
    playScanBeep();
    setCameraFlash(true);
    setTimeout(() => setCameraFlash(false), 250);
    setIsScanning(false);
    setShowCelebration(true);
  };

  const handleClaimReward = () => {
    if (!activeScanner) return;
    
    // Mark shelter as claimed locally
    setShelters((prev) =>
      prev.map((sh) => (sh.id === activeScanner.id ? { ...sh, claimed: true } : sh))
    );

    // Update daily stats
    setGemsFoundToday((prev) => prev + 1);

    // Call global callback
    const gemType = activeScanner.type === "gold" ? "Rare Gold Gem" : "Standard Green Gem";
    onAddPoints(
      activeScanner.points,
      `Scanned QR at ${activeScanner.name}! +${activeScanner.points} PTS (${gemType})`
    );

    // Close overlays
    setShowCelebration(false);
    setActiveScanner(null);
  };

  // Generate color confetti pieces
  const confettiColors = ["#00a859", "#dfa839", "#f43f5e", "#3b82f6", "#a855f7", "#eab308"];
  const confettiParticles = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.5}s`,
      duration: `${1.5 + Math.random() * 2}s`,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: `${6 + Math.random() * 8}px`,
      rotate: `${Math.random() * 360}deg`
    }));
  }, [showCelebration]);

  return (
    <div className="flex-1 flex flex-col relative">
      {/* CSS custom animations inline */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanline {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes scanner-laser {
          0% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(180px); opacity: 0.8; }
          100% { transform: translateY(0); opacity: 0.2; }
        }
      `}} />

      {/* ── MAIN DASHBOARD VIEW ────────────────────────────── */}
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {/* Header section with back button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold uppercase text-white tracking-wider">M-PESA City Gem Hunt</h2>
            <p className="text-[10px] text-white/55">Wait at shelter, scan QR codes, earn cash reward points!</p>
          </div>
        </div>

        {/* Streak & Stats Widgets */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-[#1b1530] to-[#0f0a1c] border border-purple-500/20 rounded-2xl p-3 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[9px] text-purple-300 font-bold uppercase tracking-wider block">Daily Streak</span>
              <strong className="text-sm font-extrabold text-white block mt-0.5">{dailyStreak} Days 🔥</strong>
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Zap className="w-4 h-4 fill-purple-400/20" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0e2118] to-[#050f0a] border border-mpesa-green/20 rounded-2xl p-3 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[9px] text-mpesa-green font-bold uppercase tracking-wider block">Found Today</span>
              <strong className="text-sm font-extrabold text-white block mt-0.5">{gemsFoundToday} / 3 Gems</strong>
            </div>
            <div className="w-8 h-8 rounded-xl bg-mpesa-green/10 flex items-center justify-center text-mpesa-green">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Radar Map Simulation Widget */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col items-center relative overflow-hidden shadow-lg">
          <div className="absolute top-2 left-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[8px] text-white/45 font-bold uppercase tracking-wider">Live Shelter Radar</span>
          </div>

          {/* Compass radar circle */}
          <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center relative my-2">
            <div className="absolute inset-2 rounded-full border border-white/5 border-dashed" />
            <div className="absolute inset-6 rounded-full border border-white/10" />
            <div className="w-1.5 h-1.5 bg-mpesa-green rounded-full shadow-lg shadow-mpesa-green/50" />
            
            {/* Blips */}
            <div className="absolute top-4 left-6 w-2.5 h-2.5 bg-mpesa-green rounded-full border border-black animate-pulse cursor-pointer shadow-md shadow-mpesa-green/20" title="Bole Shelter" />
            <div className="absolute bottom-6 right-4 w-2.5 h-2.5 bg-amber-500 rounded-full border border-black animate-pulse cursor-pointer shadow-md shadow-amber-500/30" style={{ animationDuration: "1.2s" }} title="Piazza Gold Gem!" />
            <div className="absolute bottom-4 left-8 w-2 h-2 bg-white/30 rounded-full border border-black" title="Stadium (Claimed)" />
            
            {/* Sweping radar line */}
            <div className="absolute w-[50%] h-[1px] bg-gradient-to-r from-transparent to-mpesa-green/40 origin-left top-[50%] left-[50%] animate-[spin_4s_linear_infinite]" />
          </div>

          <p className="text-[9.5px] text-white/60 text-center leading-normal max-w-[280px]">
            Spot the unique <strong className="text-accent-gold">City Gem QR posters</strong> inside passenger shelters. Standard gems give <strong className="text-mpesa-green">+10</strong> points.
          </p>
        </div>

        {/* Shelters List */}
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          <h3 className="text-[10px] text-white/45 font-bold uppercase tracking-wider px-1">Nearby Active Shelters</h3>
          
          {shelters.map((sh) => (
            <div
              key={sh.id}
              className={`p-3.5 border rounded-2xl flex items-center justify-between transition-all ${
                sh.claimed
                  ? "bg-white/5 border-white/5 opacity-60"
                  : sh.type === "gold"
                  ? "bg-gradient-to-br from-[#271d0e] to-[#120c04] border-amber-500/30 hover:border-amber-500/50 shadow-md shadow-amber-500/5"
                  : "bg-white/5 border-white/5 hover:border-white/10 hover:translate-y-[-0.5px]"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Visual Icon Box */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  sh.claimed
                    ? "bg-white/5 text-white/40"
                    : sh.type === "gold"
                    ? "bg-amber-500/10 border border-amber-500/25 text-amber-500 animate-[pulse-ring_2s_infinite]"
                    : "bg-mpesa-green/10 border border-mpesa-green/25 text-mpesa-green"
                }`}>
                  <QrCode className="w-5 h-5" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs text-white leading-none">{sh.name}</h4>
                    {sh.type === "gold" && (
                      <span className="text-[8px] font-black uppercase bg-amber-500 text-black px-1.5 py-0.5 rounded tracking-wide scale-90">
                        RARE GOLD
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/50">{sh.location}</p>
                  
                  {sh.type === "gold" && !sh.claimed && (
                    <span className="text-[9px] text-amber-400 font-extrabold flex items-center gap-1 pt-0.5">
                      <Zap className="w-3 h-3 fill-amber-400/20 animate-pulse" />
                      <span>Expires in: {sh.expiresText}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {sh.claimed ? (
                <div className="text-[10px] font-bold text-white/45 flex items-center gap-1 mr-1">
                  <CheckCircle2 className="w-4 h-4 text-white/40" />
                  <span>Claimed</span>
                </div>
              ) : (
                <button
                  onClick={() => handleStartScan(sh)}
                  className={`px-3 py-2 text-[10px] font-extrabold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow ${
                    sh.type === "gold"
                      ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/15"
                      : "bg-mpesa-green hover:bg-mpesa-green/90 text-white shadow-mpesa-green/15"
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Scan QR</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer info link */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-2.5 text-[10px] text-blue-300">
          <ShieldAlert className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="leading-normal">
            For fair play, gem locations shift dynamically. Make sure you are within shelter distance in the real app to allow scanning.
          </p>
        </div>
      </div>

      {/* ── SCANNER SIMULATOR VIEW OVERLAY ─────────────────── */}
      {activeScanner && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col">
          {/* Custom Camera Header */}
          <div className="h-14 border-b border-white/5 px-4 flex justify-between items-center bg-[#09080f] shrink-0 text-white z-20">
            <button
              onClick={() => {
                setActiveScanner(null);
                setIsScanning(false);
              }}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-white/90">M-PESA VIEWFINDER</span>
            </div>
            <div className="w-8" /> {/* Spacer */}
          </div>

          {/* Flash screen simulator */}
          {cameraFlash && (
            <div className="absolute inset-0 bg-white z-[100] transition-opacity duration-75" />
          )}

          {/* Viewfinder Frame Area */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            {/* Mock Camera Viewport - Live camera feed or CSS shelter drawing fallback */}
            <div className="absolute inset-0 bg-[#120f26] flex items-center justify-center">
              {stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-4 w-full h-full flex items-center justify-center">
                  {/* CSS Bus Shelter Illustration */}
                  <div className="relative w-full max-w-[280px] h-[340px] bg-gradient-to-b from-[#181335] to-[#0c091d] border border-white/10 rounded-3xl p-4 flex flex-col justify-between overflow-hidden shadow-2xl">
                    {/* Shelter Frame Header */}
                    <div className="flex justify-between items-start">
                      <div className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-[8px] font-bold text-white/60">
                        🚌 {activeScanner.name.split(" ")[0]} Shelter
                      </div>
                      <span className="text-[8px] text-accent-gold font-extrabold tracking-wider bg-accent-gold/15 border border-accent-gold/30 px-2 py-0.5 rounded-full uppercase">
                        Safaricom Ad Board
                      </span>
                    </div>

                    {/* Simulated Glass Panel Poster in Shelter */}
                    <div className="my-auto relative w-full h-[200px] bg-gradient-to-br from-[#0c2a1a] to-[#040e0a] border-2 border-mpesa-green/30 rounded-2xl flex flex-col items-center justify-center p-3 shadow-inner">
                      {/* Poster Header */}
                      <div className="text-center mb-1">
                        <span className="text-[8px] font-black uppercase text-mpesa-green tracking-widest">Safaricom</span>
                        <h5 className="text-[12px] font-black text-white uppercase tracking-tight -mt-0.5 leading-none">M-PESA Super App</h5>
                      </div>

                      {/* QR Code Container */}
                      <div className="w-24 h-24 bg-white rounded-xl p-1.5 border-4 border-accent-gold/40 flex items-center justify-center relative shadow-lg group">
                        <div className="absolute -inset-1 rounded-xl border border-accent-gold/30 animate-pulse pointer-events-none" />
                        
                        {/* Mock detailed QR code lines using grid */}
                        <div className="w-full h-full bg-[#111] rounded p-0.5 grid grid-cols-6 gap-0.5 select-none overflow-hidden">
                          {/* Anchor square Top Left */}
                          <div className="col-span-2 row-span-2 bg-white p-[1.5px]">
                            <div className="w-full h-full bg-black flex items-center justify-center">
                              <div className="w-3 h-3 bg-white" />
                            </div>
                          </div>
                          <div className="bg-white" /><div className="bg-white" />
                          {/* Anchor square Top Right */}
                          <div className="col-span-2 row-span-2 bg-white p-[1.5px] col-start-5">
                            <div className="w-full h-full bg-black flex items-center justify-center">
                              <div className="w-3 h-3 bg-white" />
                            </div>
                          </div>
                          
                          {/* Middle row details */}
                          <div className="bg-white" /><div className="bg-[#111]" /><div className="bg-white" /><div className="bg-[#111]" />
                          <div className="bg-[#111]" /><div className="bg-white" /><div className="bg-white" /><div className="bg-[#111]" /><div className="bg-white" /><div className="bg-[#111]" />
                          
                          {/* Anchor square Bottom Left */}
                          <div className="col-span-2 row-span-2 bg-white p-[1.5px]">
                            <div className="w-full h-full bg-black flex items-center justify-center">
                              <div className="w-3 h-3 bg-white" />
                            </div>
                          </div>
                          <div className="bg-white" /><div className="bg-[#111]" /><div className="bg-[#111]" /><div className="bg-white" />
                          <div className="bg-[#111]" /><div className="bg-white" /><div className="bg-white" /><div className="bg-[#111]" />
                        </div>

                        {/* Central Branded Logo in QR */}
                        <div className="absolute w-5 h-5 bg-mpesa-green border border-white rounded-md flex items-center justify-center font-bold text-white text-[9px] select-none shadow">
                          M
                        </div>
                      </div>

                      {/* Gem Scanner Helper Marker overlay on QR */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 pointer-events-none flex items-center justify-center">
                        <div className="absolute inset-0 border border-mpesa-green/40 rounded-full animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />
                      </div>

                      {/* Poster Footer Promo */}
                      <div className="mt-2 text-center text-[8px] text-white/55 font-bold uppercase tracking-wider">
                        Claim Gem: <span className={activeScanner.type === "gold" ? "text-amber-400" : "text-mpesa-green"}>+{activeScanner.points} PTS</span>
                      </div>
                    </div>

                    {/* Shelter Bench bottom decoration */}
                    <div className="w-full h-2 bg-neutral-600 rounded-full mt-2" />
                  </div>
                </div>
              )}
            </div>

            {/* Viewfinder Target Guide Overlay */}
            <div className="relative w-48 h-48 border border-white/20 rounded-3xl flex flex-col justify-between p-1 select-none pointer-events-none z-10 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
              {/* Glowing Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] rounded-tl-xl border-mpesa-green" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] rounded-tr-xl border-mpesa-green" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] rounded-bl-xl border-mpesa-green" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] rounded-br-xl border-mpesa-green" />

              {/* Pulsing Target text */}
              <div className="absolute top-[40%] inset-x-0 text-center font-extrabold text-[9px] uppercase tracking-widest text-mpesa-green animate-pulse">
                {isScanning ? `SCANNING ${scanProgress}%` : "READY"}
              </div>

              {/* Moving Laser line */}
              {isScanning && (
                <div className="absolute left-1 right-1 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-20" style={{ animation: "scanner-laser 2s infinite linear" }} />
              )}
            </div>

            {/* Hint text at bottom */}
            <div className="absolute bottom-6 inset-x-4 text-center z-10">
              <span className="text-[10px] font-bold text-white/55 uppercase tracking-wider bg-black/60 border border-white/5 px-3 py-1.5 rounded-full inline-block">
                Center QR Code in box to read
              </span>
            </div>
          </div>

          {/* Bottom Scanner Action Control Panel */}
          <div className="p-5 border-t border-white/5 bg-[#09080f] flex flex-col items-center gap-3.5 shrink-0 z-20">
            <button
              onClick={() => {
                if (!isScanning) setIsScanning(true);
              }}
              disabled={isScanning}
              className={`w-full max-w-[280px] py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isScanning
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : activeScanner.type === "gold"
                  ? "bg-amber-500 hover:bg-amber-600 text-black animate-bounce"
                  : "bg-mpesa-green hover:bg-mpesa-green/90 text-white"
              }`}
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>{isScanning ? "Processing QR..." : "TAP TO AUTO-ALIGN & SCAN"}</span>
            </button>

            <button
              onClick={() => {
                setActiveScanner(null);
                setIsScanning(false);
              }}
              className="text-[11px] text-white/55 font-bold hover:text-white"
            >
              Cancel and Return
            </button>
          </div>
        </div>
      )}

      {/* ── CONGRATULATORY REWARD CELEBRATION MODAL ───────── */}
      {showCelebration && activeScanner && (
        <div className="absolute inset-0 bg-[#09080f]/95 z-[60] flex flex-col justify-center items-center p-6 overflow-hidden">
          {/* Confetti canvas items rendered as divs falling */}
          {confettiParticles.map((p) => (
            <div
              key={p.id}
              className="absolute pointer-events-none rounded-sm"
              style={{
                left: p.left,
                top: "-20px",
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                transform: `rotate(${p.rotate})`,
                animation: `confetti-fall ${p.duration} ease-out ${p.delay} forwards`,
                zIndex: 10
              }}
            />
          ))}

          {/* Celebration Card */}
          <div className="bg-[#17142d] border-2 border-accent-gold/30 rounded-3xl p-6 w-full max-w-[300px] flex flex-col items-center text-center shadow-2xl relative z-20 animate-[float-slow_6s_infinite_ease-in-out]">
            {/* Ambient gold glow back */}
            <div className="absolute -top-12 w-28 h-28 bg-accent-gold/10 rounded-full blur-2xl pointer-events-none" />

            {/* Glowing Big Badge */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border mb-4 animate-[pulse-ring_1.5s_infinite] ${
              activeScanner.type === "gold"
                ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-amber-500/20"
                : "bg-mpesa-green/10 border-mpesa-green text-mpesa-green shadow-mpesa-green/20"
            }`}>
              <Award className="w-8 h-8 fill-current/10" />
            </div>

            <span className="text-[10px] font-black uppercase text-accent-gold tracking-widest block">
              {activeScanner.type === "gold" ? "Rare Gold Gem Discovered!" : "City Gem Claimed!"}
            </span>
            
            <h3 className="text-lg font-black text-white mt-1 leading-snug">
              Congratulations!
            </h3>
            
            <p className="text-[11px] text-white/70 mt-2 leading-normal">
              You scanned the code on <strong>{activeScanner.name}</strong>. Safaricom M-PESA has rewarded you!
            </p>

            {/* Points bubble badge */}
            <div className="my-5 bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-center flex flex-col items-center select-none shadow">
              <span className="text-[9px] text-white/45 font-bold uppercase tracking-wider">Loyalty Wallet Credit</span>
              <span className={`text-2xl font-black ${
                activeScanner.type === "gold" ? "text-amber-400" : "text-mpesa-green"
              }`}>
                +{activeScanner.points} PTS
              </span>
            </div>

            <button
              onClick={handleClaimReward}
              className="w-full py-3 px-5 bg-gradient-to-r from-accent-gold to-yellow-500 hover:from-yellow-500 hover:to-accent-gold text-black font-extrabold text-xs rounded-xl shadow-lg shadow-accent-gold/10 hover:scale-102 active:scale-98 transition-all"
            >
              Add to Wallet Balance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
