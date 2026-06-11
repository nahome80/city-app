"use client";

import React from "react";
import PhoneApp from "@/components/PhoneApp";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[#07050d] text-[#f4f4f7] font-sans flex flex-col justify-center items-center overflow-hidden">
      <PhoneApp standalone={true} />
    </div>
  );
}
