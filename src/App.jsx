import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CinematicAbout from './components/CinematicAbout';

export default function App() {
  return (
    <div className="relative bg-[#080808] min-h-screen text-white font-sans selection:bg-[#C1121F] selection:text-white">
      {/* 5. Navigation Bar */}
      <Navbar />

      <main>
        {/* Hero Section (Preserved exactly with video, smoke, sparks, navbar, and layout) */}
        <Hero />

        {/* Ultra-smooth Scroll-Controlled Cinematic About Section using Canvas Image Sequence */}
        <CinematicAbout />
      </main>

      {/* Minimalistic luxury footer baseline */}
      <footer className="py-16 bg-gradient-to-b from-[#080808] to-[#040404] flex flex-col items-center justify-center gap-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-4 text-neutral-500 text-[11px] tracking-[0.35em] uppercase font-light">
          <span>Wood Fire</span>
          <span className="text-[#C1121F]">•</span>
          <span>Oak Smoke</span>
          <span className="text-[#C1121F]">•</span>
          <span>100% Vegetarian</span>
        </div>
        <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
          © {new Date().getFullYear()} GRILL ISLAND — All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
