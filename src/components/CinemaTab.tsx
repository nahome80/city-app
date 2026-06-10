"use client";

import React from "react";
import { Film, Calendar, Clock, MapPin, ChevronRight, ArrowLeft, Ticket, ShieldAlert } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  theater: string;
  synopsis: string;
  pricePerSeat: number;
}

const MOVIES: Movie[] = [
  {
    id: "chala",
    title: "Chala Between Two Worlds",
    genre: "Ethiopian Drama / Romance",
    duration: "1h 55m",
    rating: "4.9 ★",
    theater: "Century Mall Cinema, Bole",
    synopsis: "A touching and humorous narrative charting the life of a rural migrant adjusting to the complex socio-economic realities of modern Addis Ababa.",
    pricePerSeat: 180
  },
  {
    id: "addis-hustle",
    title: "Addis Hustle",
    genre: "Action / Comedy",
    duration: "2h 10m",
    rating: "4.7 ★",
    theater: "Edna Mall Cinema, Bole",
    synopsis: "A high-stakes taxi chase through the streets of Piazza and Kazanchis as a young driver gets caught up in a mysterious gold delivery heist.",
    pricePerSeat: 180
  },
  {
    id: "great-rift",
    title: "The Great Rift",
    genre: "Nature Documentary",
    duration: "1h 30m",
    rating: "4.8 ★",
    theater: "Biresh Cinema, Sarbet",
    synopsis: "A visually stunning cinematic journey across the breathtaking landscapes, volcanic lakes, and endemic wildlife of the Great Rift Valley.",
    pricePerSeat: 150
  }
];

interface CinemaTabProps {
  onTriggerCheckout: (amount: number, name: string, category: string, extraData?: any) => void;
}

