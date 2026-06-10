"use client";

import React from "react";
import { Utensils, Star, Clock, MapPin, ChevronRight, ShoppingBag, Plus, Minus, ArrowLeft } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  desc: string;
}

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  time: string;
  priceTier: string;
  cuisine: string;
  address: string;
  menu: MenuItem[];
}

const RESTAURANTS: Restaurant[] = [
  {
    id: "kuriftu",
    name: "Kuriftu Cultural Restaurant",
    rating: 4.8,
    time: "20-35 min",
    priceTier: "⭐⭐⭐",
    cuisine: "Traditional Habesha",
    address: "Bole Road, Near Airport",
    menu: [
      { id: "k-1", name: "Special Shekla Tibs", price: 380, desc: "Sizzling lean beef cubes cooked with onions, garlic, and green pepper." },
      { id: "k-2", name: "Kitfo Special", price: 420, desc: "Finely minced beef blend with seasoned butter and mitmita, served raw, medium, or cooked." },
      { id: "k-3", name: "Kuriftu Special Beyaynetu", price: 290, desc: "A colorful platter of spicy lentils, chickpeas, cabbage, and spinach on injera." },
      { id: "k-4", name: "Habesha Tej (Honey Wine)", price: 120, desc: "Traditional home-brewed sweet honey wine, served in a berele." }
    ]
  },
  {
    id: "kategna",
    name: "Kategna Restaurant",
    rating: 4.7,
    time: "15-30 min",
    priceTier: "⭐⭐",
    cuisine: "Ethiopia Classic",
    address: "Bole Medhanialem",
    menu: [
      { id: "ka-1", name: "Tegabino Shiro", price: 210, desc: "Slow-cooked spiced chickpea stew bubbling in a traditional clay pot." },
      { id: "ka-2", name: "Kategna Appetizer", price: 160, desc: "Toasted injera brushed with seasoned butter (kibe) and berbere." },
      { id: "ka-3", name: "Derek Tibs", price: 340, desc: "Crispy fried beef strips served with mustard and awaze dip." },
      { id: "ka-4", name: "Macchiato", price: 65, desc: "Addis Ababa's legendary layered espresso with textured milk." }
    ]
  },
  {
    id: "sabor",
    name: "Sabor Restaurant & Lounge",
    rating: 4.6,
    time: "30-45 min",
    priceTier: "⭐⭐⭐",
    cuisine: "Italian Fusion",
    address: "Sarbet, Near AU",
    menu: [
      { id: "s-1", name: "Truffle Gnocchi", price: 490, desc: "Handmade potato dumplings tossed in a creamy black truffle sauce." },
      { id: "s-2", name: "Gorgonzola Filet Steak", price: 620, desc: "Tender beef tenderloin grilled to order and smothered in blue cheese." },
      { id: "s-3", name: "Tiramisu Classic", price: 220, desc: "Layers of espresso-soaked ladyfingers and whipped mascarpone." }
    ]
  }
];

// Distance calculations relative to user location
const DISTANCES: Record<string, Record<string, number>> = {
  Bole: { kuriftu: 0.5, kategna: 0.9, sabor: 6.5 },
  Kazanchis: { kuriftu: 3.5, kategna: 2.8, sabor: 4.0 },
  Piazza: { kuriftu: 7.2, kategna: 6.0, sabor: 3.8 },
  Sarbet: { kuriftu: 9.0, kategna: 8.2, sabor: 0.8 }
};

interface DiningTabProps {
  onTriggerCheckout: (amount: number, name: string, category: string) => void;
  location: string;
}

