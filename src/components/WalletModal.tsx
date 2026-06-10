"use client";

import React from "react";
import { X, ShieldCheck, Fingerprint, CheckCircle2, Loader2, Award } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (amount: number, description: string) => void;
  amount: number;
  itemName: string;
  category: string;
  balance: number;
}

export default function WalletModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  amount,
  itemName,
  category,
  balance,
}: WalletModalProps) {
  const [step, setStep] = React.useState<"confirm" | "verifying" | "success">("confirm");

  // Calculate points earned dynamically
  const pointsEarned = React.useMemo(() => {
    switch (category) {
      case "Dining":
        return 30;
      case "Tickets":
        return 25;
      case "Cinema":
        return 15;
      case "Transport":
      default:
        return 10;
    }
  }, [category]);

  React.useEffect(() => {
    if (isOpen) {
      setStep("confirm");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = () => {
    setStep("verifying");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onPaymentSuccess(amount, `${itemName} (${category})`);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end transition-opacity duration-300">
      {/* Click outside to close (only if not verifying or success) */}
      {step === "confirm" && (
        <div className="absolute inset-0" onClick={onClose} />
      )}

      {/* Sheet Content */}
      <div className="glass-panel-heavy rounded-t-[32px] w-full text-white overflow-hidden p-6 z-10 transition-transform duration-300 transform translate-y-0 shadow-[0_-8px_30px_rgb(0,0,0,0.5)]">
        {/* Top Handle bar */}
        <div className="flex justify-center -mt-2 mb-4">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        {step === "confirm" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mpesa-green animate-pulse" />
                <h3 className="text-lg font-bold tracking-wide">M-PESA Checkout</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Merchant Details Card */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-5 flex justify-between items-center animate-fade-in">
              <div>
                <p className="text-xs text-white/55 uppercase tracking-wider font-semibold mb-0.5">Merchant</p>
                <h4 className="font-bold text-white/90">CityLife — {category}</h4>
                <p className="text-xs text-white/70 mt-1 truncate max-w-[170px]">{itemName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/55 uppercase tracking-wider font-semibold mb-0.5">Amount</p>
                <span className="text-xl font-black text-accent-gold">{amount.toLocaleString()} <span className="text-xs">ETB</span></span>
              </div>
            </div>

            {/* Transaction details list */}
            <div className="space-y-3 px-1 mb-6 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Payment Source</span>
                <span className="font-semibold text-white/90">M-PESA Wallet</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Account Balance</span>
                <span className="font-semibold text-white/90">ETB {balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/70 items-center">
                <span>Loyalty Points Reward</span>
                <span className="text-accent-gold font-bold flex items-center gap-1 text-xs">
                  <Award className="w-4 h-4 fill-accent-gold/15" />
                  <span>+{pointsEarned} PTS</span>
                </span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Network Charge</span>
                <span className="text-mpesa-green font-bold flex items-center gap-1">
                  <span>FREE</span>
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Touch ID / Confirm Area */}
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
              <button
                onClick={handlePay}
                className="w-16 h-16 bg-mpesa-green hover:bg-mpesa-green-hover rounded-full flex items-center justify-center shadow-lg shadow-mpesa-green/20 hover:scale-105 active:scale-95 transition-all mb-3"
              >
                <Fingerprint className="w-8 h-8 text-white animate-pulse" />
              </button>
              <p className="text-xs text-white/70 text-center font-medium">
                Hold Fingerprint or Press to Pay 1-Tap
              </p>
            </div>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-semibold text-sm transition-colors"
            >
              Cancel Transaction
            </button>
          </div>
        )}

        {step === "verifying" && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-mpesa-green animate-spin mb-4" />
            <h3 className="text-lg font-bold mb-1">Verifying Transaction...</h3>
            <p className="text-xs text-white/60 px-6">
              Processing request through Safaricom M-PESA Secure Core Node. Please do not close the super app.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="py-10 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-mpesa-green/20 flex items-center justify-center mb-4 border border-mpesa-green/30 relative">
              <svg className="w-10 h-10 text-mpesa-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" className="animate-draw-checkmark" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Payment Successful!</h3>
            <p className="text-xs text-mpesa-green font-bold uppercase tracking-wider mb-2">ETB {amount} Transferred</p>
            
            {/* Loyalty points popout */}
            <div className="mt-1 mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-accent-gold/10 border border-accent-gold/25 rounded-full text-accent-gold font-bold text-xs animate-bounce">
              <Award className="w-4 h-4 fill-accent-gold/15" />
              <span>+{pointsEarned} Loyalty Points Earned!</span>
            </div>

            <p className="text-[10px] text-white/55 px-10 leading-normal">
              Receipt sent to +251 900 123 456. Check the Active Bookings panel in the web interface to view active passes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