export default function CinemaTab({ onTriggerCheckout }: CinemaTabProps) {
  const [selectedMovie, setSelectedMovie] = React.useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string>("Today");
  const [selectedTime, setSelectedTime] = React.useState<string>("5:30 PM");
  const [selectedSeats, setSelectedSeats] = React.useState<string[]>([]);

  // Simulated taken seats
  const takenSeats = React.useMemo(() => {
    return ["A3", "A4", "C5", "D1", "D2", "E7", "E8"];
  }, []);

  const handleSeatClick = (seatId: string) => {
    if (takenSeats.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const totalPrice = selectedMovie ? selectedSeats.length * selectedMovie.pricePerSeat : 0;

  const handleBookTickets = () => {
    if (!selectedMovie || selectedSeats.length === 0) return;
    onTriggerCheckout(
      totalPrice,
      `${selectedMovie.title} (${selectedSeats.join(", ")})`,
      "Cinema",
      { movie: selectedMovie.title, seats: selectedSeats, time: selectedTime }
    );
    // Clear seat selection
    setSelectedSeats([]);
  };

  const rows = ["A", "B", "C", "D", "E"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  if (selectedMovie) {
    return (
      <div className="flex-1 flex flex-col p-4">
        {/* Back Button */}
        <button
          onClick={() => {
            setSelectedMovie(null);
            setSelectedSeats([]);
          }}
          className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-semibold mb-4 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movies</span>
        </button>

        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {/* Movie Details Header */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full pointer-events-none" />
            <span className="text-[9px] px-2.5 py-0.5 bg-rose-500/15 text-rose-300 border border-rose-500/20 rounded-full font-bold uppercase">
              {selectedMovie.genre}
            </span>
            <h3 className="text-xl font-extrabold mt-2 text-white/95 leading-tight">{selectedMovie.title}</h3>
            <p className="text-xs text-rose-300 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedMovie.theater}</span>
            </p>

            <div className="flex gap-4 mt-4 pt-3 border-t border-white/5 text-xs text-white/70">
              <div className="flex items-center gap-1">
                <Film className="w-3.5 h-3.5 text-rose-400" />
                <span>{selectedMovie.duration}</span>
              </div>
              <div className="font-bold text-accent-gold">{selectedMovie.rating}</div>
              <div className="text-white/55">ETB {selectedMovie.pricePerSeat} / Seat</div>
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-[11px] leading-relaxed text-white/60 px-1">
            {selectedMovie.synopsis}
          </p>

          {/* Date & Time Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-white/45 font-bold uppercase tracking-wider block mb-1.5 px-1">Show Date</label>
              <div className="grid grid-cols-3 gap-1">
                {["Today", "Tomorrow", "Wed"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`py-2 text-[10px] font-bold rounded-xl border text-center transition-all ${
                      selectedDate === d
                        ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                        : "bg-white/5 border-white/5 text-white/75 hover:bg-white/10"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-white/45 font-bold uppercase tracking-wider block mb-1.5 px-1">Show Time</label>
              <div className="grid grid-cols-3 gap-1">
                {["2:00 PM", "5:30 PM", "8:45 PM"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 text-[9px] font-bold rounded-xl border text-center transition-all ${
                      selectedTime === t
                        ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                        : "bg-white/5 border-white/5 text-white/75 hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Seat Layout Selector */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col items-center">
            <h4 className="text-[10px] text-white/45 font-bold uppercase tracking-wider mb-5">Select Seats</h4>

            {/* Screen Line */}
            <div className="w-[85%] h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded-full shadow-[0_4px_12px_rgba(244,63,94,0.3)] mb-8 text-center">
              <span className="text-[8px] text-rose-400 font-extrabold tracking-widest uppercase block -mt-4">SCREEN</span>
            </div>

            {/* Seats Grid */}
            <div className="space-y-2 mb-6 w-full max-w-[270px]">
              {rows.map((row) => (
                <div key={row} className="flex justify-between items-center gap-1.5">
                  <span className="text-[10px] font-bold text-white/45 w-4 text-center">{row}</span>
                  <div className="flex-1 flex justify-between gap-1.5">
                    {cols.map((col) => {
                      const seatId = `${row}${col}`;
                      const isTaken = takenSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <button
                          key={col}
                          onClick={() => handleSeatClick(seatId)}
                          className={`w-5.5 h-5.5 rounded-[5px] text-[8px] font-bold flex items-center justify-center transition-all ${
                            isTaken
                              ? "bg-white/10 text-white/30 cursor-not-allowed border border-white/5"
                              : isSelected
                              ? "bg-rose-500 text-white shadow-md shadow-rose-500/35 border border-rose-600 scale-105"
                              : "bg-[#18152e] text-white/60 border border-white/10 hover:border-white/20 hover:bg-white/5"
                          }`}
                          title={seatId}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 text-[9px] text-white/60 pt-3 border-t border-white/5 w-full">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-[#18152e] border border-white/10" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-rose-500 border border-rose-600" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-white/10 border border-white/5" />
                <span>Taken</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout panel */}
        <div className="mt-4 p-4 glass-panel rounded-2xl border border-white/10 flex justify-between items-center shadow-lg shadow-black/40">
          <div>
            <p className="text-[10px] text-white/55 font-bold uppercase tracking-wider">
              {selectedSeats.length} Seat(s) Selected
            </p>
            <p className="text-base font-extrabold text-white">
              ETB {totalPrice.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleBookTickets}
            disabled={selectedSeats.length === 0}
            className="px-5 py-3 bg-mpesa-green hover:bg-mpesa-green-hover disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none text-white font-bold text-xs rounded-xl shadow-lg shadow-mpesa-green/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
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
        <h2 className="text-sm font-bold uppercase text-white/55 tracking-wider px-1">Cinema & Movies</h2>
        <p className="text-[11px] text-white/55 px-1 mt-0.5">Pick local theaters, select seats, pay instantly</p>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {MOVIES.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-4 cursor-pointer hover:translate-y-[-1px] transition-all flex items-center justify-between group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Film className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-sm text-white group-hover:text-accent-gold transition-colors">{movie.title}</h3>
                <p className="text-[11px] text-white/50 mt-0.5">{movie.genre}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-white/55">
                  <span className="text-white/70">{movie.duration}</span>
                  <span>•</span>
                  <span className="font-semibold text-accent-gold">{movie.rating}</span>
                  <span>•</span>
                  <span>ETB {movie.pricePerSeat} / Seat</span>
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