export default function DiningTab({ onTriggerCheckout, location }: DiningTabProps) {
  const [selectedRest, setSelectedRest] = React.useState<Restaurant | null>(null);
  const [cart, setCart] = React.useState<Record<string, number>>({});

  const handleAddToCart = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (copy[itemId] > 1) {
        copy[itemId] -= 1;
      } else {
        delete copy[itemId];
      }
      return copy;
    });
  };

  const cartTotal = selectedRest
    ? selectedRest.menu.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0)
    : 0;

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleCheckoutClick = () => {
    if (!selectedRest || cartTotal <= 0) return;
    onTriggerCheckout(cartTotal, `${selectedRest.name} Booking`, "Dining");
    // Clear cart after starting payment
    setCart({});
  };

  const getDistance = (restId: string) => {
    const locMap = DISTANCES[location] || DISTANCES.Bole;
    return locMap[restId] || 1.5;
  };

  if (selectedRest) {
    return (
      <div className="flex-1 flex flex-col p-4">
        {/* Detail Header */}
        <button
          onClick={() => {
            setSelectedRest(null);
            setCart({});
          }}
          className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-semibold mb-4 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurants</span>
        </button>

        {/* Restaurant Banner Details */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-5 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gold/5 rounded-bl-full pointer-events-none" />
          <span className="text-[9px] px-2 py-0.5 bg-accent-gold/15 text-accent-gold border border-accent-gold/20 rounded-full font-bold uppercase">
            {selectedRest.cuisine}
          </span>
          <h3 className="text-xl font-extrabold mt-2 text-white/95">{selectedRest.name}</h3>
          <p className="text-xs text-white/55 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-accent-gold" />
            <span>{selectedRest.address} ({getDistance(selectedRest.id)} km away)</span>
          </p>

          <div className="flex gap-4 mt-4 pt-3 border-t border-white/5 text-xs text-white/70">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" />
              <span className="font-bold">{selectedRest.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-white/50" />
              <span>{selectedRest.time}</span>
            </div>
            <div>{selectedRest.priceTier}</div>
          </div>
        </div>

        {/* Menu List */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold uppercase text-white/55 tracking-wider px-1">Menu Items</h4>
          {selectedRest.menu.map((item) => {
            const count = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex justify-between items-center transition-colors"
              >
                <div className="flex-1 pr-3">
                  <h5 className="font-bold text-[14px] text-white/95">{item.name}</h5>
                  <p className="text-[11px] text-white/50 leading-relaxed mt-0.5">{item.desc}</p>
                  <span className="text-xs font-extrabold text-accent-gold mt-2 block">ETB {item.price}</span>
                </div>
                {count > 0 ? (
                  <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1">
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-1 hover:bg-white/10 rounded-lg text-white/75"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-white min-w-[12px] text-center">{count}</span>
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="p-1 hover:bg-white/10 rounded-lg text-white/75"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-accent-gold hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Cart bar */}
        {cartCount > 0 && (
          <div className="mt-4 p-4 glass-panel rounded-2xl border border-white/10 flex justify-between items-center shadow-lg shadow-black/40 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-mpesa-green/10 border border-mpesa-green/30 flex items-center justify-center text-mpesa-green">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] text-white/55 font-bold uppercase tracking-wider">{cartCount} Item(s) Selected</p>
                <p className="text-sm font-extrabold text-white">ETB {cartTotal.toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={handleCheckoutClick}
              className="px-4 py-2.5 bg-mpesa-green hover:bg-mpesa-green-hover text-white font-bold text-xs rounded-xl shadow-lg shadow-mpesa-green/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>M-PESA 1-Tap</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4">
      <div>
        <h2 className="text-sm font-bold uppercase text-white/55 tracking-wider px-1">Addis Restaurants</h2>
        <p className="text-[11px] text-white/50 px-1 mt-0.5">Explore menus, book tables, and pay instantly</p>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {RESTAURANTS.map((rest) => (
          <div
            key={rest.id}
            onClick={() => setSelectedRest(rest)}
            className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-4 cursor-pointer hover:translate-y-[-1px] transition-all flex items-center justify-between group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform flex-shrink-0">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-accent-gold transition-colors">{rest.name}</h3>
                <p className="text-[11px] text-white/50 mt-0.5">{rest.cuisine}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-white/55">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" />
                    <strong className="text-white/80">{rest.rating}</strong>
                  </span>
                  <span>•</span>
                  <span>{getDistance(rest.id)} km</span>
                  <span>•</span>
                  <span>{rest.priceTier}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/35 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
}
